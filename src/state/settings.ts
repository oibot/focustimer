import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { CompletionSound } from "@/sounds"
import { zustandStorage } from "@/state/storage"
import { DIMMED_BRIGHTNESS_DEFAULT_PERCENT } from "@/utils/screenDimming"

type SettingsState = {
  breakTimeMinutes: number
  completionSound: CompletionSound
  dimmedBrightnessPercent: number
  focusTimeMinutes: number
  liveActivitiesEnabled: boolean
  keepScreenAwake: boolean
  screenDimmingEnabled: boolean
  setBreakTimeMinutes: (nextValue: number) => void
  setCompletionSound: (nextValue: CompletionSound) => void
  setDimmedBrightnessPercent: (nextValue: number) => void
  setFocusTimeMinutes: (nextValue: number) => void
  setLiveActivitiesEnabled: (nextValue: boolean) => void
  setKeepScreenAwake: (nextValue: boolean) => void
  setScreenDimmingEnabled: (nextValue: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      breakTimeMinutes: 5,
      completionSound: "cheering",
      dimmedBrightnessPercent: DIMMED_BRIGHTNESS_DEFAULT_PERCENT,
      focusTimeMinutes: 25,
      liveActivitiesEnabled: true,
      keepScreenAwake: true,
      screenDimmingEnabled: false,
      setBreakTimeMinutes: (nextValue) => {
        set({ breakTimeMinutes: nextValue })
      },
      setCompletionSound: (nextValue) => {
        set({ completionSound: nextValue })
      },
      setDimmedBrightnessPercent: (nextValue) => {
        set({ dimmedBrightnessPercent: nextValue })
      },
      setFocusTimeMinutes: (nextValue) => {
        set({ focusTimeMinutes: nextValue })
      },
      setLiveActivitiesEnabled: (nextValue) => {
        set({ liveActivitiesEnabled: nextValue })
      },
      setKeepScreenAwake: (nextValue) => {
        set({ keepScreenAwake: nextValue })
      },
      setScreenDimmingEnabled: (nextValue) => {
        set({
          screenDimmingEnabled: nextValue,
          ...(nextValue
            ? {}
            : { dimmedBrightnessPercent: DIMMED_BRIGHTNESS_DEFAULT_PERCENT }),
        })
      },
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
)
