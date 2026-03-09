import { useLingui } from "@lingui/react/macro"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"

import TimerScene from "@/components/home/TimerScene"
import { useTimer } from "@/hooks/useTimer"
import { isTimerMode } from "@/types/timer"

export default function Page() {
  const { t } = useLingui()
  const router = useRouter()
  const { status } = useTimer()
  const { mode } = useLocalSearchParams<{ mode?: string }>()
  const modeParam = typeof mode === "string" ? mode : undefined
  const timerMode = isTimerMode(modeParam) ? modeParam : "focus"
  const nextMode = timerMode === "focus" ? "short" : "focus"
  const nextModeLabel = nextMode === "focus" ? t`Focus` : t`Break`
  const isModeSwitchDisabled = status !== "idle"

  const handleDone = (nextMode: string) =>
    router.push({
      pathname: "/timer-done",
      params: { next: nextMode },
    })

  const handleModeChange = (nextMode: string) => {
    router.setParams({ mode: nextMode })
  }

  return (
    <>
      <TimerScene
        key={modeParam ?? "focus"}
        mode={modeParam}
        onDone={handleDone}
        onModeChange={handleModeChange}
      />
      <Stack.Toolbar>
        <Stack.Toolbar.Spacer />
        <Stack.Toolbar.Button
          icon="arrow.left.arrow.right"
          accessibilityLabel={
            isModeSwitchDisabled
              ? t`Switch mode unavailable while the timer is active`
              : nextMode === "focus"
                ? t`Switch to focus mode`
                : t`Switch to break mode`
          }
          accessibilityHint={
            isModeSwitchDisabled
              ? t`Reset the timer before changing the mode`
              : t`Changes the timer mode`
          }
          disabled={isModeSwitchDisabled}
          onPress={() => handleModeChange(nextMode)}
        >
          {nextModeLabel}
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
    </>
  )
}
