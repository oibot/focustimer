import { fireEvent, render } from "@testing-library/react-native"

import Timer from "@/components/home/Timer"

const baseProps = {
  remainingMs: 25 * 60 * 1000,
  status: "idle" as const,
  onToggle: jest.fn(),
  onCancel: jest.fn(),
}

describe("Timer", () => {
  it("shows minutes and seconds", () => {
    const { getByText } = render(<Timer {...baseProps} />)
    expect(getByText("25:00")).toBeTruthy()
  })

  it("shows 00:00 when remainingMs is 0", () => {
    const { getByText } = render(<Timer {...baseProps} remainingMs={0} />)
    expect(getByText("00:00")).toBeTruthy()
  })

  it("shows Start, Pause, and Resume labels", () => {
    const { getByLabelText, rerender } = render(<Timer {...baseProps} />)
    expect(getByLabelText("Start")).toBeTruthy()
    rerender(<Timer {...baseProps} status="running" />)
    expect(getByLabelText("Pause")).toBeTruthy()
    rerender(<Timer {...baseProps} status="paused" />)
    expect(getByLabelText("Resume")).toBeTruthy()
  })

  it("shows cancel only while running", () => {
    const { queryByText, rerender } = render(<Timer {...baseProps} />)
    expect(queryByText("Cancel")).toBeNull()
    rerender(<Timer {...baseProps} status="running" />)
    expect(queryByText("Cancel")).toBeTruthy()
  })

  it("disables cancel when running and cannot cancel", () => {
    const { getByText } = render(
      <Timer {...baseProps} status="running" canCancel={false} />,
    )
    expect(getByText("Cancel").parent!).toBeDisabled()
  })

  it("hides controls when requested", () => {
    const { getByLabelText, getByText, getByTestId } = render(
      <Timer {...baseProps} status="running" showControls={false} />,
    )
    expect(getByLabelText("Pause")).toBeTruthy()
    expect(getByText("Cancel")).toBeTruthy()
    const controls = getByTestId("timer-controls")
    expect(controls.props.pointerEvents).toBe("none")
  })

  it("enables cancel by default while running", () => {
    const { getByText } = render(<Timer {...baseProps} status="running" />)
    expect(getByText("Cancel").parent!).toBeEnabled()
  })

  it("calls handlers on press", () => {
    const onToggle = jest.fn()
    const onCancel = jest.fn()
    const { getByLabelText, getByText, rerender } = render(
      <Timer {...baseProps} onToggle={onToggle} onCancel={onCancel} />,
    )

    fireEvent.press(getByLabelText("Start"))
    expect(onToggle).toHaveBeenCalledTimes(1)

    rerender(
      <Timer
        {...baseProps}
        status="running"
        onToggle={onToggle}
        onCancel={onCancel}
      />,
    )
    fireEvent.press(getByText("Cancel").parent!)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it("uses a custom idle label when provided", () => {
    const { getByLabelText } = render(
      <Timer {...baseProps} idleLabel="Focus" />,
    )
    expect(getByLabelText("Focus")).toBeTruthy()
  })

  it("uses a custom cancel label when provided", () => {
    const { getByText } = render(
      <Timer {...baseProps} status="running" cancelLabel="Reset" canCancel />,
    )
    expect(getByText("Reset")).toBeTruthy()
  })

  it("uses the idle label for the toggle button", () => {
    const { getByLabelText } = render(
      <Timer {...baseProps} idleLabel="Begin" />,
    )
    expect(getByLabelText("Begin")).toBeTruthy()
  })
})
