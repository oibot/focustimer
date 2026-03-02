import { act, render, waitFor } from "@testing-library/react-native"
import { AccessibilityInfo, AppState, Text } from "react-native"

import useScreenReaderEnabled from "@/hooks/useScreenReaderEnabled"

function Harness() {
  const enabled = useScreenReaderEnabled()
  return <Text>{enabled ? "enabled" : "disabled"}</Text>
}

describe("useScreenReaderEnabled", () => {
  let accessibilityListener: ((enabled: boolean) => void) | undefined
  let appStateListener: ((state: string) => void) | undefined
  const removeAccessibility = jest.fn()
  const removeAppState = jest.fn()

  beforeEach(() => {
    accessibilityListener = undefined
    appStateListener = undefined
    removeAccessibility.mockClear()
    removeAppState.mockClear()
    jest
      .spyOn(AccessibilityInfo, "isScreenReaderEnabled")
      .mockResolvedValue(false)
    jest
      .spyOn(AccessibilityInfo as any, "addEventListener")
      .mockImplementation((_event: any, handler: any) => {
        accessibilityListener = handler as (enabled: boolean) => void
        return { remove: removeAccessibility } as any
      })
    jest
      .spyOn(AppState, "addEventListener")
      .mockImplementation((_event, handler) => {
        appStateListener = handler as (state: string) => void
        return { remove: removeAppState } as any
      })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("reads the initial screen reader state", async () => {
    ;(
      AccessibilityInfo.isScreenReaderEnabled as jest.MockedFunction<
        typeof AccessibilityInfo.isScreenReaderEnabled
      >
    ).mockResolvedValue(true)

    const { getByText } = render(<Harness />)

    await waitFor(() => {
      expect(getByText("enabled")).toBeTruthy()
    })
  })

  it("updates when the screen reader state changes", async () => {
    const { getByText } = render(<Harness />)

    await waitFor(() => {
      expect(getByText("disabled")).toBeTruthy()
    })

    act(() => {
      accessibilityListener?.(true)
    })

    await waitFor(() => {
      expect(getByText("enabled")).toBeTruthy()
    })
  })

  it("refreshes when the app becomes active", async () => {
    const isScreenReaderEnabled =
      AccessibilityInfo.isScreenReaderEnabled as jest.MockedFunction<
        typeof AccessibilityInfo.isScreenReaderEnabled
      >

    const { getByText } = render(<Harness />)

    await waitFor(() => {
      expect(getByText("disabled")).toBeTruthy()
    })

    isScreenReaderEnabled.mockResolvedValue(true)

    await act(async () => {
      appStateListener?.("active")
    })

    await waitFor(() => {
      expect(getByText("enabled")).toBeTruthy()
    })
  })

  it("removes the subscription on unmount", () => {
    const { unmount } = render(<Harness />)

    unmount()

    expect(removeAccessibility).toHaveBeenCalledTimes(1)
    expect(removeAppState).toHaveBeenCalledTimes(1)
  })
})
