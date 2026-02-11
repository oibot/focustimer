import ActivityKit
import ExpoModulesCore
import os

public class LiveActivitiesControllerModule: Module {

  private var current: Activity<FocusOnlyAttributes>?
  private let logger = Logger(
    subsystem: Bundle.main.bundleIdentifier ?? "LiveActivitiesController",
    category: "LiveActivitiesController"
  )

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
      guard ActivityAuthorizationInfo().areActivitiesEnabled else { return nil }

      do {
        self.current = try Activity.request(
          attributes: FocusOnlyAttributes(title: title),
          content: ActivityContent(
            state: FocusOnlyAttributes.ContentState(
              secondsRemaining: secondsRemaining,
              isRunning: true
            ),
            staleDate: nil
          )
        )
      } catch {
        logger.error("startActivity failed: \(String(describing: error), privacy: .public)")
      }

      return current?.id
    }

    AsyncFunction("updateActivity") { (secondsRemaining: Int, isRunning: Bool) async -> Void in
      guard let current = self.current else { return }
      let content = ActivityContent(
        state: FocusOnlyAttributes.ContentState(
          secondsRemaining: secondsRemaining,
          isRunning: isRunning
        ),
        staleDate: nil
      )
      await current.update(content)
    }

    AsyncFunction("endActivity") { (secondsRemaining: Int, isRunning: Bool) async -> Void in
      guard let current = self.current else { return }
      let content = ActivityContent(
        state: FocusOnlyAttributes.ContentState(
          secondsRemaining: secondsRemaining,
          isRunning: isRunning
        ),
        staleDate: nil
      )
      await current.end(content, dismissalPolicy: .immediate)
      self.current = nil
    }
  }
}
