import {
  Form,
  Host,
  HStack,
  Picker,
  Section,
  Slider,
  Spacer,
  Text,
  Toggle,
} from "@expo/ui/swift-ui"
import { tag } from "@expo/ui/swift-ui/modifiers"
import { useLingui } from "@lingui/react/macro"
import { Stack, useRouter } from "expo-router"
import { useNavigation, usePreventRemove } from "expo-router/react-navigation"
import { useCallback, useState } from "react"
import { Alert } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { type CompletionSound, completionSoundOptions } from "@/sounds"
import { DEFAULT_DIMMED_BRIGHTNESS_PERCENT, useStore } from "@/state/store"

const MIN_FOCUS_TIME_MINUTES = 10
const MAX_FOCUS_TIME_MINUTES = 60
const MIN_BREAK_TIME_MINUTES = 5
const MAX_BREAK_TIME_MINUTES = 20
const MIN_DIMMED_BRIGHTNESS_PERCENT = 5
const MAX_DIMMED_BRIGHTNESS_PERCENT = 20

export default function Settings() {
  const { t } = useLingui()
  const navigation = useNavigation()
  const router = useRouter()
  const store = useStore()
  const [breakTimeMinutes, setBreakTimeMinutes] = useState(
    store.breakTimeMinutes,
  )
  const [completionSound, setCompletionSound] = useState(store.completionSound)
  const [dimmedBrightnessPercent, setDimmedBrightnessPercent] = useState(
    store.dimmedBrightnessPercent,
  )
  const [focusTimeMinutes, setFocusTimeMinutes] = useState(
    store.focusTimeMinutes,
  )
  const [liveActivitiesEnabled, setLiveActivitiesEnabled] = useState(
    store.liveActivitiesEnabled,
  )
  const [keepScreenAwake, setKeepScreenAwake] = useState(store.keepScreenAwake)
  const [screenDimmingEnabled, setScreenDimmingEnabled] = useState(
    store.screenDimmingEnabled,
  )

  const focusTimeLabel =
    focusTimeMinutes === 1
      ? t`${focusTimeMinutes} minute`
      : t`${focusTimeMinutes} minutes`
  const breakTimeLabel =
    breakTimeMinutes === 1
      ? t`${breakTimeMinutes} minute`
      : t`${breakTimeMinutes} minutes`
  const completionSoundLabels: Record<CompletionSound, string> = {
    cheering: t`Cheering`,
    marimba: t`Marimba`,
    off: t`Off`,
    softChime: t`Soft Chime`,
    trumpets: t`Trumpets`,
  }
  const dimmedBrightnessLabel = t`${dimmedBrightnessPercent}%`
  const hasUnsavedChanges =
    breakTimeMinutes !== store.breakTimeMinutes ||
    completionSound !== store.completionSound ||
    dimmedBrightnessPercent !== store.dimmedBrightnessPercent ||
    focusTimeMinutes !== store.focusTimeMinutes ||
    liveActivitiesEnabled !== store.liveActivitiesEnabled ||
    keepScreenAwake !== store.keepScreenAwake ||
    screenDimmingEnabled !== store.screenDimmingEnabled

  const showDiscardChangesAlert = useCallback(
    (onDiscard: () => void = () => {}) => {
      Alert.alert(
        t`Discard changes?`,
        t`You have unsaved changes. Are you sure you want to discard them?`,
        [
          { text: t`Keep editing`, style: "cancel" },
          {
            text: t`Discard`,
            style: "destructive",
            onPress: onDiscard,
          },
        ],
      )
    },
    [t],
  )

  const handleSave = useCallback(() => {
    useStore.setState({
      breakTimeMinutes,
      completionSound,
      dimmedBrightnessPercent,
      focusTimeMinutes,
      liveActivitiesEnabled,
      keepScreenAwake,
      screenDimmingEnabled,
    })
    router.dismiss()
  }, [
    breakTimeMinutes,
    completionSound,
    dimmedBrightnessPercent,
    focusTimeMinutes,
    keepScreenAwake,
    liveActivitiesEnabled,
    router,
    screenDimmingEnabled,
  ])

  usePreventRemove(hasUnsavedChanges, ({ data }) => {
    showDiscardChangesAlert(() => {
      navigation.dispatch(data.action)
    })
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
            title={t`Sounds`}
            footer={
              <Text>
                {t`Choose the sound that plays when a focus or break timer finishes.`}
              </Text>
            }
          >
            <Picker
              label={t`Completion Sound`}
              selection={completionSound}
              onSelectionChange={(value) => {
                setCompletionSound(value as CompletionSound)
              }}
            >
              {completionSoundOptions.map((sound) => (
                <Text key={sound} modifiers={[tag(sound)]}>
                  {completionSoundLabels[sound]}
                </Text>
              ))}
            </Picker>
          </Section>

          <Section
            title={t`Live Activities`}
            footer={
              <Text>
                {t`Show the running timer on the Lock Screen and in the Dynamic Island.`}
              </Text>
            }
          >
            <Toggle
              label={t`Enable Live Activities`}
              isOn={liveActivitiesEnabled}
              onIsOnChange={setLiveActivitiesEnabled}
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

          <Section
            footer={<Text>{t`Dim the screen when the timer is running`}</Text>}
          >
            <Toggle
              label={t`Dim screen when timer runs`}
              isOn={screenDimmingEnabled}
              onIsOnChange={(nextValue) => {
                setScreenDimmingEnabled(nextValue)
                if (!nextValue) {
                  setDimmedBrightnessPercent(DEFAULT_DIMMED_BRIGHTNESS_PERCENT)
                }
              }}
            />
            {screenDimmingEnabled ? (
              <>
                <HStack>
                  <Text>{t`Dimmed brightness`}</Text>
                  <Spacer />
                  <Text>{dimmedBrightnessLabel}</Text>
                </HStack>
                <Slider
                  min={MIN_DIMMED_BRIGHTNESS_PERCENT}
                  max={MAX_DIMMED_BRIGHTNESS_PERCENT}
                  step={1}
                  value={dimmedBrightnessPercent}
                  onValueChange={(value) => {
                    setDimmedBrightnessPercent(Math.round(value))
                  }}
                />
              </>
            ) : null}
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
