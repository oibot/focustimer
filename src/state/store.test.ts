import { useStore } from "@/state/store"
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

describe("useStore", () => {
  beforeEach(() => {
    resetStore()
  })

  it("uses the default screen dimming settings", () => {
    expect(useStore.getState().screenDimmingEnabled).toBe(false)
    expect(useStore.getState().dimmedBrightnessPercent).toBe(
      DIMMED_BRIGHTNESS_DEFAULT_PERCENT,
    )
  })

  it("updates screen dimming settings", () => {
    useStore.getState().setScreenDimmingEnabled(true)
    useStore.getState().setDimmedBrightnessPercent(8)

    expect(useStore.getState().screenDimmingEnabled).toBe(true)
    expect(useStore.getState().dimmedBrightnessPercent).toBe(8)
  })

  it("resets the dimmed brightness value when dimming is disabled", () => {
    useStore.getState().setScreenDimmingEnabled(true)
    useStore.getState().setDimmedBrightnessPercent(12)

    useStore.getState().setScreenDimmingEnabled(false)

    expect(useStore.getState().screenDimmingEnabled).toBe(false)
    expect(useStore.getState().dimmedBrightnessPercent).toBe(
      DIMMED_BRIGHTNESS_DEFAULT_PERCENT,
    )
  })
})
