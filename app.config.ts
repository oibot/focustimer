import type { ExpoConfig } from "expo/config"

const variant = process.env.APP_VARIANT
const name =
  variant === "dev"
    ? "Focus Only Dev"
    : variant === "test"
      ? "Focus Only Test"
      : "Focus Only"

const bundleBase = "de.totap.focusonly"
const bundleIdentifier =
  variant === "dev"
    ? `${bundleBase}.dev`
    : variant === "test"
      ? `${bundleBase}.test`
      : bundleBase

const config: ExpoConfig = {
  name,
  slug: "focusonly",
  scheme: "focusonly",
  version: "0.1.0",
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
  plugins: [
    "expo-router",
    "expo-audio",
    "expo-asset",
    [
      "@sentry/react-native/expo",
      {
        url: "https://sentry.io/",
        project: "focus-timer",
        organization: "totap",
      },
    ],
  ],
}

export default config
