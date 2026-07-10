import { Form, Host, Picker, Section, Text, Toggle } from "@expo/ui/swift-ui"
import { accessibilityIdentifier, tag } from "@expo/ui/swift-ui/modifiers"
import { useLingui } from "@lingui/react/macro"
import { Stack, useRouter } from "expo-router"
import { useNavigation, usePreventRemove } from "expo-router/react-navigation"
import { useCallback, useState } from "react"
import { Alert } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { SettingsSlider } from "@/components/settings/SettingsSlider"
import { type CompletionSound, completionSoundOptions } from "@/sounds"
import { useStore } from "@/state/store"
import {
  DIMMED_BRIGHTNESS_DEFAULT_PERCENT,
  DIMMED_BRIGHTNESS_MAX_PERCENT,
  DIMMED_BRIGHTNESS_MIN_PERCENT,
} from "@/utils/screenDimming"

const MIN_FOCUS_TIME_MINUTES = 10
const MAX_FOCUS_TIME_MINUTES = 60
const MIN_BREAK_TIME_MINUTES = 5
const MAX_BREAK_TIME_MINUTES = 20

export function SettingsScene() {
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
          <Section title={t`Focus`}>
            <SettingsSlider
              min={MIN_FOCUS_TIME_MINUTES}
              max={MAX_FOCUS_TIME_MINUTES}
              step={5}
              value={focusTimeMinutes}
              valueLabel={focusTimeLabel}
              minimumSystemImage="timer"
              testID="settings-focus-duration-slider"
              onValueChange={(value) => {
                setFocusTimeMinutes(value)
              }}
            />
          </Section>
          <Section title={t`Break`}>
            <SettingsSlider
              min={MIN_BREAK_TIME_MINUTES}
              max={MAX_BREAK_TIME_MINUTES}
              step={5}
              value={breakTimeMinutes}
              valueLabel={breakTimeLabel}
              minimumSystemImage="timer"
              testID="settings-break-duration-slider"
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
              testID="settings-completion-sound-picker"
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
              testID="settings-live-activities-toggle"
              modifiers={[
                accessibilityIdentifier("settings-live-activities-toggle"),
              ]}
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
              testID="settings-keep-screen-awake-toggle"
              modifiers={[
                accessibilityIdentifier("settings-keep-screen-awake-toggle"),
              ]}
              isOn={keepScreenAwake}
              onIsOnChange={setKeepScreenAwake}
            />
          </Section>

          <Section
            footer={
              <Text>{t`Dim the screen while a focus or break timer is running. Brightness restores when you tap the screen or switch apps.`}</Text>
            }
          >
            <Toggle
              label={t`Screen dimming`}
              testID="settings-screen-dimming-toggle"
              modifiers={[
                accessibilityIdentifier("settings-screen-dimming-toggle"),
              ]}
              isOn={screenDimmingEnabled}
              onIsOnChange={(nextValue) => {
                setScreenDimmingEnabled(nextValue)
                if (!nextValue) {
                  setDimmedBrightnessPercent(DIMMED_BRIGHTNESS_DEFAULT_PERCENT)
                }
              }}
            />
            {screenDimmingEnabled ? (
              <SettingsSlider
                min={DIMMED_BRIGHTNESS_MIN_PERCENT}
                max={DIMMED_BRIGHTNESS_MAX_PERCENT}
                step={1}
                value={dimmedBrightnessPercent}
                valueLabel={dimmedBrightnessLabel}
                minimumSystemImage="sun.min"
                testID="settings-screen-dimming-brightness-slider"
                onValueChange={(value) => {
                  setDimmedBrightnessPercent(Math.round(value))
                }}
              />
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
