import { useLingui } from "@lingui/react/macro"
import { Stack } from "expo-router"

export default function SettingsLayout() {
  const { t } = useLingui()

  return (
    <Stack>
      <Stack.Screen
        name="settings"
        options={{
          headerShown: true,
          title: t`Settings`,
        }}
      />
    </Stack>
  )
}
