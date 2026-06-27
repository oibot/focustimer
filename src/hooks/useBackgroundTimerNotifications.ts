import * as Sentry from "@sentry/react-native"
import * as Notifications from "expo-notifications"
import { useCallback, useEffect, useRef } from "react"
import { AppState } from "react-native"

import type { TimerStatus } from "@/types/timer"

const BACKGROUND_TIMER_NOTIFICATION_KIND =
  "de.totap.focustimer.notification.background-timer-done"

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
  // Monotonically increasing token used to detect schedule/cancel races.
  // Expo notification calls are async, so a schedule can finish after a later
  // cancellation request. In that case the stale schedule must not keep a
  // notification alive.
  const notificationOperationRef = useRef(0)

  const cancelScheduled = useCallback(
    async ({ invalidate = true }: { invalidate?: boolean } = {}) => {
      // Normal cancellation invalidates any in-flight schedule operation.
      // Scheduling passes invalidate=false because it first clears old
      // notifications as part of the same operation.
      if (invalidate) notificationOperationRef.current += 1

      const existingId = notificationIdRef.current
      notificationIdRef.current = null

      const idsToCancel = new Set<string>()
      if (existingId) idsToCancel.add(existingId)

      await Notifications.getAllScheduledNotificationsAsync()
        .then((requests) => {
          requests.forEach((request) => {
            if (
              request.content.data?.kind === BACKGROUND_TIMER_NOTIFICATION_KIND
            ) {
              idsToCancel.add(request.identifier)
            }
          })
        })
        .catch((error) => {
          Sentry.captureException(error)
        })

      await Promise.all(
        Array.from(idsToCancel, async (id) => {
          Sentry.logger.info("Cancelling scheduled notification", { id })
          await Notifications.cancelScheduledNotificationAsync(id).catch(
            (error) => {
              Sentry.captureException(error)
            },
          )
        }),
      )
    },
    [],
  )

  const scheduleForEndAt = useCallback(
    async (endAt: number) => {
      const operation = notificationOperationRef.current + 1
      notificationOperationRef.current = operation

      await cancelScheduled({ invalidate: false })
      // If a cancellation happened while old notifications were being cleared,
      // this schedule request is stale and should not create a new notification.
      if (operation !== notificationOperationRef.current) return
      if (!Number.isFinite(endAt) || endAt <= Date.now()) return

      try {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: "Timer done",
            body: "Time to switch modes.",
            sound: true,
            data: { kind: BACKGROUND_TIMER_NOTIFICATION_KIND },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: new Date(endAt),
          },
        })

        if (operation !== notificationOperationRef.current) {
          // A cancellation happened while scheduleNotificationAsync was in
          // flight. Immediately cancel the newly created notification so it
          // cannot fire after the app has returned active or the timer stopped.
          await Notifications.cancelScheduledNotificationAsync(id).catch(
            (error) => {
              Sentry.captureException(error)
            },
          )
          return
        }

        notificationIdRef.current = id
        Sentry.logger.info("Scheduled notification", { endAt, id })
      } catch (error) {
        notificationIdRef.current = null
        Sentry.captureException(error)
      }
    },
    [cancelScheduled],
  )

  useEffect(() => {
    statusRef.current = status
  }, [status])

  useEffect(() => {
    if (AppState.currentState === "active") {
      void cancelScheduled()
    }
  }, [cancelScheduled])

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
