import { useLingui } from "@lingui/react/macro"
import { useEffect, useRef } from "react"
import * as ReactNative from "react-native"
import { AccessibilityInfo, Animated, View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import TimerNumericText from "@/components/home/TimerNumericText"
import { DestructiveButton } from "@/components/UI/Button"
import IconPrimaryButton from "@/components/UI/IconPrimaryButton"
import useRemainingTimeLabel from "@/hooks/useRemainingTimeLabel"
import useTimerControlsAnimation from "@/hooks/useTimerControlsAnimation"
import type { TimerMode, TimerStatus } from "@/types/timer"
import { formatDuration } from "@/utils/time"

type TimerProps = {
  remainingMs: number
  status: TimerStatus
  timerMode: TimerMode
  onToggle: () => void
  onCancel: () => void
  cancelLabel?: string
  canCancel?: boolean
  showControls?: boolean
  showDisabledCancel?: boolean
  animateDigits?: boolean
  usePlainTime?: boolean
  shouldFocusReadoutOnStart?: boolean
}

const READOUT_FOCUS_DELAY_MS = 100

export default function Timer({
  remainingMs,
  status,
  timerMode,
  onToggle,
  onCancel,
  cancelLabel = "Cancel",
  canCancel = status === "running",
  showControls = true,
  showDisabledCancel = false,
  animateDigits = true,
  usePlainTime = false,
  shouldFocusReadoutOnStart = false,
}: TimerProps) {
  const { t } = useLingui()
  const previousStatusRef = useRef<TimerStatus>(status)
  const readoutRef = useRef<View>(null)
  const pendingFocusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )
  const idleLabel = t`Start`
  const pauseLabel = t`Pause`
  const resumeLabel = t`Resume`
  const visibleTime = formatDuration(remainingMs)
  const formatRemainingTimeLabel = useRemainingTimeLabel()
  const idleHint =
    timerMode === "focus" ? t`Start focus timer` : t`Start break timer`
  const pauseHint = t`Pauses the timer`
  const resumeHint = t`Resumes the timer`
  const cancelHint = t`Resets the timer`
  const spokenTimerLabel = formatRemainingTimeLabel(remainingMs)
  const toggleLabel =
    status === "running"
      ? pauseLabel
      : status === "paused"
        ? resumeLabel
        : idleLabel
  const toggleHint =
    status === "running"
      ? pauseHint
      : status === "paused"
        ? resumeHint
        : idleHint
  const toggleSymbol = status === "running" ? "pause.fill" : "play.fill"
  const cancelAvailable = status === "running" || status === "paused"
  const showCancel = cancelAvailable || showDisabledCancel
  const { opacity: controlsOpacity, translateY: controlsTranslateY } =
    useTimerControlsAnimation({ visible: showControls })

  useEffect(() => {
    if (pendingFocusTimeoutRef.current !== null) {
      clearTimeout(pendingFocusTimeoutRef.current)
      pendingFocusTimeoutRef.current = null
    }

    if (
      shouldFocusReadoutOnStart &&
      previousStatusRef.current !== "running" &&
      status === "running"
    ) {
      pendingFocusTimeoutRef.current = setTimeout(() => {
        const reactTag = ReactNative.findNodeHandle(readoutRef.current)
        if (reactTag != null) {
          AccessibilityInfo.setAccessibilityFocus(reactTag)
        }
        pendingFocusTimeoutRef.current = null
      }, READOUT_FOCUS_DELAY_MS)
    }

    previousStatusRef.current = status

    return () => {
      if (pendingFocusTimeoutRef.current !== null) {
        clearTimeout(pendingFocusTimeoutRef.current)
        pendingFocusTimeoutRef.current = null
      }
    }
  }, [shouldFocusReadoutOnStart, status])

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View
        ref={readoutRef}
        testID="timer-readout"
        style={styles.timerContainer}
        accessible
        accessibilityRole="text"
        accessibilityLabel={spokenTimerLabel}
      >
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <TimerNumericText
            value={visibleTime}
            countsDown
            animate={usePlainTime ? false : animateDigits}
          />
        </View>
      </View>
      <Animated.View
        testID="timer-controls"
        accessibilityElementsHidden={!showControls}
        style={[
          styles.controls,
          {
            opacity: controlsOpacity,
            transform: [{ translateY: controlsTranslateY }],
          },
        ]}
        pointerEvents={showControls ? "auto" : "none"}
      >
        <IconPrimaryButton
          testID="timer-toggle-button"
          label={toggleLabel}
          symbolName={toggleSymbol}
          accessibilityHint={toggleHint}
          onPress={onToggle}
        />
        <DestructiveButton
          testID="timer-cancel-button"
          label={cancelLabel}
          accessibilityHint={cancelHint}
          disabled={!canCancel || !cancelAvailable}
          onPress={onCancel}
          style={!showCancel && styles.cancelHidden}
          pointerEvents={showCancel ? "auto" : "none"}
          accessibilityElementsHidden={!showCancel}
        />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
    gap: 20,
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  controls: {
    alignItems: "center",
    opacity: 1,
    gap: 16,
  },
  cancelHidden: {
    opacity: 0,
  },
}))
