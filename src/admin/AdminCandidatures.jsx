import { useCallback, useEffect, useRef, useState } from 'react'
import './candidatures.css'

const API = '/api/admin/candidatures'
const LABELS = { draft: 'À valider', sending: 'Envoi en cours / à vérifier', sent: 'Envoyée', uncertain: 'Envoi à vérifier' }
const dateLabel = (value) => new Date(value).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })

async function request(path = '', body, signal) {
  const response = await fetch(`${API}${path}`, body ? {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal,
  } : { signal })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(response.status === 401 ? 'Votre session a expiré. Reconnectez-vous à l’administration.' : data.error || 'La demande a échoué. Réessayez après avoir actualisé la liste.')
  return data
}

function ReviewDialog({ items, busy, onClose, onSend }) {
  const dialog = useRef(null)
  useEffect(() => { dialog.current.showModal() }, [])
  return (
    <dialog ref={dialog} className="candidature-dialog" aria-labelledby="review-title" onCancel={(event) => { event.preventDefault(); if (!busy) onClose() }}>
      <div className="candidature-dialog__head">
        <h2 id="review-title">Vérifier {items.length === 1 ? 'la réponse' : `les ${items.length} réponses`}</h2>
        <p>Chaque personne recevra uniquement son propre message. Vérifiez les noms et le contenu avant de confirmer.</p>
      </div>
      <div className="candidature-dialog__messages">
        {items.map((row) => (
          <article className="candidature-preview" key={row.id}>
            <strong>{row.name || 'Nom non renseigné'} · {row.email}</strong>
            <p>Objet : {row.response_subject}</p>
            <pre>{row.response_text}</pre>
          </article>
        ))}
      </div>
      <div className="candidature-actions">
        <button className="btn btn--outline" disabled={busy} onClick={onClose}>Revenir aux brouillons</button>
        <button className="btn btn--green" disabled={busy} onClick={onSend}>
          {busy ? 'Envoi en cours…' : `Confirmer l’envoi ${items.length === 1 ? 'de cette réponse' : `des ${items.length} réponses`}`}
        </button>
      </div>
    </dialog>
  )
}

