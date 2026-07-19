const MINUTE_MS = 60 * 1000

export const SESSION_DURATION_STEP_MINUTES = 5
export const SESSION_DURATION_MAX_MINUTES = 60
export const SESSION_DURATION_FILL_STEPS =
  SESSION_DURATION_MAX_MINUTES / SESSION_DURATION_STEP_MINUTES

export const getSessionDurationFillStep = (durationMs: number) => {
  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    return 0
  }

  const durationMinutes = durationMs / MINUTE_MS
  const fillStep = Math.round(durationMinutes / SESSION_DURATION_STEP_MINUTES)

  return Math.min(fillStep, SESSION_DURATION_FILL_STEPS)
}
