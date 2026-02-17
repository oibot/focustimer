import { useEffect, useState } from "react"
import { AccessibilityInfo } from "react-native"

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

    const subscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      setEnabled,
    )

    return () => {
      isMounted = false
      subscription.remove()
    }
  }, [])

  return enabled
}
