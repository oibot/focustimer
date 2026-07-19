import {
  getSessionDurationFillStep,
  SESSION_DURATION_FILL_STEPS,
} from "@/utils/session-duration"

const minutesToMs = (minutes: number) => minutes * 60 * 1000

describe("session duration fill", () => {
  it.each([
    [5, 1],
    [10, 2],
    [15, 3],
    [20, 4],
    [25, 5],
    [30, 6],
    [35, 7],
    [40, 8],
    [45, 9],
    [50, 10],
    [55, 11],
    [60, 12],
  ])("maps %i minutes to fill step %i", (minutes, expectedStep) => {
    expect(getSessionDurationFillStep(minutesToMs(minutes))).toBe(expectedStep)
  })

  it("rounds durations to the nearest five-minute step", () => {
    expect(getSessionDurationFillStep(minutesToMs(12))).toBe(2)
    expect(getSessionDurationFillStep(minutesToMs(13))).toBe(3)
  })

  it("caps sessions longer than 60 minutes at a full circle", () => {
    expect(getSessionDurationFillStep(minutesToMs(90))).toBe(
      SESSION_DURATION_FILL_STEPS,
    )
  })

  it("does not fill the circle for invalid durations", () => {
    expect(getSessionDurationFillStep(0)).toBe(0)
    expect(getSessionDurationFillStep(-1)).toBe(0)
    expect(getSessionDurationFillStep(Number.NaN)).toBe(0)
  })
})
