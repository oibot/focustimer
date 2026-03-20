import { useLingui } from "@lingui/react/macro"
import { View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

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
    <View style={styles.container}>
      <PrimaryButton label={buttonLabel} onPress={onStart} />
      <DestructiveButton label={t`Cancel`} onPress={handleCancel} />
    </View>
  )
}

const styles = StyleSheet.create((_, rt) => ({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: rt.insets.top + 32,
    paddingBottom: rt.insets.bottom + 32,
    paddingHorizontal: 24,
    gap: 20,
  },
}))
