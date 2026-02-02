import { Host, Picker } from "@expo/ui/swift-ui"
import { StyleSheet } from "react-native-unistyles"
import { useEffect, useState } from "react"

type TimerModePickerProps = {
  options: string[]
  activeIndex: number
  disabled?: boolean
  onModeChange?: (index: number) => void
}

export default function TimerModePicker({
  options,
  activeIndex,
  disabled = false,
  onModeChange,
}: TimerModePickerProps) {
  const [selectedIndex, setSelectedIndex] = useState(activeIndex)

  useEffect(() => {
    setSelectedIndex(activeIndex)
  }, [activeIndex])

  const handleOptionSelected = ({
    nativeEvent: { index },
  }: {
    nativeEvent: { index: number }
  }) => {
    if (disabled) return
    if (index === selectedIndex) return
    setSelectedIndex(index)
    onModeChange?.(index)
  }

  return (
    <Host style={[styles.host, disabled && styles.disabled]}>
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
  disabled: {
    opacity: 0.5,
  },
})
