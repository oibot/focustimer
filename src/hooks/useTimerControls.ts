import { useEffect, useMemo, useRef, useState } from "react"
import { Gesture } from "react-native-gesture-handler"

import type { TimerStatus } from "@/types/timer"

type UseTimerControlsParams = {
  status: TimerStatus
  timerMode: "focus" | "short"
}

export default function useTimerControls({
  status,
  timerMode,
}: UseTimerControlsParams) {
  const [showControls, setShowControls] = useState(true)
  const wasRunningRef = useRef(false)

  const tapGesture = useMemo(
    () =>
      Gesture.Tap()
        .runOnJS(true)
        .onStart(() => {
          if (timerMode !== "focus") return
          setShowControls(true)
        }),
    [timerMode],
  )

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
