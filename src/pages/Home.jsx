import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Reveal, { Stagger, StaggerItem, WordsUp, Parallax } from '../components/Motion'
import FeatureRow from '../components/FeatureRow'
import Marquee from '../components/Marquee'
import PageShell from '../components/PageShell'
import SEO from '../components/SEO'
import { Icons } from '../components/Icons'
import { CLIENTS, CONTACT, DOMAINES, ENGAGEMENTS, IMG, METHODE } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'

/* Relevé de coordonnées, Lomé */
function Coords({ label }) {
  const [c, setC] = useState({ lat: 6.1319, lon: 1.2228 })
  useEffect(() => {
    const id = setInterval(() => {
      setC({
        lat: 6.1319 + (Math.random() - 0.5) * 0.0022,
        lon: 1.2228 + (Math.random() - 0.5) * 0.0022,
      })
    }, 1800)
    return () => clearInterval(id)
  }, [])
  return (
    <>
      <b>{label}</b>
      <span>{c.lat.toFixed(4)}° N · {c.lon.toFixed(4)}° E</span>
    </>
  )
}

function Hero() {
  const reduce = useReducedMotion()
  const { t } = useI18n()
  const navTo = useNavTo()
  const rise = (delay) =>
    reduce ? {} : {
      initial: { opacity: 0, y: 26 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.85, delay, ease: [0.16, 0.84, 0.24, 1] },
    }

  return (
    <section className="hero">
      <div className="hero__bg" />
      <div className="hero__mesh" />

      <div className="shell hero__grid">
        <div>
          <motion.span className="hero__badge" {...rise(0.1)}>
            <i /> {t('home.hero.badge')}
          </motion.span>

          <motion.span className="hero__tagline" {...rise(0.16)}>
            {t('home.hero.tagline')}
          </motion.span>

          <motion.h1 className="display t-hero" {...rise(0.2)}>
            {t('home.hero.titleLine1')}<br />
            <span className="green">{t('home.hero.titleGreen')}</span>{t('home.hero.titleLine2')}<br />
            {t('home.hero.titleLine3')}
          </motion.h1>

          <motion.p className="lede hero__sub" {...rise(0.34)}>
            <strong style={{ color: 'var(--navy)' }}>CIGATE</strong>, {t('home.hero.lede')}
          </motion.p>

          <motion.div className="hero__actions" {...rise(0.46)}>
            <Link to={navTo('/contact')} className="btn btn--green">
              {t('home.hero.ctaPrimary')} <span className="btn__arrow">→</span>
            </Link>
            <Link to={navTo('/notre-expertise')} className="btn btn--outline">{t('home.hero.ctaSecondary')}</Link>
          </motion.div>

          <motion.dl className="hero__meta" {...rise(0.58)}>
            <div><dt>{t('home.hero.metaSeatLabel')}</dt><dd>{t('home.hero.metaSeatValue')}</dd></div>
            <div><dt>{t('home.hero.metaScopeLabel')}</dt><dd>{t('home.hero.metaScopeValue')}</dd></div>
          </motion.dl>
        </div>

        {/* Composition visuelle */}
        <div className="hero__stage">
          <motion.div className="hero__card hero__card--main"
            initial={reduce ? false : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            transition={{ duration: 1.15, delay: 0.25, ease: [0.16, 0.84, 0.24, 1] }}>
            <Parallax amount={16} style={{ height: '100%' }}>
              <img src={IMG.heroTeam} alt={t('home.hero.imgAltMain')} />
            </Parallax>
          </motion.div>

          <motion.div className="hero__card hero__card--sat"
            initial={reduce ? false : { opacity: 0, x: 40, y: 26 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.95, delay: 0.65, ease: [0.16, 0.84, 0.24, 1] }}>
            <img src={IMG.satLandsat} alt={t('home.hero.imgAltSat')} />
          </motion.div>

          <motion.div className="hero__card hero__card--chip"
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 0.84, 0.24, 1] }}>
            <Coords label={t('home.hero.coordsLabel')} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function useNavTo() {
  const { lang } = useI18n()
  return (to) => (lang === 'en' ? (to === '/' ? '/en' : `/en${to}`) : to)
}

