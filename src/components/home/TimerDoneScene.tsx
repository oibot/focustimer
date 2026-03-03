import { useLingui } from "@lingui/react/macro"
import { ScrollView, StyleSheet } from "react-native"

import { DestructiveButton, PrimaryButton } from "@/components/UI/Button"
import { useTimer } from "@/hooks/useTimer"

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
    <ScrollView contentContainerStyle={styles.container}>
      <PrimaryButton label={buttonLabel} onPress={onStart} />
      <DestructiveButton label={t`Cancel`} onPress={handleCancel} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
})
