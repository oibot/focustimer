import { useStore } from "@/state/store"
import {
  applyE2ESetupParams,
  durationMsToStoreMinutes,
  isE2ESetupEnabled,
} from "@/utils/e2eSetup"
import { DIMMED_BRIGHTNESS_DEFAULT_PERCENT } from "@/utils/screenDimming"

const resetStore = () => {
  useStore.setState({
    breakTimeMinutes: 5,
    completionSound: "cheering",
    dimmedBrightnessPercent: DIMMED_BRIGHTNESS_DEFAULT_PERCENT,
    focusTimeMinutes: 25,
    liveActivitiesEnabled: true,
    keepScreenAwake: true,
    screenDimmingEnabled: false,
  })
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
    applyE2ESetupParams({
      breakDurationMs: "2000",
      completionSound: "off",
      focusDurationMs: "1500",
    })

    expect(useStore.getState().focusTimeMinutes).toBe(0.025)
    expect(useStore.getState().breakTimeMinutes).toBe(2 / 60)
    expect(useStore.getState().completionSound).toBe("off")
  })

  it("ignores invalid setup values", () => {
    applyE2ESetupParams({
      breakDurationMs: "too-short",
      completionSound: "invalid",
      focusDurationMs: "250",
    })

    expect(useStore.getState().focusTimeMinutes).toBe(25)
    expect(useStore.getState().breakTimeMinutes).toBe(5)
    expect(useStore.getState().completionSound).toBe("cheering")
  })
})
