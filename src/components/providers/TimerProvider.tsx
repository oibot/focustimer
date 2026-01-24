import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

export const TimerContext = createContext({ state: {}, actions: {} })

const INITIAL_STATE = { startingMs: 4000 }

export type TimerStatus = "idle" | "running" | "paused" | "done"

export default function TimerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [startingMs, setStartingMs] = useState(INITIAL_STATE.startingMs)
  const [isRunning, setIsRunning] = useState(false)
  const [remainingMs, setRemainingMs] = useState(startingMs)
  const endAtRef = useRef<number | null>(null)
  const status: TimerStatus = isRunning
    ? "running"
    : remainingMs === 0
      ? "done"
      : remainingMs === startingMs
        ? "idle"
        : "paused"

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
    if (isRunning) {
      setIsRunning(false)
      if (endAtRef.current !== null) {
        const next = Math.max(0, endAtRef.current - Date.now())
        setRemainingMs(next)
      }
      return
    }
    endAtRef.current = Date.now() + remainingMs
    setIsRunning(true)
  }, [isRunning, remainingMs])

  const cancelTimer = useCallback(() => {
    setIsRunning(false)
    setRemainingMs(startingMs)
    endAtRef.current = null
  }, [startingMs])

  const finishTimer = useCallback(() => {
    setIsRunning(false)
    setRemainingMs(0)
    endAtRef.current = null
  }, [])

  const actions = useMemo(
    () => ({
      toggleTimer,
      cancelTimer,
      finishTimer,
      setStartingMs: setStartingMsAndReset,
    }),
    [toggleTimer, cancelTimer, finishTimer, setStartingMsAndReset],
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
