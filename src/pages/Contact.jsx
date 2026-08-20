import { useState } from 'react'
import PageShell from '../components/PageShell'
import PageHead from '../components/PageHead'
import Reveal from '../components/Motion'
import { CONTACT, DOMAINES } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'

export default function Contact() {
  const { t, tf } = useI18n()
  const [sent, setSent] = useState(false)
  const [f, setF] = useState({ nom: '', email: '', tel: '', organisation: '', domaine: '', message: '' })
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    // Ouvre la messagerie du visiteur avec la demande pré-remplie.
    // Pour un envoi serveur, branchez ici un Cloudflare Worker ou un service de formulaire.
    const mf = t('contact.mailFields')
    const body = [
      `${mf.nom} : ${f.nom}`,
      `${mf.org} : ${f.organisation}`,
      `${mf.mail} : ${f.email}`,
      `${mf.tel} : ${f.tel}`,
      `${mf.domaine} : ${f.domaine}`,
      '',
      f.message,
    ].join('\n')
    window.location.href =
      `mailto:${CONTACT.email}?subject=${encodeURIComponent(`${t('contact.mailSubject')} ${f.domaine || mf.domaine}`)}` +
      `&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <PageShell>
      <PageHead
        tag={t('contact.head.tag')}
        title={t('contact.head.title')}
        lede={t('contact.head.lede')}
      />

      <section className="band">
        <div className="shell form-grid">
          <Reveal variant="left" distance={70}>
            {sent ? (
              <div className="form__ok">
                {t('contact.successPrefix')} <strong>{CONTACT.email}</strong> {t('contact.successOr')} {CONTACT.phone}.
              </div>
            ) : (
              <form className="form" onSubmit={submit}>
                <div className="form__row">
                  <div className="field">
                    <label htmlFor="nom">{t('contact.labels.nom')}</label>
                    <input id="nom" required value={f.nom} onChange={set('nom')} placeholder={t('contact.placeholders.nom')} />
                  </div>
                  <div className="field">
                    <label htmlFor="org">{t('contact.labels.org')}</label>
                    <input id="org" value={f.organisation} onChange={set('organisation')} placeholder={t('contact.placeholders.org')} />
                  </div>
                </div>

                <div className="form__row">
                  <div className="field">
                    <label htmlFor="email">{t('contact.labels.email')}</label>
                    <input id="email" type="email" required value={f.email} onChange={set('email')} placeholder={t('contact.placeholders.email')} />
                  </div>
                  <div className="field">
                    <label htmlFor="tel">{t('contact.labels.tel')}</label>
                    <input id="tel" type="tel" value={f.tel} onChange={set('tel')} placeholder={t('contact.placeholders.tel')} />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="dom">{t('contact.labels.domaine')}</label>
                  <select id="dom" value={f.domaine} onChange={set('domaine')}>
                    <option value="">{t('contact.domaineDefault')}</option>
                    {DOMAINES.map((d) => <option key={d.slug}>{tf(d.short)}</option>)}
                    <option>{t('contact.domaineOther')}</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="msg">{t('contact.labels.message')}</label>
                  <textarea id="msg" required rows={5} value={f.message} onChange={set('message')}
                    placeholder={t('contact.placeholders.message')} />
                </div>

                <div className="form__submit">
                  <button type="submit" className="btn btn--green">
                    {t('contact.submit')} <span className="btn__arrow">→</span>
                  </button>
                  <span className="form__note">{t('contact.note')}</span>
                </div>
              </form>
            )}
          </Reveal>

          <Reveal variant="right" distance={70} delay={0.14}>
            <div className="infocard">
              <span className="tag" style={{ marginBottom: 18 }}>{t('contact.infoTag')}</span>
              <dl>
                <div className="inforow"><dt>{t('contact.infoLabels.raison')}</dt><dd>{CONTACT.raison}</dd></div>
                <div className="inforow"><dt>{t('contact.infoLabels.siege')}</dt><dd>{CONTACT.address}</dd></div>
                <div className="inforow"><dt>{t('contact.infoLabels.tel')}</dt><dd><a href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a></dd></div>
                <div className="inforow"><dt>{t('contact.infoLabels.mail')}</dt><dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd></div>
                <div className="inforow"><dt>{t('contact.infoLabels.horaires')}</dt><dd>{tf(CONTACT.hours)}</dd></div>
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
