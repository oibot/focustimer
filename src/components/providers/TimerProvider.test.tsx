import { act, renderHook } from "@testing-library/react-native"
import React, { useContext } from "react"

import TimerProvider, {
  TimerContext,
  type TimerContextValue,
} from "@/components/providers/TimerProvider"

const useTimerContext = () => useContext(TimerContext)

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TimerProvider>{children}</TimerProvider>
)

const expectNonNil = (value: unknown) => {
  expect(value).not.toBeNull()
  expect(value).not.toBeUndefined()
}

const expectTimerState = (state: TimerContextValue["state"]) => {
  expectNonNil(state.startingMs)
  expectNonNil(state.remainingMs)
  expectNonNil(state.isRunning)
  expectNonNil(state.status)
}

const expectTimerActions = (actions: TimerContextValue["actions"]) => {
  expectNonNil(actions.toggleTimer)
  expectNonNil(actions.cancelTimer)
  expectNonNil(actions.setStartingMs)
}

describe("TimerProvider", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-01-08T00:00:00Z"))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("returns safe defaults outside the provider", async () => {
    const { result } = await renderHook(() => useTimerContext())

    expectTimerState(result.current.state)
    expectTimerActions(result.current.actions)
  })

  it("starts idle at the full duration", async () => {
    const { result } = await renderHook(() => useTimerContext(), { wrapper })

    await act(() => result.current.actions.setStartingMs(5000))

    expect(result.current.state.status).toBe("idle")
    expect(result.current.state.startingMs).toBe(5000)
    expect(result.current.state.remainingMs).toBe(5000)
    expect(result.current.state.isRunning).toBe(false)
    expectTimerActions(result.current.actions)
  })

  it("runs, pauses, and resumes without drifting", async () => {
    const { result } = await renderHook(() => useTimerContext(), { wrapper })

    await act(() => result.current.actions.setStartingMs(6000))

    await act(() => result.current.actions.toggleTimer())
    expect(result.current.state.status).toBe("running")

    await act(() => jest.advanceTimersByTime(1000))
    expect(result.current.state.remainingMs).toBe(5000)

    await act(() => result.current.actions.toggleTimer())
    expect(result.current.state.status).toBe("paused")

    await act(() => jest.advanceTimersByTime(1000))
    expect(result.current.state.remainingMs).toBe(5000)

    await act(() => result.current.actions.toggleTimer())
    expect(result.current.state.status).toBe("running")

    await act(() => jest.advanceTimersByTime(1000))
    expect(result.current.state.remainingMs).toBe(4000)

    expectTimerActions(result.current.actions)
  })

  it("resets when setting a new starting duration", async () => {
    const { result } = await renderHook(() => useTimerContext(), { wrapper })

    await act(() => result.current.actions.setStartingMs(7000))
    await act(() => result.current.actions.toggleTimer())
    await act(() => jest.advanceTimersByTime(1000))

    await act(() => result.current.actions.setStartingMs(6000))

    expect(result.current.state.isRunning).toBe(false)
    expect(result.current.state.startingMs).toBe(6000)
    expect(result.current.state.remainingMs).toBe(6000)
    expect(result.current.state.status).toBe("idle")
    expectTimerActions(result.current.actions)
  })

  it("finishes and marks done", async () => {
    const { result } = await renderHook(() => useTimerContext(), { wrapper })

    await act(() => result.current.actions.setStartingMs(5000))
    await act(() => result.current.actions.toggleTimer())
    await act(() => jest.advanceTimersByTime(5000))

    expect(result.current.state.remainingMs).toBe(0)
    expect(result.current.state.status).toBe("done")
    expect(result.current.state.isRunning).toBe(false)
    expectTimerActions(result.current.actions)
  })

  it("cancels back to idle", async () => {
    const { result } = await renderHook(() => useTimerContext(), { wrapper })

    await act(() => result.current.actions.setStartingMs(5000))
    await act(() => result.current.actions.toggleTimer())
    await act(() => jest.advanceTimersByTime(1000))

    await act(() => result.current.actions.cancelTimer())

    expect(result.current.state.status).toBe("idle")
    expect(result.current.state.remainingMs).toBe(5000)
    expectTimerActions(result.current.actions)
  })

  it("keeps action identities stable across rerenders", async () => {
    const { result } = await renderHook(() => useTimerContext(), { wrapper })

    const initialActions = result.current.actions

    await act(() => result.current.actions.setStartingMs(5000))
    expect(result.current.actions).toBe(initialActions)

    await act(() => result.current.actions.toggleTimer())
    expect(result.current.actions).toBe(initialActions)
  })
})
