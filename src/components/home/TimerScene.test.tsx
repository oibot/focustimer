import { fireEvent, render } from "@testing-library/react-native"

import TimerScene from "@/components/home/TimerScene"
import { useTimer } from "@/hooks/useTimer"
import useBackgroundTimerNotifications from "@/hooks/useBackgroundTimerNotifications"
import { useKeepAwake } from "expo-keep-awake"
import { useAudioPlayer } from "expo-audio"

jest.mock("@/hooks/useTimer")
jest.mock("@/hooks/useBackgroundTimerNotifications")

const mockUseTimer = useTimer as jest.MockedFunction<typeof useTimer>
const mockUseKeepAwake = useKeepAwake as jest.MockedFunction<
  typeof useKeepAwake
>
const mockUseAudioPlayer = useAudioPlayer as jest.MockedFunction<
  typeof useAudioPlayer
>

const baseTimerState = {
  remainingMs: 1500,
  status: "idle" as const,
  setStartingMs: jest.fn(),
  toggleTimer: jest.fn(),
  cancelTimer: jest.fn(),
  canCancel: true,
}

describe("TimerScene", () => {
  beforeEach(() => {
    mockUseTimer.mockReturnValue({ ...baseTimerState })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("defaults to focus mode when mode is invalid", () => {
    const { getByText } = render(
      <TimerScene mode="unknown" onDone={jest.fn()} />,
    )

    expect(getByText("Focus")).toBeTruthy()
  })

  it("uses the short mode labels and stop button", () => {
    const { getByText } = render(<TimerScene mode="short" onDone={jest.fn()} />)

    expect(getByText("Start")).toBeTruthy()
    expect(getByText("Stop")).toBeTruthy()
  })

  it("keeps the screen awake while running", () => {
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "running",
    })

    render(<TimerScene mode="focus" onDone={jest.fn()} />)

    expect(mockUseKeepAwake).toHaveBeenCalledTimes(1)
  })

  it("plays audio and notifies when done", () => {
    const cancelTimer = jest.fn()
    const onDone = jest.fn()

    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "done",
      cancelTimer,
    })

    render(<TimerScene mode="focus" onDone={onDone} />)

    const player = mockUseAudioPlayer.mock.results[0].value as unknown as {
      play: jest.Mock
      seekTo: jest.Mock
    }

    expect(player.seekTo).toHaveBeenCalledWith(0)
    expect(player.play).toHaveBeenCalledTimes(1)
    expect(cancelTimer).toHaveBeenCalledTimes(1)
    expect(onDone).toHaveBeenCalledWith("short")
  })

  it("cancels the timer when canceling focus", () => {
    const cancelTimer = jest.fn()

    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      cancelTimer,
    })

    const { getByText } = render(<TimerScene mode="focus" onDone={jest.fn()} />)

    fireEvent.press(getByText("Cancel").parent!)

    expect(cancelTimer).toHaveBeenCalledTimes(1)
  })

  it("wires background notifications", () => {
    const mockNotifications =
      useBackgroundTimerNotifications as jest.MockedFunction<
        typeof useBackgroundTimerNotifications
      >

    render(<TimerScene mode="focus" onDone={jest.fn()} />)

    expect(mockNotifications).toHaveBeenCalledWith({
      status: baseTimerState.status,
      remainingMs: baseTimerState.remainingMs,
    })
  })
})
