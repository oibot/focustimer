import Constants from "expo-constants"

import { type CompletionSound, completionSoundOptions } from "@/sounds"
import {
  type CompletedFocusSession,
  useSessionHistoryStore,
} from "@/state/sessionHistory"
import { useSettingsStore } from "@/state/settings"

const MS_PER_MINUTE = 60 * 1000
const MIN_DURATION_MS = 500
const MAX_DURATION_MS = 10 * 1000
const PREVIOUS_DAYS_SESSION_HISTORY_FIXTURE = "previous-days"

export type E2ESetupParams = {
  breakDurationMs?: string | string[]
  completionSound?: string | string[]
  focusDurationMs?: string | string[]
  sessionHistoryFixture?: string | string[]
}

type ApplyE2ESetupOptions = {
  appVariant?: string
  now?: Date
}

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

const parseDurationMs = (value: string | string[] | undefined) => {
  const durationMs = Number(firstValue(value))

  if (!Number.isFinite(durationMs)) return null
  if (durationMs < MIN_DURATION_MS || durationMs > MAX_DURATION_MS) return null

  return durationMs
}

const parseCompletionSound = (
  value: string | string[] | undefined,
): CompletionSound | null => {
  const completionSound = firstValue(value)

  return completionSoundOptions.includes(completionSound as CompletionSound)
    ? (completionSound as CompletionSound)
    : null
}

export const durationMsToStoreMinutes = (durationMs: number) =>
  durationMs / MS_PER_MINUTE

const parseSessionHistoryFixture = (value: string | string[] | undefined) => {
  const fixture = firstValue(value)

  return fixture === PREVIOUS_DAYS_SESSION_HISTORY_FIXTURE ? fixture : null
}

const getCompletedAtDaysAgo = (now: Date, daysAgo: number) => {
  const completedAt = new Date(now)
  completedAt.setHours(12, 0, 0, 0)
  completedAt.setDate(completedAt.getDate() - daysAgo)

  return completedAt.toISOString()
}

export const createPreviousDaysSessionHistoryFixture = (
  now: Date,
): CompletedFocusSession[] => [
  {
    id: "e2e-two-days-ago",
    completedAt: getCompletedAtDaysAgo(now, 2),
    durationMs: 25 * MS_PER_MINUTE,
  },
  {
    id: "e2e-yesterday",
    completedAt: getCompletedAtDaysAgo(now, 1),
    durationMs: 15 * MS_PER_MINUTE,
  },
]

export const isE2ESetupEnabled = (
  appVariant = Constants.expoConfig?.extra?.appVariant,
) => appVariant === "test"

export function applyE2ESetupParams(
  params: E2ESetupParams,
  {
    appVariant = Constants.expoConfig?.extra?.appVariant,
    now = new Date(),
  }: ApplyE2ESetupOptions = {},
) {
  if (!isE2ESetupEnabled(appVariant)) return

  const focusDurationMs = parseDurationMs(params.focusDurationMs)
  const breakDurationMs = parseDurationMs(params.breakDurationMs)
  const completionSound = parseCompletionSound(params.completionSound)
  const sessionHistoryFixture = parseSessionHistoryFixture(
    params.sessionHistoryFixture,
  )
  const settingsStore = useSettingsStore.getState()

  if (focusDurationMs !== null) {
    settingsStore.setFocusTimeMinutes(durationMsToStoreMinutes(focusDurationMs))
  }

  if (breakDurationMs !== null) {
    settingsStore.setBreakTimeMinutes(durationMsToStoreMinutes(breakDurationMs))
  }

  if (completionSound !== null) {
    settingsStore.setCompletionSound(completionSound)
  }

  if (sessionHistoryFixture === PREVIOUS_DAYS_SESSION_HISTORY_FIXTURE) {
    useSessionHistoryStore.setState({
      completedFocusSessions: createPreviousDaysSessionHistoryFixture(now),
    })
  }
}
