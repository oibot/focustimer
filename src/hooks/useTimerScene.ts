import { useEffect, useLayoutEffect, useRef } from "react"

import useTimerStore from "@/hooks/useTimerStore"

type UseTimerSceneProps = {
  startingMs: number
  onDone: () => void
}

export default function useTimerScene({
  startingMs,
  onDone,
}: UseTimerSceneProps) {
  const { remainingMs, status, toggleTimer, cancelTimer, setStartingMs } =
    useTimerStore()
  const hasShownDoneRef = useRef(false)

  useLayoutEffect(() => {
    setStartingMs(startingMs)
  }, [setStartingMs, startingMs])

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
