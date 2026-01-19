import type { ReactNode } from "react"
import { act, renderHook, waitFor } from "@testing-library/react-native"

import useTimerScene from "@/hooks/useTimerScene"
import { TimerStoreProvider } from "@/hooks/useTimerStore"

const wrapper = ({ children }: { children: ReactNode }) => (
  <TimerStoreProvider>{children}</TimerStoreProvider>
)

describe("useTimerScene", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-01-08T00:00:00Z"))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("calls onDone once when the timer completes", async () => {
    const onDone = jest.fn()
    const { result, rerender } = renderHook(
      ({ startingMs, handler }) =>
        useTimerScene({ startingMs, onDone: handler }),
      {
        initialProps: { startingMs: 1000, handler: onDone },
        wrapper,
      },
    )

    await waitFor(() => {
      expect(result.current.remainingMs).toBe(1000)
    })

    act(() => result.current.toggleTimer())
    act(() => jest.advanceTimersByTime(1000))

    expect(result.current.status).toBe("done")
    expect(onDone).toHaveBeenCalledTimes(1)

    rerender({ startingMs: 1000, handler: onDone })
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it("allows onDone again after reset", async () => {
    const onDone = jest.fn()
    const { result } = renderHook(
      () => useTimerScene({ startingMs: 1000, onDone }),
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.remainingMs).toBe(1000)
    })

    act(() => result.current.toggleTimer())
    act(() => jest.advanceTimersByTime(1000))
    expect(onDone).toHaveBeenCalledTimes(1)

    act(() => result.current.cancelTimer())
    expect(result.current.status).toBe("idle")

    act(() => result.current.toggleTimer())
    act(() => jest.advanceTimersByTime(1000))
    expect(onDone).toHaveBeenCalledTimes(2)
  })
})
