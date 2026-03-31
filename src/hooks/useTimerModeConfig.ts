import { useMemo } from "react"

import { useStore } from "@/state/store"
import type { TimerModeConfig } from "@/types/timer"

export default function useTimerModeConfig(
  modeConfig?: TimerModeConfig,
): TimerModeConfig {
  const breakTimeMinutes = useStore((state) => state.breakTimeMinutes)
  const focusTimeMinutes = useStore((state) => state.focusTimeMinutes)

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
