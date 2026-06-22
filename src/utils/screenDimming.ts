export const DIMMED_BRIGHTNESS_MIN_PERCENT = 5
export const DIMMED_BRIGHTNESS_MAX_PERCENT = 20
export const DIMMED_BRIGHTNESS_DEFAULT_PERCENT = 15
export const SCREEN_DIMMING_DELAY_MS = 5000

export function getDimmedBrightnessTarget(
  currentBrightness: number,
  dimmedBrightnessPercent: number,
) {
  return Math.min(currentBrightness, dimmedBrightnessPercent / 100)
}
