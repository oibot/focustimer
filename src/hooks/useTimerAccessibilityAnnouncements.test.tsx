import { i18n } from "@lingui/core"
import { I18nProvider } from "@lingui/react"
import { renderHook } from "@testing-library/react-native"
import type { ReactNode } from "react"
import { AccessibilityInfo } from "react-native"

import useTimerAccessibilityAnnouncements from "@/hooks/useTimerAccessibilityAnnouncements"
import { messages as enMessages } from "@/locales/en/messages"
import type { TimerStatus } from "@/types/timer"

type HookProps = {
  enabled: boolean
  remainingMs: number
  status: TimerStatus
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <I18nProvider i18n={i18n}>{children}</I18nProvider>
)

describe("useTimerAccessibilityAnnouncements", () => {
  const announceForAccessibility = jest.fn()
  const announceForAccessibilityWithOptions = jest.fn()

  beforeAll(() => {
    i18n.load({ en: enMessages })
    i18n.activate("en")
  })

  beforeEach(() => {
    announceForAccessibility.mockReset()
    announceForAccessibilityWithOptions.mockReset()
    jest
      .spyOn(AccessibilityInfo, "announceForAccessibility")
      .mockImplementation(announceForAccessibility)
    ;(
      AccessibilityInfo as typeof AccessibilityInfo & {
        announceForAccessibilityWithOptions?: typeof announceForAccessibilityWithOptions
      }
    ).announceForAccessibilityWithOptions = announceForAccessibilityWithOptions
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("does not announce when the timer starts", () => {
    const { rerender } = renderHook(
      (props: HookProps) => useTimerAccessibilityAnnouncements(props),
      {
        initialProps: {
          enabled: true,
          remainingMs: 25 * 60 * 1000,
          status: "idle",
        },
        wrapper,
      },
    )

    rerender({
      enabled: true,
      remainingMs: 25 * 60 * 1000,
      status: "running",
    })

    expect(announceForAccessibility).not.toHaveBeenCalled()
    expect(announceForAccessibilityWithOptions).not.toHaveBeenCalled()
  })

  it("announces each five-minute milestone above the final five minutes", () => {
    const { rerender } = renderHook(
      (props: HookProps) => useTimerAccessibilityAnnouncements(props),
      {
        initialProps: {
          enabled: true,
          remainingMs: 20 * 60 * 1000 + 1000,
          status: "running",
        },
        wrapper,
      },
    )

    rerender({
      enabled: true,
      remainingMs: 20 * 60 * 1000,
      status: "running",
    })

    expect(announceForAccessibilityWithOptions).toHaveBeenCalledWith(
      "20 minutes remaining",
      { queue: true },
    )
  })

  it("announces each minute inside the final five minutes", () => {
    const { rerender } = renderHook(
      (props: HookProps) => useTimerAccessibilityAnnouncements(props),
      {
        initialProps: {
          enabled: true,
          remainingMs: 5 * 60 * 1000 + 1000,
          status: "running",
        },
        wrapper,
      },
    )

    rerender({
      enabled: true,
      remainingMs: 5 * 60 * 1000,
      status: "running",
    })
    rerender({
      enabled: true,
      remainingMs: 4 * 60 * 1000 + 1000,
      status: "running",
    })
    rerender({
      enabled: true,
      remainingMs: 4 * 60 * 1000,
      status: "running",
    })

    expect(announceForAccessibilityWithOptions).toHaveBeenNthCalledWith(
      1,
      "5 minutes remaining",
      { queue: true },
    )
    expect(announceForAccessibilityWithOptions).toHaveBeenNthCalledWith(
      2,
      "4 minutes remaining",
      { queue: true },
    )
  })

  it("does not announce on non-milestone ticks", () => {
    const { rerender } = renderHook(
      (props: HookProps) => useTimerAccessibilityAnnouncements(props),
      {
        initialProps: {
          enabled: true,
          remainingMs: 20 * 60 * 1000 + 59 * 1000,
          status: "running",
        },
        wrapper,
      },
    )

    rerender({
      enabled: true,
      remainingMs: 20 * 60 * 1000 + 58 * 1000,
      status: "running",
    })

    expect(announceForAccessibilityWithOptions).not.toHaveBeenCalled()
  })

  it("does not announce when resuming from pause", () => {
    const { rerender } = renderHook(
      (props: HookProps) => useTimerAccessibilityAnnouncements(props),
      {
        initialProps: {
          enabled: true,
          remainingMs: 14 * 60 * 1000 + 30 * 1000,
          status: "paused",
        },
        wrapper,
      },
    )

    rerender({
      enabled: true,
      remainingMs: 14 * 60 * 1000 + 30 * 1000,
      status: "running",
    })

    expect(announceForAccessibilityWithOptions).not.toHaveBeenCalled()
  })

  it("does not announce when the screen reader is off", () => {
    const { rerender } = renderHook(
      (props: HookProps) => useTimerAccessibilityAnnouncements(props),
      {
        initialProps: {
          enabled: false,
          remainingMs: 25 * 60 * 1000,
          status: "idle",
        },
        wrapper,
      },
    )

    rerender({
      enabled: false,
      remainingMs: 25 * 60 * 1000,
      status: "running",
    })

    expect(announceForAccessibilityWithOptions).not.toHaveBeenCalled()
    expect(announceForAccessibility).not.toHaveBeenCalled()
  })
})
