import { fireEvent, render } from "@testing-library/react-native"

import TimerDoneScene from "@/components/home/TimerDoneScene"
import { useTimer } from "@/hooks/useTimer"
import { i18n } from "@lingui/core"
import { I18nProvider } from "@lingui/react"
import { messages as enMessages } from "@/locales/en/messages"
import type { ReactElement } from "react"

jest.mock("@/hooks/useTimer")

const mockUseTimer = useTimer as jest.MockedFunction<typeof useTimer>

const renderWithI18n = (ui: ReactElement) =>
  render(<I18nProvider i18n={i18n}>{ui}</I18nProvider>)

describe("TimerDoneScene", () => {
  beforeAll(() => {
    i18n.load({ en: enMessages })
    i18n.activate("en")
  })

  beforeEach(() => {
    mockUseTimer.mockReturnValue({
      remainingMs: 0,
      status: "done",
      cancelTimer: jest.fn(),
      setStartingMs: jest.fn(),
      toggleTimer: jest.fn(),
      canCancel: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("shows focus label when next mode is focus", () => {
    const { getByText } = renderWithI18n(
      <TimerDoneScene
        nextMode="focus"
        onStart={jest.fn()}
        onCancel={jest.fn()}
      />,
    )

    expect(getByText("Start Focus")).toBeTruthy()
  })

  it("shows break label when next mode is short", () => {
    const { getByText } = renderWithI18n(
      <TimerDoneScene
        nextMode="short"
        onStart={jest.fn()}
        onCancel={jest.fn()}
      />,
    )

    expect(getByText("Start Break")).toBeTruthy()
  })

  it("calls onStart when the start button is pressed", () => {
    const onStart = jest.fn()
    const { getByText } = renderWithI18n(
      <TimerDoneScene
        nextMode="focus"
        onStart={onStart}
        onCancel={jest.fn()}
      />,
    )

    fireEvent.press(getByText("Start Focus").parent!)

    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it("cancels the timer and notifies parent", () => {
    const cancelTimer = jest.fn()
    const onCancel = jest.fn()

    mockUseTimer.mockReturnValue({
      remainingMs: 0,
      status: "done",
      cancelTimer,
      setStartingMs: jest.fn(),
      toggleTimer: jest.fn(),
      canCancel: true,
    })

    const { getByText } = renderWithI18n(
      <TimerDoneScene
        nextMode="focus"
        onStart={jest.fn()}
        onCancel={onCancel}
      />,
    )

    fireEvent.press(getByText("Cancel").parent!)

    expect(cancelTimer).toHaveBeenCalledTimes(1)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
