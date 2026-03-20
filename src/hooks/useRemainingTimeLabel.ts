import { useLingui } from "@lingui/react/macro"

import { getDurationParts } from "@/utils/time"

export default function useRemainingTimeLabel() {
  const { t } = useLingui()

  return (durationMs: number) => {
    const { minutes, seconds } = getDurationParts(durationMs)
    const minuteLabel =
      minutes === 1 ? t`${minutes} minute` : t`${minutes} minutes`
    const secondLabel =
      seconds === 1 ? t`${seconds} second` : t`${seconds} seconds`
    const duration =
      minutes > 0 && seconds > 0
        ? `${minuteLabel} ${secondLabel}`
        : minutes > 0
          ? minuteLabel
          : secondLabel

    return t`${duration} remaining`
  }
}
