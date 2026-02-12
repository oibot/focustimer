import TimerProvider from "@/components/providers/TimerProvider"
import * as Sentry from "@sentry/react-native"
import * as Notifications from "expo-notifications"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import { useColorScheme } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export const unstable_settings = {
  anchor: "index",
}

SplashScreen.setOptions({
  duration: 500,
  fade: true,
})

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: false,
    shouldShowList: false,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

Sentry.init({
  dsn: "https://c9186b3f36f62fb78c6138f1bf6a2a5f@o4510827175870464.ingest.de.sentry.io/4510827270766672",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
})

function Layout() {
  useEffect(() => {
    const ensurePermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync()
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync()
      }
    }
    void ensurePermissions()
  }, [])

  const colorScheme = useColorScheme()

  return (
    <GestureHandlerRootView>
      <TimerProvider>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen
            name="timer-done"
            options={{
              presentation: "formSheet",
              sheetAllowedDetents: [0.25],
              sheetInitialDetentIndex: 0,
              sheetGrabberVisible: true,
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
        </Stack>
      </TimerProvider>
    </GestureHandlerRootView>
  )
}

export default Sentry.wrap(Layout)
