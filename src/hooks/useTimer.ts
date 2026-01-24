import { useTimerStore } from "@/hooks/useTimerStore"

export function useTimer() {
  const {
    state: { startingMs, remainingMs, status },
    actions: { setStartingMs, toggleTimer, cancelTimer, finishTimer },
  } = useTimerStore()

  const canCancel = remainingMs !== startingMs

  return {
    remainingMs,
    status,
    cancelTimer,
    finishTimer,
    setStartingMs,
    toggleTimer,
    canCancel,
  }
}
