import { useEffect, useRef, useState } from "react"
import { Gesture } from "react-native-gesture-handler"

import type { TimerMode, TimerStatus } from "@/types/timer"

type UseTimerControlsParams = {
  status: TimerStatus
  timerMode: TimerMode
  autoHideDelay?: number
}

export const TIMER_CONTROLS_TAP_GESTURE_ID = "timer-controls-tap"
const DEFAULT_AUTO_HIDE_DELAY = 3000

export default function useTimerControls({
  status,
  timerMode,
  autoHideDelay = DEFAULT_AUTO_HIDE_DELAY,
}: UseTimerControlsParams) {
  const [showControls, setShowControls] = useState(true)
  const wasRunningRef = useRef(false)
  const autoHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearAutoHideTimeout = () => {
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current)
      autoHideTimeoutRef.current = null
    }
  }

  const scheduleAutoHide = () => {
    clearAutoHideTimeout()
    if (status === "running" && timerMode === "focus") {
      autoHideTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, autoHideDelay)
    }
  }

  const tapGesture = Gesture.Tap()
    .withTestId(TIMER_CONTROLS_TAP_GESTURE_ID)
    .runOnJS(true)
    .onStart(() => {
      if (timerMode !== "focus") return
      if (status !== "running") return
      setShowControls((prev) => !prev)
    })

  // Schedule auto-hide when controls become visible while running
  useEffect(() => {
    if (showControls && status === "running" && timerMode === "focus") {
      scheduleAutoHide()
    } else {
      clearAutoHideTimeout()
    }
  }, [showControls, status, timerMode, autoHideDelay])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => clearAutoHideTimeout()
  }, [])

  useEffect(() => {
    if (timerMode !== "focus") {
      setShowControls(true)
      wasRunningRef.current = status === "running"
      return
    }

    if (status === "running" && !wasRunningRef.current) {
      setShowControls(false)
    }
    if (status === "idle") {
      setShowControls(true)
    }
    if (status === "paused") {
      setShowControls(true)
    }
    wasRunningRef.current = status === "running"
  }, [status, timerMode])

  return { showControls, tapGesture }
}
