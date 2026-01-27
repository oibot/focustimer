import React from "react"
import { renderHook } from "@testing-library/react-native"

import { useTimer } from "@/hooks/useTimer"
import { TimerContext } from "@/components/providers/TimerProvider"
import type { TimerStatus } from "@/types/timer"

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}))

const mockUseContext = jest.mocked(React.useContext)

describe("useTimer", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("exposes timer state and actions", () => {
    const setStartingMs = jest.fn()
    const toggleTimer = jest.fn()
    const cancelTimer = jest.fn()
    const status: TimerStatus = "idle"

    mockUseContext.mockReturnValue({
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
      },
    } as React.ContextType<typeof TimerContext>)

    const { result } = renderHook(() => useTimer())

    expect(result.current.remainingMs).toBe(5000)
    expect(result.current.status).toBe(status)
    expect(result.current.setStartingMs).toBe(setStartingMs)
    expect(result.current.toggleTimer).toBe(toggleTimer)
    expect(result.current.cancelTimer).toBe(cancelTimer)
    expect(result.current.canCancel).toBe(false)
  })

  it("marks canCancel true when remaining differs", () => {
    mockUseContext.mockReturnValue({
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
      },
    } as React.ContextType<typeof TimerContext>)

    const { result } = renderHook(() => useTimer())

    expect(result.current.canCancel).toBe(true)
  })
})
