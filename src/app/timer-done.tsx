import { Pressable, StyleSheet, Text, View } from "react-native"

export default function Page() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button}>
        <Text>Start Break</Text>
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
