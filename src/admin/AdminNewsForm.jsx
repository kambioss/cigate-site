import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { NEWS_CATEGORIES } from '../data/content'

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const EMPTY = {
  slug: '', category: 'cabinet', date: new Date().toISOString().slice(0, 10),
  image_key: '', title_fr: '', title_en: '', excerpt_fr: '', excerpt_en: '',
  body_fr: '', body_en: '', published: 1,
}

export default function AdminNewsForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [data, setData] = useState(EMPTY)
  const [slugTouched, setSlugTouched] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    fetch(`/api/admin/news/${id}`)
      .then((r) => r.json())
      .then((row) => { setData({ ...EMPTY, ...row }); setSlugTouched(true) })
  }, [id, isEdit])

  function set(key) {
    return (e) => setData((d) => ({ ...d, [key]: e.target.value }))
  }

  function onTitleFrChange(e) {
    const value = e.target.value
    setData((d) => ({ ...d, title_fr: value, slug: slugTouched ? d.slug : slugify(value) }))
  }

  async function onFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setError('')
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/admin/media', { method: 'POST', body: form })
    setUploading(false)
    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      setError(json.error || 'Échec de l’envoi de l’image.')
      return
    }
    const json = await res.json()
    setData((d) => ({ ...d, image_key: json.key }))
  }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const method = isEdit ? 'PUT' : 'POST'
    const url = isEdit ? `/api/admin/news/${id}` : '/api/admin/news'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, published: Number(data.published) ? 1 : 0 }),
    })
    setSaving(false)
    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      setError(json.error || 'Erreur lors de l’enregistrement.')
      return
    }
    navigate('/admin/news')
  }

  return (
    <div>
      <div className="admin__head">
        <h1 className="display t-lg">{isEdit ? 'Modifier l’actualité' : 'Nouvelle actualité'}</h1>
        <Link to="/admin/news" className="btn btn--outline">Retour</Link>
      </div>

      <form className="form admin-form" onSubmit={submit}>
        <div className="form__row">
          <div className="field">
            <label htmlFor="title_fr">Titre (FR)</label>
            <input id="title_fr" value={data.title_fr} onChange={onTitleFrChange} required />
          </div>
          <div className="field">
            <label htmlFor="title_en">Titre (EN)</label>
            <input id="title_en" value={data.title_en} onChange={set('title_en')} required />
          </div>
        </div>

        <div className="form__row">
          <div className="field">
            <label htmlFor="slug">Slug</label>
            <input
              id="slug" value={data.slug} required
              onChange={(e) => { setSlugTouched(true); setData((d) => ({ ...d, slug: slugify(e.target.value) })) }}
            />
          </div>
          <div className="field">
            <label htmlFor="date">Date</label>
            <input id="date" type="date" value={data.date} onChange={set('date')} required />
          </div>
        </div>

        <div className="form__row">
          <div className="field">
            <label htmlFor="category">Catégorie</label>
            <select id="category" value={data.category} onChange={set('category')}>
              {NEWS_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label.fr}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="published">Statut</label>
            <select
              id="published" value={data.published}
              onChange={(e) => setData((d) => ({ ...d, published: Number(e.target.value) }))}
            >
              <option value={1}>Publié</option>
              <option value={0}>Brouillon</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="excerpt_fr">Extrait (FR)</label>
          <textarea id="excerpt_fr" value={data.excerpt_fr} onChange={set('excerpt_fr')} required />
        </div>
        <div className="field">
          <label htmlFor="excerpt_en">Extrait (EN)</label>
          <textarea id="excerpt_en" value={data.excerpt_en} onChange={set('excerpt_en')} required />
        </div>

        <div className="field">
          <label htmlFor="body_fr">Corps (FR, optionnel)</label>
          <textarea id="body_fr" value={data.body_fr || ''} onChange={set('body_fr')} />
        </div>
        <div className="field">
          <label htmlFor="body_en">Corps (EN, optionnel)</label>
          <textarea id="body_en" value={data.body_en || ''} onChange={set('body_en')} />
        </div>

        <div className="field">
          <label>Image</label>
          {data.image_key && <img src={`/media/${data.image_key}`} alt="" className="admin-thumb" />}
          <input type="file" accept="image/*" onChange={onFile} disabled={uploading} />
          {uploading && <span className="form__note">Envoi en cours…</span>}
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="form__submit">
          <button className="btn btn--green" type="submit" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}
