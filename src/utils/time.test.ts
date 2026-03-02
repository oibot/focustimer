import { formatDuration, getDurationParts } from "@/utils/time"

describe("time utils", () => {
  it("returns minutes and seconds for a duration", () => {
    expect(getDurationParts(10 * 60 * 1000 + 30 * 1000)).toEqual({
      minutes: 10,
      seconds: 30,
    })
  })

  it("rounds partial seconds up", () => {
    expect(getDurationParts(1)).toEqual({
      minutes: 0,
      seconds: 1,
    })
  })

  it("clamps negative durations to zero", () => {
    expect(getDurationParts(-1000)).toEqual({
      minutes: 0,
      seconds: 0,
    })
  })

  it("formats durations as mm:ss", () => {
    expect(formatDuration(10 * 60 * 1000 + 30 * 1000)).toBe("10:30")
  })
})
