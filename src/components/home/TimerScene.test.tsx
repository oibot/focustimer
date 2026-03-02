import { fireEvent, render } from "@testing-library/react-native"

import TimerScene from "@/components/home/TimerScene"
import { useTimer } from "@/hooks/useTimer"
import { TIMER_MODE_EDGE_SWIPE_GESTURE_ID } from "@/hooks/useTimerModeEdgeSwipe"
import * as useTimerControlsModule from "@/hooks/useTimerControls"
import useBackgroundTimerNotifications from "@/hooks/useBackgroundTimerNotifications"
import useScreenReaderEnabled from "@/hooks/useScreenReaderEnabled"
import { i18n } from "@lingui/core"
import { I18nProvider } from "@lingui/react"
import { useKeepAwake } from "expo-keep-awake"
import { useAudioPlayer } from "expo-audio"
import { Gesture, State } from "react-native-gesture-handler"
import { Alert } from "react-native"
import {
  fireGestureHandler,
  getByGestureTestId,
} from "react-native-gesture-handler/jest-utils"
import { messages as enMessages } from "@/locales/en/messages"
import type { ReactElement } from "react"

jest.mock("@/hooks/useTimer")
jest.mock("@/hooks/useBackgroundTimerNotifications")
jest.mock("@/hooks/useScreenReaderEnabled")
jest.mock("@/components/home/TimerModePicker", () => {
  const React = require("react")
  const { View, Text, Pressable } = require("react-native")

  return function MockTimerModePicker({
    onModeChange,
    disabled,
    activeIndex,
    disableInactiveOptions,
  }: {
    onModeChange?: (index: number) => void
    disabled?: boolean
    activeIndex: number
    disableInactiveOptions?: boolean
  }) {
    const focusDisabled =
      !!disabled || (!!disableInactiveOptions && activeIndex !== 0)
    const breakDisabled =
      !!disabled || (!!disableInactiveOptions && activeIndex !== 1)

    return (
      <View>
        <Text testID="mode-picker-active">{activeIndex}</Text>
        <Text testID="mode-picker-disabled">
          {disabled ? "disabled" : "enabled"}
        </Text>
        <Text testID="mode-picker-disable-inactive">
          {disableInactiveOptions ? "locked" : "unlocked"}
        </Text>
        <Pressable
          testID="mode-picker-focus"
          onPress={() => onModeChange?.(0)}
          disabled={focusDisabled}
        >
          <Text>PickerFocus</Text>
        </Pressable>
        <Pressable
          testID="mode-picker-break"
          onPress={() => onModeChange?.(1)}
          disabled={breakDisabled}
        >
          <Text>PickerBreak</Text>
        </Pressable>
      </View>
    )
  }
})

const mockUseTimer = useTimer as jest.MockedFunction<typeof useTimer>
const mockUseScreenReaderEnabled =
  useScreenReaderEnabled as jest.MockedFunction<typeof useScreenReaderEnabled>
const mockUseKeepAwake = useKeepAwake as jest.MockedFunction<
  typeof useKeepAwake
>
const mockUseAudioPlayer = useAudioPlayer as jest.MockedFunction<
  typeof useAudioPlayer
>

const renderWithI18n = (ui: ReactElement) =>
  render(<I18nProvider i18n={i18n}>{ui}</I18nProvider>)

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

const baseTimerState = {
  remainingMs: 1500,
  status: "idle" as const,
  setStartingMs: jest.fn(),
  toggleTimer: jest.fn(),
  cancelTimer: jest.fn(),
  canCancel: true,
}

