import { useLingui } from "@lingui/react/macro"
import { Stack, useRouter } from "expo-router"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

export function StatisticsScene() {
  const { t } = useLingui()
  const router = useRouter()

  return (
    <>
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
      />
      <Stack.Screen
        options={{
          headerTransparent: true,
          title: t`Statistics`,
          unstable_headerLeftItems: () => [
            {
              type: "button",
              label: t`Close`,
              icon: { type: "sfSymbol", name: "xmark" },
              onPress: () => {
                router.dismiss()
              },
            },
          ],
        }}
      />
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}))
