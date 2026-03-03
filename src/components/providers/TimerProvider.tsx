import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import type { TimerStatus } from "@/types/timer"

export type TimerState = {
  startingMs: number
  remainingMs: number
  isRunning: boolean
  status: TimerStatus
}

export type TimerActions = {
  toggleTimer: () => void
  cancelTimer: () => void
  setStartingMs: (ms: number) => void
}

export type TimerContextValue = {
  state: TimerState
  actions: TimerActions
}

const INITIAL_STATE = { startingMs: 4000 }

const DEFAULT_CONTEXT: TimerContextValue = {
  state: {
    startingMs: INITIAL_STATE.startingMs,
    remainingMs: INITIAL_STATE.startingMs,
    isRunning: false,
    status: "idle",
  },
  actions: {
    toggleTimer: () => {},
    cancelTimer: () => {},
    setStartingMs: () => {},
  },
}

export const TimerContext = createContext<TimerContextValue>(DEFAULT_CONTEXT)

export default function TimerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [startingMs, setStartingMs] = useState(INITIAL_STATE.startingMs)
  const [isRunning, setIsRunning] = useState(false)
  const [remainingMs, setRemainingMs] = useState(startingMs)
  const endAtRef = useRef<number | null>(null)
  const startingMsRef = useRef(startingMs)
  const remainingMsRef = useRef(remainingMs)
  const isRunningRef = useRef(isRunning)
  const status: TimerStatus = isRunning
    ? "running"
    : remainingMs === 0
      ? "done"
      : remainingMs === startingMs
        ? "idle"
        : "paused"

  startingMsRef.current = startingMs
  remainingMsRef.current = remainingMs
  isRunningRef.current = isRunning

  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(() => {
      if (endAtRef.current === null) return
      const next = Math.max(0, endAtRef.current - Date.now())
      setRemainingMs(next)
      if (next === 0) setIsRunning(false)
    }, 1000)
    return () => clearInterval(id)
  }, [isRunning])

  const setStartingMsAndReset = useCallback((ms: number) => {
    setIsRunning(false)
    setStartingMs(ms)
    setRemainingMs(ms)
    endAtRef.current = null
  }, [])

  const toggleTimer = useCallback(() => {
    if (isRunningRef.current) {
      setIsRunning(false)
      if (endAtRef.current !== null) {
        const next = Math.max(0, endAtRef.current - Date.now())
        setRemainingMs(next)
      }
      return
    }
    endAtRef.current = Date.now() + remainingMsRef.current
    setIsRunning(true)
  }, [])

  const cancelTimer = useCallback(() => {
    setIsRunning(false)
    setRemainingMs(startingMsRef.current)
    endAtRef.current = null
  }, [])

  const actions = useMemo(
    () => ({
      toggleTimer,
      cancelTimer,
      setStartingMs: setStartingMsAndReset,
    }),
    [toggleTimer, cancelTimer, setStartingMsAndReset],
  )

  const value = useMemo(
    () => ({
      state: { startingMs, remainingMs, isRunning, status },
      actions,
    }),
    [startingMs, remainingMs, isRunning, status, actions],
  )

  return <TimerContext value={value}>{children}</TimerContext>
}
