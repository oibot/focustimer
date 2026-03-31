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
  keepScreenAwake: boolean
  setKeepScreenAwake: (nextValue: boolean) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      keepScreenAwake: true,
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
