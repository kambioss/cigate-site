import { useEffect, useState } from 'react'

export default function AdminMedia() {
  const [items, setItems] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  function load() {
    fetch('/api/admin/media')
      .then((r) => { if (!r.ok) throw new Error('bad'); return r.json() })
      .then(setItems)
      .catch(() => setError('Impossible de charger la médiathèque.'))
  }
  useEffect(load, [])

  async function onUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setError('')
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/admin/media', { method: 'POST', body: form })
    setUploading(false)
    e.target.value = ''
    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      setError(json.error || 'Échec de l’envoi.')
      return
    }
    load()
  }

  async function remove(key) {
    if (!confirm('Supprimer définitivement ce fichier ?')) return
    await fetch(`/api/admin/media/${key}`, { method: 'DELETE' })
    load()
  }

  async function copyUrl(key) {
    const url = `${location.origin}/media/${key}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(key)
      setTimeout(() => setCopied(''), 1500)
    } catch {
      /* clipboard indisponible, on ignore */
    }
  }

  return (
    <div>
      <div className="admin__head">
        <h1 className="display t-lg">Médiathèque</h1>
        <label className="btn btn--green admin-upload-btn">
          {uploading ? 'Envoi…' : 'Ajouter une image'}
          <input type="file" accept="image/*" onChange={onUpload} disabled={uploading} />
        </label>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {items?.length === 0 && <p className="admin-login__note">Aucun média pour l'instant.</p>}

      <div className="admin-media-grid">
        {items?.map((m) => (
          <div className="admin-media-card" key={m.key}>
            <img src={m.url} alt={m.filename || ''} loading="lazy" />
            <div className="admin-media-card__actions">
              <button onClick={() => copyUrl(m.key)}>{copied === m.key ? 'Copié !' : 'Copier l’URL'}</button>
              <button onClick={() => remove(m.key)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
