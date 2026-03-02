import { fireEvent, render } from "@testing-library/react-native"

import Timer from "@/components/home/Timer"
import { i18n } from "@lingui/core"
import { I18nProvider } from "@lingui/react"
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

  const renderWithI18n = (ui: React.ReactElement) =>
    render(<I18nProvider i18n={i18n}>{ui}</I18nProvider>)

  it("reads full minutes remaining for VoiceOver", () => {
    const { getByLabelText } = renderWithI18n(<Timer {...baseProps} />)
    expect(getByLabelText("25 minutes remaining")).toBeTruthy()
  })

  it("reads 00:00 as zero seconds remaining", () => {
    const { getByLabelText } = renderWithI18n(
      <Timer {...baseProps} remainingMs={0} />,
    )
    expect(getByLabelText("0 seconds remaining")).toBeTruthy()
  })

  it("reads both minutes and seconds when both are present", () => {
    const { getByLabelText } = renderWithI18n(
      <Timer {...baseProps} remainingMs={10 * 60 * 1000 + 30 * 1000} />,
    )

    expect(getByLabelText("10 minutes 30 seconds remaining")).toBeTruthy()
  })

  it("reads seconds only when less than a minute remains", () => {
    const { getByLabelText } = renderWithI18n(
      <Timer {...baseProps} remainingMs={45 * 1000} />,
    )

    expect(getByLabelText("45 seconds remaining")).toBeTruthy()
  })

  it("reads singular seconds correctly", () => {
    const { getByLabelText } = renderWithI18n(
      <Timer {...baseProps} remainingMs={1000} />,
    )

    expect(getByLabelText("1 second remaining")).toBeTruthy()
  })

  it("does not expose the compact timer string as the accessibility label", () => {
    const { queryByLabelText } = renderWithI18n(<Timer {...baseProps} />)

    expect(queryByLabelText("25:00")).toBeNull()
  })

  it("keeps the visible timer digits when plain rendering is requested", () => {
    const { getByLabelText, getByText } = renderWithI18n(
      <Timer {...baseProps} usePlainTime />,
    )

    expect(getByLabelText("25 minutes remaining")).toBeTruthy()
    expect(getByText(":", { includeHiddenElements: true })).toBeTruthy()
  })

  it("exposes the timer as one accessible text element", () => {
    const { getAllByRole } = renderWithI18n(<Timer {...baseProps} />)

    expect(getAllByRole("text")).toHaveLength(1)
  })

  it("shows Start, Pause, and Resume labels", () => {
    const { getByLabelText, rerender } = renderWithI18n(
      <Timer {...baseProps} />,
    )
    expect(getByLabelText("Start")).toBeTruthy()
    rerender(
      <I18nProvider i18n={i18n}>
        <Timer {...baseProps} status="running" />
      </I18nProvider>,
    )
    expect(getByLabelText("Pause")).toBeTruthy()
    rerender(
      <I18nProvider i18n={i18n}>
        <Timer {...baseProps} status="paused" />
      </I18nProvider>,
    )
    expect(getByLabelText("Resume")).toBeTruthy()
  })

  it("uses mode-specific start hints", () => {
    const { getByA11yHint, rerender } = renderWithI18n(<Timer {...baseProps} />)

    expect(getByA11yHint("Start focus timer")).toBeTruthy()

    rerender(
      <I18nProvider i18n={i18n}>
        <Timer {...baseProps} timerMode="short" />
      </I18nProvider>,
    )

    expect(getByA11yHint("Start break timer")).toBeTruthy()
  })

  it("shows cancel only while running", () => {
    const { queryByText, rerender } = renderWithI18n(<Timer {...baseProps} />)
    expect(queryByText("Cancel")).toBeNull()
    rerender(
      <I18nProvider i18n={i18n}>
        <Timer {...baseProps} status="running" />
      </I18nProvider>,
    )
    expect(queryByText("Cancel")).toBeTruthy()
  })

  it("shows a disabled cancel button when requested for accessibility", () => {
    const { getByText } = renderWithI18n(
      <Timer {...baseProps} showDisabledCancel />,
    )

    expect(getByText("Cancel")).toBeTruthy()
    expect(getByText("Cancel").parent!).toBeDisabled()
  })

  it("disables cancel when running and cannot cancel", () => {
    const { getByText } = renderWithI18n(
      <Timer {...baseProps} status="running" canCancel={false} />,
    )
    expect(getByText("Cancel").parent!).toBeDisabled()
  })

  it("hides controls when requested", () => {
    const { getByLabelText, getByText, getByTestId } = renderWithI18n(
      <Timer {...baseProps} status="running" showControls={false} />,
    )
    expect(getByLabelText("Pause")).toBeTruthy()
    expect(getByText("Cancel")).toBeTruthy()
    const controls = getByTestId("timer-controls")
    expect(controls.props.pointerEvents).toBe("none")
  })

  it("enables cancel by default while running", () => {
    const { getByText } = renderWithI18n(
      <Timer {...baseProps} status="running" />,
    )
    expect(getByText("Cancel").parent!).toBeEnabled()
  })

  it("calls handlers on press", () => {
    const onToggle = jest.fn()
    const onCancel = jest.fn()
    const { getByLabelText, getByText, rerender } = renderWithI18n(
      <Timer {...baseProps} onToggle={onToggle} onCancel={onCancel} />,
    )

    fireEvent.press(getByLabelText("Start"))
    expect(onToggle).toHaveBeenCalledTimes(1)

    rerender(
      <I18nProvider i18n={i18n}>
        <Timer
          {...baseProps}
          status="running"
          onToggle={onToggle}
          onCancel={onCancel}
        />
      </I18nProvider>,
    )
    fireEvent.press(getByText("Cancel").parent!)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it("uses a custom idle label when provided", () => {
    const { getByLabelText } = renderWithI18n(
      <Timer {...baseProps} idleLabel="Focus" />,
    )
    expect(getByLabelText("Focus")).toBeTruthy()
  })

  it("uses a custom cancel label when provided", () => {
    const { getByText } = renderWithI18n(
      <Timer {...baseProps} status="running" cancelLabel="Reset" canCancel />,
    )
    expect(getByText("Reset")).toBeTruthy()
  })

  it("uses the idle label for the toggle button", () => {
    const { getByLabelText } = renderWithI18n(
      <Timer {...baseProps} idleLabel="Begin" />,
    )
    expect(getByLabelText("Begin")).toBeTruthy()
  })
})
