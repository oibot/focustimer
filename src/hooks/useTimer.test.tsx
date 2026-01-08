import { act, renderHook } from "@testing-library/react-native"

import useTimer from "@/hooks/useTimer"

describe("useTimer", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-01-08T00:00:00Z"))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("starts idle at the full duration", () => {
    const { result } = renderHook(() => useTimer({ startingMs: 5000 }))

    expect(result.current.status).toBe("idle")
    expect(result.current.remainingMs).toBe(5000)
  })

  it("runs, pauses, and resumes without drifting", () => {
    const { result } = renderHook(() => useTimer({ startingMs: 5000 }))

    act(() => result.current.toggleTimer())
    expect(result.current.status).toBe("running")

    act(() => jest.advanceTimersByTime(1000))
    expect(result.current.remainingMs).toBe(4000)

    act(() => result.current.toggleTimer())
    expect(result.current.status).toBe("paused")

    act(() => jest.advanceTimersByTime(1000))
    expect(result.current.remainingMs).toBe(4000)

    act(() => result.current.toggleTimer())
    expect(result.current.status).toBe("running")

    act(() => jest.advanceTimersByTime(1000))
    expect(result.current.remainingMs).toBe(3000)
  })

  it("finishes at zero and marks done", () => {
    const { result } = renderHook(() => useTimer({ startingMs: 2000 }))

    act(() => result.current.toggleTimer())
    act(() => jest.advanceTimersByTime(2000))

    expect(result.current.remainingMs).toBe(0)
    expect(result.current.status).toBe("done")
  })

  it("cancels back to idle and resets remaining", () => {
    const { result } = renderHook(() => useTimer({ startingMs: 3000 }))

    act(() => result.current.toggleTimer())
    act(() => jest.advanceTimersByTime(1000))

    act(() => result.current.cancelTimer())
    expect(result.current.status).toBe("idle")
    expect(result.current.remainingMs).toBe(3000)
  })
})
