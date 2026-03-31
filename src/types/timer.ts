export type TimerStatus = "idle" | "running" | "paused" | "done"

export type TimerMode = "focus" | "short"

export type TimerModeConfig = Record<
  TimerMode,
  {
    startingMs: number
    nextMode: TimerMode
  }
>

export const isTimerMode = (value?: string): value is TimerMode =>
  value === "focus" || value === "short"
