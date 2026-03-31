import {
  Form,
  Host,
  HStack,
  Section,
  Slider,
  Spacer,
  Text,
  Toggle,
} from "@expo/ui/swift-ui"
import { useLingui } from "@lingui/react/macro"
import { Stack, useRouter } from "expo-router"
import { useEffectEvent, useState } from "react"
import { StyleSheet } from "react-native-unistyles"

import { useStore } from "@/state/store"

const MIN_FOCUS_TIME_MINUTES = 10
const MAX_FOCUS_TIME_MINUTES = 60
const MIN_BREAK_TIME_MINUTES = 5
const MAX_BREAK_TIME_MINUTES = 20

export default function Settings() {
  const { t } = useLingui()
  const router = useRouter()
  const store = useStore()
  const [breakTimeMinutes, setBreakTimeMinutes] = useState(
    store.breakTimeMinutes,
  )
  const [focusTimeMinutes, setFocusTimeMinutes] = useState(
    store.focusTimeMinutes,
  )
  const [keepScreenAwake, setKeepScreenAwake] = useState(store.keepScreenAwake)

  const focusTimeLabel =
    focusTimeMinutes === 1
      ? t`${focusTimeMinutes} minute`
      : t`${focusTimeMinutes} minutes`
  const breakTimeLabel =
    breakTimeMinutes === 1
      ? t`${breakTimeMinutes} minute`
      : t`${breakTimeMinutes} minutes`

  const handleSave = useEffectEvent(() => {
    useStore.setState({
      breakTimeMinutes,
      focusTimeMinutes,
      keepScreenAwake,
    })
    router.dismiss()
  })

  return (
    <>
      <Stack.Screen
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
                router.dismiss()
              },
            },
          ],
          unstable_headerRightItems: () => [
            {
              type: "button",
              label: t`Save`,
              icon: { type: "sfSymbol", name: "checkmark" },
              variant: "prominent",
              onPress: handleSave,
            },
          ],
        }}
      />
      <Host style={styles.container}>
        <Form>
          <Section>
            <HStack>
              <Text>{t`Focus`}</Text>
              <Spacer />
              <Text>{focusTimeLabel}</Text>
            </HStack>
            <Slider
              min={MIN_FOCUS_TIME_MINUTES}
              max={MAX_FOCUS_TIME_MINUTES}
              step={5}
              value={focusTimeMinutes}
              onValueChange={(value) => {
                setFocusTimeMinutes(value)
              }}
            />
          </Section>
          <Section>
            <HStack>
              <Text>{t`Break`}</Text>
              <Spacer />
              <Text>{breakTimeLabel}</Text>
            </HStack>
            <Slider
              min={MIN_BREAK_TIME_MINUTES}
              max={MAX_BREAK_TIME_MINUTES}
              step={5}
              value={breakTimeMinutes}
              onValueChange={(value) => {
                setBreakTimeMinutes(value)
              }}
            />
          </Section>

          <Section
            title={t`Display`}
            footer={
              <Text>{t`Prevent the screen from turning off while a timer is running.`}</Text>
            }
          >
            <Toggle
              label={t`Keep Screen Awake`}
              isOn={keepScreenAwake}
              onIsOnChange={setKeepScreenAwake}
            />
          </Section>
        </Form>
      </Host>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
