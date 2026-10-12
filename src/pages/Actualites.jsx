import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import PageHead from '../components/PageHead'
import Reveal, { Stagger, StaggerItem, WordsUp } from '../components/Motion'
import { CATEGORY_LABELS, CONTACT, IMG } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'

const FALLBACK_IMAGE = IMG.briefing

function formatDate(iso, lang) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function NewsMeta({ category, date, lang, tf }) {
  return (
    <span className="newsmeta">
      <span className="newsmeta__cat">{tf(CATEGORY_LABELS[category]) || category}</span>
      <span className="newsmeta__dot" />
      <span className="newsmeta__date">{formatDate(date, lang)}</span>
    </span>
  )
}

export default function Actualites() {
  const { lang, t, tf } = useI18n()
  const [news, setNews] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setNews(null)
    setError(false)
    fetch(`/api/news?lang=${lang}`)
      .then((r) => { if (!r.ok) throw new Error('bad response'); return r.json() })
      .then((data) => { if (!cancelled) setNews(data) })
      .catch(() => { if (!cancelled) setError(true) })
    return () => { cancelled = true }
  }, [lang])

  const navTo = (to) => (lang === 'en' ? `/en${to}` : to)
  const [featured, ...rest] = news || []

  return (
    <PageShell>
      <PageHead
        tag={t('news.head.tag')}
        title={t('news.head.title')}
        lede={t('news.head.lede')}
        pathFr="/actualites" pathEn="/en/actualites"
      />

      {featured && (
        <section className="band band--tight">
          <div className="shell">
            <Reveal variant="scale">
              <article className="news-feat">
                <div className="news-feat__media">
                  <img src={featured.image || FALLBACK_IMAGE} alt="" loading="lazy" />
                </div>
                <div className="news-feat__body">
                  <NewsMeta category={featured.category} date={featured.date} lang={lang} tf={tf} />
                  <h2 className="display t-lg">{featured.title}</h2>
                  <p className="body-text">{featured.excerpt}</p>
                </div>
              </article>
            </Reveal>
          </div>
        </section>
      )}

      <section className="band band--soft">
        <div className="shell">
          <Reveal variant="down"><span className="tag">{t('news.sectionTag')}</span></Reveal>
          <WordsUp as="h2" text={t('news.sectionTitle')}
            className="display t-xl" delay={0.05} />

          {error && <p className="body-text" style={{ marginTop: 24 }}>{t('news.error')}</p>}
          {news && news.length === 0 && <p className="body-text" style={{ marginTop: 24 }}>{t('news.empty')}</p>}

          {news && rest.length > 0 && (
            <div style={{ marginTop: 'clamp(28px, 4vw, 44px)' }}>
              <Stagger gap={0.07} className="newsgrid">
                {rest.map((n) => (
                  <StaggerItem key={n.slug} variant="up">
                    <article className="newscard">
                      <div className="newscard__media">
                        <img src={n.image || FALLBACK_IMAGE} alt="" loading="lazy" />
                      </div>
                      <div className="newscard__body">
                        <NewsMeta category={n.category} date={n.date} lang={lang} tf={tf} />
                        <h3>{n.title}</h3>
                        <p>{n.excerpt}</p>
                      </div>
                    </article>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          )}
        </div>
      </section>

      <section className="band band--tight">
        <div className="shell">
          <Reveal variant="scale">
            <div className="callout">
              <h2 className="display t-lg" style={{ maxWidth: '24ch', marginInline: 'auto' }}>
                {t('news.callout.title')}
              </h2>
              <div className="callout__actions">
                <Link to={navTo('/contact')} className="btn btn--green">
                  {t('news.callout.cta')} <span className="btn__arrow">→</span>
                </Link>
                <a href={`tel:${CONTACT.phoneHref}`} className="btn btn--onnavy">{CONTACT.phone}</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}
