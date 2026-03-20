import { useEffect, useRef } from "react"
import { AccessibilityInfo } from "react-native"

import useRemainingTimeLabel from "@/hooks/useRemainingTimeLabel"
import type { TimerStatus } from "@/types/timer"

type UseTimerAccessibilityAnnouncementsParams = {
  enabled: boolean
  remainingMs: number
  status: TimerStatus
}

const FIVE_MINUTES_IN_SECONDS = 5 * 60
const ONE_MINUTE_IN_SECONDS = 60

function isAnnouncementThreshold(totalSeconds: number) {
  if (totalSeconds <= 0) return false
  if (totalSeconds > FIVE_MINUTES_IN_SECONDS) {
    return totalSeconds % FIVE_MINUTES_IN_SECONDS === 0
  }
  return totalSeconds % ONE_MINUTE_IN_SECONDS === 0
}

function getCrossedAnnouncementSecond(
  previousSeconds: number,
  currentSeconds: number,
) {
  let matchedThreshold: number | null = null

  for (
    let threshold = ONE_MINUTE_IN_SECONDS;
    threshold <= previousSeconds;
    threshold += ONE_MINUTE_IN_SECONDS
  ) {
    if (!isAnnouncementThreshold(threshold)) continue
    if (currentSeconds <= threshold && threshold < previousSeconds) {
      matchedThreshold = threshold
    }
  }

  return matchedThreshold
}

export default function useTimerAccessibilityAnnouncements({
  enabled,
  remainingMs,
  status,
}: UseTimerAccessibilityAnnouncementsParams) {
  const formatRemainingTimeLabel = useRemainingTimeLabel()
  const previousStatusRef = useRef<TimerStatus>(status)
  const previousSecondsRef = useRef<number | null>(null)
  const lastAnnouncedSecondsRef = useRef<number | null>(null)

  useEffect(() => {
    const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000))
    const previousStatus = previousStatusRef.current
    const previousSeconds = previousSecondsRef.current

    if (!enabled) {
      previousStatusRef.current = status
      previousSecondsRef.current = status === "running" ? totalSeconds : null
      return
    }

    if (status !== "running") {
      previousStatusRef.current = status
      previousSecondsRef.current = null
      return
    }

    let secondsToAnnounce: number | null = null

    if (
      previousStatus === "running" &&
      previousSeconds !== null &&
      totalSeconds < previousSeconds
    ) {
      secondsToAnnounce = getCrossedAnnouncementSecond(
        previousSeconds,
        totalSeconds,
      )
    }

    if (
      secondsToAnnounce !== null &&
      secondsToAnnounce !== lastAnnouncedSecondsRef.current
    ) {
      const announcement = formatRemainingTimeLabel(secondsToAnnounce * 1000)
      AccessibilityInfo.announceForAccessibilityWithOptions(announcement, {
        queue: true,
      })

      lastAnnouncedSecondsRef.current = secondsToAnnounce
    }

    previousStatusRef.current = status
    previousSecondsRef.current = totalSeconds
  }, [enabled, formatRemainingTimeLabel, remainingMs, status])
}
