import { NativeModule, requireNativeModule } from "expo"

declare class LiveActivitiesControllerModule extends NativeModule {
  areActivitiesEnabled: () => boolean
  startActivity: (title: string, secondsRemaining: number) => string | null
  updateActivity: (secondsRemaining: number, isRunning: boolean) => Promise<void>
  endActivity: (secondsRemaining: number, isRunning: boolean) => Promise<void>
}

export default requireNativeModule<LiveActivitiesControllerModule>(
  "LiveActivitiesController",
)
