import { Image, type ImageProps, Slider, Text } from "@expo/ui/swift-ui"
import { accessibilityIdentifier } from "@expo/ui/swift-ui/modifiers"

type SettingsSliderProps = {
  value: number
  valueLabel: string
  min: number
  max: number
  step: number
  minimumSystemImage: ImageProps["systemName"]
  testID?: string
  onValueChange: (value: number) => void
}

export function SettingsSlider({
  value,
  valueLabel,
  min,
  max,
  step,
  minimumSystemImage,
  testID,
  onValueChange,
}: SettingsSliderProps) {
  return (
    <Slider
      min={min}
      max={max}
      step={step}
      value={value}
      testID={testID}
      minimumValueLabel={<Image systemName={minimumSystemImage} size={18} />}
      maximumValueLabel={<Text>{valueLabel}</Text>}
      onValueChange={onValueChange}
      modifiers={[accessibilityIdentifier(testID ?? "")]}
    />
  )
}
