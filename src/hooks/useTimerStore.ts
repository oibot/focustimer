import { TimerContext } from "@/components/providers/TimerProvider"
import { useContext } from "react"

export function useTimerStore() {
  return useContext(TimerContext)
}
