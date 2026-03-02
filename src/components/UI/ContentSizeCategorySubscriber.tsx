import type { ReactNode } from "react"
import { useUnistyles } from "react-native-unistyles"

type ContentSizeCategorySubscriberProps = {
  children: ReactNode
}

export default function ContentSizeCategorySubscriber({
  children,
}: ContentSizeCategorySubscriberProps) {
  const { rt } = useUnistyles()
  const contentSizeCategory = rt.contentSizeCategory

  if (contentSizeCategory === "unspecified") {
    return children
  }

  return children
}
