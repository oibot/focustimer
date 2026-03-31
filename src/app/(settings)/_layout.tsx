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
          headerTransparent: true,
          title: "",
          unstable_headerLeftItems: () => [
            {
              type: "button",
              label: t`Cancel`,
              icon: { type: "sfSymbol", name: "xmark" },
              onPress: () => {
                console.log("close settings")
              },
            },
          ],
          unstable_headerRightItems: () => [
            {
              type: "button",
              label: t`Save`,
              icon: { type: "sfSymbol", name: "checkmark" },
              variant: "prominent",
              onPress: () => {
                console.log("save settings")
              },
            },
          ],
        }}
      />
    </Stack>
  )
}
