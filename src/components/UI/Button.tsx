import { Pressable, Text, type PressableProps } from "react-native"
import { StyleSheet } from "react-native-unistyles"

type ButtonVariant = "primary" | "cancel"

type ButtonProps = PressableProps & {
  variant?: ButtonVariant
  label: string
}

export default function Button({
  variant = "primary",
  label,
  disabled,
  ...pressableProps
}: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        variant === "cancel" && styles.cancelButton,
        disabled && styles.buttonDisabled,
        pressed && styles.buttonPressed,
      ]}
      disabled={disabled}
      {...pressableProps}
    >
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.background,
  },
  cancelButton: {
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.4,
    color: theme.colors.primary,
  },
}))
