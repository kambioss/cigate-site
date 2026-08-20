import { Link } from 'react-router-dom'
import { CONTACT, DOMAINES, NAV } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'

export default function Footer() {
  const { lang, t, tf } = useI18n()
  const navTo = (to) => (lang === 'en' ? (to === '/' ? '/en' : `/en${to}`) : to)

  return (
    <footer className="ftr">
      <div className="shell">
        <div className="ftr__top">
          <div>
            <span className="ftr__logo"><img src="/images/logo-cigate.png" alt="CIGATE" /></span>
            <p className="ftr__blurb">
              {CONTACT.denomination}. {t('footer.blurb')}
            </p>
          </div>

          <div>
            <h4>{t('footer.domainesHeading')}</h4>
            <ul>
              {DOMAINES.slice(0, 5).map((d) => (
                <li key={d.slug}><Link to={navTo('/notre-expertise')}>{tf(d.short)}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{t('footer.navHeading')}</h4>
            <ul>
              {NAV.map((n) => (
                <li key={n.to}><Link to={navTo(n.to)}>{tf(n.label)}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{t('footer.contactHeading')}</h4>
            <ul>
              <li><a href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a></li>
              <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
              <li><span>{CONTACT.address}</span></li>
            </ul>
          </div>
        </div>

        <div className="ftr__bottom">
          <span>© {new Date().getFullYear()} {CONTACT.raison} — {t('footer.rights')}</span>
          <span>Lomé · {CONTACT.coord}</span>
        </div>
      </div>
    </footer>
  )
}
