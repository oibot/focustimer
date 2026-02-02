import { Host, Picker } from "@expo/ui/swift-ui"
import { StyleSheet } from "react-native-unistyles"
import { useState } from "react"

type TimerModePickerProps = {
  options: string[]
  onModeChange?: (index: number) => void
}

export default function TimerModePicker({
  options,
  onModeChange,
}: TimerModePickerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleOptionSelected = ({
    nativeEvent: { index },
  }: {
    nativeEvent: { index: number }
  }) => {
    setSelectedIndex(index)
    onModeChange?.(index)
  }

  return (
    <Host style={styles.host}>
      <Picker
        options={options}
        selectedIndex={selectedIndex}
        onOptionSelected={handleOptionSelected}
        variant="segmented"
      />
    </Host>
  )
}

const styles = StyleSheet.create({
  host: {
    width: 200,
    height: 100,
  },
})
