import { useLocalSearchParams, useRouter } from "expo-router"

import TimerDoneScene from "@/components/home/TimerDoneScene"

export default function Page() {
  const router = useRouter()
  const { next } = useLocalSearchParams<{ next?: string }>()
  const nextMode = next === "short" ? next : "focus"
  const currentMode = nextMode === "focus" ? "short" : "focus"

  const handleStart = () => {
    router.dismissTo({
      pathname: "/",
      params: { mode: nextMode },
    })
  }

  const handleCancel = () => {
    router.dismissTo({
      pathname: "/",
      params: { mode: currentMode },
    })
  }

  return (
    <TimerDoneScene
      nextMode={nextMode}
      onStart={handleStart}
      onCancel={handleCancel}
    />
  )
}
