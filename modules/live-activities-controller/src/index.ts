import LiveActivitiesControllerModule from "./LiveActivitiesControllerModule"

export function areActivitiesEnabled(): boolean {
  return LiveActivitiesControllerModule.areActivitiesEnabled()
}

export function startActivity(title: string, secondsRemaining: number): string | null {
  return LiveActivitiesControllerModule.startActivity(title, secondsRemaining)
}

export async function updateActivity(
  secondsRemaining: number,
  isRunning: boolean,
): Promise<void> {
  await LiveActivitiesControllerModule.updateActivity(secondsRemaining, isRunning)
}

export async function endActivity(
  secondsRemaining: number,
  isRunning: boolean,
): Promise<void> {
  await LiveActivitiesControllerModule.endActivity(secondsRemaining, isRunning)
}
