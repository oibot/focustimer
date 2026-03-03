import {
  areActivitiesEnabled,
  endActivity,
  type LiveActivityStrings,
  startActivity,
  updateActivity,
} from "local:live-activities-controller"
import { useEffect, useRef } from "react"
import { Platform } from "react-native"

import type { TimerStatus } from "@/types/timer"

type UseTimerLiveActivityParams = {
  strings: LiveActivityStrings
  status: TimerStatus
  remainingMs: number
}

const toSeconds = (ms: number) => Math.max(0, Math.ceil(ms / 1000))

export default function useTimerLiveActivity({
  strings,
  status,
  remainingMs,
}: UseTimerLiveActivityParams) {
  const prevStatusRef = useRef<TimerStatus>(status)
  const hasActivityRef = useRef(false)
  const remainingMsRef = useRef(remainingMs)
  const prevRemainingMsRef = useRef(remainingMs)

  remainingMsRef.current = remainingMs

  useEffect(() => {
    if (Platform.OS !== "ios") return
    const prevStatus = prevStatusRef.current
    const prevRemainingMs = prevRemainingMsRef.current
    prevStatusRef.current = status
    prevRemainingMsRef.current = remainingMs

    if (status === "running" && prevStatus !== "running") {
      if (!areActivitiesEnabled()) {
        hasActivityRef.current = false
        return
      }

      const activityId = startActivity(strings, toSeconds(remainingMs))
      hasActivityRef.current = activityId != null
      return
    }

    if (prevStatus === "running" && status !== "running") {
      if (!hasActivityRef.current) return
      void endActivity(toSeconds(remainingMs), false)
      hasActivityRef.current = false
      return
    }

    if (
      status === "running" &&
      hasActivityRef.current &&
      remainingMs > prevRemainingMs
    ) {
      void updateActivity(toSeconds(remainingMs), true)
    }
  }, [remainingMs, status, strings])

  useEffect(() => {
    if (Platform.OS !== "ios") return
    return () => {
      if (!hasActivityRef.current) return
      void endActivity(toSeconds(remainingMsRef.current), false)
      hasActivityRef.current = false
    }
  }, [])
}
