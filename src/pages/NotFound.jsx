import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import Reveal from '../components/Motion'
import { useI18n } from '../i18n/I18nProvider'

export default function NotFound() {
  const { lang, t } = useI18n()
  const home = lang === 'en' ? '/en' : '/'

  return (
    <PageShell>
      <section className="band" style={{ paddingTop: 'clamp(150px, 18vw, 220px)' }}>
        <div className="shell">
          <Reveal variant="down"><span className="tag">{t('notFound.tag')}</span></Reveal>
          <Reveal variant="left" delay={0.08}>
            <h1 className="display t-xl" style={{ marginTop: 18, maxWidth: '16ch' }}>
              {t('notFound.title')}
            </h1>
          </Reveal>
          <Reveal variant="blur" delay={0.18}>
            <p className="lede" style={{ marginTop: 18 }}>
              {t('notFound.text')}
            </p>
          </Reveal>
          <Reveal variant="up" delay={0.26} style={{ marginTop: 30 }}>
            <Link to={home} className="btn btn--green">
              {t('notFound.cta')} <span className="btn__arrow">→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}
