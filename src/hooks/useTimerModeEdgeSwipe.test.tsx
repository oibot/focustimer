import { act, render } from "@testing-library/react-native"
import { Text, View } from "react-native"
import { GestureDetector, State } from "react-native-gesture-handler"
import {
  fireGestureHandler,
  getByGestureTestId,
} from "react-native-gesture-handler/jest-utils"

import useTimerModeEdgeSwipe, {
  TIMER_MODE_EDGE_SWIPE_GESTURE_ID,
} from "@/hooks/useTimerModeEdgeSwipe"
import type { TimerMode, TimerStatus } from "@/types/timer"

type HarnessProps = {
  status: TimerStatus
  timerMode: TimerMode
  onModeChange?: (nextMode: TimerMode) => void
}

const Harness = ({
  status,
  timerMode,
  onModeChange = () => {},
}: HarnessProps) => {
  const { activeEdge, edgeSwipeGesture } = useTimerModeEdgeSwipe({
    status,
    timerMode,
    onModeChange,
  })

  return (
    <GestureDetector gesture={edgeSwipeGesture}>
      <View>
        <Text>{activeEdge ?? "none"}</Text>
      </View>
    </GestureDetector>
  )
}

const fireEdgeSwipeGesture = ({
  translationX,
  translationY = 0,
}: {
  translationX: number
  translationY?: number
}) => {
  fireGestureHandler(getByGestureTestId(TIMER_MODE_EDGE_SWIPE_GESTURE_ID), [
    { state: State.BEGAN, translationX: 0, translationY: 0 },
    { state: State.ACTIVE, translationX, translationY },
    { state: State.END, translationX, translationY },
  ])
}

describe("useTimerModeEdgeSwipe", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("exposes the right edge in focus idle", () => {
    const { getByText } = render(<Harness status="idle" timerMode="focus" />)

    expect(getByText("right")).toBeTruthy()
  })

  it("exposes the right edge in focus paused", () => {
    const { getByText } = render(<Harness status="paused" timerMode="focus" />)

    expect(getByText("right")).toBeTruthy()
  })

  it("exposes the left edge in short idle", () => {
    const { getByText } = render(<Harness status="idle" timerMode="short" />)

    expect(getByText("left")).toBeTruthy()
  })

  it("exposes the left edge in short paused", () => {
    const { getByText } = render(<Harness status="paused" timerMode="short" />)

    expect(getByText("left")).toBeTruthy()
  })

  it("does not expose an edge while running", () => {
    const { getByText } = render(<Harness status="running" timerMode="focus" />)

    expect(getByText("none")).toBeTruthy()
  })

  it("does not expose an edge while done", () => {
    const { getByText } = render(<Harness status="done" timerMode="short" />)

    expect(getByText("none")).toBeTruthy()
  })

  it("switches from focus to short on a left swipe from the right edge", () => {
    const onModeChange = jest.fn()

    render(
      <Harness status="idle" timerMode="focus" onModeChange={onModeChange} />,
    )

    act(() => {
      fireEdgeSwipeGesture({ translationX: -60 })
    })

    expect(onModeChange).toHaveBeenCalledWith("short")
  })

  it("switches from short to focus on a right swipe from the left edge", () => {
    const onModeChange = jest.fn()

    render(
      <Harness status="idle" timerMode="short" onModeChange={onModeChange} />,
    )

    act(() => {
      fireEdgeSwipeGesture({ translationX: 60 })
    })

    expect(onModeChange).toHaveBeenCalledWith("focus")
  })

  it("ignores the wrong swipe direction", () => {
    const onModeChange = jest.fn()

    render(
      <Harness status="idle" timerMode="focus" onModeChange={onModeChange} />,
    )

    act(() => {
      fireEdgeSwipeGesture({ translationX: 60 })
    })

    expect(onModeChange).not.toHaveBeenCalled()
  })

  it("ignores swipes shorter than the trigger distance", () => {
    const onModeChange = jest.fn()

    render(
      <Harness status="idle" timerMode="short" onModeChange={onModeChange} />,
    )

    act(() => {
      fireEdgeSwipeGesture({ translationX: 30 })
    })

    expect(onModeChange).not.toHaveBeenCalled()
  })

  it("ignores large vertical movement", () => {
    const onModeChange = jest.fn()

    render(
      <Harness status="paused" timerMode="focus" onModeChange={onModeChange} />,
    )

    act(() => {
      fireEdgeSwipeGesture({ translationX: -60, translationY: 32 })
    })

    expect(onModeChange).not.toHaveBeenCalled()
  })
})
