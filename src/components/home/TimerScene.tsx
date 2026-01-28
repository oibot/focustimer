import Timer from "@/components/home/Timer"
import useBackgroundTimerNotifications from "@/hooks/useBackgroundTimerNotifications"
import { useKeepAwake } from "expo-keep-awake"
import { View } from "react-native"
import { useAudioPlayer } from "expo-audio"
import { useEffect, useLayoutEffect, useRef } from "react"
import { useTimer } from "@/hooks/useTimer"
import { isTimerMode, TimerMode } from "@/types/timer"
import { GestureDetector } from "react-native-gesture-handler"
import useTimerControls from "@/hooks/useTimerControls"

const TIMER_MODES = {
  focus: {
    startingMs: 25 * 60 * 1000,
    idleLabel: "Focus",
    nextMode: "short",
  },
  short: {
    startingMs: 5 * 60 * 1000,
    idleLabel: "Start",
    nextMode: "focus",
  },
} as const

type TimerSceneProps = {
  mode?: string
  onDone: (nextMode: string) => void
}

function KeepAwakeWhileRunning() {
  useKeepAwake()
  return null
}

export default function TimerScene({ mode, onDone }: TimerSceneProps) {
  const player = useAudioPlayer(require("../../../assets/sounds/focus-end.mp3"))
  const timerMode: TimerMode = isTimerMode(mode) ? mode : "focus"
  const { startingMs, idleLabel, nextMode } = TIMER_MODES[timerMode]
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

  const hasShownDoneRef = useRef(false)

  useBackgroundTimerNotifications({ status, remainingMs })

  // TODO: should we sync the startingMs, or put this logic in the timer provider?
  useLayoutEffect(() => {
    setStartingMs(startingMs)
  }, [startingMs])

  const playDoneSound = () => {
    player.seekTo(0)
    player.play()
  }

  useEffect(() => {
    if (status === "done" && !hasShownDoneRef.current) {
      hasShownDoneRef.current = true
      playDoneSound()
      cancelTimer()
      onDone(nextMode)
      return
    }
    if (status !== "done") {
      hasShownDoneRef.current = false
    }
  }, [cancelTimer, nextMode, onDone, player, status])

  const handleCancel = () => {
    cancelTimer()
    if (timerMode === "short") {
      playDoneSound()
      onDone(nextMode)
    }
  }

  return (
    <GestureDetector gesture={tapGesture}>
      <View style={{ flex: 1 }}>
        {status === "running" ? <KeepAwakeWhileRunning /> : null}
        <Timer
          remainingMs={remainingMs}
          status={status}
          onToggle={toggleTimer}
          onCancel={handleCancel}
          idleLabel={idleLabel}
          cancelLabel={timerMode === "short" ? "Stop" : "Cancel"}
          canCancel={canCancel}
          showControls={timerMode !== "focus" || showControls}
        />
      </View>
    </GestureDetector>
  )
}
