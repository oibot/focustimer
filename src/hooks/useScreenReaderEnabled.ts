import { useEffect, useState } from "react"
import { AccessibilityInfo, AppState } from "react-native"

export default function useScreenReaderEnabled() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      const value = await AccessibilityInfo.isScreenReaderEnabled()
      if (isMounted) {
        setEnabled(value)
      }
    }

    load()

    const screenReaderSubscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      setEnabled,
    )
    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState !== "active") return
        void load()
      },
    )

    return () => {
      isMounted = false
      screenReaderSubscription.remove()
      appStateSubscription.remove()
    }
  }, [])

  return enabled
}
