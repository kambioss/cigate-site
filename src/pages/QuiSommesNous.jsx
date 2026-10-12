import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import PageHead from '../components/PageHead'
import Reveal, { Stagger, StaggerItem, WordsUp, Parallax } from '../components/Motion'
import { Icons } from '../components/Icons'
import { CLIENTS, CONTACT, DOMAINES, ENGAGEMENTS, IMG } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'

const METIER_ICONS = [Icons.globe, Icons.target, Icons.layers, Icons.chart, Icons.code, Icons.cap, Icons.drone, Icons.doc]

export default function QuiSommesNous() {
  const { lang, t, tf } = useI18n()
  const navTo = (to) => (lang === 'en' ? `/en${to}` : to)

  return (
    <PageShell>
      <PageHead
        tag={t('about.head.tag')}
        title={t('about.head.title')}
        lede={t('about.head.lede')}
        pathFr="/qui-sommes-nous" pathEn="/en/qui-sommes-nous"
      />

      {/* Présentation */}
      <section className="band">
        <div className="shell">
          <article className="feature" style={{ borderTop: 'none', paddingTop: 0 }}>
            <Reveal variant="left" distance={78} className="feature__media">
              <Parallax amount={24} style={{ height: '100%' }}>
                <img src={IMG.collab} alt={t('about.intro.imgAlt')} loading="lazy" />
              </Parallax>
            </Reveal>
            <Reveal variant="right" distance={78} delay={0.14} className="feature__body">
              <h2 className="display t-lg">{t('about.intro.title')}</h2>
              <p className="body-text" style={{ marginTop: 16 }}>{t('about.intro.p1')}</p>
              <p className="body-text" style={{ marginTop: 16 }}>{t('about.intro.p2')}</p>
            </Reveal>
          </article>
        </div>
      </section>

      {/* Métiers */}
      <section className="band band--soft">
        <div className="shell">
          <Reveal variant="down"><span className="tag">{t('about.metiers.tag')}</span></Reveal>
          <WordsUp as="h2" text={t('about.metiers.title')}
            className="display t-xl" delay={0.05} />

          <Stagger className="cards" gap={0.07} style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
            {DOMAINES.map((d, i) => (
              <StaggerItem key={d.slug} variant={i % 2 === 0 ? 'tilt' : 'scale'}>
                <div className="card">
                  <span className="card__n">{d.index}</span>
                  <div className="card__icon">{METIER_ICONS[i]}</div>
                  <h3>{tf(d.short)}</h3>
                  <p>{tf(d.intro)}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Vision */}
      <section className="band band--navy">
        <div className="shell">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(28px,4vw,64px)', alignItems: 'center' }}>
            <div>
              <Reveal variant="down"><span className="tag">{t('about.vision.tag')}</span></Reveal>
              <Reveal variant="left" delay={0.08}>
                <h2 className="display t-xl" style={{ marginTop: 16 }}>
                  {t('about.vision.titleLine1')}<br />{t('about.vision.titleLine2')}
                </h2>
              </Reveal>
              <Reveal variant="blur" delay={0.2}>
                <p className="lede" style={{ marginTop: 20 }}>{t('about.vision.lede')}</p>
              </Reveal>
            </div>
            <Reveal variant="wipe" delay={0.15}>
              <div style={{ borderRadius: 6, overflow: 'hidden', aspectRatio: '4/3' }}>
                <img src={IMG.aerialCity} alt={t('about.vision.imgAlt')} loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="band">
        <div className="shell">
          <Reveal variant="down"><span className="tag">{t('about.engagements.tag')}</span></Reveal>
          <WordsUp as="h2" text={t('about.engagements.title')}
            className="display t-xl" delay={0.05} />

          <div style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
            <Stagger gap={0.08}>
              {ENGAGEMENTS.map((e, i) => (
                <StaggerItem key={e.n} variant={i % 2 === 0 ? 'left' : 'right'}>
                  <div className="step">
                    <span className="step__n">{e.n}</span>
                    <h3>{tf(e.title)}</h3>
                    <p>{tf(e.text)}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Reveal variant="up" delay={0.14} style={{ marginTop: 'clamp(34px, 5vw, 54px)' }}>
            <p className="tag" style={{ marginBottom: 16 }}>{t('about.engagements.clientsLabel')}</p>
            <div className="pills">
              {CLIENTS.map((c) => <span className="pill" key={c.fr}>{tf(c)}</span>)}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="band band--tight band--soft">
        <div className="shell">
          <Reveal variant="scale">
            <div className="callout">
              <h2 className="display t-lg" style={{ maxWidth: '24ch', marginInline: 'auto' }}>
                {t('about.callout.title')}
              </h2>
              <div className="callout__actions">
                <Link to={navTo('/contact')} className="btn btn--green">
                  {t('about.callout.cta')} <span className="btn__arrow">→</span>
                </Link>
                <a href={`mailto:${CONTACT.email}`} className="btn btn--onnavy">{CONTACT.email}</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}
