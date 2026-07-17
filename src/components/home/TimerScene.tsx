import { useLingui } from "@lingui/react/macro"
import * as Sentry from "@sentry/react-native"
import { useAudioPlayer } from "expo-audio"
import type { LiveActivityStrings } from "local:live-activities-controller"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Alert, AppState } from "react-native"

import TimerView from "@/components/home/TimerView"
import useBackgroundTimerNotifications from "@/hooks/useBackgroundTimerNotifications"
import useScreenDimming from "@/hooks/useScreenDimming"
import useScreenReaderEnabled from "@/hooks/useScreenReaderEnabled"
import { useTimer } from "@/hooks/useTimer"
import useTimerAccessibilityAnnouncements from "@/hooks/useTimerAccessibilityAnnouncements"
import useTimerControls from "@/hooks/useTimerControls"
import useTimerLiveActivity from "@/hooks/useTimerLiveActivity"
import useTimerModeEdgeSwipe from "@/hooks/useTimerModeEdgeSwipe"
import { completionSoundConfig } from "@/sounds"
import { useStore } from "@/state/store"
import { isTimerMode, TimerMode, type TimerModeConfig } from "@/types/timer"

type TimerSceneProps = {
  config: TimerModeConfig
  mode?: string
  onDone: (nextMode: string) => void
  onModeChange: (nextMode: string) => void
}

export default function TimerScene({
  config,
  mode,
  onDone,
  onModeChange,
}: TimerSceneProps) {
  const { t } = useLingui()
  const timerMode: TimerMode = isTimerMode(mode) ? mode : "focus"
  const completionSound = useStore((state) => state.completionSound)
  const dimmedBrightnessPercent = useStore(
    (state) => state.dimmedBrightnessPercent,
  )
  const keepScreenAwake = useStore((state) => state.keepScreenAwake)
  const liveActivitiesEnabled = useStore((state) => state.liveActivitiesEnabled)
  const screenDimmingEnabled = useStore((state) => state.screenDimmingEnabled)
  const selectedCompletionSound = completionSoundConfig[completionSound]
  const player = useAudioPlayer(selectedCompletionSound.audioSource)
  const { startingMs, nextMode } = config[timerMode]
  const cancelLabel = timerMode === "short" ? t`Stop` : t`Cancel`
  const focusLabel = t`Focus`
  const breakLabel = t`Break`
  const liveActivityStrings: LiveActivityStrings = {
    title: timerMode === "focus" ? focusLabel : breakLabel,
    statusRunning: t`Running`,
    statusPaused: t`Paused`,
    subtitleRunning: t`Stay focused`,
    subtitlePaused: t`Session paused`,
  }
  const {
    remainingMs,
    status,
    setStartingMs,
    toggleTimer,
    cancelTimer,
    canCancel,
  } = useTimer()

  const [isFocusCancelAlertVisible, setIsFocusCancelAlertVisible] =
    useState(false)

  const { resetDimming } = useScreenDimming({
    enabled: screenDimmingEnabled,
    dimmedBrightnessPercent,
    shouldDim: status === "running" && !isFocusCancelAlertVisible,
  })
  const { showControls, tapGesture } = useTimerControls({
    status,
    timerMode,
    onRunningTimerTap: resetDimming,
  })
  const isScreenReaderEnabled = useScreenReaderEnabled()
  const handleTimerModeChange = (nextMode: TimerMode) => {
    if (nextMode === timerMode) return
    onModeChange(nextMode)
  }
  const { activeEdge, edgeSwipeGesture } = useTimerModeEdgeSwipe({
    status,
    timerMode,
    onModeChange: handleTimerModeChange,
  })

  const hasShownDoneRef = useRef(false)

  useBackgroundTimerNotifications({ status, remainingMs })
  useTimerAccessibilityAnnouncements({
    enabled: isScreenReaderEnabled,
    remainingMs,
    status,
  })
  useTimerLiveActivity({
    enabled: liveActivitiesEnabled,
    strings: liveActivityStrings,
    status,
    remainingMs,
  })

  useLayoutEffect(() => {
    setStartingMs(startingMs)
  }, [setStartingMs, startingMs])

  useEffect(() => {
    if (status === "done" && !hasShownDoneRef.current) {
      hasShownDoneRef.current = true
      void (async () => {
        if (
          selectedCompletionSound.audioSource !== null &&
          AppState.currentState === "active"
        ) {
          try {
            await player.seekTo(0)
            if (AppState.currentState === "active") {
              player.play()
            }
          } catch (error) {
            Sentry.captureException(error)
          }
        }
        cancelTimer()
        onDone(nextMode)
      })()
      return
    }
    if (status !== "done") {
      hasShownDoneRef.current = false
    }
  }, [cancelTimer, nextMode, onDone, player, selectedCompletionSound, status])

  const handleCancel = () => {
    if (timerMode === "focus") {
      setIsFocusCancelAlertVisible(true)
      Alert.alert(
        t`End focus session`,
        t`Your current focus timer will reset.`,
        [
          {
            text: t`Keep going`,
            style: "cancel",
            onPress: () => {
              setIsFocusCancelAlertVisible(false)
            },
          },
          {
            text: t`End`,
            style: "destructive",
            onPress: () => {
              setIsFocusCancelAlertVisible(false)
              cancelTimer()
            },
          },
        ],
        {
          onDismiss: () => {
            setIsFocusCancelAlertVisible(false)
          },
        },
      )
      return
    }

    cancelTimer()
    onDone(nextMode)
  }

  return (
    <TimerView
      activeEdge={activeEdge}
      animateDigits={!isScreenReaderEnabled}
      breakLabel={breakLabel}
      canCancel={canCancel}
      cancelLabel={cancelLabel}
      edgeSwipeGesture={edgeSwipeGesture}
      focusLabel={focusLabel}
      isScreenReaderEnabled={isScreenReaderEnabled}
      keepScreenAwake={keepScreenAwake}
      onCancel={handleCancel}
      onToggle={toggleTimer}
      remainingMs={remainingMs}
      showControls={
        isScreenReaderEnabled || timerMode !== "focus" || showControls
      }
      status={status}
      tapGesture={tapGesture}
      timerMode={timerMode}
      usePlainTime={isScreenReaderEnabled}
    />
  )
}
