import { fireEvent, render } from "@testing-library/react-native"

import PomodoroTimer from "@/components/home/PomodoroTimer"

const baseProps = {
  isRunning: false,
  remainingMs: 25 * 60 * 1000,
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

  it("shows Focus when paused and Pause when running", () => {
    const { getByText, rerender } = render(<PomodoroTimer {...baseProps} />)
    expect(getByText("Focus")).toBeTruthy()
    rerender(<PomodoroTimer {...baseProps} isRunning />)
    expect(getByText("Pause")).toBeTruthy()
  })

  it("disables cancel when not running and enables when running", () => {
    const { getByTestId, rerender } = render(<PomodoroTimer {...baseProps} />)
    expect(getByTestId("cancel-timer")).toBeDisabled()
    rerender(<PomodoroTimer {...baseProps} isRunning />)
    expect(getByTestId("cancel-timer")).toBeEnabled()
  })

  it("calls handlers on press", () => {
    const onToggle = jest.fn()
    const onCancel = jest.fn()
    const { getByTestId, rerender } = render(
      <PomodoroTimer {...baseProps} onToggle={onToggle} onCancel={onCancel} />
    )

    fireEvent.press(getByTestId("toggle-timer"))
    expect(onToggle).toHaveBeenCalledTimes(1)

    rerender(
      <PomodoroTimer
        {...baseProps}
        isRunning
        onToggle={onToggle}
        onCancel={onCancel}
      />
    )
    fireEvent.press(getByTestId("cancel-timer"))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
