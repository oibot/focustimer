import LiveActivitiesControllerModule from "./LiveActivitiesControllerModule"

export function areActivitiesEnabled(): boolean {
  return LiveActivitiesControllerModule.areActivitiesEnabled()
}
