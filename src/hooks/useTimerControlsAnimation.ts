import { useEffect, useRef } from "react"
import { Animated, Easing } from "react-native"

type UseTimerControlsAnimationOptions = {
  visible: boolean
  durationMs?: number
  offsetY?: number
}

export default function useTimerControlsAnimation({
  visible,
  durationMs = 1000,
  offsetY = 8,
}: UseTimerControlsAnimationOptions) {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: durationMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()
  }, [durationMs, opacity, visible])

  const translateY = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [offsetY, 0],
  })

  return { opacity, translateY }
}
