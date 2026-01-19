import { Stack } from "expo-router"
import * as Notifications from "expo-notifications"
import { useEffect } from "react"

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

  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="timer-done"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: [0.25],
          sheetInitialDetentIndex: 0,
          sheetGrabberVisible: true,
          headerShown: false,
        }}
      />
    </Stack>
  )
}
