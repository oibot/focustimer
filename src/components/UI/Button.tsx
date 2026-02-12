import { Pressable, Text, type PressableProps } from "react-native"
import { StyleSheet } from "react-native-unistyles"

type ButtonProps = PressableProps & {
  label: string
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
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
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
    padding: 20,
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
