export type TimerStatus = "idle" | "running" | "paused" | "done"

export type TimerMode = "focus" | "short"

export const isTimerMode = (value?: string): value is TimerMode =>
  value === "focus" || value === "short"
