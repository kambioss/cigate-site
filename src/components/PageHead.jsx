import Reveal, { WordsUp } from './Motion'
import SEO from './SEO'

export default function PageHead({ tag, title, lede, pathFr, pathEn }) {
  return (
    <section className="pagehead">
      <SEO title={title} description={lede} pathFr={pathFr} pathEn={pathEn} />
      <div className="shell pagehead__inner">
        <Reveal variant="down"><span className="tag">{tag}</span></Reveal>
        <WordsUp as="h1" text={title} className="display t-xl" delay={0.06} />
        {lede && (
          <Reveal variant="blur" delay={0.24}>
            <p className="lede" style={{ marginTop: 20 }}>{lede}</p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
