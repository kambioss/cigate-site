import { useState } from 'react'
import PageShell from '../components/PageShell'
import PageHead from '../components/PageHead'
import Reveal from '../components/Motion'
import { CONTACT, DOMAINES } from '../data/content'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [f, setF] = useState({ nom: '', email: '', tel: '', organisation: '', domaine: '', message: '' })
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    // Ouvre la messagerie du visiteur avec la demande pré-remplie.
    // Pour un envoi serveur, branchez ici un Cloudflare Worker ou un service de formulaire.
    const body = [
      `Nom : ${f.nom}`,
      `Organisation : ${f.organisation}`,
      `Courriel : ${f.email}`,
      `Téléphone : ${f.tel}`,
      `Domaine : ${f.domaine}`,
      '',
      f.message,
    ].join('\n')
    window.location.href =
      `mailto:${CONTACT.email}?subject=${encodeURIComponent('Demande via le site — ' + (f.domaine || 'Projet'))}` +
      `&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <PageShell>
      <PageHead
        tag="Contact"
        title="Parlons de votre projet."
        lede="Pour une mission, une étude, une fourniture d'équipement ou un partenariat, décrivez-nous brièvement votre contexte, la localisation concernée et vos délais."
      />

      <section className="band">
        <div className="shell form-grid">
          <Reveal variant="left" distance={70}>
            {sent ? (
              <div className="form__ok">
                Votre demande a été préparée dans votre messagerie. Si rien ne s'est ouvert
                automatiquement, écrivez-nous directement à <strong>{CONTACT.email}</strong> ou
                appelez le {CONTACT.phone}.
              </div>
            ) : (
              <form className="form" onSubmit={submit}>
                <div className="form__row">
                  <div className="field">
                    <label htmlFor="nom">Nom et prénom</label>
                    <input id="nom" required value={f.nom} onChange={set('nom')} placeholder="Votre nom complet" />
                  </div>
                  <div className="field">
                    <label htmlFor="org">Organisation</label>
                    <input id="org" value={f.organisation} onChange={set('organisation')} placeholder="Votre structure" />
                  </div>
                </div>

                <div className="form__row">
                  <div className="field">
                    <label htmlFor="email">Adresse électronique</label>
                    <input id="email" type="email" required value={f.email} onChange={set('email')} placeholder="vous@organisation.tg" />
                  </div>
                  <div className="field">
                    <label htmlFor="tel">Téléphone</label>
                    <input id="tel" type="tel" value={f.tel} onChange={set('tel')} placeholder="+228 ..." />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="dom">Domaine concerné</label>
                  <select id="dom" value={f.domaine} onChange={set('domaine')}>
                    <option value="">Sélectionnez un domaine</option>
                    {DOMAINES.map((d) => <option key={d.slug}>{d.short}</option>)}
                    <option>Partenariat ou autre demande</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="msg">Votre besoin</label>
                  <textarea id="msg" required rows={5} value={f.message} onChange={set('message')}
                    placeholder="Localisation, surface concernée, échéances, livrables attendus…" />
                </div>

                <div className="form__submit">
                  <button type="submit" className="btn btn--green">
                    Envoyer la demande <span className="btn__arrow">→</span>
                  </button>
                  <span className="form__note">Réponse rapide, sous 48 h ouvrées</span>
                </div>
              </form>
            )}
          </Reveal>

          <Reveal variant="right" distance={70} delay={0.14}>
            <div className="infocard">
              <span className="tag" style={{ marginBottom: 18 }}>Nous joindre</span>
              <dl>
                <div className="inforow"><dt>Raison sociale</dt><dd>{CONTACT.raison}</dd></div>
                <div className="inforow"><dt>Siège social</dt><dd>{CONTACT.address}</dd></div>
                <div className="inforow"><dt>Téléphone</dt><dd><a href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a></dd></div>
                <div className="inforow"><dt>Courriel</dt><dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd></div>
                <div className="inforow"><dt>Horaires</dt><dd>{CONTACT.hours}</dd></div>
              </dl>
              <div className="locus" aria-hidden="true">
                <span className="locus__ring" />
                <span className="locus__pin" />
                <span className="mono" style={{ position: 'absolute', right: 10, bottom: 8, fontSize: 10, color: 'var(--mute)' }}>
                  {CONTACT.coord}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}
