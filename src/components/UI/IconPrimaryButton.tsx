import { Pressable, type PressableProps } from "react-native"
import { Host, Image, type ImageProps } from "@expo/ui/swift-ui"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

type IconPrimaryButtonProps = PressableProps & {
  label: string
  symbolName: ImageProps["systemName"]
  size?: number
}

export default function IconPrimaryButton({
  label,
  symbolName,
  size = 36,
  disabled,
  style,
  ...pressableProps
}: IconPrimaryButtonProps) {
  const { theme, rt } = useUnistyles()
  const isDark = rt.colorScheme === "dark"

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={(state) => [
        styles.iconButton,
        isDark && styles.iconButtonDark,
        disabled && styles.buttonDisabled,
        state.pressed && styles.buttonPressed,
        typeof style === "function" ? style(state) : style,
      ]}
      disabled={disabled}
      {...pressableProps}
    >
      <Host matchContents>
        <Image
          systemName={symbolName}
          size={size}
          color={theme.colors.background}
        />
      </Host>
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  iconButton: {
    width: 90,
    height: 90,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },
  iconButtonDark: {
    shadowColor: "#000000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonPressed: {
    opacity: 0.8,
  },
}))
