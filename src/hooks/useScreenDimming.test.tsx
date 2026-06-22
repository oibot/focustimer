import {
  act,
  cleanup,
  renderHook,
  waitFor,
} from "@testing-library/react-native"
import * as Brightness from "expo-brightness"

import useScreenDimming from "@/hooks/useScreenDimming"

type RenderParams = Parameters<typeof useScreenDimming>[0]

const mockGetBrightnessAsync =
  Brightness.getBrightnessAsync as jest.MockedFunction<
    typeof Brightness.getBrightnessAsync
  >
const mockSetBrightnessAsync =
  Brightness.setBrightnessAsync as jest.MockedFunction<
    typeof Brightness.setBrightnessAsync
  >

const renderUseScreenDimming = (params: RenderParams) =>
  renderHook((hookParams: RenderParams) => useScreenDimming(hookParams), {
    initialProps: params,
  })

describe("useScreenDimming", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockGetBrightnessAsync.mockResolvedValue(0.8)
    mockSetBrightnessAsync.mockResolvedValue()
  })

  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it("does nothing when disabled", async () => {
    renderUseScreenDimming({
      enabled: false,
      dimmedBrightnessPercent: 15,
      shouldDim: true,
      delayMs: 1000,
    })

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(mockGetBrightnessAsync).not.toHaveBeenCalled()
    expect(mockSetBrightnessAsync).not.toHaveBeenCalled()
  })

  it("does nothing before the delay completes", async () => {
    renderUseScreenDimming({
      enabled: true,
      dimmedBrightnessPercent: 15,
      shouldDim: true,
      delayMs: 1000,
    })

    act(() => {
      jest.advanceTimersByTime(999)
    })

    expect(mockGetBrightnessAsync).not.toHaveBeenCalled()
    expect(mockSetBrightnessAsync).not.toHaveBeenCalled()
  })

  it("dims after the delay completes", async () => {
    renderUseScreenDimming({
      enabled: true,
      dimmedBrightnessPercent: 15,
      shouldDim: true,
      delayMs: 1000,
    })

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    await waitFor(() => {
      expect(mockGetBrightnessAsync).toHaveBeenCalledTimes(1)
      expect(mockSetBrightnessAsync).toHaveBeenCalledWith(0.15)
    })
  })

  it("keeps current brightness when it is lower than configured brightness", async () => {
    mockGetBrightnessAsync.mockResolvedValue(0.1)

    renderUseScreenDimming({
      enabled: true,
      dimmedBrightnessPercent: 15,
      shouldDim: true,
      delayMs: 1000,
    })

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    await waitFor(() => {
      expect(mockSetBrightnessAsync).toHaveBeenCalledWith(0.1)
    })
  })

  it("cancels pending dimming when it should no longer dim before the delay completes", async () => {
    const { rerender } = renderUseScreenDimming({
      enabled: true,
      dimmedBrightnessPercent: 15,
      shouldDim: true,
      delayMs: 1000,
    })

    rerender({
      enabled: true,
      dimmedBrightnessPercent: 15,
      shouldDim: false,
      delayMs: 1000,
    })

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(mockGetBrightnessAsync).not.toHaveBeenCalled()
    expect(mockSetBrightnessAsync).not.toHaveBeenCalled()
  })

  it("restores brightness when it should no longer dim after dimming", async () => {
    const { rerender } = renderUseScreenDimming({
      enabled: true,
      dimmedBrightnessPercent: 15,
      shouldDim: true,
      delayMs: 1000,
    })

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    await waitFor(() => {
      expect(mockSetBrightnessAsync).toHaveBeenCalledWith(0.15)
    })

    rerender({
      enabled: true,
      dimmedBrightnessPercent: 15,
      shouldDim: false,
      delayMs: 1000,
    })

    await waitFor(() => {
      expect(mockSetBrightnessAsync).toHaveBeenNthCalledWith(1, 0.15)
      expect(mockSetBrightnessAsync).toHaveBeenNthCalledWith(2, 0.8)
    })
  })

  it("restores brightness on unmount", async () => {
    const { unmount } = renderUseScreenDimming({
      enabled: true,
      dimmedBrightnessPercent: 15,
      shouldDim: true,
      delayMs: 1000,
    })

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    await waitFor(() => {
      expect(mockSetBrightnessAsync).toHaveBeenCalledWith(0.15)
    })

    unmount()

    await waitFor(() => {
      expect(mockSetBrightnessAsync).toHaveBeenNthCalledWith(1, 0.15)
      expect(mockSetBrightnessAsync).toHaveBeenNthCalledWith(2, 0.8)
    })
  })
})
