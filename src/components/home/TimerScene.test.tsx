import { i18n } from "@lingui/core"
import { I18nProvider } from "@lingui/react"
import { act, fireEvent, render, waitFor } from "@testing-library/react-native"
import { useAudioPlayer } from "expo-audio"
import { useKeepAwake } from "expo-keep-awake"
import type { ReactElement } from "react"
import { Alert } from "react-native"
import { Gesture } from "react-native-gesture-handler"

import TimerScene from "@/components/home/TimerScene"
import useBackgroundTimerNotifications from "@/hooks/useBackgroundTimerNotifications"
import useScreenDimming from "@/hooks/useScreenDimming"
import useScreenReaderEnabled from "@/hooks/useScreenReaderEnabled"
import { useTimer } from "@/hooks/useTimer"
import * as useTimerControlsModule from "@/hooks/useTimerControls"
import { messages as enMessages } from "@/locales/en/messages"
import { useStore } from "@/state/store"

jest.mock("@/hooks/useTimer")
jest.mock("@/hooks/useBackgroundTimerNotifications")
jest.mock("@/hooks/useScreenDimming")
jest.mock("@/hooks/useScreenReaderEnabled")

const mockUseTimer = useTimer as jest.MockedFunction<typeof useTimer>
const mockUseScreenDimming = useScreenDimming as jest.MockedFunction<
  typeof useScreenDimming
>
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

const baseTimerState = {
  remainingMs: 1500,
  status: "idle" as const,
  setStartingMs: jest.fn(),
  toggleTimer: jest.fn(),
  cancelTimer: jest.fn(),
  canCancel: true,
}

const baseConfig = {
  focus: { startingMs: 25 * 60 * 1000, nextMode: "short" as const },
  short: { startingMs: 5 * 60 * 1000, nextMode: "focus" as const },
}

