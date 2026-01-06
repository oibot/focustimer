import { Pressable, StyleSheet, Text, View } from "react-native"

import type { TimerStatus } from "@/hooks/useTimer"

type PomodoroTimerProps = {
  remainingMs: number
  status: TimerStatus
  onToggle: () => void
  onCancel: () => void
}

export default function PomodoroTimer({
  remainingMs,
  status,
  onToggle,
  onCancel,
}: PomodoroTimerProps) {
  const toggleLabel = status === "running" ? "Pause" : status === "paused" ? "Resume" : "Focus"
  const canCancel = status === "running"

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatMs(remainingMs)}</Text>
      <Pressable style={styles.button} onPress={onToggle}>
        <Text style={styles.buttonLabel}>{toggleLabel}</Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.cancelButton, !canCancel && styles.buttonDisabled]}
        disabled={!canCancel}
        onPress={onCancel}
      >
        <Text style={styles.buttonLabel}>Cancel</Text>
      </Pressable>
    </View>
  )
}

const formatMs = (ms: number) => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timer: {
    fontSize: 96,
    fontWeight: "700",
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
})
