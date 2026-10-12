import { Link } from 'react-router-dom'
import Reveal, { Parallax } from './Motion'
import { useI18n } from '../i18n/I18nProvider'

/**
 * Ligne alternée image / texte.
 * L'image entre par un côté, le texte par l'autre, avec un décalage.
 * L'image a en plus une légère parallaxe verticale au scroll.
 */
export default function FeatureRow({ item, flip = false, cta }) {
  const { tf } = useI18n()
  return (
    <article className={`feature ${flip ? 'feature--flip' : ''}`}>
      <Reveal variant={flip ? 'right' : 'left'} distance={78} className="feature__media">
        <span className="feature__index">{item.index}</span>
        <Parallax amount={22} style={{ height: '100%' }}>
          <img src={item.image} alt="" loading="lazy" />
        </Parallax>
      </Reveal>

      <Reveal variant={flip ? 'left' : 'right'} distance={78} delay={0.14} className="feature__body">
        <h3 className="display t-lg">{tf(item.title)}</h3>
        <p className="body-text">{tf(item.intro)}</p>
        <ul className="feature__list">
          {tf(item.points).map((p) => <li key={p}>{p}</li>)}
        </ul>
        {item.tag && <span className="feature__tag">{tf(item.tag)}</span>}
        {cta && (
          <div style={{ marginTop: 26 }}>
            <Link to={cta.to} className="btn btn--green">
              {cta.label} <span className="btn__arrow">→</span>
            </Link>
          </div>
        )}
      </Reveal>
    </article>
  )
}
