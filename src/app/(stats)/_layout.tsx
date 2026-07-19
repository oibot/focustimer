import { Stack } from "expo-router"

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="stats" options={{ headerTransparent: true }} />
    </Stack>
  )
}
