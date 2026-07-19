import { useLingui } from "@lingui/react/macro"
import { Stack } from "expo-router"
import { useMemo } from "react"
import { FlatList, type ListRenderItem, Text, View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { DailyStatsRow } from "@/components/stats/DailyStatsRow"
import {
  type CompletedFocusSession,
  type DailyFocusSessionSummary,
  getDailyFocusSessionSummaries,
  getLocalDateKey,
  useSessionHistoryStore,
} from "@/state/sessionHistory"

const MINUTE_MS = 60 * 1000
const PREVIEW_SESSION_COUNTS = [5, 3, 18, 4, 6, 2]

// Temporary development-only history for previewing FOC-10 before FOC-11
// starts recording completed focus sessions.
const createPreviewSessionHistory = (now: Date): CompletedFocusSession[] =>
  PREVIEW_SESSION_COUNTS.flatMap((sessionCount, dayOffset) =>
    Array.from({ length: sessionCount }, (_, sessionIndex) => {
      const completedAt = new Date(now)
      completedAt.setDate(now.getDate() - dayOffset)
      completedAt.setHours(8, sessionIndex * 30, 0, 0)

      return {
        id: `stats-preview-${dayOffset}-${sessionIndex}`,
        completedAt: completedAt.toISOString(),
        durationMs: 25 * MINUTE_MS,
      }
    }),
  )

type DailyStatsListItem = DailyFocusSessionSummary & {
  isToday: boolean
}

const keyExtractor = (item: DailyStatsListItem) => item.dateKey

const renderItem: ListRenderItem<DailyStatsListItem> = ({ item }) => (
  <DailyStatsRow isToday={item.isToday} summary={item} />
)

function ItemSeparator() {
  return <View style={styles.separator} />
}

function StatisticsEmptyState() {
  const { t } = useLingui()

  return (
    <View style={styles.emptyState}>
      <Text selectable style={styles.emptyTitle}>
        {t`No focus sessions yet`}
      </Text>
      <Text selectable style={styles.emptyDescription}>
        {t`Complete a focus timer to see your statistics here.`}
      </Text>
    </View>
  )
}

type StatisticsSceneProps = {
  onClose: () => void
}

export function StatisticsScene({ onClose }: StatisticsSceneProps) {
  const { t } = useLingui()
  const completedFocusSessions = useSessionHistoryStore(
    (state) => state.completedFocusSessions,
  )
  const sessionsForDisplay = useMemo(() => {
    const shouldShowPreviewHistory =
      __DEV__ &&
      process.env.NODE_ENV !== "test" &&
      completedFocusSessions.length === 0

    return shouldShowPreviewHistory
      ? createPreviewSessionHistory(new Date())
      : completedFocusSessions
  }, [completedFocusSessions])
  const dailyStats = useMemo<DailyStatsListItem[]>(() => {
    if (sessionsForDisplay.length === 0) {
      return []
    }

    const todayDateKey = getLocalDateKey(new Date())
    const summaries = getDailyFocusSessionSummaries(sessionsForDisplay)
    const hasTodaySummary = summaries.some(
      (summary) => summary.dateKey === todayDateKey,
    )

    if (!hasTodaySummary) {
      summaries.unshift({
        dateKey: todayDateKey,
        sessionCount: 0,
        totalDurationMs: 0,
        totalMinutes: 0,
      })
    }

    return summaries.map((summary) => ({
      ...summary,
      isToday: summary.dateKey === todayDateKey,
    }))
  }, [sessionsForDisplay])

  return (
    <>
      <FlatList
        data={dailyStats}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={StatisticsEmptyState}
        testID="statistics-list"
        style={styles.container}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      />
      <Stack.Screen
        options={{
          title: t`Statistics`,
          unstable_headerLeftItems: () => [
            {
              type: "button",
              label: t`Close`,
              icon: { type: "sfSymbol", name: "xmark" },
              onPress: onClose,
            },
          ],
        }}
      />
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.primary,
    opacity: 0.12,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyTitle: {
    color: theme.colors.primary,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyDescription: {
    maxWidth: 320,
    color: theme.colors.secondary,
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },
}))
