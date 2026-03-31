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
import { useState } from "react"
import { StyleSheet } from "react-native-unistyles"

import { useStore } from "@/state/store"

const MIN_FOCUS_TIME_MINUTES = 10
const MAX_FOCUS_TIME_MINUTES = 60
const MIN_BREAK_TIME_MINUTES = 5
const MAX_BREAK_TIME_MINUTES = 20

export default function Settings() {
  const { t } = useLingui()
  const { keepScreenAwake, setKeepScreenAwake } = useStore()
  const [focusTimeMinutes, setFocusTimeMinutes] = useState(25)
  const [breakTimeMinutes, setBreakTimeMinutes] = useState(5)
  const focusTimeLabel =
    focusTimeMinutes === 1
      ? t`${focusTimeMinutes} minute`
      : t`${focusTimeMinutes} minutes`
  const breakTimeLabel =
    breakTimeMinutes === 1
      ? t`${breakTimeMinutes} minute`
      : t`${breakTimeMinutes} minutes`

  return (
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
