import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORY_LABELS_FR } from '../data/content'

export default function AdminNewsList() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')

  function load() {
    fetch('/api/admin/news')
      .then((r) => { if (!r.ok) throw new Error('bad'); return r.json() })
      .then(setItems)
      .catch(() => setError('Impossible de charger les actualités.'))
  }
  useEffect(load, [])

  async function remove(id) {
    if (!confirm('Supprimer définitivement cette actualité ?')) return
    await fetch(`/api/admin/news/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div className="admin__head">
        <h1 className="display t-lg">Actualités</h1>
        <Link to="/admin/news/new" className="btn btn--green">Nouvelle actualité</Link>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table">
        <div className="admin-table__row admin-table__row--head">
          <span>Titre</span><span>Catégorie</span><span>Date</span><span>Statut</span><span />
        </div>
        {items === null && !error && <div className="admin-table__row"><span>Chargement…</span></div>}
        {items?.length === 0 && <div className="admin-table__row"><span>Aucune actualité pour l'instant.</span></div>}
        {items?.map((n) => (
          <div className="admin-table__row" key={n.id}>
            <span>{n.title_fr}</span>
            <span>{CATEGORY_LABELS_FR[n.category] || n.category}</span>
            <span>{n.date}</span>
            <span>{n.published ? 'Publié' : 'Brouillon'}</span>
            <span className="admin-table__actions">
              <Link to={`/admin/news/${n.id}`}>Éditer</Link>
              <button onClick={() => remove(n.id)}>Supprimer</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
