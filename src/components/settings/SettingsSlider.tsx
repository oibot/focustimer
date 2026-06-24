import { Image, type ImageProps, Slider, Text } from "@expo/ui/swift-ui"

type SettingsSliderProps = {
  value: number
  valueLabel: string
  min: number
  max: number
  step: number
  minimumSystemImage: ImageProps["systemName"]
  onValueChange: (value: number) => void
}

export function SettingsSlider({
  value,
  valueLabel,
  min,
  max,
  step,
  minimumSystemImage,
  onValueChange,
}: SettingsSliderProps) {
  return (
    <Slider
      min={min}
      max={max}
      step={step}
      value={value}
      minimumValueLabel={<Image systemName={minimumSystemImage} size={18} />}
      maximumValueLabel={<Text>{valueLabel}</Text>}
      onValueChange={onValueChange}
    />
  )
}
