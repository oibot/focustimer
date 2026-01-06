import PomodoroTimer from "@/components/home/PomodoroTimer"
import useTimer from "@/hooks/useTimer"

export default function Page() {
  const { remainingMs, status, toggleTimer, cancelTimer } = useTimer({
    startingMs: 25 * 60 * 1000,
  })

  return (
    <PomodoroTimer
      remainingMs={remainingMs}
      status={status}
      onToggle={toggleTimer}
      onCancel={cancelTimer}
    />
  )
}
