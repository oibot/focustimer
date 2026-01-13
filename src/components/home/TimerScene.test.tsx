import { act, render } from "@testing-library/react-native"

import TimerScene from "@/components/home/TimerScene"
import useTimerScene from "@/hooks/useTimerScene"

jest.mock("@/hooks/useTimerScene")

const mockUseTimerScene = useTimerScene as jest.MockedFunction<
  typeof useTimerScene
>

const baseHookState = {
  remainingMs: 1500,
  status: "idle" as const,
  toggleTimer: jest.fn(),
  cancelTimer: jest.fn(),
}

describe("TimerScene", () => {
  beforeEach(() => {
    mockUseTimerScene.mockImplementation(() => baseHookState)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders focus mode with the Focus label", () => {
    const { getByText } = render(<TimerScene mode="focus" onDone={jest.fn()} />)

    expect(getByText("Focus")).toBeTruthy()
  })

  it("renders short break mode with the Start label", () => {
    const { getByText } = render(<TimerScene mode="short" onDone={jest.fn()} />)

    expect(getByText("Start")).toBeTruthy()
  })

  it("falls back to focus when mode is unsupported", () => {
    const { getByText } = render(<TimerScene mode="long" onDone={jest.fn()} />)

    expect(getByText("Focus")).toBeTruthy()
  })

  it("passes the next mode to onDone", () => {
    let capturedOnDone: (() => void) | undefined
    mockUseTimerScene.mockImplementation(({ onDone }) => {
      capturedOnDone = onDone
      return baseHookState
    })

    const onDone = jest.fn()
    render(<TimerScene mode="focus" onDone={onDone} />)

    act(() => capturedOnDone?.())
    expect(onDone).toHaveBeenCalledWith("short")
  })
})
