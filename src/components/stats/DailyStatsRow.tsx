import { useLingui } from "@lingui/react/macro"
import { memo, useMemo } from "react"
import { Text, View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { SessionDurationDot } from "@/components/stats/session-duration-dot"
import type { DailyFocusSessionSummary } from "@/state/sessionHistory"

const MINUTE_MS = 60 * 1000

type DailyStatsRowProps = {
  isToday: boolean
  summary: DailyFocusSessionSummary
  testID?: string
}

const getDateFromKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number)

  return new Date(year, month - 1, day)
}

function DailyStatsRowComponent({
  isToday,
  summary,
  testID,
}: DailyStatsRowProps) {
  const { i18n, t } = useLingui()
  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(i18n.locale, {
        maximumFractionDigits: 1,
      }),
    [i18n.locale],
  )
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(i18n.locale, {
        dateStyle: "medium",
      }),
    [i18n.locale],
  )
  const datePartsFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(i18n.locale, {
        day: "numeric",
        month: "short",
        weekday: "short",
      }),
    [i18n.locale],
  )
  const formattedSessionCount = numberFormatter.format(summary.sessionCount)
  const formattedMinutes = numberFormatter.format(summary.totalMinutes)
  const date = getDateFromKey(summary.dateKey)
  const dateParts = datePartsFormatter.formatToParts(date)
  const monthLabel = dateParts
    .find(({ type }) => type === "month")
    ?.value.toLocaleUpperCase(i18n.locale)
  const dayLabel = dateParts.find(({ type }) => type === "day")?.value
  const weekdayLabel = dateParts
    .find(({ type }) => type === "weekday")
    ?.value.toLocaleUpperCase(i18n.locale)
  const dateLabel = isToday ? t`Today` : dateFormatter.format(date)
  const sessionCountLabel =
    summary.sessionCount === 1
      ? t`${formattedSessionCount} focus session`
      : t`${formattedSessionCount} focus sessions`
  const minutesLabel =
    summary.totalMinutes === 1
      ? t`${formattedMinutes} minute`
      : t`${formattedMinutes} minutes`
  const accessibilityLabel = t`${dateLabel}, ${sessionCountLabel}, ${minutesLabel}`

  return (
    <View
      testID={`daily-stats-row-${summary.dateKey}`}
      style={styles.container}
    >
      <View
        accessible
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        style={styles.date}
      >
        <Text
          testID={`daily-stats-month-${summary.dateKey}`}
          style={styles.dateSmallLabel}
        >
          {monthLabel}
        </Text>
        <Text
          testID={`daily-stats-day-${summary.dateKey}`}
          style={styles.dayLabel}
        >
          {dayLabel}
        </Text>
        <Text
          testID={`daily-stats-weekday-${summary.dateKey}`}
          style={styles.dateSmallLabel}
        >
          {weekdayLabel}
        </Text>
      </View>
      <View style={styles.summary}>
        <View style={styles.dots}>
          {summary.sessionDurationsMs.map((durationMs, index) => {
            const durationMinutes = durationMs / MINUTE_MS
            const formattedDuration = numberFormatter.format(durationMinutes)
            const durationLabel = t`${formattedDuration}-minute focus session`

            return (
              <SessionDurationDot
                key={`${summary.dateKey}-${index}`}
                accessibilityLabel={durationLabel}
                durationMs={durationMs}
                testID={`session-dot-${summary.dateKey}`}
              />
            )
          })}
        </View>
      </View>
    </View>
  )
}

export const DailyStatsRow = memo(DailyStatsRowComponent)

const styles = StyleSheet.create((theme) => ({
  container: {
    minHeight: 112,
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    paddingVertical: 12,
  },
  date: {
    width: 64,
    alignItems: "center",
  },
  dateSmallLabel: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 17,
  },
  dayLabel: {
    color: theme.colors.primary,
    fontSize: 44,
    fontWeight: "700",
    letterSpacing: -2,
    lineHeight: 46,
  },
  summary: {
    flex: 1,
    justifyContent: "center",
  },
  dots: {
    minHeight: 24,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
}))
