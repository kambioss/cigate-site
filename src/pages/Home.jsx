import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Reveal, { Stagger, StaggerItem, WordsUp, Parallax } from '../components/Motion'
import FeatureRow from '../components/FeatureRow'
import Marquee from '../components/Marquee'
import PageShell from '../components/PageShell'
import { Icons } from '../components/Icons'
import { CLIENTS, CONTACT, DOMAINES, ENGAGEMENTS, IMG, METHODE } from '../data/content'

/* Relevé de coordonnées — Lomé */
function Coords() {
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
      <b>Position — Lomé</b>
      <span>{c.lat.toFixed(4)}° N · {c.lon.toFixed(4)}° E</span>
    </>
  )
}

function Hero() {
  const reduce = useReducedMotion()
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
            <i /> Cabinet basé à Lomé · Togo
          </motion.span>

          <motion.h1 className="display t-hero" {...rise(0.2)}>
            Lire le territoire,<br />
            <span className="green">mesurer</span> le réel,<br />
            éclairer la décision.
          </motion.h1>

          <motion.p className="lede hero__sub" {...rise(0.34)}>
            <strong style={{ color: 'var(--navy)' }}>CIGATE</strong> — Cabinet International de
            Géomatique, Aménagement, Topographie et Environnement. Nous produisons la donnée
            géospatiale, la traitons et la transformons en outils d'aide à la décision pour les
            administrations, les collectivités et les entreprises.
          </motion.p>

          <motion.div className="hero__actions" {...rise(0.46)}>
            <Link to="/contact" className="btn btn--green">
              Discuter de votre projet <span className="btn__arrow">→</span>
            </Link>
            <Link to="/notre-expertise" className="btn btn--outline">Nos domaines d'intervention</Link>
          </motion.div>

          <motion.dl className="hero__meta" {...rise(0.58)}>
            <div><dt>Siège</dt><dd>Lomé, Togo</dd></div>
            <div><dt>Champ d'action</dt><dd>Togo &amp; international</dd></div>
          </motion.dl>
        </div>

        {/* Composition visuelle */}
        <div className="hero__stage">
          <motion.div className="hero__card hero__card--main"
            initial={reduce ? false : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            transition={{ duration: 1.15, delay: 0.25, ease: [0.16, 0.84, 0.24, 1] }}>
            <Parallax amount={16} style={{ height: '100%' }}>
              <img src={IMG.heroTeam} alt="Équipe d'ingénieurs analysant des données géospatiales" />
            </Parallax>
          </motion.div>

          <motion.div className="hero__card hero__card--sat"
            initial={reduce ? false : { opacity: 0, x: 40, y: 26 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.95, delay: 0.65, ease: [0.16, 0.84, 0.24, 1] }}>
            <img src={IMG.satLandsat} alt="Image satellite en fausses couleurs" />
          </motion.div>

          <motion.div className="hero__card hero__card--chip"
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 0.84, 0.24, 1] }}>
            <Coords />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const cardIcons = [Icons.globe, Icons.target, Icons.layers, Icons.chart, Icons.code, Icons.cap, Icons.drone, Icons.doc]

  return (
    <PageShell>
      <Hero />
      <Marquee />

      {/* ---- Introduction ---- */}
      <section className="band">
        <div className="shell">
          <Reveal variant="down"><span className="tag">Qui sommes-nous</span></Reveal>
          <WordsUp
            as="h2"
            text="Un cabinet d'ingénierie territoriale né au Togo, tourné vers l'international."
            className="display t-xl"
            delay={0.05}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(24px,4vw,60px)', marginTop: 30 }}>
            <Reveal variant="left" delay={0.1}>
              <p className="body-text">
                CIGATE réunit des ingénieurs géomaticiens, des statisticiens et des économistes autour
                d'une conviction simple : une décision territoriale ne vaut que ce que vaut la donnée
                sur laquelle elle repose.
              </p>
            </Reveal>
            <Reveal variant="right" delay={0.18}>
              <p className="body-text">
                Nous couvrons toute la chaîne, de la collecte sur le terrain jusqu'à la restitution
                cartographique et au développement des outils numériques qui font vivre la donnée
                dans la durée.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- Les huit domaines ---- */}
      <section className="band band--soft">
        <div className="shell">
          <Reveal variant="down"><span className="tag">Nos domaines d'activité</span></Reveal>
          <WordsUp as="h2" text="Huit champs d'intervention, une seule chaîne technique."
            className="display t-xl" delay={0.05} />
          <Reveal variant="blur" delay={0.2}>
            <p className="lede" style={{ marginTop: 18, marginBottom: 'clamp(30px, 4vw, 50px)' }}>
              Nos activités couvrent l'ensemble du cycle de la donnée territoriale, de son
              acquisition sur le terrain à sa valorisation dans vos outils de décision.
            </p>
          </Reveal>

          <Stagger className="cards" gap={0.07}>
            {DOMAINES.map((d, i) => (
              <StaggerItem key={d.slug} variant={i % 2 === 0 ? 'tilt' : 'up'}>
                <div className="card">
                  <span className="card__n">{d.index}</span>
                  <div className="card__icon">{cardIcons[i]}</div>
                  <h3>{d.short}</h3>
                  <p>{d.intro}</p>
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
              <Reveal variant="down"><span className="tag">Télédétection</span></Reveal>
              <Reveal variant="left" delay={0.08}>
                <h2 className="display t-xl" style={{ marginTop: 16 }}>
                  Observer depuis l'espace,<br />comprendre au sol.
                </h2>
              </Reveal>
            </div>
            <Reveal variant="right" delay={0.16}>
              <p className="lede">
                Imagerie satellitaire, acquisition par drone et traitement multispectral : nous
                exploitons l'observation de la Terre pour suivre l'occupation des sols, les
                dynamiques urbaines et les évolutions environnementales.
              </p>
            </Reveal>
          </div>

          <Stagger className="cards" gap={0.09}>
            {[
              { src: IMG.satEarth,    label: 'Imagerie satellitaire' },
              { src: IMG.satDelta,    label: 'Dynamique hydrologique' },
              { src: IMG.satBands,    label: 'Analyse multispectrale' },
              { src: IMG.aerialField, label: 'Parcellaire vu du ciel' },
              { src: IMG.satTexture,  label: 'Occupation des sols' },
              { src: IMG.satOrbit,    label: 'Observation de la Terre' },
              { src: IMG.aerialCoast, label: 'Suivi du littoral' },
              { src: IMG.satIslands,  label: 'Cartographie côtière' },
            ].map((t, i) => (
              <StaggerItem key={t.label} variant={i % 3 === 0 ? 'scale' : i % 3 === 1 ? 'blur' : 'up'}>
                <div className="tile">
                  <img src={t.src} alt={t.label} loading="lazy" />
                  <span className="tile__label">{t.label}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---- Lignes alternées ---- */}
      <section className="band">
        <div className="shell">
          <Reveal variant="down"><span className="tag">En détail</span></Reveal>
          <WordsUp as="h2" text="Ce que nous faisons concrètement." className="display t-xl" delay={0.05} />
          <div style={{ marginTop: 'clamp(24px, 4vw, 44px)' }}>
            {DOMAINES.slice(0, 4).map((d, i) => (
              <FeatureRow key={d.slug} item={d} flip={i % 2 === 1} />
            ))}
          </div>
          <Reveal variant="up" delay={0.1} style={{ marginTop: 40 }}>
            <Link to="/notre-expertise" className="btn btn--outline">
              Voir les huit domaines <span className="btn__arrow">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---- Méthode ---- */}
      <section className="band band--soft">
        <div className="shell">
          <Reveal variant="down"><span className="tag">Notre méthode</span></Reveal>
          <WordsUp as="h2" text="Cinq étapes, de l'écoute au transfert." className="display t-xl" delay={0.05} />
          <div style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
            <Stagger gap={0.08}>
              {METHODE.map((s) => (
                <StaggerItem key={s.n} variant="left">
                  <div className="step">
                    <span className="step__n">{s.n}</span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
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
          <Reveal variant="down"><span className="tag">Pourquoi nous confier votre projet</span></Reveal>
          <WordsUp as="h2" text="Une structure jeune, des méthodes rigoureuses."
            className="display t-xl" delay={0.05} />

          <Stagger className="cards cards--2" gap={0.1} style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
            {ENGAGEMENTS.map((e, i) => (
              <StaggerItem key={e.n} variant={i % 2 === 0 ? 'left' : 'right'}>
                <div className="card">
                  <span className="card__n">{e.n}</span>
                  <h3 style={{ marginTop: 14 }}>{e.title}</h3>
                  <p>{e.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal variant="up" delay={0.12} style={{ marginTop: 'clamp(34px, 5vw, 56px)' }}>
            <p className="tag" style={{ marginBottom: 16 }}>Nous travaillons avec</p>
            <div className="pills">
              {CLIENTS.map((c) => <span className="pill" key={c}>{c}</span>)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Appel ---- */}
      <section className="band band--tight band--soft">
        <div className="shell">
          <Reveal variant="scale">
            <div className="callout">
              <span className="tag" style={{ justifyContent: 'center', color: '#7FC08A' }}>Contact</span>
              <h2 className="display t-lg" style={{ marginTop: 16, maxWidth: '22ch', marginInline: 'auto' }}>
                Une parcelle, une étude, un besoin en données ?
              </h2>
              <p style={{ marginTop: 14, maxWidth: '54ch', marginInline: 'auto', fontSize: 16.5, lineHeight: 1.7 }}>
                Décrivez-nous votre contexte et vos délais. Nous vous répondons rapidement
                avec une première lecture technique et une proposition adaptée.
              </p>
              <div className="callout__actions">
                <Link to="/contact" className="btn btn--green">
                  Nous écrire <span className="btn__arrow">→</span>
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
