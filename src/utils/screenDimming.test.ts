import { getDimmedBrightnessTarget } from "@/utils/screenDimming"

describe("getDimmedBrightnessTarget", () => {
  it("uses the configured brightness when current brightness is higher", () => {
    expect(getDimmedBrightnessTarget(0.8, 15)).toBe(0.15)
  })

  it("keeps the current brightness when it is lower than configured brightness", () => {
    expect(getDimmedBrightnessTarget(0.1, 15)).toBe(0.1)
  })

  it("keeps the current brightness when it equals configured brightness", () => {
    expect(getDimmedBrightnessTarget(0.2, 20)).toBe(0.2)
  })

  it("uses the configured brightness when current brightness is slightly higher", () => {
    expect(getDimmedBrightnessTarget(0.21, 20)).toBe(0.2)
  })
})