describe("TimerScene", () => {
  beforeAll(() => {
    i18n.load({ en: enMessages })
    i18n.activate("en")
  })

  beforeEach(() => {
    useStore.setState({
      breakTimeMinutes: 5,
      completionSound: "cheering",
      dimmedBrightnessPercent: 15,
      focusTimeMinutes: 25,
      keepScreenAwake: true,
      liveActivitiesEnabled: true,
      screenDimmingEnabled: false,
    })
    mockUseTimer.mockReturnValue({ ...baseTimerState })
    mockUseScreenDimming.mockReturnValue({ resetDimming: jest.fn() })
    mockUseScreenReaderEnabled.mockReturnValue(false)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it("defaults to focus mode when mode is invalid", () => {
    const { getByLabelText } = renderWithI18n(
      <TimerScene
        config={baseConfig}
        mode="unknown"
        onDone={jest.fn()}
        onModeChange={jest.fn()}
      />,
    )

    expect(getByLabelText("Start")).toBeTruthy()
  })

  it("uses the short mode labels without stop button while idle", () => {
    const { getByLabelText, getByTestId, queryByText, queryByTestId } =
      renderWithI18n(
        <TimerScene
          config={baseConfig}
          mode="short"
          onDone={jest.fn()}
          onModeChange={jest.fn()}
        />,
      )

    expect(getByLabelText("Start")).toBeTruthy()
    expect(getByTestId("timer-edge-swipe-left")).toBeTruthy()
    expect(queryByTestId("timer-edge-swipe-right")).toBeNull()
    expect(queryByText("Stop")).toBeNull()
  })

  it("renders the right edge swipe zone in focus idle", () => {
    const { getByTestId, queryByTestId } = renderWithI18n(
      <TimerScene
        config={baseConfig}
        mode="focus"
        onDone={jest.fn()}
        onModeChange={jest.fn()}
      />,
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
      <TimerScene
        config={baseConfig}
        mode="short"
        onDone={jest.fn()}
        onModeChange={jest.fn()}
      />,
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

    const { queryByLabelText, queryByText, getByTestId, queryByTestId } =
      renderWithI18n(
        <TimerScene
          config={baseConfig}
          mode="focus"
          onDone={jest.fn()}
          onModeChange={jest.fn()}
        />,
      )

    expect(queryByLabelText("Pause")).toBeNull()
    expect(queryByText("Cancel")).toBeNull()
    expect(getByTestId("timer-tap-gesture-background")).toBeTruthy()
    expect(queryByTestId("timer-controls")).toBeNull()
  })

  it("does not render the tap gesture background while idle in focus mode", () => {
    const { queryByTestId } = renderWithI18n(
      <TimerScene
        config={baseConfig}
        mode="focus"
        onDone={jest.fn()}
        onModeChange={jest.fn()}
      />,
    )

    expect(queryByTestId("timer-tap-gesture-background")).toBeNull()
  })

  it("renders the tap gesture background in short mode while running", () => {
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "running",
    })

    const { getByTestId } = renderWithI18n(
      <TimerScene
        config={baseConfig}
        mode="short"
        onDone={jest.fn()}
        onModeChange={jest.fn()}
      />,
    )

    expect(getByTestId("timer-tap-gesture-background")).toBeTruthy()
  })

  it("shows the cancel button while paused", () => {
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "paused",
    })

    const { getByLabelText, getByText } = renderWithI18n(
      <TimerScene
        config={baseConfig}
        mode="focus"
        onDone={jest.fn()}
        onModeChange={jest.fn()}
      />,
    )

    expect(getByLabelText("Resume")).toBeTruthy()
    expect(getByText("Cancel")).toBeTruthy()
  })

  it("does not reset the duration again when status changes in the same mode", () => {
    const testStartingMs = 123_456
    const setStartingMs = jest.fn()
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      setStartingMs,
    })

    const { rerender } = renderWithI18n(
      <TimerScene
        config={{
          focus: { startingMs: testStartingMs, nextMode: "short" },
          short: { startingMs: 99_999, nextMode: "focus" },
        }}
        mode="focus"
        onDone={jest.fn()}
        onModeChange={jest.fn()}
      />,
    )

    expect(setStartingMs).toHaveBeenCalledTimes(1)
    expect(setStartingMs).toHaveBeenCalledWith(testStartingMs)

    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "running",
      setStartingMs,
    })

    rerender(
      <I18nProvider i18n={i18n}>
        <TimerScene
          config={{
            focus: { startingMs: testStartingMs, nextMode: "short" },
            short: { startingMs: 99_999, nextMode: "focus" },
          }}
          mode="focus"
          onDone={jest.fn()}
          onModeChange={jest.fn()}
        />
      </I18nProvider>,
    )

    expect(setStartingMs).toHaveBeenCalledTimes(1)
  })

  it("keeps the screen awake while running", () => {
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "running",
    })

    renderWithI18n(
      <TimerScene
        config={baseConfig}
        mode="focus"
        onDone={jest.fn()}
        onModeChange={jest.fn()}
      />,
    )

    expect(mockUseKeepAwake).toHaveBeenCalled()
  })

  it("wires disabled screen dimming while idle", () => {
    renderWithI18n(
      <TimerScene
        config={baseConfig}
        mode="focus"
        onDone={jest.fn()}
        onModeChange={jest.fn()}
      />,
    )

    expect(mockUseScreenDimming).toHaveBeenCalledWith({
      enabled: false,
      dimmedBrightnessPercent: 15,
      shouldDim: false,
    })
  })

  it("enables screen dimming while the focus timer runs", () => {
    useStore.setState({
      dimmedBrightnessPercent: 12,
      screenDimmingEnabled: true,
    })
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "running",
    })

    renderWithI18n(
      <TimerScene
        config={baseConfig}
        mode="focus"
        onDone={jest.fn()}
        onModeChange={jest.fn()}
      />,
    )

    expect(mockUseScreenDimming).toHaveBeenCalledWith({
      enabled: true,
      dimmedBrightnessPercent: 12,
      shouldDim: true,
    })
  })

  it("enables screen dimming while the break timer runs", () => {
    useStore.setState({
      dimmedBrightnessPercent: 10,
      screenDimmingEnabled: true,
    })
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "running",
    })

    renderWithI18n(
      <TimerScene
        config={baseConfig}
        mode="short"
        onDone={jest.fn()}
        onModeChange={jest.fn()}
      />,
    )

    expect(mockUseScreenDimming).toHaveBeenCalledWith({
      enabled: true,
      dimmedBrightnessPercent: 10,
      shouldDim: true,
    })
  })

  it("does not dim while paused", () => {
    useStore.setState({ screenDimmingEnabled: true })
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "paused",
    })

    renderWithI18n(
      <TimerScene
        config={baseConfig}
        mode="focus"
        onDone={jest.fn()}
        onModeChange={jest.fn()}
      />,
    )

    expect(mockUseScreenDimming).toHaveBeenCalledWith({
      enabled: true,
      dimmedBrightnessPercent: 15,
      shouldDim: false,
    })
  })

  it("does not dim while the focus cancel alert is visible", async () => {
    useStore.setState({ screenDimmingEnabled: true })
    const useTimerControlsSpy = jest.spyOn(useTimerControlsModule, "default")
    useTimerControlsSpy.mockReturnValue({
      showControls: true,
      tapGesture: Gesture.Tap(),
    })
    jest.spyOn(Alert, "alert").mockImplementation(() => {})
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "running",
    })

    const { getByText } = renderWithI18n(
      <TimerScene
        config={baseConfig}
        mode="focus"
        onDone={jest.fn()}
        onModeChange={jest.fn()}
      />,
    )

    expect(mockUseScreenDimming).toHaveBeenLastCalledWith({
      enabled: true,
      dimmedBrightnessPercent: 15,
      shouldDim: true,
    })

    fireEvent.press(getByText("Cancel").parent!)

    await waitFor(() => {
      expect(mockUseScreenDimming).toHaveBeenLastCalledWith({
        enabled: true,
        dimmedBrightnessPercent: 15,
        shouldDim: false,
      })
    })
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
      <TimerScene
        config={baseConfig}
        mode="focus"
        onDone={onDone}
        onModeChange={jest.fn()}
      />,
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

  it("does not play audio when completion sound is off", () => {
    const cancelTimer = jest.fn()
    const onDone = jest.fn()

    useStore.setState({ completionSound: "off" })
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "done",
      cancelTimer,
    })

    renderWithI18n(
      <TimerScene
        config={baseConfig}
        mode="focus"
        onDone={onDone}
        onModeChange={jest.fn()}
      />,
    )

    const player = mockUseAudioPlayer.mock.results[0].value as unknown as {
      play: jest.Mock
      seekTo: jest.Mock
    }

    expect(player.seekTo).not.toHaveBeenCalled()
    expect(player.play).not.toHaveBeenCalled()
    expect(cancelTimer).toHaveBeenCalledTimes(1)
    expect(onDone).toHaveBeenCalledWith("short")
  })

  it("loads the selected custom sound asset", () => {
    useStore.setState({ completionSound: "trumpets" })

    renderWithI18n(
      <TimerScene
        config={baseConfig}
        mode="focus"
        onDone={jest.fn()}
        onModeChange={jest.fn()}
      />,
    )

    expect(mockUseAudioPlayer).toHaveBeenCalledWith(
      require("../../../assets/sounds/trumpets.mp3"),
    )
  })

  it("plays audio when a break finishes", () => {
    const cancelTimer = jest.fn()
    const onDone = jest.fn()

    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "done",
      cancelTimer,
    })

    renderWithI18n(
      <TimerScene
        config={baseConfig}
        mode="short"
        onDone={onDone}
        onModeChange={jest.fn()}
      />,
    )

    const player = mockUseAudioPlayer.mock.results[0].value as unknown as {
      play: jest.Mock
      seekTo: jest.Mock
    }

    expect(player.seekTo).toHaveBeenCalledWith(0)
    expect(player.play).toHaveBeenCalledTimes(1)
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
      <TimerScene
        config={baseConfig}
        mode="focus"
        onDone={jest.fn()}
        onModeChange={jest.fn()}
      />,
    )

    fireEvent.press(getByText("Cancel").parent!)

    expect(alertSpy).toHaveBeenCalledTimes(1)
    expect(alertSpy).toHaveBeenCalledWith(
      "End focus session",
      "Your current focus timer will reset.",
      expect.arrayContaining([
        expect.objectContaining({ text: "Keep going", style: "cancel" }),
        expect.objectContaining({ text: "End", style: "destructive" }),
      ]),
      expect.objectContaining({ onDismiss: expect.any(Function) }),
    )
    const buttons = alertSpy.mock.calls[0]?.[2]
    const confirm = Array.isArray(buttons)
      ? buttons.find((button) => button.style === "destructive")
      : undefined
    act(() => {
      confirm?.onPress?.()
    })

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
      <TimerScene
        config={baseConfig}
        mode="short"
        onDone={onDone}
        onModeChange={jest.fn()}
      />,
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
      <TimerScene
        config={baseConfig}
        mode="focus"
        onDone={jest.fn()}
        onModeChange={jest.fn()}
      />,
    )

    expect(mockNotifications).toHaveBeenCalledWith({
      status: baseTimerState.status,
      remainingMs: baseTimerState.remainingMs,
    })
  })

  it("does not render an edge swipe zone while paused in focus", () => {
    mockUseTimer.mockReturnValue({
      ...baseTimerState,
      status: "paused",
    })

    const { queryByTestId } = renderWithI18n(
      <TimerScene
        config={baseConfig}
        mode="focus"
        onDone={jest.fn()}
        onModeChange={jest.fn()}
      />,
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
      <TimerScene
        config={baseConfig}
        mode="short"
        onDone={jest.fn()}
        onModeChange={jest.fn()}
      />,
    )

    expect(queryByTestId("timer-edge-swipe-left")).toBeNull()
    expect(queryByTestId("timer-edge-swipe-right")).toBeNull()
  })
})
