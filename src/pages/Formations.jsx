import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import PageHead from '../components/PageHead'
import FeatureRow from '../components/FeatureRow'
import Reveal from '../components/Motion'
import JsonLd from '../components/JsonLd'
import { CONTACT, FORMATIONS } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'

export default function Formations() {
  const { lang, t, tf } = useI18n()
  const navTo = (to) => (lang === 'en' ? `/en${to}` : to)

  const courseSchema = FORMATIONS.map((f) => ({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: tf(f.title),
    description: tf(f.intro),
    provider: {
      '@type': 'Organization',
      name: CONTACT.raison,
      sameAs: navTo('/'),
    },
  }))

  return (
    <PageShell>
      <JsonLd data={courseSchema} />

      <PageHead
        tag={t('formations.head.tag')}
        title={t('formations.head.title')}
        lede={t('formations.head.lede')}
        pathFr="/formations" pathEn="/en/formations"
      />

      <section className="band">
        <div className="shell">
          <div style={{ marginTop: 'clamp(8px, 2vw, 20px)' }}>
            {FORMATIONS.map((f, i) => (
              <FeatureRow
                key={f.slug}
                item={f}
                flip={i % 2 === 1}
                cta={{
                  label: t('formations.quoteCta'),
                  to: `${navTo('/contact')}?formation=${encodeURIComponent(tf(f.title))}`,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="band band--tight">
        <div className="shell">
          <Reveal variant="scale">
            <div className="callout">
              <h2 className="display t-lg" style={{ maxWidth: '26ch', marginInline: 'auto' }}>
                {t('formations.callout.title')}
              </h2>
              <p className="lede" style={{ maxWidth: '52ch', marginInline: 'auto', marginTop: 14 }}>
                {t('formations.callout.text')}
              </p>
              <div className="callout__actions">
                <Link to={navTo('/contact')} className="btn btn--green">
                  {t('formations.callout.ctaPrimary')} <span className="btn__arrow">→</span>
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
