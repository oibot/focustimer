import Timer from "@/components/home/Timer"
import useBackgroundTimerNotifications from "@/hooks/useBackgroundTimerNotifications"
import useTimerScene from "@/hooks/useTimerScene"
import { useKeepAwake } from "expo-keep-awake"
import { View } from "react-native"
import { useAudioPlayer } from "expo-audio"

const TIMER_MODES = {
  focus: {
    startingMs: 3000, //25 * 60 * 1000,
    idleLabel: "Focus",
    nextMode: "short",
  },
  short: {
    startingMs: 2000, //5 * 60 * 1000,
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

function KeepAwakeWhileRunning() {
  useKeepAwake()
  return null
}

export default function TimerScene({ mode, onDone }: TimerSceneProps) {
  const player = useAudioPlayer(require("../../../assets/sounds/focus-end.mp3"))
  const timerMode = isTimerMode(mode) ? mode : "focus"
  const { startingMs, idleLabel, nextMode } = TIMER_MODES[timerMode]
  const { remainingMs, status, toggleTimer, cancelTimer, finishTimer } =
    useTimerScene({
      startingMs,
      onDone: () => {
        player.seekTo(0)
        player.play()
        onDone(nextMode)
      },
    })

  useBackgroundTimerNotifications({ status, remainingMs })

  const handleCancel = () => {
    switch (timerMode) {
      case "short":
        finishTimer()
        break
      default:
        cancelTimer()
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {status === "running" ? <KeepAwakeWhileRunning /> : null}
      <Timer
        remainingMs={remainingMs}
        status={status}
        onToggle={toggleTimer}
        onCancel={handleCancel}
        idleLabel={idleLabel}
        cancelLabel={timerMode === "short" ? "Stop" : "Cancel"}
      />
    </View>
  )
}
