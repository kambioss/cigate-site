import { createContext, useContext, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import fr from './fr'
import en from './en'

const DICTS = { fr, en }
const I18nContext = createContext(null)

function get(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj)
}

/** '/en' ou '/en/...' -> 'en' ; tout le reste -> 'fr'. */
export function detectLang(pathname) {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'fr'
}

/** Convertit un chemin (FR ou EN) vers son équivalent dans `lang`. */
export function toLangPath(pathname, lang) {
  const bare = pathname.replace(/^\/en(?=\/|$)/, '') || '/'
  if (lang === 'en') return bare === '/' ? '/en' : `/en${bare}`
  return bare
}

export function I18nProvider({ children }) {
  const location = useLocation()
  const lang = detectLang(location.pathname)

  const value = useMemo(() => {
    function t(key) {
      const value = get(DICTS[lang], key)
      if (value !== undefined) return value
      const fallback = get(DICTS.fr, key)
      return fallback !== undefined ? fallback : key
    }
    function tf(field) {
      return field ? (field[lang] || field.fr) : ''
    }
    const otherLang = lang === 'fr' ? 'en' : 'fr'
    return {
      lang,
      t,
      tf,
      otherLang,
      switchPath: toLangPath(location.pathname, otherLang),
      langPath: (path) => toLangPath(path, lang),
    }
  }, [lang, location.pathname])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
