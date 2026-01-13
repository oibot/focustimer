import { useEffect, useRef } from "react"

import useTimer from "@/hooks/useTimer"

type UseTimerSceneProps = {
  startingMs: number
  onDone: () => void
}

export default function useTimerScene({
  startingMs,
  onDone,
}: UseTimerSceneProps) {
  const { remainingMs, status, toggleTimer, cancelTimer } = useTimer({
    startingMs,
  })
  const hasShownDoneRef = useRef(false)

  useEffect(() => {
    if (status === "done" && !hasShownDoneRef.current) {
      hasShownDoneRef.current = true
      onDone()
      return
    }
    if (status !== "done") {
      hasShownDoneRef.current = false
    }
  }, [onDone, status])

  return { remainingMs, status, toggleTimer, cancelTimer }
}
