import { i18n } from "@lingui/core"
import { I18nProvider } from "@lingui/react"
import { fireEvent, render } from "@testing-library/react-native"
import * as ReactNative from "react-native"

import Timer from "@/components/home/Timer"
import { messages as enMessages } from "@/locales/en/messages"

const baseProps = {
  remainingMs: 25 * 60 * 1000,
  status: "idle" as const,
  timerMode: "focus" as const,
  onToggle: jest.fn(),
  onCancel: jest.fn(),
}

describe("Timer", () => {
  beforeAll(() => {
    i18n.load({ en: enMessages })
    i18n.activate("en")
  })

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  const renderWithI18n = (ui: React.ReactElement) =>
    render(<I18nProvider i18n={i18n}>{ui}</I18nProvider>)

  it("reads full minutes remaining for VoiceOver", async () => {
    const { getByLabelText } = await renderWithI18n(<Timer {...baseProps} />)
    expect(getByLabelText("25 minutes remaining")).toBeTruthy()
  })

  it("reads 00:00 as zero seconds remaining", async () => {
    const { getByLabelText } = await renderWithI18n(
      <Timer {...baseProps} remainingMs={0} />,
    )
    expect(getByLabelText("0 seconds remaining")).toBeTruthy()
  })

  it("reads both minutes and seconds when both are present", async () => {
    const { getByLabelText } = await renderWithI18n(
      <Timer {...baseProps} remainingMs={10 * 60 * 1000 + 30 * 1000} />,
    )

    expect(getByLabelText("10 minutes 30 seconds remaining")).toBeTruthy()
  })

  it("reads seconds only when less than a minute remains", async () => {
    const { getByLabelText } = await renderWithI18n(
      <Timer {...baseProps} remainingMs={45 * 1000} />,
    )

    expect(getByLabelText("45 seconds remaining")).toBeTruthy()
  })

  it("reads singular seconds correctly", async () => {
    const { getByLabelText } = await renderWithI18n(
      <Timer {...baseProps} remainingMs={1000} />,
    )

    expect(getByLabelText("1 second remaining")).toBeTruthy()
  })

  it("does not expose the compact timer string as the accessibility label", async () => {
    const { queryByLabelText } = await renderWithI18n(<Timer {...baseProps} />)

    expect(queryByLabelText("25:00")).toBeNull()
  })

  it("keeps the visible timer digits when plain rendering is requested", async () => {
    const { getByLabelText, getByText } = await renderWithI18n(
      <Timer {...baseProps} usePlainTime />,
    )

    expect(getByLabelText("25 minutes remaining")).toBeTruthy()
    expect(getByText(":", { includeHiddenElements: true })).toBeTruthy()
  })

  it("exposes the timer as one accessible text element", async () => {
    const { getAllByRole } = await renderWithI18n(<Timer {...baseProps} />)

    expect(getAllByRole("text")).toHaveLength(1)
  })

  it("shows Start, Pause, and Resume labels", async () => {
    const { getByLabelText, rerender } = await renderWithI18n(
      <Timer {...baseProps} />,
    )
    expect(getByLabelText("Start")).toBeTruthy()
    await rerender(
      <I18nProvider i18n={i18n}>
        <Timer {...baseProps} status="running" />
      </I18nProvider>,
    )
    expect(getByLabelText("Pause")).toBeTruthy()
    await rerender(
      <I18nProvider i18n={i18n}>
        <Timer {...baseProps} status="paused" />
      </I18nProvider>,
    )
    expect(getByLabelText("Resume")).toBeTruthy()
  })

  it("uses mode-specific start hints", async () => {
    const { getByA11yHint, rerender } = await renderWithI18n(
      <Timer {...baseProps} />,
    )

    expect(getByA11yHint("Start focus timer")).toBeTruthy()

    await rerender(
      <I18nProvider i18n={i18n}>
        <Timer {...baseProps} timerMode="short" />
      </I18nProvider>,
    )

    expect(getByA11yHint("Start break timer")).toBeTruthy()
  })

  it("shows cancel only while running", async () => {
    const { queryByText, rerender } = await renderWithI18n(
      <Timer {...baseProps} />,
    )
    expect(queryByText("Cancel")).toBeNull()
    await rerender(
      <I18nProvider i18n={i18n}>
        <Timer {...baseProps} status="running" />
      </I18nProvider>,
    )
    expect(queryByText("Cancel")).toBeTruthy()
  })

  it("shows cancel while paused", async () => {
    const { getByText } = await renderWithI18n(
      <Timer {...baseProps} status="paused" canCancel />,
    )

    expect(getByText("Cancel")).toBeTruthy()
    expect(getByText("Cancel").parent!).toBeEnabled()
  })

  it("shows a disabled cancel button when requested for accessibility", async () => {
    const { getByText } = await renderWithI18n(
      <Timer {...baseProps} showDisabledCancel />,
    )

    expect(getByText("Cancel")).toBeTruthy()
    expect(getByText("Cancel").parent!).toBeDisabled()
  })

  it("disables cancel when running and cannot cancel", async () => {
    const { getByText } = await renderWithI18n(
      <Timer {...baseProps} status="running" canCancel={false} />,
    )
    expect(getByText("Cancel").parent!).toBeDisabled()
  })

  it("hides controls when requested", async () => {
    const { queryByLabelText, queryByText, queryByTestId } =
      await renderWithI18n(
        <Timer {...baseProps} status="running" showControls={false} />,
      )
    expect(queryByLabelText("Pause")).toBeNull()
    expect(queryByText("Cancel")).toBeNull()
    expect(queryByTestId("timer-controls")).toBeNull()
  })

  it("enables cancel by default while running", async () => {
    const { getByText } = await renderWithI18n(
      <Timer {...baseProps} status="running" />,
    )
    expect(getByText("Cancel").parent!).toBeEnabled()
  })

  it("calls handlers on press", async () => {
    const onToggle = jest.fn()
    const onCancel = jest.fn()
    const { getByLabelText, getByText, rerender } = await renderWithI18n(
      <Timer {...baseProps} onToggle={onToggle} onCancel={onCancel} />,
    )

    await fireEvent.press(getByLabelText("Start"))
    expect(onToggle).toHaveBeenCalledTimes(1)

    await rerender(
      <I18nProvider i18n={i18n}>
        <Timer
          {...baseProps}
          status="running"
          onToggle={onToggle}
          onCancel={onCancel}
        />
      </I18nProvider>,
    )
    await fireEvent.press(getByText("Cancel").parent!)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it("uses a custom cancel label when provided", async () => {
    const { getByText } = await renderWithI18n(
      <Timer {...baseProps} status="running" cancelLabel="Reset" canCancel />,
    )
    expect(getByText("Reset")).toBeTruthy()
  })

  it("moves accessibility focus to the timer when starting", async () => {
    jest
      .spyOn(ReactNative.AccessibilityInfo, "setAccessibilityFocus")
      .mockImplementation()
    jest.spyOn(ReactNative, "findNodeHandle").mockReturnValue(42)

    const { rerender } = await renderWithI18n(
      <Timer {...baseProps} shouldFocusReadoutOnStart />,
    )

    await rerender(
      <I18nProvider i18n={i18n}>
        <Timer {...baseProps} status="running" shouldFocusReadoutOnStart />
      </I18nProvider>,
    )

    jest.advanceTimersByTime(100)

    expect(
      ReactNative.AccessibilityInfo.setAccessibilityFocus,
    ).toHaveBeenCalledWith(42)
  })

  it("moves accessibility focus to the timer when resuming", async () => {
    jest
      .spyOn(ReactNative.AccessibilityInfo, "setAccessibilityFocus")
      .mockImplementation()
    jest.spyOn(ReactNative, "findNodeHandle").mockReturnValue(42)

    const { rerender } = await renderWithI18n(
      <Timer {...baseProps} status="paused" shouldFocusReadoutOnStart />,
    )

    await rerender(
      <I18nProvider i18n={i18n}>
        <Timer {...baseProps} status="running" shouldFocusReadoutOnStart />
      </I18nProvider>,
    )

    jest.advanceTimersByTime(100)

    expect(
      ReactNative.AccessibilityInfo.setAccessibilityFocus,
    ).toHaveBeenCalledWith(42)
  })

  it("does not move accessibility focus when the option is off", async () => {
    jest
      .spyOn(ReactNative.AccessibilityInfo, "setAccessibilityFocus")
      .mockImplementation()
    jest.spyOn(ReactNative, "findNodeHandle").mockReturnValue(42)

    const { rerender } = await renderWithI18n(<Timer {...baseProps} />)

    await rerender(
      <I18nProvider i18n={i18n}>
        <Timer {...baseProps} status="running" />
      </I18nProvider>,
    )

    jest.advanceTimersByTime(100)

    expect(
      ReactNative.AccessibilityInfo.setAccessibilityFocus,
    ).not.toHaveBeenCalled()
  })
})
