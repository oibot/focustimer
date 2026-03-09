import LiveActivitiesControllerModule from "./LiveActivitiesControllerModule"
import type { LiveActivityStrings } from "./LiveActivitiesController.type"

export type { LiveActivityStrings }

export function areActivitiesEnabled(): boolean {
  return LiveActivitiesControllerModule?.areActivitiesEnabled() ?? false
}

export function startActivity(
  strings: LiveActivityStrings,
  secondsRemaining: number,
): string | null {
  return (
    LiveActivitiesControllerModule?.startActivity(strings, secondsRemaining) ??
    null
  )
}

export async function updateActivity(
  secondsRemaining: number,
  isRunning: boolean,
): Promise<void> {
  await LiveActivitiesControllerModule?.updateActivity(
    secondsRemaining,
    isRunning,
  )
}

export async function reconcileExpiredActivities(): Promise<void> {
  await LiveActivitiesControllerModule?.reconcileExpiredActivities()
}

export async function endActivity(
  secondsRemaining: number,
  isRunning: boolean,
): Promise<void> {
  await LiveActivitiesControllerModule?.endActivity(secondsRemaining, isRunning)
}
