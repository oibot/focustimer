import { renderHook } from "@testing-library/react-native"

import { useTimer } from "@/hooks/useTimer"
import { useTimerStore } from "@/hooks/useTimerStore"
import type { TimerStatus } from "@/types/timer"

jest.mock("@/hooks/useTimerStore")

const mockUseTimerStore = useTimerStore as jest.MockedFunction<
  typeof useTimerStore
>

describe("useTimer", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("exposes timer state and actions", () => {
    const setStartingMs = jest.fn()
    const toggleTimer = jest.fn()
    const cancelTimer = jest.fn()
    const finishTimer = jest.fn()
    const status: TimerStatus = "idle"

    mockUseTimerStore.mockReturnValue({
      state: {
        startingMs: 5000,
        remainingMs: 5000,
        isRunning: false,
        status,
      },
      actions: {
        setStartingMs,
        toggleTimer,
        cancelTimer,
        finishTimer,
      },
    })

    const { result } = renderHook(() => useTimer())

    expect(result.current.remainingMs).toBe(5000)
    expect(result.current.status).toBe(status)
    expect(result.current.setStartingMs).toBe(setStartingMs)
    expect(result.current.toggleTimer).toBe(toggleTimer)
    expect(result.current.cancelTimer).toBe(cancelTimer)
    expect(result.current.finishTimer).toBe(finishTimer)
    expect(result.current.canCancel).toBe(false)
  })

  it("marks canCancel true when remaining differs", () => {
    mockUseTimerStore.mockReturnValue({
      state: {
        startingMs: 6000,
        remainingMs: 3000,
        isRunning: true,
        status: "running",
      },
      actions: {
        setStartingMs: jest.fn(),
        toggleTimer: jest.fn(),
        cancelTimer: jest.fn(),
        finishTimer: jest.fn(),
      },
    })

    const { result } = renderHook(() => useTimer())

    expect(result.current.canCancel).toBe(true)
  })
})
