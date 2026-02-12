import { NativeModule, requireNativeModule } from "expo"
import type { LiveActivityStrings } from "./LiveActivitiesController.type"

declare class LiveActivitiesControllerModule extends NativeModule {
  areActivitiesEnabled: () => boolean
  startActivity: (
    strings: LiveActivityStrings,
    secondsRemaining: number,
  ) => string | null
  updateActivity: (secondsRemaining: number, isRunning: boolean) => Promise<void>
  endActivity: (secondsRemaining: number, isRunning: boolean) => Promise<void>
}

export default requireNativeModule<LiveActivitiesControllerModule>(
  "LiveActivitiesController",
)
