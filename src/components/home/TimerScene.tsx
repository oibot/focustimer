import Timer from "@/components/home/Timer"
import useTimerScene from "@/hooks/useTimerScene"
import { View } from "react-native"

const TIMER_MODES = {
  focus: {
    startingMs: 25 * 60 * 1000,
    idleLabel: "Focus",
    nextMode: "short",
  },
  short: {
    startingMs: 5 * 60 * 1000,
    idleLabel: "Start",
    nextMode: "focus",
  },
} as const

type TimerMode = keyof typeof TIMER_MODES

const isTimerMode = (value?: string): value is TimerMode =>
  value === "focus" || value === "short"

type TimerSceneProps = {
  mode?: string
  onDone: (nextMode: string) => void
}

export default function TimerScene({ mode, onDone }: TimerSceneProps) {
  const timerMode = isTimerMode(mode) ? mode : "focus"
  const { startingMs, idleLabel, nextMode } = TIMER_MODES[timerMode]
  const { remainingMs, status, toggleTimer, cancelTimer } = useTimerScene({
    startingMs,
    onDone: () => onDone(nextMode),
  })

  return (
    <View style={{ flex: 1 }}>
      <Timer
        remainingMs={remainingMs}
        status={status}
        onToggle={toggleTimer}
        onCancel={cancelTimer}
        idleLabel={idleLabel}
      />
    </View>
  )
}
