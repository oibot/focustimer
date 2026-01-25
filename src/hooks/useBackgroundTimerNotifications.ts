import { useCallback, useEffect, useRef } from "react"
import { AppState } from "react-native"
import * as Notifications from "expo-notifications"

import type { TimerStatus } from "@/types/timer"

type UseBackgroundTimerNotificationsProps = {
  status: TimerStatus
  remainingMs: number
}

export default function useBackgroundTimerNotifications({
  status,
  remainingMs,
}: UseBackgroundTimerNotificationsProps) {
  const notificationIdRef = useRef<string | null>(null)
  const endAtRef = useRef<number | null>(null)
  const appStateRef = useRef(AppState.currentState)
  const statusRef = useRef<TimerStatus>(status)
  const prevStatusRef = useRef<TimerStatus | null>(null)

  const cancelScheduled = useCallback(async () => {
    const existingId = notificationIdRef.current
    if (!existingId) return
    notificationIdRef.current = null
    await Notifications.cancelScheduledNotificationAsync(existingId).catch(
      (error) => {
        if (__DEV__) {
          console.warn("Cancel notification failed", error)
        }
      },
    )
  }, [])

  const scheduleForEndAt = useCallback(
    async (endAt: number) => {
      await cancelScheduled()
      if (!Number.isFinite(endAt) || endAt <= Date.now()) return
      try {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: "Timer done",
            body: "Time to switch modes.",
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: new Date(endAt),
          },
        })
        notificationIdRef.current = id
      } catch (error) {
        notificationIdRef.current = null
        if (__DEV__) {
          console.warn("Schedule notification failed", error)
        }
      }
    },
    [cancelScheduled],
  )

  useEffect(() => {
    statusRef.current = status
  }, [status])

  useEffect(() => {
    if (status === "running" && prevStatusRef.current !== "running") {
      const endAt = Date.now() + remainingMs
      endAtRef.current = endAt
      if (appStateRef.current === "background") {
        void scheduleForEndAt(endAt)
      }
    }

    if (status !== "running" && prevStatusRef.current === "running") {
      endAtRef.current = null
      void cancelScheduled()
    }

    prevStatusRef.current = status
  }, [cancelScheduled, remainingMs, scheduleForEndAt, status])

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      appStateRef.current = nextState
      if (
        nextState === "background" &&
        statusRef.current === "running" &&
        endAtRef.current !== null
      ) {
        void scheduleForEndAt(endAtRef.current)
        return
      }
      if (nextState === "active") {
        void cancelScheduled()
        return
      }
    })

    return () => subscription.remove()
  }, [cancelScheduled, scheduleForEndAt])
}
