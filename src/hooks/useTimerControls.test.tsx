import { act, render, waitFor } from "@testing-library/react-native"
import { Text, View } from "react-native"
import { GestureDetector, State } from "react-native-gesture-handler"
import {
  fireGestureHandler,
  getByGestureTestId,
} from "react-native-gesture-handler/jest-utils"

import useTimerControls, {
  TIMER_CONTROLS_TAP_GESTURE_ID,
} from "@/hooks/useTimerControls"
import type { TimerMode, TimerStatus } from "@/types/timer"

type HarnessProps = {
  status: TimerStatus
  timerMode: TimerMode
  autoHideDelay?: number
  onRunningTimerTap?: () => void
}

const Harness = ({
  status,
  timerMode,
  autoHideDelay,
  onRunningTimerTap,
}: HarnessProps) => {
  const { showControls, tapGesture } = useTimerControls({
    status,
    timerMode,
    autoHideDelay,
    onRunningTimerTap,
  })

  return (
    <GestureDetector gesture={tapGesture}>
      <View>{showControls ? <Text>controls</Text> : null}</View>
    </GestureDetector>
  )
}

const fireTapGesture = () => {
  fireGestureHandler(getByGestureTestId(TIMER_CONTROLS_TAP_GESTURE_ID), [
    { state: State.BEGAN },
    { state: State.END },
  ])
}

describe("useTimerControls", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it("hides controls when focus timer starts running", async () => {
    const { queryByText } = await render(
      <Harness status="running" timerMode="focus" />,
    )

    await waitFor(() => {
      expect(queryByText("controls")).toBeNull()
    })
  })

  it("toggles controls on tap while running", async () => {
    const { queryByText } = await render(
      <Harness status="running" timerMode="focus" autoHideDelay={5000} />,
    )

    await waitFor(() => {
      expect(queryByText("controls")).toBeNull()
    })

    // First tap shows controls
    await act(() => {
      fireTapGesture()
    })

    await waitFor(() => {
      expect(queryByText("controls")).toBeTruthy()
    })

    // Second tap hides controls
    await act(() => {
      fireTapGesture()
    })

    await waitFor(() => {
      expect(queryByText("controls")).toBeNull()
    })

    // Third tap shows controls again
    await act(() => {
      fireTapGesture()
    })

    await waitFor(() => {
      expect(queryByText("controls")).toBeTruthy()
    })
  })

  it("auto-hides controls after delay while running", async () => {
    const { queryByText } = await render(
      <Harness status="running" timerMode="focus" autoHideDelay={1000} />,
    )

    await waitFor(() => {
      expect(queryByText("controls")).toBeNull()
    })

    // Tap to show controls
    await act(() => {
      fireTapGesture()
    })

    await waitFor(() => {
      expect(queryByText("controls")).toBeTruthy()
    })

    // Advance time but not enough to trigger auto-hide
    await act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(queryByText("controls")).toBeTruthy()

    // Advance time to trigger auto-hide
    await act(() => {
      jest.advanceTimersByTime(600)
    })

    await waitFor(() => {
      expect(queryByText("controls")).toBeNull()
    })
  })

  it("keeps controls visible in short mode", async () => {
    const { queryByText } = await render(
      <Harness status="running" timerMode="short" />,
    )

    await waitFor(() => {
      expect(queryByText("controls")).toBeTruthy()
    })

    await act(() => {
      fireTapGesture()
    })

    await waitFor(() => {
      expect(queryByText("controls")).toBeTruthy()
    })
  })

  it("calls the running timer tap callback while running", async () => {
    const onRunningTimerTap = jest.fn()
    await render(
      <Harness
        status="running"
        timerMode="short"
        onRunningTimerTap={onRunningTimerTap}
      />,
    )

    await act(() => {
      fireTapGesture()
    })

    expect(onRunningTimerTap).toHaveBeenCalledTimes(1)
  })

  it("shows controls when focus timer pauses", async () => {
    const { queryByText, rerender } = await render(
      <Harness status="running" timerMode="focus" />,
    )

    await waitFor(() => {
      expect(queryByText("controls")).toBeNull()
    })

    await rerender(<Harness status="paused" timerMode="focus" />)

    await waitFor(() => {
      expect(queryByText("controls")).toBeTruthy()
    })
  })
})
