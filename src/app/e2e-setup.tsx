import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect } from "react"

import { applyE2ESetupParams } from "@/utils/e2eSetup"

export default function E2ESetupPage() {
  const router = useRouter()
  const params = useLocalSearchParams<{
    breakDurationMs?: string | string[]
    completionSound?: string | string[]
    focusDurationMs?: string | string[]
    mode?: string | string[]
    sessionHistoryFixture?: string | string[]
  }>()

  useEffect(() => {
    applyE2ESetupParams(params)

    const mode = Array.isArray(params.mode) ? params.mode[0] : params.mode

    if (mode === "short") {
      router.dismissTo({ pathname: "/", params: { mode: "short" } })
      return
    }

    router.dismissTo("/")
  }, [params, router])

  return null
}
