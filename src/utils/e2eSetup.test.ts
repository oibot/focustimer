import { getLocalDateKey, useSessionHistoryStore } from "@/state/sessionHistory"
import { useSettingsStore } from "@/state/settings"
import {
  applyE2ESetupParams,
  durationMsToStoreMinutes,
  isE2ESetupEnabled,
} from "@/utils/e2eSetup"
import { DIMMED_BRIGHTNESS_DEFAULT_PERCENT } from "@/utils/screenDimming"

const resetStore = () => {
  useSettingsStore.setState({
    breakTimeMinutes: 5,
    completionSound: "cheering",
    dimmedBrightnessPercent: DIMMED_BRIGHTNESS_DEFAULT_PERCENT,
    focusTimeMinutes: 25,
    liveActivitiesEnabled: true,
    keepScreenAwake: true,
    screenDimmingEnabled: false,
  })
  useSessionHistoryStore.setState({ completedFocusSessions: [] })
}

describe("e2eSetup", () => {
  beforeEach(() => {
    resetStore()
  })

  it("is enabled only for the test app variant", () => {
    expect(isE2ESetupEnabled("test")).toBe(true)
    expect(isE2ESetupEnabled("dev")).toBe(false)
    expect(isE2ESetupEnabled("production")).toBe(false)
  })

  it("converts milliseconds to store minutes", () => {
    expect(durationMsToStoreMinutes(1500)).toBe(0.025)
  })

  it("applies valid timer durations and completion sound", () => {
    applyE2ESetupParams(
      {
        breakDurationMs: "2000",
        completionSound: "off",
        focusDurationMs: "1500",
      },
      { appVariant: "test" },
    )

    expect(useSettingsStore.getState().focusTimeMinutes).toBe(0.025)
    expect(useSettingsStore.getState().breakTimeMinutes).toBe(2 / 60)
    expect(useSettingsStore.getState().completionSound).toBe("off")
  })

  it("ignores invalid setup values", () => {
    applyE2ESetupParams(
      {
        breakDurationMs: "too-short",
        completionSound: "invalid",
        focusDurationMs: "250",
        sessionHistoryFixture: "unknown",
      },
      { appVariant: "test" },
    )

    expect(useSettingsStore.getState().focusTimeMinutes).toBe(25)
    expect(useSettingsStore.getState().breakTimeMinutes).toBe(5)
    expect(useSettingsStore.getState().completionSound).toBe("cheering")
    expect(useSessionHistoryStore.getState().completedFocusSessions).toEqual([])
  })

  it("seeds deterministic previous-day session history idempotently", () => {
    const now = new Date(2026, 6, 17, 18)
    const options = { appVariant: "test", now }
    const params = { sessionHistoryFixture: "previous-days" }

    applyE2ESetupParams(params, options)

    const firstSeed = useSessionHistoryStore.getState().completedFocusSessions

    expect(firstSeed).toEqual([
      {
        id: "e2e-two-days-ago",
        completedAt: expect.any(String),
        durationMs: 25 * 60 * 1000,
      },
      {
        id: "e2e-yesterday",
        completedAt: expect.any(String),
        durationMs: 15 * 60 * 1000,
      },
    ])
    expect(getLocalDateKey(new Date(firstSeed[0].completedAt))).toBe(
      "2026-07-15",
    )
    expect(getLocalDateKey(new Date(firstSeed[1].completedAt))).toBe(
      "2026-07-16",
    )

    applyE2ESetupParams(params, options)

    expect(useSessionHistoryStore.getState().completedFocusSessions).toEqual(
      firstSeed,
    )
  })

  it.each(["dev", "production"])(
    "does not apply setup parameters to the %s app variant",
    (appVariant) => {
      applyE2ESetupParams(
        {
          completionSound: "off",
          focusDurationMs: "1500",
          sessionHistoryFixture: "previous-days",
        },
        { appVariant, now: new Date(2026, 6, 17, 18) },
      )

      expect(useSettingsStore.getState().focusTimeMinutes).toBe(25)
      expect(useSettingsStore.getState().completionSound).toBe("cheering")
      expect(useSessionHistoryStore.getState().completedFocusSessions).toEqual(
        [],
      )
    },
  )
})
