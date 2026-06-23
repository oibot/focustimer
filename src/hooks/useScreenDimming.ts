import * as Brightness from "expo-brightness"
import { useCallback, useEffect, useRef, useState } from "react"
import { AppState } from "react-native"

import {
  getDimmedBrightnessTarget,
  SCREEN_DIMMING_DELAY_MS,
} from "@/utils/screenDimming"

type UseScreenDimmingParams = {
  enabled: boolean
  dimmedBrightnessPercent: number
  shouldDim: boolean
  delayMs?: number
}

export default function useScreenDimming({
  enabled,
  dimmedBrightnessPercent,
  shouldDim,
  delayMs = SCREEN_DIMMING_DELAY_MS,
}: UseScreenDimmingParams) {
  const originalBrightnessRef = useRef<number | null>(null)
  const dimTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isAppActive, setIsAppActive] = useState(
    AppState.currentState === "active",
  )

  const clearDimTimeout = useCallback(() => {
    if (dimTimeoutRef.current === null) return
    clearTimeout(dimTimeoutRef.current)
    dimTimeoutRef.current = null
  }, [])

  const restoreBrightness = useCallback(() => {
    clearDimTimeout()

    if (originalBrightnessRef.current === null) return

    const originalBrightness = originalBrightnessRef.current
    originalBrightnessRef.current = null
    void Brightness.setBrightnessAsync(originalBrightness)
  }, [clearDimTimeout])

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setIsAppActive(nextAppState === "active")
    })

    return () => {
      subscription.remove()
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    if (!enabled || !shouldDim || !isAppActive) {
      restoreBrightness()
      return
    }

    clearDimTimeout()
    dimTimeoutRef.current = setTimeout(() => {
      dimTimeoutRef.current = null
      void (async () => {
        const currentBrightness = await Brightness.getBrightnessAsync()
        if (cancelled) return

        if (originalBrightnessRef.current === null) {
          originalBrightnessRef.current = currentBrightness
        }

        await Brightness.setBrightnessAsync(
          getDimmedBrightnessTarget(currentBrightness, dimmedBrightnessPercent),
        )
      })()
    }, delayMs)

    return () => {
      cancelled = true
      clearDimTimeout()
    }
  }, [
    clearDimTimeout,
    delayMs,
    dimmedBrightnessPercent,
    enabled,
    isAppActive,
    restoreBrightness,
    shouldDim,
  ])

  useEffect(() => {
    return () => {
      restoreBrightness()
    }
  }, [restoreBrightness])
}
