import Reveal, { Parallax } from './Motion'

/**
 * Ligne alternée image / texte.
 * L'image entre par un côté, le texte par l'autre, avec un décalage.
 * L'image a en plus une légère parallaxe verticale au scroll.
 */
export default function FeatureRow({ item, flip = false }) {
  return (
    <article className={`feature ${flip ? 'feature--flip' : ''}`}>
      <Reveal variant={flip ? 'right' : 'left'} distance={78} className="feature__media">
        <span className="feature__index">{item.index}</span>
        <Parallax amount={22} style={{ height: '100%' }}>
          <img src={item.image} alt="" loading="lazy" />
        </Parallax>
      </Reveal>

      <Reveal variant={flip ? 'left' : 'right'} distance={78} delay={0.14} className="feature__body">
        <h3 className="display t-lg">{item.title}</h3>
        <p className="body-text">{item.intro}</p>
        <ul className="feature__list">
          {item.points.map((p) => <li key={p}>{p}</li>)}
        </ul>
        <span className="feature__tag">{item.tag}</span>
      </Reveal>
    </article>
  )
}
