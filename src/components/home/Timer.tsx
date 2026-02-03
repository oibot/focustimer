import { Text, View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { DestructiveButton, IconPrimaryButton } from "@/components/UI/Button"
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
  const toggleSymbol = status === "running" ? "pause.fill" : "play.fill"

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
        <IconPrimaryButton
          label={toggleLabel}
          symbolName={toggleSymbol}
          onPress={onToggle}
        />
        <DestructiveButton
          label={cancelLabel}
          disabled={!canCancel}
          onPress={onCancel}
        />
      </View>
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
  timerText: {
    fontSize: 96,
    fontWeight: "600",
    textAlign: "center",
    fontVariant: ["tabular-nums"],
    color: theme.colors.primary,
  },
  controls: {
    alignItems: "center",
    opacity: 1,
    gap: 16,
  },
  controlsHidden: {
    opacity: 0,
  },
}))
