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

  it("shows minutes and seconds", () => {
    const { getByLabelText } = renderWithI18n(<Timer {...baseProps} />)
    expect(getByLabelText("25:00")).toBeTruthy()
  })

  it("shows 00:00 when remainingMs is 0", () => {
    const { getByLabelText } = renderWithI18n(
      <Timer {...baseProps} remainingMs={0} />,
    )
    expect(getByLabelText("00:00")).toBeTruthy()
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
