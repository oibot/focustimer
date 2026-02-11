import ActivityKit
import WidgetKit
import SwiftUI

struct FocusOnlyLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: FocusOnlyAttributes.self) { context in
      VStack {
        Text("Hello \(context.attributes.title)")
      }
      .activityBackgroundTint(Color.cyan)
      .activitySystemActionForegroundColor(Color.black)

    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          Text("")
        }
        DynamicIslandExpandedRegion(.trailing) {
          Text("\(context.attributes.title)")
        }
        DynamicIslandExpandedRegion(.bottom) {
          Text("Bottom")
        }
      } compactLeading: {
        Text("\(formatMMSS(context.state.secondsRemaining))")
          .monospaced()
      } compactTrailing: {
        Image(.icon)
          .resizable()
          .scaledToFit()
          .frame(width: 24, height: 24)
      } minimal: {
        Image(.icon)
          .resizable()
          .scaledToFit()
          .frame(width: 24, height: 24)
      }
      .widgetURL(URL(string: "https://www.expo.dev"))
      .keylineTint(Color.red)
    }
  }

  private func formatMMSS(_ seconds: Int) -> String {
    TimeFormatters.mmss.string(from: TimeInterval(seconds)) ?? "0:00"
  }
}

enum TimeFormatters {
  static let mmss: DateComponentsFormatter = {
    let f = DateComponentsFormatter()
    f.allowedUnits = [.minute, .second]
    f.unitsStyle = .positional
    f.zeroFormattingBehavior = [.pad]
    return f
  }()
}

extension FocusOnlyAttributes {
    fileprivate static var preview: Self {
      FocusOnlyAttributes(title: "FO")
    }
}

extension FocusOnlyAttributes.ContentState {
  fileprivate static var preview: Self {
    Self(secondsRemaining: 1111, isRunning: true)
  }
}

#Preview("Lockscreen", as: .content, using: FocusOnlyAttributes.preview) {
  FocusOnlyLiveActivity()
} contentStates: {
  .preview
}

#Preview("Expanded", as: .dynamicIsland(.expanded), using: FocusOnlyAttributes.preview) {
  FocusOnlyLiveActivity()
} contentStates: {
  .preview
}

#Preview("Compact", as: .dynamicIsland(.compact), using: FocusOnlyAttributes.preview) {
  FocusOnlyLiveActivity()
} contentStates: {
  .preview
}

#Preview("Minimal", as: .dynamicIsland(.minimal), using: FocusOnlyAttributes.preview) {
  FocusOnlyLiveActivity()
} contentStates: {
  .preview
}