export default function Home() {
  const { t, tf } = useI18n()
  const navTo = useNavTo()
  const cardIcons = [Icons.globe, Icons.target, Icons.layers, Icons.chart, Icons.code, Icons.cap, Icons.drone, Icons.doc]
  const tiles = [
    IMG.satEarth, IMG.satDelta, IMG.satBands, IMG.aerialField,
    IMG.satTexture, IMG.satOrbit, IMG.aerialCoast, IMG.satIslands,
  ]
  const tileLabels = t('home.remote.tiles')

  return (
    <PageShell>
      <SEO
        title={t('home.seo.title')} description={t('home.seo.description')}
        pathFr="/" pathEn="/en" suffix={false}
      />
      <Hero />
      <Marquee />

      {/* ---- Introduction ---- */}
      <section className="band">
        <div className="shell">
          <Reveal variant="down"><span className="tag">{t('home.intro.tag')}</span></Reveal>
          <WordsUp
            as="h2"
            text={t('home.intro.title')}
            className="display t-xl"
            delay={0.05}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(24px,4vw,60px)', marginTop: 30 }}>
            <Reveal variant="left" delay={0.1}>
              <p className="body-text">{t('home.intro.p1')}</p>
            </Reveal>
            <Reveal variant="right" delay={0.18}>
              <p className="body-text">{t('home.intro.p2')}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- Les huit domaines ---- */}
      <section className="band band--soft">
        <div className="shell">
          <Reveal variant="down"><span className="tag">{t('home.domaines.tag')}</span></Reveal>
          <WordsUp as="h2" text={t('home.domaines.title')}
            className="display t-xl" delay={0.05} />
          <Reveal variant="blur" delay={0.2}>
            <p className="lede" style={{ marginTop: 18, marginBottom: 'clamp(30px, 4vw, 50px)' }}>
              {t('home.domaines.lede')}
            </p>
          </Reveal>

          <Stagger className="cards" gap={0.07}>
            {DOMAINES.map((d, i) => (
              <StaggerItem key={d.slug} variant={i % 2 === 0 ? 'tilt' : 'up'}>
                <div className="card">
                  <span className="card__n">{d.index}</span>
                  <div className="card__icon">{cardIcons[i]}</div>
                  <h3>{tf(d.short)}</h3>
                  <p>{tf(d.intro)}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---- Télédétection ---- */}
      <section className="band band--navy">
        <div className="shell">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(24px,4vw,60px)', alignItems: 'end', marginBottom: 'clamp(28px,4vw,46px)' }}>
            <div>
              <Reveal variant="down"><span className="tag">{t('home.remote.tag')}</span></Reveal>
              <Reveal variant="left" delay={0.08}>
                <h2 className="display t-xl" style={{ marginTop: 16 }}>
                  {t('home.remote.titleLine1')}<br />{t('home.remote.titleLine2')}
                </h2>
              </Reveal>
            </div>
            <Reveal variant="right" delay={0.16}>
              <p className="lede">{t('home.remote.lede')}</p>
            </Reveal>
          </div>

          <Stagger className="cards" gap={0.09}>
            {tiles.map((src, i) => (
              <StaggerItem key={tileLabels[i]} variant={i % 3 === 0 ? 'scale' : i % 3 === 1 ? 'blur' : 'up'}>
                <div className="tile">
                  <img src={src} alt={tileLabels[i]} loading="lazy" />
                  <span className="tile__label">{tileLabels[i]}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---- Lignes alternées ---- */}
      <section className="band">
        <div className="shell">
          <Reveal variant="down"><span className="tag">{t('home.detail.tag')}</span></Reveal>
          <WordsUp as="h2" text={t('home.detail.title')} className="display t-xl" delay={0.05} />
          <div style={{ marginTop: 'clamp(24px, 4vw, 44px)' }}>
            {DOMAINES.slice(0, 4).map((d, i) => (
              <FeatureRow key={d.slug} item={d} flip={i % 2 === 1} />
            ))}
          </div>
          <Reveal variant="up" delay={0.1} style={{ marginTop: 40 }}>
            <Link to={navTo('/notre-expertise')} className="btn btn--outline">
              {t('home.detail.cta')} <span className="btn__arrow">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---- Méthode ---- */}
      <section className="band band--soft">
        <div className="shell">
          <Reveal variant="down"><span className="tag">{t('home.methode.tag')}</span></Reveal>
          <WordsUp as="h2" text={t('home.methode.title')} className="display t-xl" delay={0.05} />
          <div style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
            <Stagger gap={0.08}>
              {METHODE.map((s) => (
                <StaggerItem key={s.n} variant="left">
                  <div className="step">
                    <span className="step__n">{s.n}</span>
                    <h3>{tf(s.title)}</h3>
                    <p>{tf(s.text)}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ---- Engagements ---- */}
      <section className="band">
        <div className="shell">
          <Reveal variant="down"><span className="tag">{t('home.engagements.tag')}</span></Reveal>
          <WordsUp as="h2" text={t('home.engagements.title')}
            className="display t-xl" delay={0.05} />

          <Stagger className="cards cards--2" gap={0.1} style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
            {ENGAGEMENTS.map((e, i) => (
              <StaggerItem key={e.n} variant={i % 2 === 0 ? 'left' : 'right'}>
                <div className="card">
                  <span className="card__n">{e.n}</span>
                  <h3 style={{ marginTop: 14 }}>{tf(e.title)}</h3>
                  <p>{tf(e.text)}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal variant="up" delay={0.12} style={{ marginTop: 'clamp(34px, 5vw, 56px)' }}>
            <p className="tag" style={{ marginBottom: 16 }}>{t('home.engagements.clientsLabel')}</p>
            <div className="pills">
              {CLIENTS.map((c) => <span className="pill" key={c.fr}>{tf(c)}</span>)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Appel ---- */}
      <section className="band band--tight band--soft">
        <div className="shell">
          <Reveal variant="scale">
            <div className="callout">
              <span className="tag" style={{ justifyContent: 'center', color: '#7FC08A' }}>{t('home.callout.tag')}</span>
              <h2 className="display t-lg" style={{ marginTop: 16, maxWidth: '22ch', marginInline: 'auto' }}>
                {t('home.callout.title')}
              </h2>
              <p style={{ marginTop: 14, maxWidth: '54ch', marginInline: 'auto', fontSize: 16.5, lineHeight: 1.7 }}>
                {t('home.callout.text')}
              </p>
              <div className="callout__actions">
                <Link to={navTo('/contact')} className="btn btn--green">
                  {t('home.callout.cta')} <span className="btn__arrow">→</span>
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
