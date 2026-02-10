import { NativeModule, requireNativeModule } from "expo"

declare class LiveActivitiesControllerModule extends NativeModule {
  areActivitiesEnabled: () => boolean
}

export default requireNativeModule<LiveActivitiesControllerModule>(
  "LiveActivitiesController",
)
