import Timer from "@/components/home/Timer"
import useTimer from "@/hooks/useTimer"
import { useRouter } from "expo-router"
import { useEffect, useRef } from "react"
import { View } from "react-native"

export default function Page() {
  const router = useRouter()
  const hasShownDoneRef = useRef(false)
  const { remainingMs, status, toggleTimer, cancelTimer } = useTimer({
    startingMs: 25 * 60 * 1000,
  })

  useEffect(() => {
    if (status === "done" && !hasShownDoneRef.current) {
      hasShownDoneRef.current = true
      router.push("/focus-done")
      return
    }
    if (status !== "done") {
      hasShownDoneRef.current = false
    }
  }, [router, status])

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
