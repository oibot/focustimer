import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect } from "react"

import { applyE2ESetupParams, isE2ESetupEnabled } from "@/utils/e2eSetup"

export default function E2ESetupPage() {
  const router = useRouter()
  const params = useLocalSearchParams<{
    breakDurationMs?: string | string[]
    completionSound?: string | string[]
    focusDurationMs?: string | string[]
    mode?: string | string[]
  }>()

  useEffect(() => {
    if (isE2ESetupEnabled()) {
      applyE2ESetupParams(params)
    }

    const mode = Array.isArray(params.mode) ? params.mode[0] : params.mode

    if (mode === "short") {
      router.replace({ pathname: "/", params: { mode: "short" } })
      return
    }

    router.replace("/")
  }, [params, router])

  return null
}
