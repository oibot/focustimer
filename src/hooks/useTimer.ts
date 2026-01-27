import { TimerContext } from "@/components/providers/TimerProvider"
import { useContext } from "react"

export function useTimer() {
  const {
    state: { startingMs, remainingMs, status },
    actions: { setStartingMs, toggleTimer, cancelTimer },
  } = useContext(TimerContext)

  const canCancel = remainingMs !== startingMs

  return {
    remainingMs,
    status,
    cancelTimer,
    setStartingMs,
    toggleTimer,
    canCancel,
  }
}
