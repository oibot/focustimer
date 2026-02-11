import type { TimerStatus } from "@/types/timer"
import { useEffect, useRef } from "react"
import { Platform } from "react-native"
import {
  areActivitiesEnabled,
  endActivity,
  startActivity,
  updateActivity,
} from "local:live-activities-controller"

type UseTimerLiveActivityParams = {
  title: string
  status: TimerStatus
  remainingMs: number
}

const toSeconds = (ms: number) => Math.max(0, Math.ceil(ms / 1000))

export default function useTimerLiveActivity({
  title,
  status,
  remainingMs,
}: UseTimerLiveActivityParams) {
  const prevStatusRef = useRef<TimerStatus>(status)
  const hasActivityRef = useRef(false)

  useEffect(() => {
    if (Platform.OS !== "ios") return
    const prevStatus = prevStatusRef.current
    prevStatusRef.current = status

    if (status === "running" && prevStatus !== "running") {
      if (!areActivitiesEnabled()) {
        hasActivityRef.current = false
        return
      }

      const activityId = startActivity(title, toSeconds(remainingMs))
      hasActivityRef.current = activityId != null
      return
    }

    if (prevStatus === "running" && status !== "running") {
      if (!hasActivityRef.current) return
      void endActivity(toSeconds(remainingMs), false)
      hasActivityRef.current = false
    }
  }, [remainingMs, status, title])

  useEffect(() => {
    if (Platform.OS !== "ios") return
    if (status !== "running" || !hasActivityRef.current) return
    void updateActivity(toSeconds(remainingMs), true)
  }, [remainingMs, status])
}
