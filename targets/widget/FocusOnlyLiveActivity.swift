import ActivityKit
import WidgetKit
import SwiftUI
import UIKit

struct FocusOnlyLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: FocusOnlyAttributes.self) { context in
      LockScreenView(context: context)
      .activityBackgroundTint(Color(.secondarySystemBackground))
      .activitySystemActionForegroundColor(.primary)

    } dynamicIsland: { context in
      DynamicIsland {
        expandedContent(context)
      } compactLeading: {
        TimerText(
          seconds: context.state.secondsRemaining,
          endDate: context.state.endDate,
          isRunning: context.state.isRunning,
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
    AppIconView(size: 28)
      .padding(.leading, 8)
  }
  DynamicIslandExpandedRegion(.center) {
    Text(context.attributes.strings.title)
      .font(.headline)
      .lineLimit(1)
  }
  DynamicIslandExpandedRegion(.trailing) {
    TimerText(
      seconds: context.state.secondsRemaining,
      endDate: context.state.endDate,
      isRunning: context.state.isRunning,
      size: 28,
      weight: .semibold
    )
  }
  DynamicIslandExpandedRegion(.bottom) {
    ExpandedBottomView(
      isRunning: context.state.isRunning,
      strings: context.attributes.strings
    )
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

private func formatMMSS(_ seconds: Int) -> String {
  TimeFormatters.mmss.string(from: TimeInterval(seconds)) ?? "0:00"
}

private struct LockScreenView: View {
  let context: ActivityViewContext<FocusOnlyAttributes>

  var body: some View {
    HStack(alignment: .center, spacing: Layout.rowSpacing) {
      AppIconView(size: Layout.iconSize)
      Text(context.attributes.strings.title)
        .font(.headline)
        .lineLimit(1)
        .truncationMode(.tail)
      StatusPill(
        isRunning: context.state.isRunning,
        strings: context.attributes.strings
      )
      Spacer(minLength: 8)
      TimerText(
        seconds: context.state.secondsRemaining,
        endDate: context.state.endDate,
        isRunning: context.state.isRunning,
        size: Layout.timerSize,
        weight: .semibold
      )
    }
    .padding(Layout.edgePadding)
  }

}

private struct ExpandedBottomView: View {
  let isRunning: Bool
  let strings: FocusOnlyAttributes.Strings

  var body: some View {
    HStack(spacing: 8) {
      StatusPill(isRunning: isRunning, strings: strings)
        .padding(.leading, 8)
      Text(isRunning ? strings.subtitleRunning : strings.subtitlePaused)
        .font(.caption)
        .foregroundStyle(.secondary)
      Spacer(minLength: 0)
    }
  }
}

private struct TimerText: View {
  let seconds: Int
  let endDate: Date?
  let isRunning: Bool
  let size: CGFloat
  let weight: Font.Weight

  var body: some View {
    let text: Text = {
      if isRunning, let endDate {
        return Text(endDate, style: .timer)
      }
      return Text(formatMMSS(seconds))
    }()
    return text
      .font(.system(size: size, weight: weight, design: .rounded))
      .monospacedDigit()
      .lineLimit(1)
  }
}

private struct StatusPill: View {
  let isRunning: Bool
  let strings: FocusOnlyAttributes.Strings

  var body: some View {
    Label(
      isRunning ? strings.statusRunning : strings.statusPaused,
      systemImage: isRunning ? "play.fill" : "pause.fill"
    )
      .font(.caption2)
      .foregroundStyle(.primary)
      .padding(.horizontal, 8)
      .padding(.vertical, 4)
      .background(
        isRunning
          ? Color(.systemGreen).opacity(0.2)
          : Color(.systemOrange).opacity(0.2),
        in: Capsule()
      )
  }
}

private struct AppIconView: View {
  let size: CGFloat

  var body: some View {
    Image(.icon)
      .resizable()
      .scaledToFit()
      .frame(width: size, height: size)
      .padding(Layout.iconPadding)
      .background(Color(.tertiarySystemBackground), in: Circle())
  }
}

private enum Layout {
  static let edgePadding: CGFloat = 16
  static let rowSpacing: CGFloat = 12
  static let iconSize: CGFloat = 28
  static let iconPadding: CGFloat = 4
  static let timerSize: CGFloat = 36
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
      isRunning: true,
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
