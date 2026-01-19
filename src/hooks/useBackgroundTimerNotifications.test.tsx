import { act, renderHook, waitFor } from "@testing-library/react-native"
import { AppState } from "react-native"
import * as Notifications from "expo-notifications"

import useBackgroundTimerNotifications from "@/hooks/useBackgroundTimerNotifications"
import type { TimerStatus } from "@/hooks/useTimer"

jest.mock("expo-notifications", () => ({
  cancelScheduledNotificationAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  SchedulableTriggerInputTypes: {
    DATE: "date",
  },
}))

let appStateHandler: ((state: string) => void) | null = null

describe("useBackgroundTimerNotifications", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-01-08T00:00:00Z"))
    appStateHandler = null
    ;(AppState as { currentState?: string }).currentState = "active"
    jest
      .spyOn(AppState, "addEventListener")
      .mockImplementation((_type, handler) => {
        appStateHandler = handler as (state: string) => void
        return { remove: jest.fn() }
      })
    ;(Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
      "notif-1",
    )
    ;(
      Notifications.cancelScheduledNotificationAsync as jest.Mock
    ).mockResolvedValue(undefined)
  })

  afterEach(() => {
    ;(AppState.addEventListener as jest.Mock).mockRestore()
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it("schedules when running and app goes background", async () => {
    renderHook(() =>
      useBackgroundTimerNotifications({
        status: "running",
        remainingMs: 1000,
      }),
    )

    await waitFor(() => {
      expect(appStateHandler).not.toBeNull()
    })

    act(() => appStateHandler?.("background"))

    await waitFor(() => {
      const call = (Notifications.scheduleNotificationAsync as jest.Mock).mock
        .calls[0]?.[0]
      expect(call).toBeTruthy()
      expect(call.content).toEqual({
        title: "Timer done",
        body: "Time to switch modes.",
        sound: true,
      })
      expect(call.trigger.type).toBe("date")
      expect(call.trigger.date.getTime()).toBe(
        new Date("2026-01-08T00:00:01Z").getTime(),
      )
    })
  })

  it("schedules immediately when already in background", async () => {
    ;(AppState as { currentState?: string }).currentState = "background"

    renderHook(() =>
      useBackgroundTimerNotifications({
        status: "running",
        remainingMs: 2000,
      }),
    )

    await waitFor(() => {
      const call = (Notifications.scheduleNotificationAsync as jest.Mock).mock
        .calls[0]?.[0]
      expect(call).toBeTruthy()
      expect(call.trigger.type).toBe("date")
      expect(call.trigger.date.getTime()).toBe(
        new Date("2026-01-08T00:00:02Z").getTime(),
      )
    })
  })

  it("cancels when app returns to active", async () => {
    ;(
      Notifications.scheduleNotificationAsync as jest.Mock
    ).mockResolvedValueOnce("notif-2")

    renderHook(() =>
      useBackgroundTimerNotifications({
        status: "running",
        remainingMs: 1500,
      }),
    )

    await waitFor(() => {
      expect(appStateHandler).not.toBeNull()
    })

    act(() => appStateHandler?.("background"))

    await waitFor(() => {
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled()
    })

    act(() => appStateHandler?.("active"))

    await waitFor(() => {
      expect(
        Notifications.cancelScheduledNotificationAsync,
      ).toHaveBeenCalledWith("notif-2")
    })
  })

  it("cancels when status stops running", async () => {
    ;(
      Notifications.scheduleNotificationAsync as jest.Mock
    ).mockResolvedValueOnce("notif-3")

    const { rerender } = renderHook(
      ({ status, remainingMs }: { status: TimerStatus; remainingMs: number }) =>
        useBackgroundTimerNotifications({ status, remainingMs }),
      {
        initialProps: { status: "running", remainingMs: 1500 },
      },
    )

    await waitFor(() => {
      expect(appStateHandler).not.toBeNull()
    })

    act(() => appStateHandler?.("background"))

    await waitFor(() => {
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled()
    })

    rerender({ status: "paused", remainingMs: 1500 })

    await waitFor(() => {
      expect(
        Notifications.cancelScheduledNotificationAsync,
      ).toHaveBeenCalledWith("notif-3")
    })
  })
})
