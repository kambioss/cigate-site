import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import PageShell from '../components/PageShell'
import PageHead from '../components/PageHead'
import FeatureRow from '../components/FeatureRow'
import Marquee from '../components/Marquee'
import Reveal, { Stagger, StaggerItem, WordsUp } from '../components/Motion'
import { CONTACT, DOMAINES, METHODE } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'

export default function NotreExpertise() {
  const [open, setOpen] = useState(DOMAINES[0].slug)
  const { lang, t, tf } = useI18n()
  const navTo = (to) => (lang === 'en' ? `/en${to}` : to)

  return (
    <PageShell>
      <PageHead
        tag={t('expertise.head.tag')}
        title={t('expertise.head.title')}
        lede={t('expertise.head.lede')}
      />

      {/* Sommaire dépliable */}
      <section className="band band--tight">
        <div className="shell">
          <Reveal variant="down"><span className="tag">{t('expertise.summary.tag')}</span></Reveal>
          <div style={{ marginTop: 24, borderTop: '1px solid var(--line)' }}>
            {DOMAINES.map((d, i) => {
              const isOpen = open === d.slug
              return (
                <motion.div key={d.slug} layout
                  style={{ borderBottom: '1px solid var(--line)', overflow: 'hidden' }}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.55, delay: i * 0.045, ease: [0.16, 0.84, 0.24, 1] }}>
                  <button
                    onClick={() => setOpen(isOpen ? null : d.slug)}
                    aria-expanded={isOpen}
                    style={{
                      display: 'flex', width: '100%', alignItems: 'center', gap: 18,
                      padding: '20px 4px', textAlign: 'left',
                    }}>
                    <span className="mono" style={{ fontSize: 12.5, color: 'var(--green)', minWidth: 26 }}>{d.index}</span>
                    <span className="display" style={{ flex: 1, fontSize: 'clamp(17px, 2vw, 23px)', fontWeight: 600 }}>
                      {tf(d.short)}
                    </span>
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}
                      style={{ fontSize: 22, color: 'var(--navy)', lineHeight: 1 }}>+</motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.42, ease: [0.16, 0.84, 0.24, 1] }}>
                        <div style={{ padding: '0 4px 26px 44px' }}>
                          <p className="body-text">{tf(d.intro)}</p>
                          <ul className="feature__list" style={{ marginTop: 16 }}>
                            {tf(d.points).map((p) => <li key={p}>{p}</li>)}
                          </ul>
                          <span className="feature__tag">{tf(d.tag)}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <Marquee />

      {/* Détail illustré */}
      <section className="band">
        <div className="shell">
          <Reveal variant="down"><span className="tag">{t('expertise.detail.tag')}</span></Reveal>
          <WordsUp as="h2" text={t('expertise.detail.title')}
            className="display t-xl" delay={0.05} />
          <div style={{ marginTop: 'clamp(24px, 4vw, 44px)' }}>
            {DOMAINES.map((d, i) => (
              <FeatureRow key={d.slug} item={d} flip={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Méthode */}
      <section className="band band--soft">
        <div className="shell">
          <Reveal variant="down"><span className="tag">{t('expertise.method.tag')}</span></Reveal>
          <WordsUp as="h2" text={t('expertise.method.title')}
            className="display t-xl" delay={0.05} />
          <div style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
            <Stagger gap={0.08}>
              {METHODE.map((s) => (
                <StaggerItem key={s.n} variant="right">
                  <div className="step">
                    <span className="step__n">{s.n}</span>
                    <h3>{tf(s.title)}</h3>
                    <p>{tf(s.text)}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Reveal variant="up" delay={0.12} style={{ marginTop: 40 }}>
            <Link to={navTo('/contact')} className="btn btn--green">
              {t('expertise.method.cta')} <span className="btn__arrow">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="band band--tight">
        <div className="shell">
          <Reveal variant="scale">
            <div className="callout">
              <h2 className="display t-lg" style={{ maxWidth: '24ch', marginInline: 'auto' }}>
                {t('expertise.callout.title')}
              </h2>
              <div className="callout__actions">
                <Link to={navTo('/contact')} className="btn btn--green">
                  {t('expertise.callout.ctaPrimary')} <span className="btn__arrow">→</span>
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
