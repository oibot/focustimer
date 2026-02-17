import { act, render, waitFor } from "@testing-library/react-native"
import { AccessibilityInfo, Text } from "react-native"

import useScreenReaderEnabled from "@/hooks/useScreenReaderEnabled"

function Harness() {
  const enabled = useScreenReaderEnabled()
  return <Text>{enabled ? "enabled" : "disabled"}</Text>
}

describe("useScreenReaderEnabled", () => {
  let listener: ((enabled: boolean) => void) | undefined
  const remove = jest.fn()

  beforeEach(() => {
    listener = undefined
    remove.mockClear()
    jest
      .spyOn(AccessibilityInfo, "isScreenReaderEnabled")
      .mockResolvedValue(false)
    jest
      .spyOn(AccessibilityInfo as any, "addEventListener")
      .mockImplementation((_event: any, handler: any) => {
        listener = handler as (enabled: boolean) => void
        return { remove } as any
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
      listener?.(true)
    })

    await waitFor(() => {
      expect(getByText("enabled")).toBeTruthy()
    })
  })

  it("removes the subscription on unmount", () => {
    const { unmount } = render(<Harness />)

    unmount()

    expect(remove).toHaveBeenCalledTimes(1)
  })
})
