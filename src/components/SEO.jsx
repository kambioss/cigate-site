import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Placeholder : à remplacer par le domaine définitif une fois le site déployé
// (voir CONTACT.email dans data/content.js, également un placeholder : cigate.tg).
const SITE_URL = 'https://cigate.tg'

function setMeta(attr, key, content) {
  if (!content) return
  let tag = document.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setLink(rel, href, hreflang) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`
  let tag = document.querySelector(selector)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    if (hreflang) tag.setAttribute('hreflang', hreflang)
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

/** Titre, description et balises canonical/hreflang par page, pour un référencement correct de chaque route. */
export default function SEO({ title, description, pathFr, pathEn, suffix = true }) {
  const location = useLocation()

  useEffect(() => {
    if (title) document.title = suffix ? `${title} · CIGATE` : title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)

    setLink('canonical', `${SITE_URL}${location.pathname}`)
    if (pathFr) setLink('alternate', `${SITE_URL}${pathFr}`, 'fr')
    if (pathEn) setLink('alternate', `${SITE_URL}${pathEn}`, 'en')
  }, [title, description, location.pathname, pathFr, pathEn, suffix])

  return null
}
