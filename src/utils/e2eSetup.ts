import Constants from "expo-constants"

import { type CompletionSound, completionSoundOptions } from "@/sounds"
import { useSettingsStore } from "@/state/settings"

const MS_PER_MINUTE = 60 * 1000
const MIN_DURATION_MS = 500
const MAX_DURATION_MS = 10 * 1000

export type E2ESetupParams = {
  breakDurationMs?: string | string[]
  completionSound?: string | string[]
  focusDurationMs?: string | string[]
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

export const isE2ESetupEnabled = (
  appVariant = Constants.expoConfig?.extra?.appVariant,
) => appVariant === "test"

export function applyE2ESetupParams(params: E2ESetupParams) {
  const focusDurationMs = parseDurationMs(params.focusDurationMs)
  const breakDurationMs = parseDurationMs(params.breakDurationMs)
  const completionSound = parseCompletionSound(params.completionSound)
  const store = useSettingsStore.getState()

  if (focusDurationMs !== null) {
    store.setFocusTimeMinutes(durationMsToStoreMinutes(focusDurationMs))
  }

  if (breakDurationMs !== null) {
    store.setBreakTimeMinutes(durationMsToStoreMinutes(breakDurationMs))
  }

  if (completionSound !== null) {
    store.setCompletionSound(completionSound)
  }
}
