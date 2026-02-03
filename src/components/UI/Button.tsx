import { Pressable, Text, type PressableProps } from "react-native"
import { Host, Image, type ImageProps } from "@expo/ui/swift-ui"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

type ButtonProps = PressableProps & {
  label: string
}

type IconPrimaryButtonProps = PressableProps & {
  label: string
  symbolName: ImageProps["systemName"]
  size?: number
}

type BaseButtonProps = ButtonProps & {
  buttonStyle: object
  labelStyle: object
}

function BaseButton({
  label,
  buttonStyle,
  labelStyle,
  disabled,
  style,
  ...pressableProps
}: BaseButtonProps) {
  return (
    <Pressable
      style={(state) => [
        styles.button,
        buttonStyle,
        disabled && styles.buttonDisabled,
        state.pressed && styles.buttonPressed,
        typeof style === "function" ? style(state) : style,
      ]}
      disabled={disabled}
      {...pressableProps}
    >
      <Text style={[styles.buttonLabel, labelStyle]}>{label}</Text>
    </Pressable>
  )
}

export function PrimaryButton(props: ButtonProps) {
  return (
    <BaseButton
      {...props}
      buttonStyle={styles.primary}
      labelStyle={styles.primaryLabel}
    />
  )
}

export function IconPrimaryButton({
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
        styles.button,
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

export function DestructiveButton(props: ButtonProps) {
  return (
    <BaseButton
      {...props}
      buttonStyle={styles.destructive}
      labelStyle={styles.destructiveLabel}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  button: {
    width: 200,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  iconButton: {
    width: 80,
    height: 80,
    borderRadius: 14,
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
  destructive: {
    borderRadius: 999,
    backgroundColor: "transparent",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonLabel: {
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  primaryLabel: {
    color: theme.colors.background,
  },
  destructiveLabel: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.2,
    color: theme.colors.primary,
  },
}))
