import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import Reveal from '../components/Motion'

export default function NotFound() {
  return (
    <PageShell>
      <section className="band" style={{ paddingTop: 'clamp(150px, 18vw, 220px)' }}>
        <div className="shell">
          <Reveal variant="down"><span className="tag">Erreur 404</span></Reveal>
          <Reveal variant="left" delay={0.08}>
            <h1 className="display t-xl" style={{ marginTop: 18, maxWidth: '16ch' }}>
              Cette page ne figure pas sur notre carte.
            </h1>
          </Reveal>
          <Reveal variant="blur" delay={0.18}>
            <p className="lede" style={{ marginTop: 18 }}>
              L'adresse demandée est introuvable. Revenez à l'accueil pour reprendre la navigation.
            </p>
          </Reveal>
          <Reveal variant="up" delay={0.26} style={{ marginTop: 30 }}>
            <Link to="/" className="btn btn--green">
              Retour à l'accueil <span className="btn__arrow">→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}
