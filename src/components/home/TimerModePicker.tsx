import { Host, Picker, Text } from "@expo/ui/swift-ui"
import {
  accessibilityHint,
  disabled as disabledModifier,
  pickerStyle,
  tag,
} from "@expo/ui/swift-ui/modifiers"
import { useLingui } from "@lingui/react/macro"
import { useEffect, useState } from "react"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

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
  const { rt } = useUnistyles()
  const contentSizeCategory = rt.contentSizeCategory
  const [selectedIndex, setSelectedIndex] = useState(activeIndex)

  useEffect(() => {
    setSelectedIndex(activeIndex)
  }, [activeIndex])

  const handleSelectionChange = (index: number) => {
    if (disabled) return
    if (index === selectedIndex) return
    setSelectedIndex(index)
    onModeChange?.(index)
  }

  return (
    <Host key={contentSizeCategory} style={styles.host}>
      <Picker
        selection={selectedIndex}
        onSelectionChange={handleSelectionChange}
        modifiers={[
          pickerStyle("segmented"),
          disabledModifier(disabled),
          accessibilityHint(t`Changes the timer mode`),
        ]}
      >
        {options.map((option, index) => (
          <Text key={option} modifiers={[tag(index)]}>
            {option}
          </Text>
        ))}
      </Picker>
    </Host>
  )
}

const styles = StyleSheet.create({
  host: {
    width: 250,
    height: 100,
  },
})
