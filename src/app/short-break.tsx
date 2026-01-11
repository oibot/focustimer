import Timer from "@/components/home/Timer"
import useTimerScene from "@/hooks/useTimerScene"
import { useRouter } from "expo-router"
import { View } from "react-native"

export default function Page() {
  const router = useRouter()
  const { remainingMs, status, toggleTimer, cancelTimer } = useTimerScene({
    startingMs: 5 * 60 * 1000,
    onDone: () => router.push("focus-done"),
  })

  return (
    <View style={{ flex: 1 }}>
      <Timer
        remainingMs={remainingMs}
        status={status}
        onToggle={toggleTimer}
        onCancel={cancelTimer}
      />
    </View>
  )
}
