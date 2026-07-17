import { useMemo } from "react"

import { useSettingsStore } from "@/state/settings"
import type { TimerModeConfig } from "@/types/timer"

export default function useTimerModeConfig(
  modeConfig?: TimerModeConfig,
): TimerModeConfig {
  const breakTimeMinutes = useSettingsStore((state) => state.breakTimeMinutes)
  const focusTimeMinutes = useSettingsStore((state) => state.focusTimeMinutes)

  return useMemo(
    () =>
      modeConfig ?? {
        focus: {
          startingMs: focusTimeMinutes * 60 * 1000,
          nextMode: "short",
        },
        short: {
          startingMs: breakTimeMinutes * 60 * 1000,
          nextMode: "focus",
        },
      },
    [breakTimeMinutes, focusTimeMinutes, modeConfig],
  )
}
