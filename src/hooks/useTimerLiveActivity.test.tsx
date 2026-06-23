import { act, renderHook, waitFor } from "@testing-library/react-native"
import {
  areActivitiesEnabled,
  endActivity,
  type LiveActivityStrings,
  reconcileExpiredActivities,
  startActivity,
  updateActivity,
} from "local:live-activities-controller"
import { AppState, Platform } from "react-native"

import useTimerLiveActivity from "@/hooks/useTimerLiveActivity"
import type { TimerStatus } from "@/types/timer"

const setPlatformOS = (os: "ios" | "android") => {
  Object.defineProperty(Platform, "OS", { value: os, configurable: true })
}

let appStateHandler: ((state: string) => void) | null = null

const renderLiveActivityHook = (props: {
  enabled?: boolean
  status: TimerStatus
  remainingMs: number
  strings?: LiveActivityStrings
}) =>
  renderHook(
    ({ enabled, status, remainingMs, strings }: typeof props) =>
      useTimerLiveActivity({
        enabled: enabled ?? true,
        strings:
          strings ??
          ({
            title: "Focus",
            statusRunning: "Running",
            statusPaused: "Paused",
            subtitleRunning: "Stay focused",
            subtitlePaused: "Session paused",
          } satisfies LiveActivityStrings),
        status,
        remainingMs,
      }),
    { initialProps: props },
  )

describe("useTimerLiveActivity", () => {
  const areActivitiesEnabledMock = areActivitiesEnabled as jest.MockedFunction<
    typeof areActivitiesEnabled
  >
  const startActivityMock = startActivity as jest.MockedFunction<
    typeof startActivity
  >
  const updateActivityMock = updateActivity as jest.MockedFunction<
    typeof updateActivity
  >
  const reconcileExpiredActivitiesMock =
    reconcileExpiredActivities as jest.MockedFunction<
      typeof reconcileExpiredActivities
    >
  const endActivityMock = endActivity as jest.MockedFunction<typeof endActivity>

  beforeEach(() => {
    setPlatformOS("ios")
    jest.clearAllMocks()
    appStateHandler = null
    areActivitiesEnabledMock.mockReturnValue(true)
    startActivityMock.mockReturnValue("activity-1")
    jest
      .spyOn(AppState, "addEventListener")
      .mockImplementation((_type, handler) => {
        appStateHandler = handler as (state: string) => void
        return { remove: jest.fn() }
      })
  })

  afterEach(() => {
    ;(AppState.addEventListener as jest.Mock).mockRestore()
  })

  it("reconciles expired activities on mount", async () => {
    await renderLiveActivityHook({
      status: "idle",
      remainingMs: 5000,
    })

    await waitFor(() => {
      expect(reconcileExpiredActivitiesMock).toHaveBeenCalledTimes(1)
    })
  })

  it("reconciles expired activities when the app becomes active", async () => {
    await renderLiveActivityHook({
      status: "idle",
      remainingMs: 5000,
    })

    await waitFor(() => {
      expect(appStateHandler).not.toBeNull()
    })

    await act(() => appStateHandler?.("background"))
    await act(() => appStateHandler?.("active"))

    await waitFor(() => {
      expect(reconcileExpiredActivitiesMock).toHaveBeenCalledTimes(2)
    })
  })

  it("starts when running begins", async () => {
    const { rerender } = await renderLiveActivityHook({
      status: "idle",
      remainingMs: 5000,
    })

    await rerender({ status: "running", remainingMs: 5000 })

    await waitFor(() => {
      expect(startActivityMock).toHaveBeenCalledWith(
        {
          title: "Focus",
          statusRunning: "Running",
          statusPaused: "Paused",
          subtitleRunning: "Stay focused",
          subtitlePaused: "Session paused",
        },
        5,
      )
    })

    await rerender({ status: "running", remainingMs: 4000 })

    await waitFor(() => {
      expect(updateActivityMock).not.toHaveBeenCalled()
    })
  })

  it("updates when remaining time increases while running", async () => {
    const { rerender } = await renderLiveActivityHook({
      status: "idle",
      remainingMs: 5000,
    })

    await rerender({ status: "running", remainingMs: 5000 })

    await waitFor(() => {
      expect(startActivityMock).toHaveBeenCalled()
    })

    await rerender({ status: "running", remainingMs: 8000 })

    await waitFor(() => {
      expect(updateActivityMock).toHaveBeenCalledWith(8, true)
    })
  })

  it("ends when running stops", async () => {
    const { rerender } = await renderLiveActivityHook({
      status: "idle",
      remainingMs: 5000,
    })

    await rerender({ status: "running", remainingMs: 5000 })

    await waitFor(() => {
      expect(startActivityMock).toHaveBeenCalled()
    })

    await rerender({ status: "paused", remainingMs: 3000 })

    await waitFor(() => {
      expect(endActivityMock).toHaveBeenCalledWith(3, false)
    })
  })

  it("ends when unmounting with an active activity", async () => {
    const { rerender, unmount } = await renderLiveActivityHook({
      status: "idle",
      remainingMs: 5000,
    })

    await rerender({ status: "running", remainingMs: 5000 })

    await waitFor(() => {
      expect(startActivityMock).toHaveBeenCalled()
    })

    await unmount()

    await waitFor(() => {
      expect(endActivityMock).toHaveBeenCalledWith(5, false)
    })
  })

  it("does not start when activities are disabled", async () => {
    areActivitiesEnabledMock.mockReturnValue(false)

    const { rerender } = await renderLiveActivityHook({
      status: "idle",
      remainingMs: 5000,
    })

    await rerender({ status: "running", remainingMs: 5000 })

    await waitFor(() => {
      expect(startActivityMock).not.toHaveBeenCalled()
    })

    await rerender({ status: "paused", remainingMs: 4000 })

    await waitFor(() => {
      expect(endActivityMock).not.toHaveBeenCalled()
    })
    expect(updateActivityMock).not.toHaveBeenCalled()
  })

  it("ends an active activity when the setting is disabled while still running", async () => {
    const { rerender } = await renderLiveActivityHook({
      enabled: true,
      status: "idle",
      remainingMs: 5000,
    })

    await rerender({ enabled: true, status: "running", remainingMs: 5000 })

    await waitFor(() => {
      expect(startActivityMock).toHaveBeenCalled()
    })

    expect(endActivityMock).not.toHaveBeenCalled()

    await rerender({ enabled: false, status: "running", remainingMs: 4000 })

    await waitFor(() => {
      expect(endActivityMock).toHaveBeenCalledWith(4, false)
    })

    expect(updateActivityMock).not.toHaveBeenCalled()
  })

  it("does nothing on android", async () => {
    setPlatformOS("android")

    const { rerender } = await renderLiveActivityHook({
      enabled: true,
      status: "idle",
      remainingMs: 5000,
    })

    await rerender({ enabled: true, status: "running", remainingMs: 5000 })

    await waitFor(() => {
      expect(startActivityMock).not.toHaveBeenCalled()
      expect(reconcileExpiredActivitiesMock).not.toHaveBeenCalled()
      expect(updateActivityMock).not.toHaveBeenCalled()
      expect(endActivityMock).not.toHaveBeenCalled()
    })
  })
})
