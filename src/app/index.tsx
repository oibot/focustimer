import TimerScene from "@/components/home/TimerScene"
import { useLocalSearchParams, useRouter } from "expo-router"
import { areActivitiesEnabled } from "local:live-activities-controller"

export default function Page() {
  const router = useRouter()
  const { mode } = useLocalSearchParams<{ mode?: string }>()
  const modeParam = typeof mode === "string" ? mode : undefined

  console.log("Are activities enabled?", areActivitiesEnabled())

  const handleDone = (nextMode: string) =>
    router.push({
      pathname: "/timer-done",
      params: { next: nextMode },
    })

  const handleModeChange = (nextMode: string) => {
    router.setParams({ mode: nextMode })
  }

  return (
    <TimerScene
      key={modeParam ?? "focus"}
      mode={modeParam}
      onDone={handleDone}
      onModeChange={handleModeChange}
    />
  )
}
