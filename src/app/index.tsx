import HomeTimer from "@/components/home/HomeTimer"
import useTimer from "@/hooks/useTimer"

export default function Page() {
  const { isRunning, remainingMs, toggleTimer, cancelTimer } = useTimer({
    startingMs: 25 * 60 * 1000,
  })

  return (
    <HomeTimer
      isRunning={isRunning}
      remainingMs={remainingMs}
      onToggle={toggleTimer}
      onCancel={cancelTimer}
    />
  )
}
