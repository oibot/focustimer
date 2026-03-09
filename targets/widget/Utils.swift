import Foundation
import SwiftUI
import UIKit

enum TimeFormatters {
  static let mmss: DateComponentsFormatter = {
    let formatter = DateComponentsFormatter()
    formatter.allowedUnits = [.minute, .second]
    formatter.unitsStyle = .positional
    formatter.zeroFormattingBehavior = [.pad]
    return formatter
  }()
}

func formatMMSS(_ seconds: Int) -> String {
  TimeFormatters.mmss.string(from: TimeInterval(seconds)) ?? "0:00"
}

func timerWidth(for font: UIFont) -> CGFloat {
  let text = "88:88" as NSString
  let attributes: [NSAttributedString.Key: Any] = [
    .font: font,
  ]
  return ceil(text.size(withAttributes: attributes).width)
}

extension UIFont.Weight {
  init(_ weight: Font.Weight) {
    switch weight {
    case .ultraLight:
      self = .ultraLight
    case .thin:
      self = .thin
    case .light:
      self = .light
    case .regular:
      self = .regular
    case .medium:
      self = .medium
    case .semibold:
      self = .semibold
    case .bold:
      self = .bold
    case .heavy:
      self = .heavy
    case .black:
      self = .black
    default:
      self = .regular
    }
  }
}
