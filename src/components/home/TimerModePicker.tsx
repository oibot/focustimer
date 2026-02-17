import { Host, Picker } from "@expo/ui/swift-ui"
import {
  accessibilityHint,
  disabled as disabledModifier,
} from "@expo/ui/swift-ui/modifiers"
import { useLingui } from "@lingui/react/macro"
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
  const { t } = useLingui()
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
    <Host style={styles.host}>
      <Picker
        options={options}
        selectedIndex={selectedIndex}
        onOptionSelected={handleOptionSelected}
        variant="segmented"
        modifiers={[
          disabledModifier(disabled),
          accessibilityHint(t`Changes the timer mode`),
        ]}
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
