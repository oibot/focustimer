import { act, render } from "@testing-library/react-native"

import TimerScene from "@/components/home/TimerScene"
import useTimerScene from "@/hooks/useTimerScene"
import { useAudioPlayer } from "expo-audio"
import { useKeepAwake } from "expo-keep-awake"

jest.mock("@/hooks/useTimerScene")
jest.mock("expo-audio", () => ({ useAudioPlayer: jest.fn() }))
jest.mock("expo-keep-awake", () => ({ useKeepAwake: jest.fn() }))
jest.mock("expo-notifications", () => ({
  cancelScheduledNotificationAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  SchedulableTriggerInputTypes: {
    DATE: "date",
  },
}))

const mockUseTimerScene = useTimerScene as jest.MockedFunction<
  typeof useTimerScene
>
const playMock = jest.fn()
const seekToMock = jest.fn()

const baseHookState = {
  remainingMs: 1500,
  status: "idle" as const,
  toggleTimer: jest.fn(),
  cancelTimer: jest.fn(),
}

describe("TimerScene", () => {
  beforeEach(() => {
    mockUseTimerScene.mockImplementation(() => baseHookState)
    playMock.mockClear()
    seekToMock.mockClear()
    ;(useAudioPlayer as jest.Mock).mockReturnValue({
      play: playMock,
      seekTo: seekToMock,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("keeps the screen awake while running", () => {
    mockUseTimerScene.mockImplementation(() => ({
      ...baseHookState,
      status: "running",
    }))

    render(<TimerScene mode="focus" onDone={jest.fn()} />)

    expect(useKeepAwake).toHaveBeenCalledTimes(1)
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
    expect(seekToMock).toHaveBeenCalledWith(0)
    expect(playMock).toHaveBeenCalledTimes(1)
  })
})
