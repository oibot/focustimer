import PomodoroTimer from "@/components/home/PomodoroTimer"
import useTimer from "@/hooks/useTimer"

export default function Page() {
  const { isRunning, remainingMs, toggleTimer, cancelTimer } = useTimer({
    startingMs: 25 * 60 * 1000,
  })

  return (
    <PomodoroTimer
      isRunning={isRunning}
      remainingMs={remainingMs}
      onToggle={toggleTimer}
      onCancel={cancelTimer}
    />
  )
}
