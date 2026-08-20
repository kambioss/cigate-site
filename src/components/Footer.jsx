import { Link } from 'react-router-dom'
import { CONTACT, DOMAINES } from '../data/content'

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="shell">
        <div className="ftr__top">
          <div>
            <span className="ftr__logo"><img src="/images/logo-cigate.png" alt="CIGATE" /></span>
            <p className="ftr__blurb">
              {CONTACT.denomination}. Société à responsabilité limitée de droit togolais,
              établie à Lomé et intervenant au Togo comme à l'international.
            </p>
          </div>

          <div>
            <h4>Domaines</h4>
            <ul>
              {DOMAINES.slice(0, 5).map((d) => (
                <li key={d.slug}><Link to="/notre-expertise">{d.short}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/qui-sommes-nous">Qui sommes-nous</Link></li>
              <li><Link to="/notre-expertise">Notre expertise</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4>Nous joindre</h4>
            <ul>
              <li><a href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a></li>
              <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
              <li><span>{CONTACT.address}</span></li>
            </ul>
          </div>
        </div>

        <div className="ftr__bottom">
          <span>© {new Date().getFullYear()} {CONTACT.raison} — Tous droits réservés.</span>
          <span>Lomé · {CONTACT.coord}</span>
        </div>
      </div>
    </footer>
  )
}
