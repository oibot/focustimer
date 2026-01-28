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
import type { TimerStatus } from "@/types/timer"

type HarnessProps = {
  status: TimerStatus
  timerMode: "focus" | "short"
}

const Harness = ({ status, timerMode }: HarnessProps) => {
  const { showControls, tapGesture } = useTimerControls({ status, timerMode })

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
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("hides controls when focus timer starts running", async () => {
    const { queryByText } = render(
      <Harness status="running" timerMode="focus" />,
    )

    await waitFor(() => {
      expect(queryByText("controls")).toBeNull()
    })
  })

  it("shows controls on tap while running", async () => {
    const { queryByText } = render(
      <Harness status="running" timerMode="focus" />,
    )

    await waitFor(() => {
      expect(queryByText("controls")).toBeNull()
    })

    act(() => {
      fireTapGesture()
    })

    await waitFor(() => {
      expect(queryByText("controls")).toBeTruthy()
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
