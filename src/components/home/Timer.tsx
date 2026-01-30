import { Pressable, Text, View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

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
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatDuration(remainingMs)}</Text>
      {showControls ? (
        <View style={styles.controls}>
          <Pressable style={styles.button} onPress={onToggle}>
            <Text style={styles.buttonLabel}>{toggleLabel}</Text>
          </Pressable>
          <Pressable
            style={[
              styles.button,
              styles.cancelButton,
              !canCancel && styles.buttonDisabled,
            ]}
            disabled={!canCancel}
            onPress={onCancel}
          >
            <Text style={styles.buttonLabel}>{cancelLabel}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create( (theme) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  timerText: {
    fontSize: 96,
    fontWeight: "700",
    textAlign: "center",
    fontVariant: ["tabular-nums"],
    color: theme.colors.primary,
  },
  controls: {
    alignItems: "center",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderColor: "black",
    borderWidth: 2,
  },
  cancelButton: {
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  }))
