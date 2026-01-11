import { Stack } from "expo-router"

export const unstable_settings = {
  anchor: "index",
}

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="timer-done"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: [0.25, 1],
          sheetInitialDetentIndex: 0,
          sheetGrabberVisible: true,
          headerShown: false,
        }}
      />
    </Stack>
  )
}
