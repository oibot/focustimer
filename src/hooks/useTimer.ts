import { useContext } from "react"

import { TimerContext } from "@/components/providers/TimerProvider"

export function useTimer() {
  const {
    state: { remainingMs, status },
    actions: { setStartingMs, toggleTimer, cancelTimer },
  } = useContext(TimerContext)

  const canCancel = status === "running" || status === "paused"

  return {
    remainingMs,
    status,
    cancelTimer,
    setStartingMs,
    toggleTimer,
    canCancel,
  }
}
