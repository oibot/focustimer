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
