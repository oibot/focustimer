import "@testing-library/jest-native/extend-expect"

jest.mock("expo-notifications", () => ({
  addNotificationReceivedListener: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
}))

jest.mock("expo-keep-awake", () => ({
  useKeepAwake: jest.fn(),
}))

jest.mock("expo-audio", () => ({
  useAudioPlayer: jest.fn(() => ({
    play: jest.fn(),
    seekTo: jest.fn(),
  })),
}))

jest.mock("@expo/ui/swift-ui", () => {
  const React = require("react")
  const { View } = require("react-native")

  const MockView = ({ children, ...props }: any) =>
    React.createElement(View, props, children)

  return new Proxy(
    {},
    {
      get: (_, prop) => (prop === "__esModule" ? true : MockView),
    },
  )
})

jest.mock("react-native-unistyles", () => ({
  StyleSheet: {
    create: (styles: any) => styles,
  },
  useUnistyles: () => ({
    theme: {
      colors: {
        background: "#ffffff",
        primary: "#111111",
        secondary: "#666666",
      },
    },
    rt: { colorScheme: "light" },
  }),
}))
