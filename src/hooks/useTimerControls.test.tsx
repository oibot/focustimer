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
}

const Harness = ({ status, timerMode, autoHideDelay }: HarnessProps) => {
  const { showControls, tapGesture } = useTimerControls({
    status,
    timerMode,
    autoHideDelay,
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
    const { queryByText } = render(
      <Harness status="running" timerMode="focus" />,
    )

    await waitFor(() => {
      expect(queryByText("controls")).toBeNull()
    })
  })

  it("toggles controls on tap while running", async () => {
    const { queryByText } = render(
      <Harness status="running" timerMode="focus" autoHideDelay={5000} />,
    )

    await waitFor(() => {
      expect(queryByText("controls")).toBeNull()
    })

    // First tap shows controls
    act(() => {
      fireTapGesture()
    })

    await waitFor(() => {
      expect(queryByText("controls")).toBeTruthy()
    })

    // Second tap hides controls
    act(() => {
      fireTapGesture()
    })

    await waitFor(() => {
      expect(queryByText("controls")).toBeNull()
    })

    // Third tap shows controls again
    act(() => {
      fireTapGesture()
    })

    await waitFor(() => {
      expect(queryByText("controls")).toBeTruthy()
    })
  })

  it("auto-hides controls after delay while running", async () => {
    const { queryByText } = render(
      <Harness status="running" timerMode="focus" autoHideDelay={1000} />,
    )

    await waitFor(() => {
      expect(queryByText("controls")).toBeNull()
    })

    // Tap to show controls
    act(() => {
      fireTapGesture()
    })

    await waitFor(() => {
      expect(queryByText("controls")).toBeTruthy()
    })

    // Advance time but not enough to trigger auto-hide
    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(queryByText("controls")).toBeTruthy()

    // Advance time to trigger auto-hide
    act(() => {
      jest.advanceTimersByTime(600)
    })

    await waitFor(() => {
      expect(queryByText("controls")).toBeNull()
    })
  })

  it("keeps controls visible in short mode", async () => {
    const { queryByText } = render(
      <Harness status="running" timerMode="short" />,
    )

    await waitFor(() => {
      expect(queryByText("controls")).toBeTruthy()
    })

    act(() => {
      fireTapGesture()
    })

    await waitFor(() => {
      expect(queryByText("controls")).toBeTruthy()
    })
  })

  it("shows controls when focus timer pauses", async () => {
    const { queryByText, rerender } = render(
      <Harness status="running" timerMode="focus" />,
    )

    await waitFor(() => {
      expect(queryByText("controls")).toBeNull()
    })

    rerender(<Harness status="paused" timerMode="focus" />)

    await waitFor(() => {
      expect(queryByText("controls")).toBeTruthy()
    })
  })
})
