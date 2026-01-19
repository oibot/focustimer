import { fireEvent, render } from "@testing-library/react-native"

import TimerDoneScene from "@/components/home/TimerDoneScene"

describe("TimerDoneScene", () => {
  it("shows focus label when next mode is focus", () => {
    const { getByText } = render(
      <TimerDoneScene nextMode="focus" onStart={jest.fn()} />,
    )

    expect(getByText("Start Focus")).toBeTruthy()
  })

  it("shows break label when next mode is short", () => {
    const { getByText } = render(
      <TimerDoneScene nextMode="short" onStart={jest.fn()} />,
    )

    expect(getByText("Start Break")).toBeTruthy()
  })

  it("fires onStart when pressed", () => {
    const onStart = jest.fn()
    const { getByText } = render(
      <TimerDoneScene nextMode="focus" onStart={onStart} />,
    )

    fireEvent.press(getByText("Start Focus").parent!)
    expect(onStart).toHaveBeenCalledTimes(1)
  })
})
