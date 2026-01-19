import type { ReactNode } from "react"
import { createContext, useContext, useState } from "react"

import useTimer from "@/hooks/useTimer"

type TimerStoreValue = ReturnType<typeof useTimer> & {
  startingMs: number
  setStartingMs: (startingMs: number) => void
}

const TimerStoreContext = createContext<TimerStoreValue | null>(null)

const DEFAULT_STARTING_MS = 4000

export function TimerStoreProvider({ children }: { children: ReactNode }) {
  const [startingMs, setStartingMs] = useState(DEFAULT_STARTING_MS)
  const timer = useTimer({ startingMs })

  return (
    <TimerStoreContext.Provider value={{ ...timer, startingMs, setStartingMs }}>
      {children}
    </TimerStoreContext.Provider>
  )
}

export default function useTimerStore() {
  const value = useContext(TimerStoreContext)
  if (!value) {
    throw new Error("useTimerStore must be used within TimerStoreProvider")
  }
  return value
}
