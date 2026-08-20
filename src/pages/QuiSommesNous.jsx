import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import PageHead from '../components/PageHead'
import Reveal, { Stagger, StaggerItem, WordsUp, Parallax } from '../components/Motion'
import { Icons } from '../components/Icons'
import { CLIENTS, CONTACT, DOMAINES, ENGAGEMENTS, IMG } from '../data/content'

const METIER_ICONS = [Icons.globe, Icons.target, Icons.layers, Icons.chart, Icons.code, Icons.cap, Icons.drone, Icons.doc]

export default function QuiSommesNous() {
  return (
    <PageShell>
      <PageHead
        tag="Qui sommes-nous"
        title="Un cabinet d'ingénierie territoriale né à Lomé."
        lede="CIGATE — Cabinet International de Géomatique, Aménagement, Topographie et Environnement — est une société à responsabilité limitée de droit togolais, constituée sous le régime OHADA et intervenant au Togo comme à l'international."
      />

      {/* Présentation */}
      <section className="band">
        <div className="shell">
          <article className="feature" style={{ borderTop: 'none', paddingTop: 0 }}>
            <Reveal variant="left" distance={78} className="feature__media">
              <Parallax amount={24} style={{ height: '100%' }}>
                <img src={IMG.collab} alt="Collaboration en réunion de travail" loading="lazy" />
              </Parallax>
            </Reveal>
            <Reveal variant="right" distance={78} delay={0.14} className="feature__body">
              <h2 className="display t-lg">Une équipe pluridisciplinaire, un seul standard.</h2>
              <p className="body-text" style={{ marginTop: 16 }}>
                Notre cabinet réunit des ingénieurs géomaticiens, des statisticiens et des
                économistes. Cette pluridisciplinarité n'est pas une façade : elle permet qu'une
                contrainte environnementale ou économique soit identifiée dès la phase de levé,
                et non découverte au moment de l'instruction du dossier.
              </p>
              <p className="body-text" style={{ marginTop: 16 }}>
                Nous sommes une structure récente, et nous l'assumons. Ce que nous apportons n'est
                pas un catalogue de références, mais une exigence méthodologique, une disponibilité
                réelle et des compétences techniques directement mobilisables sur votre projet.
              </p>
            </Reveal>
          </article>
        </div>
      </section>

      {/* Métiers */}
      <section className="band band--soft">
        <div className="shell">
          <Reveal variant="down"><span className="tag">Nos métiers</span></Reveal>
          <WordsUp as="h2" text="Huit compétences réunies sous un même toit."
            className="display t-xl" delay={0.05} />

          <Stagger className="cards" gap={0.07} style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
            {DOMAINES.map((d, i) => (
              <StaggerItem key={d.slug} variant={i % 2 === 0 ? 'tilt' : 'scale'}>
                <div className="card">
                  <span className="card__n">{d.index}</span>
                  <div className="card__icon">{METIER_ICONS[i]}</div>
                  <h3>{d.short}</h3>
                  <p>{d.intro}</p>
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
              <Reveal variant="down"><span className="tag">Notre vision</span></Reveal>
              <Reveal variant="left" delay={0.08}>
                <h2 className="display t-xl" style={{ marginTop: 16 }}>
                  La donnée territoriale<br />comme bien commun.
                </h2>
              </Reveal>
              <Reveal variant="blur" delay={0.2}>
                <p className="lede" style={{ marginTop: 20 }}>
                  L'Afrique de l'Ouest se transforme vite, et beaucoup de décisions d'aménagement
                  se prennent encore sans base cartographique fiable. Nous voulons contribuer à
                  combler cet écart : produire des données précises, documentées et réutilisables,
                  puis en transmettre la maîtrise à ceux qui gèrent le territoire au quotidien.
                </p>
              </Reveal>
            </div>
            <Reveal variant="wipe" delay={0.15}>
              <div style={{ borderRadius: 6, overflow: 'hidden', aspectRatio: '4/3' }}>
                <img src={IMG.satDelta} alt="Vue satellitaire d'un delta fluvial" loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="band">
        <div className="shell">
          <Reveal variant="down"><span className="tag">Nos engagements</span></Reveal>
          <WordsUp as="h2" text="Ce sur quoi vous pouvez nous attendre."
            className="display t-xl" delay={0.05} />

          <div style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
            <Stagger gap={0.08}>
              {ENGAGEMENTS.map((e, i) => (
                <StaggerItem key={e.n} variant={i % 2 === 0 ? 'left' : 'right'}>
                  <div className="step">
                    <span className="step__n">{e.n}</span>
                    <h3>{e.title}</h3>
                    <p>{e.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Reveal variant="up" delay={0.14} style={{ marginTop: 'clamp(34px, 5vw, 54px)' }}>
            <p className="tag" style={{ marginBottom: 16 }}>Nos interlocuteurs</p>
            <div className="pills">
              {CLIENTS.map((c) => <span className="pill" key={c}>{c}</span>)}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="band band--tight band--soft">
        <div className="shell">
          <Reveal variant="scale">
            <div className="callout">
              <h2 className="display t-lg" style={{ maxWidth: '24ch', marginInline: 'auto' }}>
                Faisons connaissance autour de votre projet.
              </h2>
              <div className="callout__actions">
                <Link to="/contact" className="btn btn--green">
                  Nous contacter <span className="btn__arrow">→</span>
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
