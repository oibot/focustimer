import { memo } from "react"
import { View } from "react-native"
import Svg, { Circle, Path } from "react-native-svg"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import {
  getSessionDurationFillStep,
  SESSION_DURATION_FILL_STEPS,
} from "@/utils/session-duration"

const DOT_SIZE = 24
const DOT_CENTER = DOT_SIZE / 2
const DOT_RADIUS = DOT_CENTER - 0.5

const getSectorPath = (fillStep: number) => {
  const angle = (fillStep / SESSION_DURATION_FILL_STEPS) * Math.PI * 2
  const endAngle = angle - Math.PI / 2
  const endX = DOT_CENTER + DOT_RADIUS * Math.cos(endAngle)
  const endY = DOT_CENTER + DOT_RADIUS * Math.sin(endAngle)
  const largeArcFlag = fillStep > SESSION_DURATION_FILL_STEPS / 2 ? 1 : 0

  return [
    `M ${DOT_CENTER} ${DOT_CENTER}`,
    `L ${DOT_CENTER} ${DOT_CENTER - DOT_RADIUS}`,
    `A ${DOT_RADIUS} ${DOT_RADIUS} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
    "Z",
  ].join(" ")
}

type SessionDurationDotProps = {
  accessibilityLabel: string
  durationMs: number
  testID: string
}

function SessionDurationDotComponent({
  accessibilityLabel,
  durationMs,
  testID,
}: SessionDurationDotProps) {
  const { theme } = useUnistyles()
  const fillStep = getSessionDurationFillStep(durationMs)

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
      testID={testID}
    >
      <Svg
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        viewBox={`0 0 ${DOT_SIZE} ${DOT_SIZE}`}
        style={styles.dot}
      >
        <Circle
          cx={DOT_CENTER}
          cy={DOT_CENTER}
          r={DOT_RADIUS}
          fill="none"
          stroke={theme.colors.primary}
          strokeWidth={1.5}
        />
        {fillStep === SESSION_DURATION_FILL_STEPS ? (
          <Circle
            cx={DOT_CENTER}
            cy={DOT_CENTER}
            r={DOT_RADIUS}
            fill={theme.colors.primary}
          />
        ) : fillStep > 0 ? (
          <Path d={getSectorPath(fillStep)} fill={theme.colors.primary} />
        ) : null}
      </Svg>
    </View>
  )
}

export const SessionDurationDot = memo(SessionDurationDotComponent)

const styles = StyleSheet.create({
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
  },
})
