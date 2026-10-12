import { useEffect } from 'react'

/** Injecte des données structurées schema.org (JSON-LD) dans <head> pour la page courante. */
export default function JsonLd({ data }) {
  useEffect(() => {
    if (!data) return
    const items = Array.isArray(data) ? data : [data]
    const scripts = items.map((item) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(item)
      document.head.appendChild(script)
      return script
    })
    return () => scripts.forEach((s) => s.remove())
  }, [data])

  return null
}
