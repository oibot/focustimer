import { useRouter } from "expo-router"
import { useCallback } from "react"

import { StatisticsScene } from "@/components/stats/StatisticsScene"

export default function StatisticsRoute() {
  const router = useRouter()
  const handleClose = useCallback(() => {
    router.dismiss()
  }, [router])

  return <StatisticsScene onClose={handleClose} />
}
