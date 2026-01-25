import { fireEvent, render } from "@testing-library/react-native"

import TimerDoneScene from "@/components/home/TimerDoneScene"
import { useTimer } from "@/hooks/useTimer"

jest.mock("@/hooks/useTimer")

const mockUseTimer = useTimer as jest.MockedFunction<typeof useTimer>

describe("TimerDoneScene", () => {
  beforeEach(() => {
    mockUseTimer.mockReturnValue({
      remainingMs: 0,
      status: "done",
      cancelTimer: jest.fn(),
      finishTimer: jest.fn(),
      setStartingMs: jest.fn(),
      toggleTimer: jest.fn(),
      canCancel: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("shows focus label when next mode is focus", () => {
    const { getByText } = render(
      <TimerDoneScene
        nextMode="focus"
        onStart={jest.fn()}
        onCancel={jest.fn()}
      />,
    )

    expect(getByText("Start Focus")).toBeTruthy()
  })

  it("shows break label when next mode is short", () => {
    const { getByText } = render(
      <TimerDoneScene
        nextMode="short"
        onStart={jest.fn()}
        onCancel={jest.fn()}
      />,
    )

    expect(getByText("Start Break")).toBeTruthy()
  })

  it("calls onStart when the start button is pressed", () => {
    const onStart = jest.fn()
    const { getByText } = render(
      <TimerDoneScene
        nextMode="focus"
        onStart={onStart}
        onCancel={jest.fn()}
      />,
    )

    fireEvent.press(getByText("Start Focus").parent!)

    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it("cancels the timer and notifies parent", () => {
    const cancelTimer = jest.fn()
    const onCancel = jest.fn()

    mockUseTimer.mockReturnValue({
      remainingMs: 0,
      status: "done",
      cancelTimer,
      finishTimer: jest.fn(),
      setStartingMs: jest.fn(),
      toggleTimer: jest.fn(),
      canCancel: true,
    })

    const { getByText } = render(
      <TimerDoneScene
        nextMode="focus"
        onStart={jest.fn()}
        onCancel={onCancel}
      />,
    )

    fireEvent.press(getByText("Cancel").parent!)

    expect(cancelTimer).toHaveBeenCalledTimes(1)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
