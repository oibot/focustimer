import ActivityKit
import WidgetKit
import SwiftUI
import UIKit

struct FocusOnlyLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: FocusOnlyAttributes.self) { context in
      FocusOnlyLockScreenView(context: context)
      .activityBackgroundTint(ActivityColors.background)
      .activitySystemActionForegroundColor(.primary)

    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          AppIconView(size: 28, padded: true)
        }
        DynamicIslandExpandedRegion(.center) {
          Text(context.attributes.strings.title)
            .font(.headline)
            .lineLimit(1)
        }
        DynamicIslandExpandedRegion(.trailing) {
          TimerText(
            seconds: context.state.secondsRemaining,
            size: 28,
            weight: .semibold
          )
        }
        DynamicIslandExpandedRegion(.bottom) {
          FocusOnlyExpandedBottomView(
            isRunning: context.state.isRunning,
            strings: context.attributes.strings
          )
        }
      } compactLeading: {
        TimerText(
          seconds: context.state.secondsRemaining,
          size: 14,
          weight: .medium
        )
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
      .keylineTint(.primary)
    }
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

private struct FocusOnlyLockScreenView: View {
  let context: ActivityViewContext<FocusOnlyAttributes>

  var body: some View {
    HStack(alignment: .center, spacing: Layout.rowSpacing) {
      AppIconView(size: Layout.iconSize, padded: true)
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
        size: Layout.timerSize,
        weight: .semibold
      )
    }
    .padding(Layout.edgePadding)
  }
}

private struct FocusOnlyExpandedBottomView: View {
  let isRunning: Bool
  let strings: FocusOnlyAttributes.Strings

  var body: some View {
    HStack(spacing: 8) {
      StatusPill(isRunning: isRunning, strings: strings)
      Text(isRunning ? strings.subtitleRunning : strings.subtitlePaused)
        .font(.caption)
        .foregroundStyle(.secondary)
      Spacer(minLength: 0)
    }
  }
}

private struct TimerText: View {
  let seconds: Int
  let size: CGFloat
  let weight: Font.Weight

  var body: some View {
    Text(formatMMSS(seconds))
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
      .background(isRunning ? ActivityColors.runningBackground : ActivityColors.pausedBackground, in: Capsule())
  }
}

private struct AppIconView: View {
  let size: CGFloat
  let padded: Bool

  var body: some View {
    Image(.icon)
      .resizable()
      .scaledToFit()
      .frame(width: size, height: size)
      .padding(padded ? Layout.iconPadding : 0)
      .background(
        padded ? ActivityColors.iconBackground : Color.clear,
        in: ContainerRelativeShape().inset(by: Layout.edgePadding)
      )
  }
}

private enum Layout {
  static let edgePadding: CGFloat = 16
  static let rowSpacing: CGFloat = 12
  static let iconSize: CGFloat = 28
  static let iconPadding: CGFloat = 6
  static let timerSize: CGFloat = 36
}

private enum ActivityColors {
  static let background = Color(uiColor: .secondarySystemBackground)
  static let iconBackground = Color(uiColor: .tertiarySystemBackground)
  static let runningBackground = Color(uiColor: .systemGreen).opacity(0.2)
  static let pausedBackground = Color(uiColor: .systemOrange).opacity(0.2)
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
