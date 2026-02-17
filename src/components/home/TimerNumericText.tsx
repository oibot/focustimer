import { useEffect, useRef } from "react"
import { Animated, Easing, Text, View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

const TIMER_FONT_SIZE = 96
const DIGIT_HEIGHT = TIMER_FONT_SIZE
const DIGIT_SEQUENCE = Array.from({ length: 30 }, (_, index) => index % 10)
const BASE_INDEX = 10
const ROLL_DURATION_MS = 280

type TimerNumericTextProps = {
  value: string
  countsDown?: boolean
  animate?: boolean
}

type RollingDigitProps = {
  value: number
  countsDown: boolean
  animate: boolean
}

function RollingDigit({ value, countsDown, animate }: RollingDigitProps) {
  const startIndex = BASE_INDEX + value
  const animatedIndex = useRef(new Animated.Value(startIndex)).current
  const indexRef = useRef(startIndex)
  const prevValueRef = useRef(value)

  useEffect(() => {
    const prevValue = prevValueRef.current

    if (prevValue === value) {
      return
    }

    const resetIndex = BASE_INDEX + value

    if (!animate) {
      indexRef.current = resetIndex
      prevValueRef.current = value
      animatedIndex.setValue(resetIndex)
      return
    }

    const isStep = countsDown
      ? (prevValue === 0 && value === 9) || value === prevValue - 1
      : (prevValue === 9 && value === 0) || value === prevValue + 1

    if (!isStep) {
      indexRef.current = resetIndex
      prevValueRef.current = value
      animatedIndex.setValue(resetIndex)
      return
    }

    const nextIndex = indexRef.current + (countsDown ? -1 : 1)
    indexRef.current = nextIndex
    prevValueRef.current = value

    Animated.timing(animatedIndex, {
      toValue: nextIndex,
      duration: ROLL_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) {
        return
      }

      indexRef.current = resetIndex
      animatedIndex.setValue(resetIndex)
    })
  }, [value, countsDown, animate, animatedIndex])

  const translateY = Animated.multiply(animatedIndex, -DIGIT_HEIGHT)

  return (
    <View style={styles.digitWindow}>
      <Animated.View
        style={[styles.digitColumn, { transform: [{ translateY }] }]}
      >
        {DIGIT_SEQUENCE.map((digit, index) => (
          <Text
            key={`${digit}-${index}`}
            style={styles.digit}
            allowFontScaling={false}
            maxFontSizeMultiplier={1}
          >
            {digit}
          </Text>
        ))}
      </Animated.View>
    </View>
  )
}

export default function TimerNumericText({
  value,
  countsDown = true,
  animate = true,
}: TimerNumericTextProps) {
  const chars = value.split("")

  return (
    <View
      style={styles.row}
      accessibilityLabel={value}
      accessibilityRole="text"
    >
      {chars.map((char, index) =>
        char === ":" ? (
          <Text
            key={`sep-${index}`}
            style={styles.separator}
            allowFontScaling={false}
            maxFontSizeMultiplier={1}
          >
            {char}
          </Text>
        ) : (
          <RollingDigit
            key={`digit-${index}`}
            value={Number(char)}
            countsDown={countsDown}
            animate={animate}
          />
        ),
      )}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  digitWindow: {
    height: DIGIT_HEIGHT,
    overflow: "hidden",
  },
  digitColumn: {
    alignItems: "center",
  },
  digit: {
    fontSize: TIMER_FONT_SIZE,
    lineHeight: DIGIT_HEIGHT,
    fontWeight: "600",
    textAlign: "center",
    fontVariant: ["tabular-nums"],
    color: theme.colors.primary,
  },
  separator: {
    fontSize: TIMER_FONT_SIZE,
    lineHeight: DIGIT_HEIGHT,
    fontWeight: "600",
    textAlign: "center",
    color: theme.colors.primary,
    marginHorizontal: 4,
  },
}))
