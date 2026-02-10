import ActivityKit
import ExpoModulesCore

public class LiveActivitiesControllerModule: Module {

  //private var current: Activity<FocusOnlyAttributes>?

  public func definition() -> ModuleDefinition {
    Name("LiveActivitiesController")

    Function("areActivitiesEnabled") { () -> Bool in
      if #available(iOS 16.1, *) {
        return ActivityAuthorizationInfo().areActivitiesEnabled
      } else {
        return false
      }
    }

    Function("startActivity") { (title: String, secondsRemaining: Int) -> String? in
      //guard ActivityAuthorizationInfo().areActivitiesEnabled else { return nil }

      let attributes = FocusOnlyAttributes(title: title)
      let state = FocusOnlyAttributes.ContentState(
        secondsRemaining: secondsRemaining,
        isRunning: true
      )

      return nil
    }
  }
}
