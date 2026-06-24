import { useKeepAwake } from "expo-keep-awake"
import type { ComponentProps } from "react"
import { Text, View } from "react-native"
import { GestureDetector } from "react-native-gesture-handler"
import { StyleSheet } from "react-native-unistyles"

import Timer from "@/components/home/Timer"
import type { TimerMode, TimerStatus } from "@/types/timer"

type Gesture = ComponentProps<typeof GestureDetector>["gesture"]

type TimerViewProps = {
  activeEdge: "left" | "right" | null
  animateDigits: boolean
  breakLabel: string
  canCancel: boolean
  cancelLabel: string
  edgeSwipeGesture: Gesture
  focusLabel: string
  isScreenReaderEnabled: boolean
  keepScreenAwake: boolean
  onCancel: () => void
  onToggle: () => void
  remainingMs: number
  showControls: boolean
  status: TimerStatus
  tapGesture: Gesture
  timerMode: TimerMode
  usePlainTime: boolean
}

function KeepAwakeWhileRunning() {
  useKeepAwake()
  return null
}

export default function TimerView({
  activeEdge,
  animateDigits,
  breakLabel,
  canCancel,
  cancelLabel,
  edgeSwipeGesture,
  focusLabel,
  isScreenReaderEnabled,
  keepScreenAwake,
  onCancel,
  onToggle,
  remainingMs,
  showControls,
  status,
  tapGesture,
  timerMode,
  usePlainTime,
}: TimerViewProps) {
  const title = timerMode === "focus" ? focusLabel : breakLabel
  const showsTapGesture = status === "running"

  return (
    <View style={styles.container}>
      {showsTapGesture ? (
        <GestureDetector gesture={tapGesture}>
          <View
            testID="timer-tap-gesture-background"
            style={styles.background}
          />
        </GestureDetector>
      ) : null}
      {activeEdge ? (
        <GestureDetector gesture={edgeSwipeGesture}>
          <View
            testID={
              activeEdge === "left"
                ? "timer-edge-swipe-left"
                : "timer-edge-swipe-right"
            }
            style={[
              styles.edgeSwipeZone,
              activeEdge === "left"
                ? styles.edgeSwipeZoneLeft
                : styles.edgeSwipeZoneRight,
            ]}
            accessible={false}
          />
        </GestureDetector>
      ) : null}

      {status === "running" && keepScreenAwake ? (
        <KeepAwakeWhileRunning />
      ) : null}

      <View
        testID="timer-mode-title"
        pointerEvents="none"
        accessible
        accessibilityRole="header"
        accessibilityLabel={title}
        style={styles.titleContainer}
      >
        <Text style={styles.titleText}>{title}</Text>
      </View>

      <View style={styles.timerContainer} pointerEvents="box-none">
        <Timer
          remainingMs={remainingMs}
          status={status}
          timerMode={timerMode}
          onToggle={onToggle}
          onCancel={onCancel}
          cancelLabel={cancelLabel}
          canCancel={canCancel}
          showControls={showControls}
          showDisabledCancel={isScreenReaderEnabled}
          animateDigits={animateDigits}
          usePlainTime={usePlainTime}
          shouldFocusReadoutOnStart={isScreenReaderEnabled}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  background: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  edgeSwipeZone: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 64,
    backgroundColor: theme.colors.transparent,
    zIndex: 1,
  },
  edgeSwipeZoneLeft: {
    left: 0,
  },
  edgeSwipeZoneRight: {
    right: 0,
  },
  titleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: rt.insets.top + 12,
    paddingHorizontal: 24,
    zIndex: 1,
  },
  titleText: {
    color: theme.colors.primary,
    fontSize: 32,
    fontWeight: "600",
    textAlign: "left",
  },
  timerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
}))
