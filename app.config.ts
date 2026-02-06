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
  owner: "tobio",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier,
    icon: "./assets/icon/Hourglass.icon",
    splash: {
      image: "./assets/splash/splash-icon-light.png",
      resizeMode: "contain",
      backgroundColor: "#F2F2F7",
      dark: {
        image: "./assets/splash/splash-icon-dark.png",
        resizeMode: "contain",
        backgroundColor: "#1C1C1E",
      },
    },
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
  extra: {
    eas: {
      projectId: "7db1fae9-e214-4dab-b8e0-5be5136c2455",
    },
  },
}

export default config
