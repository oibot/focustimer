import { i18n } from "@lingui/core"
import { getLocales } from "expo-localization"

import { messages as deMessages } from "@/locales/de/messages"
import { messages as enMessages } from "@/locales/en/messages"

const catalogs = {
  de: deMessages,
  en: enMessages,
} as const

export type AppLocale = keyof typeof catalogs

const fallbackLocale: AppLocale = "en"

export function detectLocale(): AppLocale {
  const deviceLocale = getLocales()[0]?.languageCode ?? fallbackLocale

  return deviceLocale in catalogs ? (deviceLocale as AppLocale) : fallbackLocale
}

export function initI18n(): AppLocale {
  const locale = detectLocale()

  i18n.load(catalogs)
  i18n.activate(locale)

  return locale
}
