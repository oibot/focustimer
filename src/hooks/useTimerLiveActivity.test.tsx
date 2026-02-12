import { renderHook, waitFor } from "@testing-library/react-native"
import { Platform } from "react-native"
import type { TimerStatus } from "@/types/timer"
import useTimerLiveActivity from "@/hooks/useTimerLiveActivity"
import {
  areActivitiesEnabled,
  endActivity,
  startActivity,
  updateActivity,
  type LiveActivityStrings,
} from "local:live-activities-controller"

const setPlatformOS = (os: "ios" | "android") => {
  Object.defineProperty(Platform, "OS", { value: os, configurable: true })
}

const renderLiveActivityHook = (props: {
  status: TimerStatus
  remainingMs: number
  strings?: LiveActivityStrings
}) =>
  renderHook(
    ({ status, remainingMs, strings }: typeof props) =>
      useTimerLiveActivity({
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
  const endActivityMock = endActivity as jest.MockedFunction<typeof endActivity>

  beforeEach(() => {
    setPlatformOS("ios")
    jest.clearAllMocks()
    areActivitiesEnabledMock.mockReturnValue(true)
    startActivityMock.mockReturnValue("activity-1")
  })

  it("starts and updates when running begins", async () => {
    const { rerender } = renderLiveActivityHook({
      status: "idle",
      remainingMs: 5000,
    })

    rerender({ status: "running", remainingMs: 5000 })

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

    await waitFor(() => {
      expect(updateActivityMock).toHaveBeenCalledWith(5, true)
    })

    rerender({ status: "running", remainingMs: 4000 })

    await waitFor(() => {
      expect(updateActivityMock).toHaveBeenLastCalledWith(4, true)
    })
  })

  it("ends when running stops", async () => {
    const { rerender } = renderLiveActivityHook({
      status: "idle",
      remainingMs: 5000,
    })

    rerender({ status: "running", remainingMs: 5000 })

    await waitFor(() => {
      expect(startActivityMock).toHaveBeenCalled()
    })

    rerender({ status: "paused", remainingMs: 3000 })

    await waitFor(() => {
      expect(endActivityMock).toHaveBeenCalledWith(3, false)
    })
  })

  it("ends when unmounting with an active activity", async () => {
    const { rerender, unmount } = renderLiveActivityHook({
      status: "idle",
      remainingMs: 5000,
    })

    rerender({ status: "running", remainingMs: 5000 })

    await waitFor(() => {
      expect(startActivityMock).toHaveBeenCalled()
    })

    unmount()

    await waitFor(() => {
      expect(endActivityMock).toHaveBeenCalledWith(5, false)
    })
  })

  it("does not start when activities are disabled", async () => {
    areActivitiesEnabledMock.mockReturnValue(false)

    const { rerender } = renderLiveActivityHook({
      status: "idle",
      remainingMs: 5000,
    })

    rerender({ status: "running", remainingMs: 5000 })

    await waitFor(() => {
      expect(startActivityMock).not.toHaveBeenCalled()
    })

    rerender({ status: "paused", remainingMs: 4000 })

    await waitFor(() => {
      expect(endActivityMock).not.toHaveBeenCalled()
    })
    expect(updateActivityMock).not.toHaveBeenCalled()
  })

  it("does nothing on android", async () => {
    setPlatformOS("android")

    const { rerender } = renderLiveActivityHook({
      status: "idle",
      remainingMs: 5000,
    })

    rerender({ status: "running", remainingMs: 5000 })

    await waitFor(() => {
      expect(startActivityMock).not.toHaveBeenCalled()
      expect(updateActivityMock).not.toHaveBeenCalled()
      expect(endActivityMock).not.toHaveBeenCalled()
    })
  })
})
