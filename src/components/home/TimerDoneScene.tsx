import { Pressable, StyleSheet, Text, View } from "react-native"

type TimerDoneSceneProps = {
  nextMode: "focus" | "short"
  onStart: () => void
  onCancel?: () => void
}

export default function TimerDoneScene({
  nextMode,
  onStart,
  onCancel,
}: TimerDoneSceneProps) {
  const buttonLabel = nextMode === "focus" ? "Start Focus" : "Start Break"

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={onStart}>
        <Text>{buttonLabel}</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={onCancel}>
        <Text>Cancel</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    gap: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 2,
  },
})
