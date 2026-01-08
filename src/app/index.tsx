import PomodoroTimer from "@/components/home/PomodoroTimer"
import useTimer from "@/hooks/useTimer"
import { View } from "react-native"

export default function Page() {
  const { remainingMs, status, toggleTimer, cancelTimer } = useTimer({
    startingMs: 25 * 60 * 1000,
  })

  return (
    <View style={{ flex: 1 }}>
      <PomodoroTimer
        remainingMs={remainingMs}
        status={status}
        onToggle={toggleTimer}
        onCancel={cancelTimer}
      />
    </View>
  )
}
