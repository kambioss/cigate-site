const NEWS_FIELDS = [
  'slug', 'category', 'date', 'image_key',
  'title_fr', 'title_en', 'excerpt_fr', 'excerpt_en', 'body_fr', 'body_en',
  'published',
]

export function publicNewsShape(row, lang) {
  const isEn = lang === 'en'
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    date: row.date,
    image: row.image_key ? `/media/${row.image_key}` : null,
    title: isEn && row.title_en ? row.title_en : row.title_fr,
    excerpt: isEn && row.excerpt_en ? row.excerpt_en : row.excerpt_fr,
    body: (isEn && row.body_en ? row.body_en : row.body_fr) || null,
  }
}

export async function listPublishedNews(db, lang) {
  const { results } = await db
    .prepare('SELECT * FROM news WHERE published = 1 ORDER BY date DESC')
    .all()
  return results.map((row) => publicNewsShape(row, lang))
}

export async function listAllNews(db) {
  const { results } = await db.prepare('SELECT * FROM news ORDER BY date DESC').all()
  return results
}

export async function getNewsById(db, id) {
  return db.prepare('SELECT * FROM news WHERE id = ?').bind(id).first()
}

function bindValues(data) {
  return NEWS_FIELDS.map((key) => {
    if (key === 'published') return data.published ? 1 : 0
    return data[key] ?? null
  })
}

export async function createNews(db, data) {
  const placeholders = NEWS_FIELDS.map(() => '?').join(', ')
  const res = await db
    .prepare(`INSERT INTO news (${NEWS_FIELDS.join(', ')}) VALUES (${placeholders})`)
    .bind(...bindValues(data))
    .run()
  return res.meta.last_row_id
}

export async function updateNews(db, id, data) {
  const setClause = NEWS_FIELDS.map((key) => `${key} = ?`).join(', ')
  await db
    .prepare(`UPDATE news SET ${setClause}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...bindValues(data), id)
    .run()
}

export async function deleteNews(db, id) {
  await db.prepare('DELETE FROM news WHERE id = ?').bind(id).run()
}
