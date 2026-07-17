import { useSettingsStore } from "@/state/settings"
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
}

describe("useSettingsStore", () => {
  beforeEach(() => {
    resetStore()
  })

  it("uses the default screen dimming settings", () => {
    expect(useSettingsStore.getState().screenDimmingEnabled).toBe(false)
    expect(useSettingsStore.getState().dimmedBrightnessPercent).toBe(
      DIMMED_BRIGHTNESS_DEFAULT_PERCENT,
    )
  })

  it("updates screen dimming settings", () => {
    useSettingsStore.getState().setScreenDimmingEnabled(true)
    useSettingsStore.getState().setDimmedBrightnessPercent(8)

    expect(useSettingsStore.getState().screenDimmingEnabled).toBe(true)
    expect(useSettingsStore.getState().dimmedBrightnessPercent).toBe(8)
  })

  it("resets the dimmed brightness value when dimming is disabled", () => {
    useSettingsStore.getState().setScreenDimmingEnabled(true)
    useSettingsStore.getState().setDimmedBrightnessPercent(12)

    useSettingsStore.getState().setScreenDimmingEnabled(false)

    expect(useSettingsStore.getState().screenDimmingEnabled).toBe(false)
    expect(useSettingsStore.getState().dimmedBrightnessPercent).toBe(
      DIMMED_BRIGHTNESS_DEFAULT_PERCENT,
    )
  })
})
