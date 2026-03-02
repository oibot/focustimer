import Timer from "@/components/home/Timer"
import TimerModePicker from "@/components/home/TimerModePicker"
import useBackgroundTimerNotifications from "@/hooks/useBackgroundTimerNotifications"
import useTimerModeEdgeSwipe from "@/hooks/useTimerModeEdgeSwipe"
import useTimerLiveActivity from "@/hooks/useTimerLiveActivity"
import { useLingui } from "@lingui/react/macro"
import { useKeepAwake } from "expo-keep-awake"
import { Alert, View } from "react-native"
import { useAudioPlayer } from "expo-audio"
import { useEffect, useLayoutEffect, useRef } from "react"
import { useTimer } from "@/hooks/useTimer"
import { isTimerMode, TimerMode } from "@/types/timer"
import { GestureDetector } from "react-native-gesture-handler"
import useTimerControls from "@/hooks/useTimerControls"
import useScreenReaderEnabled from "@/hooks/useScreenReaderEnabled"
import { StyleSheet } from "react-native-unistyles"
import type { LiveActivityStrings } from "local:live-activities-controller"

const TIMER_MODES = {
  focus: {
    startingMs: 25 * 60 * 1000,
    nextMode: "short",
  },
  short: {
    startingMs: 5 * 60 * 1000,
    nextMode: "focus",
  },
} as const

type TimerSceneProps = {
  mode?: string
  onDone: (nextMode: string) => void
  onModeChange: (nextMode: string) => void
}

function KeepAwakeWhileRunning() {
  useKeepAwake()
  return null
}

export default function TimerScene({
  mode,
  onDone,
  onModeChange,
}: TimerSceneProps) {
  const { t } = useLingui()
  const player = useAudioPlayer(require("../../../assets/sounds/focus-end.mp3"))
  const timerMode: TimerMode = isTimerMode(mode) ? mode : "focus"
  const { startingMs, nextMode } = TIMER_MODES[timerMode]
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
  const activeIndex = timerMode === "focus" ? 0 : 1
  const {
    remainingMs,
    status,
    setStartingMs,
    toggleTimer,
    cancelTimer,
    canCancel,
  } = useTimer()

  const { showControls, tapGesture } = useTimerControls({
    status,
    timerMode,
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

  const handleModeChange = (index: number) => {
    handleTimerModeChange(index === 0 ? "focus" : "short")
  }

  const hasShownDoneRef = useRef(false)

  useBackgroundTimerNotifications({ status, remainingMs })
  useTimerLiveActivity({
    strings: liveActivityStrings,
    status,
    remainingMs,
  })

  // TODO: should we sync the startingMs, or put this logic in the timer provider?
  useLayoutEffect(() => {
    setStartingMs(startingMs)
  }, [setStartingMs, startingMs])

  useEffect(() => {
    if (status === "done" && !hasShownDoneRef.current) {
      hasShownDoneRef.current = true
      if (timerMode === "focus") {
        player.seekTo(0)
        player.play()
      }
      cancelTimer()
      onDone(nextMode)
      return
    }
    if (status !== "done") {
      hasShownDoneRef.current = false
    }
  }, [cancelTimer, nextMode, onDone, player, status, timerMode])

  const handleCancel = () => {
    if (timerMode === "focus") {
      Alert.alert(
        t`Cancel focus session?`,
        t`Your current focus timer will reset.`,
        [
          { text: t`Keep going`, style: "cancel" },
          { text: cancelLabel, style: "destructive", onPress: cancelTimer },
        ],
      )
      return
    }

    cancelTimer()
    onDone(nextMode)
  }
  const showsTapGesture = status === "running" && timerMode === "focus"

  return (
    <View style={styles.container}>
      {showsTapGesture ? (
        <GestureDetector gesture={tapGesture}>
          <View
            testID="timer-tap-gesture-background"
            style={styles.background}
          />
        </GestureDetector>
      ) : null}
      {activeEdge ? (
        <GestureDetector gesture={edgeSwipeGesture}>
          <View
            testID={
              activeEdge === "left"
                ? "timer-edge-swipe-left"
                : "timer-edge-swipe-right"
            }
            style={[
              styles.edgeSwipeZone,
              activeEdge === "left"
                ? styles.edgeSwipeZoneLeft
                : styles.edgeSwipeZoneRight,
            ]}
            accessible={false}
          />
        </GestureDetector>
      ) : null}

      {status === "running" ? <KeepAwakeWhileRunning /> : null}

      <View style={styles.pickerContainer}>
        <TimerModePicker
          options={[focusLabel, breakLabel]}
          activeIndex={activeIndex}
          disabled={status === "running"}
          disableInactiveOptions={status === "paused"}
          onModeChange={handleModeChange}
        />
      </View>

      <View style={styles.timerContainer} pointerEvents="box-none">
        <Timer
          remainingMs={remainingMs}
          status={status}
          timerMode={timerMode}
          onToggle={toggleTimer}
          onCancel={handleCancel}
          cancelLabel={cancelLabel}
          canCancel={canCancel}
          showControls={
            isScreenReaderEnabled || timerMode !== "focus" || showControls
          }
          showDisabledCancel={isScreenReaderEnabled}
          animateDigits={!isScreenReaderEnabled}
          usePlainTime={isScreenReaderEnabled}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  background: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  edgeSwipeZone: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 64,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  edgeSwipeZoneLeft: {
    left: 0,
  },
  edgeSwipeZoneRight: {
    right: 0,
  },
  pickerContainer: {
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  timerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
}))
