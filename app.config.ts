import type { ExpoConfig } from "expo/config"

const variant = process.env.APP_VARIANT
const name =
  variant === "dev"
    ? "pomodoro-dev"
    : variant === "test"
      ? "pomodoro-test"
      : "pomodoro"

const bundleBase = "de.totap.pomodoro"
const bundleIdentifier =
  variant === "dev"
    ? `${bundleBase}.dev`
    : variant === "test"
      ? `${bundleBase}.test`
      : bundleBase

const config: ExpoConfig = {
  name,
  slug: "pomodoro",
  scheme: "pomodoro",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  icon: "./assets/icon.png",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier,
  },
  android: {
    package: bundleIdentifier,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: ["expo-router", "expo-audio", "expo-asset"],
}

export default config
