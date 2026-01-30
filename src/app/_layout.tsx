import { Stack } from "expo-router"
import * as Notifications from "expo-notifications"
import { useEffect } from "react"
import TimerProvider from "@/components/providers/TimerProvider"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { useColorScheme } from "react-native"
import { StatusBar } from "expo-status-bar"

export const unstable_settings = {
  anchor: "index",
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: false,
    shouldShowList: false,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export default function Layout() {
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
