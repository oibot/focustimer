import TimerNumericText from "@/components/home/TimerNumericText"
import { DestructiveButton } from "@/components/UI/Button"
import IconPrimaryButton from "@/components/UI/IconPrimaryButton"
import useTimerControlsAnimation from "@/hooks/useTimerControlsAnimation"
import type { TimerStatus } from "@/types/timer"
import { formatDuration } from "@/utils/time"
import { Animated, View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

type TimerProps = {
  remainingMs: number
  status: TimerStatus
  onToggle: () => void
  onCancel: () => void
  idleLabel?: string
  cancelLabel?: string
  canCancel?: boolean
  showControls?: boolean
}

export default function Timer({
  remainingMs,
  status,
  onToggle,
  onCancel,
  idleLabel = "Start",
  cancelLabel = "Cancel",
  canCancel = status === "running",
  showControls = true,
}: TimerProps) {
  const toggleLabel =
    status === "running" ? "Pause" : status === "paused" ? "Resume" : idleLabel
  const toggleSymbol = status === "running" ? "pause.fill" : "play.fill"
  const showCancel = status === "running"
  const { opacity: controlsOpacity, translateY: controlsTranslateY } =
    useTimerControlsAnimation({ visible: showControls })

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.timerContainer}>
        <TimerNumericText value={formatDuration(remainingMs)} countsDown />
      </View>
      <Animated.View
        testID="timer-controls"
        style={[
          styles.controls,
          {
            opacity: controlsOpacity,
            transform: [{ translateY: controlsTranslateY }],
          },
        ]}
        pointerEvents={showControls ? "auto" : "none"}
      >
        <IconPrimaryButton
          label={toggleLabel}
          symbolName={toggleSymbol}
          onPress={onToggle}
        />
        <DestructiveButton
          label={cancelLabel}
          disabled={!canCancel || !showCancel}
          onPress={onCancel}
          style={!showCancel && styles.cancelHidden}
          pointerEvents={showCancel ? "auto" : "none"}
          accessibilityElementsHidden={!showCancel}
          importantForAccessibility={
            showCancel ? "auto" : "no-hide-descendants"
          }
        />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
    gap: 20,
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  controls: {
    alignItems: "center",
    opacity: 1,
    gap: 16,
  },
  cancelHidden: {
    opacity: 0,
  },
}))
