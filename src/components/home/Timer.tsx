import { Text, View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { DestructiveButton, PrimaryButton } from "@/components/UI/Button"
import { formatDuration } from "@/utils/time"
import type { TimerStatus } from "@/types/timer"

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

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatDuration(remainingMs)}</Text>
      </View>
      <View
        testID="timer-controls"
        style={[styles.controls, !showControls && styles.controlsHidden]}
        pointerEvents={showControls ? "auto" : "none"}
      >
        <View style={styles.buttons}>
          <PrimaryButton label={toggleLabel} onPress={onToggle} />
          <DestructiveButton
            label={cancelLabel}
            disabled={!canCancel}
            onPress={onCancel}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 96,
    fontWeight: "600",
    textAlign: "center",
    fontVariant: ["tabular-nums"],
    color: theme.colors.primary,
  },
  controls: {
    marginTop: 40,
    alignItems: "center",
    opacity: 1,
  },
  controlsHidden: {
    opacity: 0,
  },
  buttons: {
    gap: 12,
  },
}))