describe("TimerScene", () => {
  beforeAll(() => {
    i18n.load({ en: enMessages })
    i18n.activate("en")
  })

  beforeEach(() => {
    mockUseTimer.mockReturnValue({ ...baseTimerState })
    mockUseScreenReaderEnabled.mockReturnValue(false)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it("defaults to focus mode when mode is invalid", () => {
    const { getByLabelText } = renderWithI18n(
      <TimerScene mode="unknown" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(getByLabelText("Start")).toBeTruthy()
  })

  it("uses the short mode labels without stop button while idle", () => {
    const { getByLabelText, getByTestId, queryByText, queryByTestId } =
      renderWithI18n(
        <TimerScene mode="short" onDone={jest.fn()} onModeChange={jest.fn()} />,
      )

    expect(getByLabelText("Start")).toBeTruthy()
    expect(getByTestId("timer-edge-swipe-left")).toBeTruthy()
    expect(queryByTestId("timer-edge-swipe-right")).toBeNull()
    expect(queryByText("Stop")).toBeNull()
  })

  it("renders the right edge swipe zone in focus idle", () => {
    const { getByTestId, queryByTestId } = renderWithI18n(
      <TimerScene mode="focus" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(getByTestId("timer-edge-swipe-right")).toBeTruthy()
    expect(queryByTestId("timer-edge-swipe-left")).toBeNull()
  })

  it("shows the stop button when short mode is running", () => {
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "running",
    })

    const { getByLabelText, getByText, queryByTestId } = renderWithI18n(
      <TimerScene mode="short" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(getByLabelText("Pause")).toBeTruthy()
    expect(getByText("Stop")).toBeTruthy()
    expect(queryByTestId("timer-edge-swipe-left")).toBeNull()
    expect(queryByTestId("timer-edge-swipe-right")).toBeNull()
  })

  it("hides controls while running in focus mode", () => {
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "running",
    })

    const { getByLabelText, getByText, getByTestId } = renderWithI18n(
      <TimerScene mode="focus" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(getByLabelText("Pause")).toBeTruthy()
    expect(getByText("Cancel")).toBeTruthy()
    expect(getByTestId("timer-tap-gesture-background")).toBeTruthy()
    const controls = getByTestId("timer-controls")
    expect(controls.props.pointerEvents).toBe("none")
  })

  it("does not render the tap gesture background while idle in focus mode", () => {
    const { queryByTestId } = renderWithI18n(
      <TimerScene mode="focus" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(queryByTestId("timer-tap-gesture-background")).toBeNull()
  })

  it("does not render the tap gesture background in short mode", () => {
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "running",
    })

    const { queryByTestId } = renderWithI18n(
      <TimerScene mode="short" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(queryByTestId("timer-tap-gesture-background")).toBeNull()
  })

  it("shows the cancel button while paused", () => {
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "paused",
    })

    const { getByLabelText, getByText } = renderWithI18n(
      <TimerScene mode="focus" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(getByLabelText("Resume")).toBeTruthy()
    expect(getByText("Cancel")).toBeTruthy()
  })

  it("keeps the screen awake while running", () => {
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "running",
    })

    renderWithI18n(
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

    renderWithI18n(
      <TimerScene mode="focus" onDone={onDone} onModeChange={jest.fn()} />,
    )

    const player = mockUseAudioPlayer.mock.results[0].value as unknown as {
      play: jest.Mock
      seekTo: jest.Mock
    }

    expect(player.seekTo).toHaveBeenCalledWith(0)
    expect(player.play).toHaveBeenCalledTimes(1)
    expect(cancelTimer).toHaveBeenCalledTimes(1)
    expect(onDone).toHaveBeenCalledWith("short")
  })

  it("does not play audio when a break finishes", () => {
    const cancelTimer = jest.fn()
    const onDone = jest.fn()

    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "done",
      cancelTimer,
    })

    renderWithI18n(
      <TimerScene mode="short" onDone={onDone} onModeChange={jest.fn()} />,
    )

    const player = mockUseAudioPlayer.mock.results[0].value as unknown as {
      play: jest.Mock
      seekTo: jest.Mock
    }

    expect(player.seekTo).not.toHaveBeenCalled()
    expect(player.play).not.toHaveBeenCalled()
    expect(cancelTimer).toHaveBeenCalledTimes(1)
    expect(onDone).toHaveBeenCalledWith("focus")
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

    const { getByText } = renderWithI18n(
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

    const { getByText } = renderWithI18n(
      <TimerScene mode="short" onDone={onDone} onModeChange={jest.fn()} />,
    )

    const player = mockUseAudioPlayer.mock.results[0].value as unknown as {
      play: jest.Mock
      seekTo: jest.Mock
    }

    fireEvent.press(getByText("Stop").parent!)

    expect(cancelTimer).toHaveBeenCalledTimes(1)
    expect(onDone).toHaveBeenCalledWith("focus")
    expect(player.seekTo).not.toHaveBeenCalled()
    expect(player.play).not.toHaveBeenCalled()
  })

  it("wires background notifications", () => {
    const mockNotifications =
      useBackgroundTimerNotifications as jest.MockedFunction<
        typeof useBackgroundTimerNotifications
      >

    renderWithI18n(
      <TimerScene mode="focus" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(mockNotifications).toHaveBeenCalledWith({
      status: baseTimerState.status,
      remainingMs: baseTimerState.remainingMs,
    })
  })

  it("calls onModeChange with focus when selecting focus mode", () => {
    const onModeChange = jest.fn()

    const { getByTestId } = renderWithI18n(
      <TimerScene
        mode="short"
        onDone={jest.fn()}
        onModeChange={onModeChange}
      />,
    )

    fireEvent.press(getByTestId("mode-picker-focus"))

    expect(onModeChange).toHaveBeenCalledWith("focus")
  })

  it("does not render an edge swipe zone while paused in focus", () => {
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "paused",
    })

    const { queryByTestId } = renderWithI18n(
      <TimerScene mode="focus" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(queryByTestId("timer-edge-swipe-left")).toBeNull()
    expect(queryByTestId("timer-edge-swipe-right")).toBeNull()
  })

  it("does not render an edge swipe zone while paused in short", () => {
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "paused",
    })

    const { queryByTestId } = renderWithI18n(
      <TimerScene mode="short" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(queryByTestId("timer-edge-swipe-left")).toBeNull()
    expect(queryByTestId("timer-edge-swipe-right")).toBeNull()
  })

  it("calls onModeChange with short when selecting break mode", () => {
    const onModeChange = jest.fn()

    const { getByTestId } = renderWithI18n(
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

    const { getByTestId } = renderWithI18n(
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

    const { getByTestId } = renderWithI18n(
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

    const { getByTestId } = renderWithI18n(
      <TimerScene
        mode="focus"
        onDone={jest.fn()}
        onModeChange={onModeChange}
      />,
    )

    expect(getByTestId("mode-picker-disabled").children[0]).toBe("enabled")
  })

  it("locks the inactive mode while paused", () => {
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "paused",
    })

    const { getByTestId } = renderWithI18n(
      <TimerScene mode="focus" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(getByTestId("mode-picker-disabled").children[0]).toBe("enabled")
    expect(getByTestId("mode-picker-disable-inactive").children[0]).toBe(
      "locked",
    )
    expect(
      getByTestId("mode-picker-focus").props.accessibilityState.disabled,
    ).toBe(false)
    expect(
      getByTestId("mode-picker-break").props.accessibilityState.disabled,
    ).toBe(true)
  })

  it("does not call onModeChange when selecting the inactive mode while paused", () => {
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "paused",
    })
    const onModeChange = jest.fn()

    const { getByTestId } = renderWithI18n(
      <TimerScene
        mode="focus"
        onDone={jest.fn()}
        onModeChange={onModeChange}
      />,
    )

    fireEvent.press(getByTestId("mode-picker-break"))

    expect(onModeChange).not.toHaveBeenCalled()
  })

  it("passes correct activeIndex to mode picker", () => {
    const { getByTestId: getByTestIdFocus } = renderWithI18n(
      <TimerScene mode="focus" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(getByTestIdFocus("mode-picker-active").children[0]).toBe("0")

    const { getByTestId: getByTestIdShort } = renderWithI18n(
      <TimerScene mode="short" onDone={jest.fn()} onModeChange={jest.fn()} />,
    )

    expect(getByTestIdShort("mode-picker-active").children[0]).toBe("1")
  })
})
