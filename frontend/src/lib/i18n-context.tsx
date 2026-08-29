'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  createTranslator,
  defaultLanguage,
  SUPPORTED_LANGUAGES,
  type Language,
  type Translator,
} from './i18n'

interface I18nContextValue {
  locale: Language
  setLocale: (locale: Language) => void
  toggle: () => void
  t: Translator
}

const STORAGE_KEY = 'medstage-locale'

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  // Initialize to the server-compatible default so SSR and the first client
  // render match (avoids hydration mismatches from reading localStorage).
  // The persisted preference is applied in an effect after mount.
  const [locale, setLocaleState] = useState<Language>(defaultLanguage)

  useEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      // ignore storage errors
    }
    if (stored === 'fr' || stored === 'en') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState(stored)
    }
  }, [])

  const setLocale = useCallback((next: Language) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore storage errors
    }
  }, [])

  const toggle = useCallback(() => {
    setLocaleState((prev) => {
      const next = prev === 'fr' ? 'en' : 'fr'
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // ignore storage errors
      }
      return next
    })
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const t = useMemo(() => createTranslator(locale), [locale])

  const value = useMemo(
    () => ({ locale, setLocale, toggle, t }),
    [locale, setLocale, toggle, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return ctx
}

export { SUPPORTED_LANGUAGES }
