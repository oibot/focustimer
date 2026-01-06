import { fireEvent, render } from "@testing-library/react-native"

import PomodoroTimer from "@/components/home/PomodoroTimer"

const baseProps = {
  remainingMs: 25 * 60 * 1000,
  status: "idle" as const,
  onToggle: jest.fn(),
  onCancel: jest.fn(),
}

describe("PomodoroTimer", () => {
  it("shows minutes and seconds", () => {
    const { getByText } = render(<PomodoroTimer {...baseProps} />)
    expect(getByText("25:00")).toBeTruthy()
  })

  it("shows 00:00 when remainingMs is 0", () => {
    const { getByText } = render(
      <PomodoroTimer {...baseProps} remainingMs={0} />
    )
    expect(getByText("00:00")).toBeTruthy()
  })

  it("shows Focus, Pause, and Resume labels", () => {
    const { getByText, rerender } = render(<PomodoroTimer {...baseProps} />)
    expect(getByText("Focus")).toBeTruthy()
    rerender(<PomodoroTimer {...baseProps} status="running" />)
    expect(getByText("Pause")).toBeTruthy()
    rerender(<PomodoroTimer {...baseProps} status="paused" />)
    expect(getByText("Resume")).toBeTruthy()
  })

  it("disables cancel when not running and enables when running", () => {
    const { getByText, rerender } = render(<PomodoroTimer {...baseProps} />)
    expect(getByText("Cancel").parent!).toBeDisabled()
    rerender(<PomodoroTimer {...baseProps} status="running" />)
    expect(getByText("Cancel").parent!).toBeEnabled()
  })

  it("calls handlers on press", () => {
    const onToggle = jest.fn()
    const onCancel = jest.fn()
    const { getByText, rerender } = render(
      <PomodoroTimer {...baseProps} onToggle={onToggle} onCancel={onCancel} />
    )

    fireEvent.press(getByText("Focus").parent!)
    expect(onToggle).toHaveBeenCalledTimes(1)

    rerender(
      <PomodoroTimer
        {...baseProps}
        status="running"
        onToggle={onToggle}
        onCancel={onCancel}
      />
    )
    fireEvent.press(getByText("Cancel").parent!)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
