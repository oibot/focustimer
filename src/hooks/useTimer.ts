import { useEffect, useRef, useState } from "react"

export default function useTimer({ startingMs }: { startingMs: number }) {
  const [isRunning, setIsRunning] = useState(false)
  const [remainingMs, setRemainingMs] = useState(startingMs)
  const endAtRef = useRef<number | null>(null)

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
      if (endAtRef.current !== null) {
        const next = Math.max(0, endAtRef.current - Date.now())
        setRemainingMs(next)
      }
      setIsRunning(false)
      return
    }
    endAtRef.current = Date.now() + remainingMs
    setIsRunning(true)
  }

  return { isRunning, remainingMs, toggleTimer }
}
