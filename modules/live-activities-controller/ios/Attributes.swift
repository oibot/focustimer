import ActivityKit

struct FocusOnlyAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    var secondsRemaining: Int
    var isRunning: Bool
  }

  var title: String
}


