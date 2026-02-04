import { fireEvent, render } from "@testing-library/react-native"

import TimerScene from "@/components/home/TimerScene"
import { useTimer } from "@/hooks/useTimer"
import * as useTimerControlsModule from "@/hooks/useTimerControls"
import useBackgroundTimerNotifications from "@/hooks/useBackgroundTimerNotifications"
import { useKeepAwake } from "expo-keep-awake"
import { useAudioPlayer } from "expo-audio"
import { Gesture } from "react-native-gesture-handler"
import { Alert } from "react-native"

jest.mock("@/hooks/useTimer")
jest.mock("@/hooks/useBackgroundTimerNotifications")
jest.mock("@/components/home/TimerModePicker", () => {
  const React = require("react")
  const { View, Text, Pressable } = require("react-native")

  return function MockTimerModePicker({
    onModeChange,
    disabled,
    activeIndex,
  }: {
    onModeChange?: (index: number) => void
    disabled?: boolean
    activeIndex: number
  }) {
    return (
      <View>
        <Text testID="mode-picker-active">{activeIndex}</Text>
        <Text testID="mode-picker-disabled">
          {disabled ? "disabled" : "enabled"}
        </Text>
        <Pressable
          testID="mode-picker-focus"
          onPress={() => onModeChange?.(0)}
          disabled={disabled}
        >
          <Text>PickerFocus</Text>
        </Pressable>
        <Pressable
          testID="mode-picker-break"
          onPress={() => onModeChange?.(1)}
          disabled={disabled}
        >
          <Text>PickerBreak</Text>
        </Pressable>
      </View>
    )
  }
})

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
    jest.restoreAllMocks()
  })

  it("defaults to focus mode when mode is invalid", () => {
    const { getByLabelText } = render(
      <TimerScene mode="unknown" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(getByLabelText("Focus")).toBeTruthy()
  })

  it("uses the short mode labels without stop button while idle", () => {
    const { getByLabelText, queryByText } = render(
      <TimerScene mode="short" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(getByLabelText("Start")).toBeTruthy()
    expect(queryByText("Stop")).toBeNull()
  })

  it("shows the stop button when short mode is running", () => {
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "running",
    })

    const { getByLabelText, getByText } = render(
      <TimerScene mode="short" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(getByLabelText("Pause")).toBeTruthy()
    expect(getByText("Stop")).toBeTruthy()
  })

  it("hides controls while running in focus mode", () => {
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "running",
    })

    const { getByLabelText, getByText, getByTestId } = render(
      <TimerScene mode="focus" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(getByLabelText("Pause")).toBeTruthy()
    expect(getByText("Cancel")).toBeTruthy()
    const controls = getByTestId("timer-controls")
    expect(controls.props.pointerEvents).toBe("none")
  })

  it("keeps the screen awake while running", () => {
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "running",
    })

    render(
      <TimerScene mode="focus" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(mockUseKeepAwake).toHaveBeenCalled()
  })

  it("plays audio and notifies when done", () => {
    const cancelTimer = jest.fn()
    const onDone = jest.fn()

    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "done",
      cancelTimer,
    })

    render(<TimerScene mode="focus" onDone={onDone} onModeChange={jest.fn()} />)

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
    const useTimerControlsSpy = jest.spyOn(useTimerControlsModule, "default")
    useTimerControlsSpy.mockReturnValue({
      showControls: true,
      tapGesture: Gesture.Tap(),
    })
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {})

    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "running",
      cancelTimer,
    })

    const { getByText } = render(
      <TimerScene mode="focus" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    fireEvent.press(getByText("Cancel").parent!)

    expect(alertSpy).toHaveBeenCalledTimes(1)
    const buttons = alertSpy.mock.calls[0]?.[2]
    const confirm = Array.isArray(buttons)
      ? buttons.find((button) => button.style === "destructive")
      : undefined
    confirm?.onPress?.()

    expect(cancelTimer).toHaveBeenCalledTimes(1)
  })

  it("cancels and finishes the timer when stopping short mode", () => {
    const cancelTimer = jest.fn()
    const onDone = jest.fn()

    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "running",
      cancelTimer,
    })

    const { getByText } = render(
      <TimerScene mode="short" onDone={onDone} onModeChange={jest.fn()} />,
    )

    const player = mockUseAudioPlayer.mock.results[0].value as unknown as {
      play: jest.Mock
      seekTo: jest.Mock
    }

    fireEvent.press(getByText("Stop").parent!)

    expect(cancelTimer).toHaveBeenCalledTimes(1)
    expect(onDone).toHaveBeenCalledWith("focus")
    expect(player.seekTo).toHaveBeenCalledWith(0)
    expect(player.play).toHaveBeenCalledTimes(1)
  })

  it("wires background notifications", () => {
    const mockNotifications =
      useBackgroundTimerNotifications as jest.MockedFunction<
        typeof useBackgroundTimerNotifications
      >

    render(
      <TimerScene mode="focus" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(mockNotifications).toHaveBeenCalledWith({
      status: baseTimerState.status,
      remainingMs: baseTimerState.remainingMs,
    })
  })

  it("calls onModeChange with focus when selecting focus mode", () => {
    const onModeChange = jest.fn()

    const { getByTestId } = render(
      <TimerScene
        mode="short"
        onDone={jest.fn()}
        onModeChange={onModeChange}
      />,
    )

    fireEvent.press(getByTestId("mode-picker-focus"))

    expect(onModeChange).toHaveBeenCalledWith("focus")
  })

  it("calls onModeChange with short when selecting break mode", () => {
    const onModeChange = jest.fn()

    const { getByTestId } = render(
      <TimerScene
        mode="focus"
        onDone={jest.fn()}
        onModeChange={onModeChange}
      />,
    )

    fireEvent.press(getByTestId("mode-picker-break"))

    expect(onModeChange).toHaveBeenCalledWith("short")
  })

  it("does not call onModeChange when selecting the current mode", () => {
    const onModeChange = jest.fn()

    const { getByTestId } = render(
      <TimerScene
        mode="focus"
        onDone={jest.fn()}
        onModeChange={onModeChange}
      />,
    )

    fireEvent.press(getByTestId("mode-picker-focus"))

    expect(onModeChange).not.toHaveBeenCalled()
  })

  it("disables mode picker when timer is running", () => {
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "running",
    })

    const onModeChange = jest.fn()

    const { getByTestId } = render(
      <TimerScene
        mode="focus"
        onDone={jest.fn()}
        onModeChange={onModeChange}
      />,
    )

    expect(getByTestId("mode-picker-disabled").children[0]).toBe("disabled")

    fireEvent.press(getByTestId("mode-picker-break"))

    expect(onModeChange).not.toHaveBeenCalled()
  })

  it("enables mode picker when timer is idle", () => {
    const onModeChange = jest.fn()

    const { getByTestId } = render(
      <TimerScene
        mode="focus"
        onDone={jest.fn()}
        onModeChange={onModeChange}
      />,
    )

    expect(getByTestId("mode-picker-disabled").children[0]).toBe("enabled")
  })

  it("passes correct activeIndex to mode picker", () => {
    const { getByTestId: getByTestIdFocus } = render(
      <TimerScene mode="focus" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(getByTestIdFocus("mode-picker-active").children[0]).toBe("0")

    const { getByTestId: getByTestIdShort } = render(
      <TimerScene mode="short" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(getByTestIdShort("mode-picker-active").children[0]).toBe("1")
  })
})
