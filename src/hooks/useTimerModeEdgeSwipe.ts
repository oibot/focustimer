import { Gesture } from "react-native-gesture-handler"

import type { TimerMode, TimerStatus } from "@/types/timer"

type UseTimerModeEdgeSwipeParams = {
  status: TimerStatus
  timerMode: TimerMode
  onModeChange: (nextMode: TimerMode) => void
}

export const TIMER_MODE_EDGE_SWIPE_GESTURE_ID = "timer-mode-edge-swipe"
const EDGE_SWIPE_ACTIVATION_OFFSET_X = 12
const EDGE_SWIPE_FAIL_OFFSET_Y = 28
const EDGE_SWIPE_TRIGGER_DISTANCE = 36

export default function useTimerModeEdgeSwipe({
  status,
  timerMode,
  onModeChange,
}: UseTimerModeEdgeSwipeParams) {
  const activeEdge =
    status === "idle" || status === "paused"
      ? timerMode === "focus"
        ? "right"
        : "left"
      : null

  const edgeSwipeGesture = Gesture.Pan()
    .withTestId(TIMER_MODE_EDGE_SWIPE_GESTURE_ID)
    .enabled(activeEdge !== null)
    .runOnJS(true)
    .minPointers(1)
    .maxPointers(1)
    .activeOffsetX([
      -EDGE_SWIPE_ACTIVATION_OFFSET_X,
      EDGE_SWIPE_ACTIVATION_OFFSET_X,
    ])
    .failOffsetY([-EDGE_SWIPE_FAIL_OFFSET_Y, EDGE_SWIPE_FAIL_OFFSET_Y])
    .onEnd(({ translationX, translationY }) => {
      if (activeEdge === null) return
      if (Math.abs(translationY) > EDGE_SWIPE_FAIL_OFFSET_Y) return

      if (
        activeEdge === "right" &&
        translationX <= -EDGE_SWIPE_TRIGGER_DISTANCE
      ) {
        onModeChange("short")
      }

      if (
        activeEdge === "left" &&
        translationX >= EDGE_SWIPE_TRIGGER_DISTANCE
      ) {
        onModeChange("focus")
      }
    })

  return { activeEdge, edgeSwipeGesture }
}