export default function AdminCandidatures() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(new Set())
  const [activeId, setActiveId] = useState(null)
  const [editor, setEditor] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageError, setMessageError] = useState('')
  const [batch, setBatch] = useState(null)
  const [manual, setManual] = useState(null)
  const [review, setReview] = useState(null)
  const items = data?.items || []
  const active = items.find((row) => row.id === activeId)
  const visible = items.filter((row) => (filter === 'all' || row.status === filter) &&
    `${row.name} ${row.email} ${row.subject}`.toLocaleLowerCase('fr').includes(search.toLocaleLowerCase('fr')))
  const draftCount = items.filter((row) => row.status === 'draft').length

  const load = useCallback(async () => {
    const next = await request()
    setData(next)
    return next
  }, [])
  useEffect(() => { load().catch((e) => setError(e.message)) }, [load])

  useEffect(() => {
    if (!activeId) return
    const controller = new AbortController()
    setMessage(null)
    setMessageError('')
    request(`/${activeId}/message`, null, controller.signal)
      .then(setMessage).catch((e) => { if (e.name !== 'AbortError') setMessageError(e.message) })
    return () => controller.abort()
  }, [activeId])

  function open(row) {
    setActiveId(row.id)
    setEditor({ name: row.name, subject: row.response_subject, text: row.response_text, revision: row.revision })
    setBatch(null)
    setManual(null)
    setError('')
  }

  function toggle(id) {
    setSelected((old) => {
      const next = new Set(old)
      if (next.has(id)) next.delete(id)
      else if (next.size < 20) next.add(id)
      return next
    })
    setBatch(null)
  }

  async function refresh(sync = false) {
    setBusy(sync ? 'sync' : 'refresh')
    setError('')
    try {
      if (sync) {
        const result = await request('/sync', {})
        setNotice(`${result.imported} candidature(s) ajoutée(s). ${result.scanned} courriel(s) du dossier vérifié(s).${result.remaining ? ' Cliquez de nouveau pour récupérer les candidatures plus anciennes.' : ''} Aucune réponse envoyée.`)
      }
      await load()
      setSelected(new Set())
      setActiveId(null)
      setEditor(null)
      setBatch(null)
      setManual(null)
    } catch (e) { setError(e.message) } finally { setBusy('') }
  }

  function startBatch() {
    const rows = items.filter((row) => selected.has(row.id) && row.status === 'draft')
    setBatch({ rows, names: Object.fromEntries(rows.map((row) => [row.id, row.name])), subject: data.defaultSubject, text: data.defaultTemplate })
    setActiveId(null)
    setEditor(null)
    setManual(null)
    setError('')
  }

  async function addManual(event) {
    event.preventDefault()
    setBusy('manual')
    setError('')
    try {
      const result = await request('/manual', manual)
      const next = await load()
      const row = next.items.find((item) => item.id === result.item.id) || result.item
      setManual(null)
      setNotice('Le destinataire a été ajouté comme brouillon. Aucun email n’a été envoyé.')
      open(row)
    } catch (e) { setError(e.message) } finally { setBusy('') }
  }

  async function prepare(event) {
    event.preventDefault()
    setBusy('prepare')
    setError('')
    try {
      const payload = batch ? {
        items: batch.rows.map((row) => ({ id: row.id, revision: row.revision, name: batch.names[row.id] })),
        subject: batch.subject, text: batch.text,
      } : { items: [{ id: active.id, revision: editor.revision, name: editor.name }], subject: editor.subject, text: editor.text }
      const prepared = await request('/drafts', payload)
      // Update local versions even if the user cancels the confirmation dialog.
      setData((old) => ({ ...old, items: old.items.map((row) => prepared.items.find((next) => next.id === row.id) || row) }))
      if (batch) setBatch((old) => ({ ...old, rows: prepared.items }))
      else setEditor((old) => ({ ...old, revision: prepared.items[0].revision }))
      setReview(prepared.items)
    } catch (e) { setError(e.message) } finally { setBusy('') }
  }

  async function send() {
    setBusy('send')
    setError('')
    try {
      const result = await request('/send', { approved: true, items: review.map((row) => ({ id: row.id, revision: row.revision })) })
      const sent = result.items.filter((row) => row.status === 'sent').length
      setNotice(`${sent} réponse(s) envoyée(s).${sent < result.items.length ? ' Certains envois sont à vérifier dans Infomaniak avant toute nouvelle tentative.' : ''}`)
    } catch (e) { setError(`${e.message} Vérifiez les statuts avant une nouvelle tentative.`) }
    finally {
      setReview(null)
      setBatch(null)
      setSelected(new Set())
      setActiveId(null)
      setEditor(null)
      await load().catch((e) => setError(e.message))
      setBusy('')
    }
  }

  const form = batch || editor
  const updateForm = (key, value) => batch ? setBatch((old) => ({ ...old, [key]: value })) : setEditor((old) => ({ ...old, [key]: value }))
  return (
    <div className="candidatures">
      <div className="admin__head">
        <div><h1 className="display t-lg">Candidatures</h1><p className="candidature-muted">{draftCount} à valider · Chaque envoi nécessite votre accord.</p></div>
        <div className="candidature-actions">
          <button className="btn btn--outline" onClick={() => { setManual({ name: '', email: '' }); setActiveId(null); setEditor(null); setBatch(null); setError('') }} disabled={Boolean(busy)}>Ajouter un destinataire</button>
          <button className="btn btn--outline" onClick={() => refresh()} disabled={Boolean(busy)}>Actualiser</button>
          <button className="btn btn--green" onClick={() => refresh(true)} disabled={Boolean(busy) || !data?.configured}>
            {busy === 'sync' ? 'Récupération…' : 'Récupérer depuis Infomaniak'}
          </button>
        </div>
      </div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      {notice && <p className="candidature-notice" role="status">{notice}</p>}
      {data && !data.configured && <p className="candidature-notice">La boîte mail des candidatures n’est pas encore connectée. Renseignez son adresse, son mot de passe et le dossier dédié dans la configuration du serveur.</p>}
      {data?.configured && <p className="candidature-notice">Source : {data.mailbox} · {data.folder === 'INBOX' ? 'Boîte de réception' : `Dossier ${data.folder}`}. {data.subjectTerms?.length > 0 && <>Seuls les objets contenant {data.subjectTerms.join(', ')} sont proposés comme candidatures.</>} Aucun courriel n’est envoyé lors de la récupération.</p>}
      <div className="candidature-filters">
        <label className="field">Rechercher<input type="search" placeholder="Nom, adresse ou objet…" value={search} onChange={(e) => setSearch(e.target.value)} /></label>
        <label className="field">Statut<select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">Toutes les candidatures</option>{Object.entries(LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      </div>
      <div className="candidature-selection">
        <span>{selected.size} sélectionnée(s) · 20 maximum par lot</span>
        <button className="btn btn--outline" disabled={Boolean(busy) || !visible.some((row) => row.status === 'draft')} onClick={() => { setSelected(new Set(visible.filter((row) => row.status === 'draft').slice(0, 20).map((row) => row.id))); setBatch(null) }}>Sélectionner les 20 premières</button>
        <button className="btn btn--green" disabled={!selected.size || Boolean(busy)} onClick={startBatch}>Préparer les réponses du lot</button>
        {selected.size > 0 && <button className="candidature-link" disabled={Boolean(busy)} onClick={() => { setSelected(new Set()); setBatch(null) }}>Désélectionner</button>}
      </div>
      <div className="candidature-layout">
        <section className="candidature-list" aria-label="Liste des candidatures">
          {!data && !error && <p>Chargement…</p>}
          {data && !visible.length && <p className="candidature-empty">{items.length ? 'Aucun résultat pour ces filtres.' : 'Récupérez les candidatures de votre dossier Infomaniak pour préparer vos réponses.'}</p>}
          {visible.map((row) => (
            <div className={`candidature-row ${activeId === row.id ? 'is-active' : ''}`} key={row.id}>
              <input type="checkbox" aria-label={`Sélectionner ${row.name || row.email}`} checked={selected.has(row.id)} disabled={row.status !== 'draft' || Boolean(busy) || (!selected.has(row.id) && selected.size >= 20)} onChange={() => toggle(row.id)} />
              <button className="candidature-row__open" disabled={Boolean(busy)} onClick={() => open(row)}>
                <strong>{row.name || row.email}</strong><span>{row.subject}</span>
                <small>{dateLabel(row.received_at)}</small><span className={`candidature-status candidature-status--${row.status}`}>{LABELS[row.status]}</span>
              </button>
            </div>
          ))}
          {items.length === 500 && <p className="candidature-muted">Affichage des 500 candidatures les plus récentes.</p>}
        </section>
        <section className="candidature-workspace" aria-label="Préparation des réponses">
          {!active && !batch && !manual && <div className="candidature-empty"><h2>Une réponse à la fois, ou par lot</h2><p>Ouvrez une candidature pour lire le message et rédiger une réponse. Cochez plusieurs personnes pour préparer un modèle personnalisé.</p><p>Les noms et les textes seront affichés avant votre confirmation.</p></div>}
          {manual && <form className="form" onSubmit={addManual}>
            <h2>Ajouter un destinataire</h2>
            <p className="candidature-muted">Cette personne sera ajoutée à la liste avec une réponse en brouillon. Aucun email ne sera envoyé à cette étape.</p>
            <label className="field">Nom du candidat<input autoFocus maxLength={160} value={manual.name} onChange={(e) => setManual((old) => ({ ...old, name: e.target.value }))} /></label>
            <label className="field">Adresse email<input type="email" maxLength={254} required value={manual.email} onChange={(e) => setManual((old) => ({ ...old, email: e.target.value }))} /></label>
            <div className="candidature-actions">
              <button className="btn btn--green" disabled={Boolean(busy) || !data?.configured} type="submit">{busy === 'manual' ? 'Ajout…' : 'Créer le brouillon'}</button>
              <button className="btn btn--outline" disabled={Boolean(busy)} type="button" onClick={() => setManual(null)}>Annuler</button>
            </div>
          </form>}
          {active && <>
            <h2>{active.name || 'Candidature sans nom'}</h2><p>{active.email}</p><p className="candidature-muted">{active.subject}</p>
            <details className="candidature-message" open>
              <summary>Message reçu</summary>
              {messageError && <p className="admin-error">{messageError}</p>}
              {!message && !messageError && <p>Lecture du message…</p>}
              {message && <><pre>{message.text}</pre>{message.attachments.length > 0 && <p>Pièces jointes : {message.attachments.map((item) => item.filename).join(', ')}</p>}<a className="candidature-link" href={`${API}/${active.id}/message?download=1`}>Télécharger le courriel et ses pièces jointes (.eml)</a></>}
            </details>
          </>}
          {form && (batch || active?.status === 'draft') && <form className="form" onSubmit={prepare}>
            <h2>{batch ? `Modèle pour ${batch.rows.length} personne(s)` : 'Votre réponse'}</h2>
            {batch ? <>
              <p className="candidature-muted">Utilisez {'{{nom}}'} pour insérer le nom de chaque personne et {'{{email}}'} pour son adresse. Sans nom, « Bonjour {'{{nom}}'}, » devient « Bonjour, ».</p>
              <details className="candidature-names"><summary>Vérifier ou corriger les noms</summary>{batch.rows.map((row) => <label className="field" key={row.id}>{row.email}<input maxLength={160} value={batch.names[row.id]} placeholder="Nom du candidat" onChange={(e) => setBatch((old) => ({ ...old, names: { ...old.names, [row.id]: e.target.value } }))} /></label>)}</details>
            </> : <label className="field">Nom du candidat<input maxLength={160} value={editor.name} onChange={(e) => updateForm('name', e.target.value)} /></label>}
            <label className="field">Objet<input maxLength={200} required value={form.subject} onChange={(e) => updateForm('subject', e.target.value)} /></label>
            <label className="field">{batch ? 'Modèle de réponse' : 'Texte de la réponse'}<textarea rows={12} maxLength={10000} required value={form.text} onChange={(e) => updateForm('text', e.target.value)} /></label>
            <button className="btn btn--green" disabled={Boolean(busy) || !data?.configured} type="submit">{busy === 'prepare' ? 'Préparation…' : batch ? 'Vérifier les réponses personnalisées' : 'Vérifier cette réponse'}</button>
            <p className="candidature-muted">Cette étape enregistre les brouillons. Vous confirmerez ensuite l’envoi.</p>
          </form>}
          {active && active.status !== 'draft' && <div className="candidature-preview"><h2>{LABELS[active.status]}</h2>{active.sent_at && <p>{dateLabel(active.sent_at)}</p>}<p>{active.response_subject}</p><pre>{active.response_text}</pre>{active.status !== 'sent' && <p>Vérifiez la réception auprès du destinataire ou dans les journaux Infomaniak avant tout renvoi. Aucun nouvel envoi n’est lancé depuis cette candidature.</p>}</div>}
        </section>
      </div>
      {review && <ReviewDialog items={review} busy={busy === 'send'} onClose={() => setReview(null)} onSend={send} />}
    </div>
  )
}
