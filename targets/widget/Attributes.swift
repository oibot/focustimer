import ActivityKit

struct FocusOnlyAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    var secondsRemaining: Int
    var isRunning: Bool
  }

  public struct Strings: Codable, Hashable {
    var title: String
    var statusRunning: String
    var statusPaused: String
    var subtitleRunning: String
    var subtitlePaused: String
  }

  var strings: Strings
}
