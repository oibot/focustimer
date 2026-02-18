import type { ExpoConfig } from "expo/config"

const variant = process.env.APP_VARIANT

const name =
  variant === "dev"
    ? "Focus Only Dev"
    : variant === "test"
      ? "Focus Only Test"
      : "Focus Only"

const icon =
  variant === "dev"
    ? "./assets/icon/Hourglass-dev.icon"
    : variant === "test"
      ? "./assets/icon/Hourglass-test.icon"
      : "./assets/icon/Hourglass.icon"

const bundleBase = "de.totap.focustimer"
const deploymentSuffix =
  variant === "dev" ? ".development" : variant === "test" ? ".test" : ""
const bundleIdentifier = `${bundleBase}${deploymentSuffix}`
const appGroup = `group.${bundleBase}${deploymentSuffix}`

const config: ExpoConfig = {
  name,
  slug: "focusonly",
  scheme: "focusonly",
  version: "0.1.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  owner: "tobio",
  newArchEnabled: true,
  icon,
  ios: {
    supportsTablet: true,
    bundleIdentifier,
    config: {
      usesNonExemptEncryption: false,
    },
    icon,
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
    appleTeamId: "DCY46V87K7",
    entitlements: {
      "com.apple.security.application-groups": [appGroup],
    },
    infoPlist: {
      NSSupportsLiveActivities: true,
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
    "@bacons/apple-targets",
    "expo-router",
    "expo-audio",
    "expo-asset",
    [
      "expo-build-properties",
      {
        ios: {
          deploymentTarget: "26.0",
        },
      },
    ],
    [
      "@sentry/react-native",
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
