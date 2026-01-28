import { act, renderHook, waitFor } from "@testing-library/react-native"
import { Gesture } from "react-native-gesture-handler"

import useTimerControls from "@/hooks/useTimerControls"
import type { TimerStatus } from "@/types/timer"

jest.mock("react-native-gesture-handler", () => ({
  Gesture: {
    Tap: jest.fn(),
  },
}))

const mockTap = jest.mocked(Gesture.Tap)

let onStartHandler: (() => void) | null = null

const setupGestureMock = () => {
  let mockGesture: { runOnJS: jest.Mock; onStart: jest.Mock }

  mockGesture = {
    runOnJS: jest.fn(() => mockGesture),
    onStart: jest.fn((handler: () => void) => {
      onStartHandler = handler
      return mockGesture
    }),
  }

  mockTap.mockReturnValue(
    mockGesture as unknown as ReturnType<typeof Gesture.Tap>,
  )
}

describe("useTimerControls", () => {
  beforeEach(() => {
    onStartHandler = null
    setupGestureMock()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("hides controls when focus timer starts running", async () => {
    const { result } = renderHook(() =>
      useTimerControls({ status: "running", timerMode: "focus" }),
    )

    await waitFor(() => {
      expect(result.current.showControls).toBe(false)
    })
  })

  it("shows controls on tap while running", async () => {
    const { result } = renderHook(() =>
      useTimerControls({ status: "running", timerMode: "focus" }),
    )

    await waitFor(() => {
      expect(result.current.showControls).toBe(false)
    })

    act(() => {
      onStartHandler?.()
    })

    await waitFor(() => {
      expect(result.current.showControls).toBe(true)
    })
  })

  it("keeps controls visible in short mode", async () => {
    const { result } = renderHook(() =>
      useTimerControls({ status: "running", timerMode: "short" }),
    )

    await waitFor(() => {
      expect(result.current.showControls).toBe(true)
    })

    act(() => {
      onStartHandler?.()
    })

    await waitFor(() => {
      expect(result.current.showControls).toBe(true)
    })
  })

  it("shows controls when focus timer pauses", async () => {
    const { result, rerender } = renderHook(
      ({ status }: { status: TimerStatus }) =>
        useTimerControls({ status, timerMode: "focus" }),
      { initialProps: { status: "running" } },
    )

    await waitFor(() => {
      expect(result.current.showControls).toBe(false)
    })

    rerender({ status: "paused" })

    await waitFor(() => {
      expect(result.current.showControls).toBe(true)
    })
  })
})
