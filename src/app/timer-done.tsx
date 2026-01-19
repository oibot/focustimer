import TimerDoneScene from "@/components/home/TimerDoneScene"
import useTimerStore from "@/hooks/useTimerStore"
import { useLocalSearchParams, useRouter } from "expo-router"

export default function Page() {
  const router = useRouter()
  const { cancelTimer } = useTimerStore()
  const { next } = useLocalSearchParams<{ next?: string }>()
  const nextMode = next === "short" ? next : "focus"

  const handleStart = () => {
    router.dismissTo({
      pathname: "/",
      params: { mode: nextMode },
    })
  }

  const handleCancel = () => {
    cancelTimer()
    router.dismiss()
  }

  return (
    <TimerDoneScene
      nextMode={nextMode}
      onStart={handleStart}
      onCancel={handleCancel}
    />
  )
}
