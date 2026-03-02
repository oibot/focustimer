import type { ReactNode } from "react"
import { useUnistyles } from "react-native-unistyles"

type ContentSizeCategorySubscriberProps = {
  children: ReactNode
}

export default function ContentSizeCategorySubscriber({
  children,
}: ContentSizeCategorySubscriberProps) {
  const { rt } = useUnistyles()

  rt.contentSizeCategory

  return children
}
