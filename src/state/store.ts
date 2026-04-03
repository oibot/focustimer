import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist, StateStorage } from "zustand/middleware"

const storage = createMMKV()

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    storage.set(name, value)
  },
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => {
    storage.remove(name)
  },
}

type StoreState = {
  breakTimeMinutes: number
  focusTimeMinutes: number
  liveActivitiesEnabled: boolean
  keepScreenAwake: boolean
  setBreakTimeMinutes: (nextValue: number) => void
  setFocusTimeMinutes: (nextValue: number) => void
  setLiveActivitiesEnabled: (nextValue: boolean) => void
  setKeepScreenAwake: (nextValue: boolean) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      breakTimeMinutes: 5,
      focusTimeMinutes: 25,
      liveActivitiesEnabled: true,
      keepScreenAwake: true,
      setBreakTimeMinutes: (nextValue) => {
        set({ breakTimeMinutes: nextValue })
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
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
)
