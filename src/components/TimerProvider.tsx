import useTimer from "@/hooks/useTimer"
import { createContext, useEffect, useRef, useState } from "react"

const TimerContext = createContext({ state: {}, actions: {} })

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
    setIsRunning(false)
    setRemainingMs(startingMs)
    endAtRef.current = null
  }, [startingMs])

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

  const toggleTimer = () => {
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
  }

  const cancelTimer = () => {
    setIsRunning(false)
    setRemainingMs(startingMs)
    endAtRef.current = null
  }

  const finishTimer = () => {
    setIsRunning(false)
    setRemainingMs(0)
    endAtRef.current = null
  }

  const value = {
    state: { startingMs, remainingMs, isRunning, status },
    actions: { toggleTimer, cancelTimer, finishTimer, setStartingMs },
  }

  return <TimerContext value={value}>{children}</TimerContext>
}
