import ActivityKit
import SwiftUI
import UIKit
import WidgetKit

struct FocusOnlyLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: FocusOnlyAttributes.self) { context in
      LockScreenView(context: context)
        .padding()
        .activityBackgroundTint(Color(.secondarySystemBackground))
        .activitySystemActionForegroundColor(.primary)

    } dynamicIsland: { context in
      DynamicIsland {
        expandedContent(context)
      } compactLeading: {
        TimerText(
          seconds: context.state.secondsRemaining,
          endDate: context.state.endDate,
          size: 14,
          weight: .medium
        )
      } compactTrailing: {
        AppIconView(size: 20)
      } minimal: {
        AppIconView(size: 20)
      }
      .keylineTint(.primary)
    }
  }
}

@DynamicIslandExpandedContentBuilder
private func expandedContent(
  _ context: ActivityViewContext<FocusOnlyAttributes>
) -> DynamicIslandExpandedContent<some View> {
  DynamicIslandExpandedRegion(.leading) {
    HStack(spacing: 8) {
      AppIconView(size: 28)
      Text(context.attributes.strings.title)
        .font(.title)
        .lineLimit(1)
        .minimumScaleFactor(0.8)
        .allowsTightening(true)
    }
  }
  DynamicIslandExpandedRegion(.trailing) {
    HStack {
      TimerText(
        seconds: context.state.secondsRemaining,
        endDate: context.state.endDate,
        size: 28,
        weight: .semibold
      )
    }
  }
}

private struct LockScreenView: View {
  let context: ActivityViewContext<FocusOnlyAttributes>

  var body: some View {
    HStack(alignment: .center) {
      AppIconView(size: 36)
      Text(context.attributes.strings.title)
        .font(.title)
        .lineLimit(1)
        .truncationMode(.tail)
        .minimumScaleFactor(0.8)
        .allowsTightening(true)
      Spacer(minLength: 8)
      TimerText(
        seconds: context.state.secondsRemaining,
        endDate: context.state.endDate,
        size: 36,
        weight: .semibold
      )
    }
  }
}

private struct TimerText: View {
  @Environment(\.isLuminanceReduced) private var isLuminanceReduced

  let seconds: Int
  let endDate: Date?
  let size: CGFloat
  let weight: Font.Weight

  private var uiFont: UIFont {
    UIFont.monospacedDigitSystemFont(
      ofSize: size,
      weight: .init(weight),
    )
  }

  var body: some View {
    timerContent
      .font(.system(size: size, weight: weight))
      .monospacedDigit()
      .lineLimit(1)
      .opacity(isLuminanceReduced ? 0.75 : 1)
      .frame(width: timerWidth(for: uiFont), alignment: .trailing)
  }

  @ViewBuilder
  private var timerContent: some View {
    if let endDate {
      if isLuminanceReduced {
        EmptyView()
      } else {
        Text(
          timerInterval: min(Date.now, endDate)...endDate,
          countsDown: true,
          showsHours: false
        )
      }
    } else {
      Text(formatMMSS(seconds))
    }
  }
}

private struct AppIconView: View {
  let size: CGFloat

  var body: some View {
    Image(.icon)
      .resizable()
      .scaledToFit()
      .frame(width: size, height: size)
      .padding(4)
      .background(Color(.tertiarySystemBackground), in: Circle())
  }
}

extension FocusOnlyAttributes {
    fileprivate static var preview: Self {
      FocusOnlyAttributes(
        strings: FocusOnlyAttributes.Strings(
          title: "FO",
          statusRunning: "Running",
          statusPaused: "Paused",
          subtitleRunning: "Stay focused",
          subtitlePaused: "Session paused"
        )
      )
    }
}

extension FocusOnlyAttributes.ContentState {
  fileprivate static var preview: Self {
    Self(
      secondsRemaining: 1111,
      endDate: Date().addingTimeInterval(1111)
    )
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
