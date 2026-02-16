import ActivityKit
import ExpoModulesCore
import os

struct LiveActivityStringsRecord: Record {
  @Field
  var title: String

  @Field
  var statusRunning: String

  @Field
  var statusPaused: String

  @Field
  var subtitleRunning: String

  @Field
  var subtitlePaused: String
}

public class LiveActivitiesControllerModule: Module {

  private var current: Activity<FocusOnlyAttributes>?
  private let logger = Logger(
    subsystem: Bundle.main.bundleIdentifier ?? "LiveActivitiesController",
    category: "LiveActivitiesController"
  )

  private func makeContent(
    secondsRemaining: Int,
    isRunning: Bool
  ) -> ActivityContent<FocusOnlyAttributes.ContentState> {
    let endDate = isRunning
      ? Date().addingTimeInterval(TimeInterval(secondsRemaining))
      : nil
    return ActivityContent(
      state: FocusOnlyAttributes.ContentState(
        secondsRemaining: secondsRemaining,
        isRunning: isRunning,
        endDate: endDate
      ),
      staleDate: endDate
    )
  }

  public func definition() -> ModuleDefinition {
    Name("LiveActivitiesController")

    Function("areActivitiesEnabled") { () -> Bool in
      return ActivityAuthorizationInfo().areActivitiesEnabled
    }

    Function("startActivity") { (strings: LiveActivityStringsRecord, secondsRemaining: Int) -> String? in
      guard ActivityAuthorizationInfo().areActivitiesEnabled else { return nil }
      let attributes = FocusOnlyAttributes(
        strings: FocusOnlyAttributes.Strings(
          title: strings.title,
          statusRunning: strings.statusRunning,
          statusPaused: strings.statusPaused,
          subtitleRunning: strings.subtitleRunning,
          subtitlePaused: strings.subtitlePaused
        )
      )

      do {
        self.current = try Activity.request(
          attributes: attributes,
          content: makeContent(
            secondsRemaining: secondsRemaining,
            isRunning: true
          )
        )
      } catch {
        logger.error("startActivity failed: \(String(describing: error), privacy: .public)")
      }

      return current?.id
    }

    AsyncFunction("updateActivity") { (secondsRemaining: Int, isRunning: Bool) async -> Void in
      guard let current = self.current else { return }
      await current.update(makeContent(secondsRemaining: secondsRemaining, isRunning: isRunning))
    }

    AsyncFunction("endActivity") { (secondsRemaining: Int, isRunning: Bool) async -> Void in
      guard let current = self.current else { return }
      let content = makeContent(secondsRemaining: secondsRemaining, isRunning: isRunning)
      await current.end(content, dismissalPolicy: .immediate)
      self.current = nil
    }
  }
}
