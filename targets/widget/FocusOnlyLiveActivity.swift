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
          Text("\(context.state.secondsRemaining)")
        }
        DynamicIslandExpandedRegion(.trailing) {
          Text("\(context.attributes.title)")
        }
        DynamicIslandExpandedRegion(.bottom) {
          Text("Bottom")
        }
      } compactLeading: {
        Text("\(context.state.secondsRemaining)")
      } compactTrailing: {
        Text("\(context.attributes.title)")
      } minimal: {
        Text("\(context.state.secondsRemaining)")
      }
      .widgetURL(URL(string: "https://www.expo.dev"))
      .keylineTint(Color.red)
    }
  }
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
