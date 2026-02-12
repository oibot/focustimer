import { DestructiveButton, PrimaryButton } from "@/components/UI/Button"
import { useTimer } from "@/hooks/useTimer"
import { useLingui } from "@lingui/react/macro"
import { StyleSheet, View } from "react-native"

type TimerDoneSceneProps = {
  nextMode: "focus" | "short"
  onStart: () => void
  onCancel: () => void
}

export default function TimerDoneScene({
  nextMode,
  onStart,
  onCancel,
}: TimerDoneSceneProps) {
  const { t } = useLingui()
  const buttonLabel = nextMode === "focus" ? t`Start Focus` : t`Start Break`
  const { cancelTimer } = useTimer()

  const handleCancel = () => {
    cancelTimer()
    onCancel()
  }

  return (
    <View style={styles.container}>
      <PrimaryButton label={buttonLabel} onPress={onStart} />
      <DestructiveButton label={t`Cancel`} onPress={handleCancel} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    gap: 20,
  },
})
