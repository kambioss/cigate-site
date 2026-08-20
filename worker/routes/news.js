import { Hono } from 'hono'
import { requireAuth } from './auth.js'
import * as db from '../lib/db.js'

export const NEWS_CATEGORIES = ['cabinet', 'projet', 'equipement', 'formation', 'partenariat', 'evenement']

function validate(body) {
  const required = ['slug', 'category', 'date', 'title_fr', 'title_en', 'excerpt_fr', 'excerpt_en']
  for (const key of required) {
    if (!body[key] || typeof body[key] !== 'string' || !body[key].trim()) {
      return `Le champ "${key}" est requis.`
    }
  }
  if (!NEWS_CATEGORIES.includes(body.category)) return 'Catégorie invalide.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date)) return 'Date invalide (attendu AAAA-MM-JJ).'
  if (!/^[a-z0-9-]+$/.test(body.slug)) return 'Le slug ne doit contenir que des lettres minuscules, chiffres et tirets.'
  return null
}

export const newsPublicRoutes = new Hono()

newsPublicRoutes.get('/', async (c) => {
  const lang = c.req.query('lang') === 'en' ? 'en' : 'fr'
  const news = await db.listPublishedNews(c.env.DB, lang)
  return c.json(news)
})

export const newsAdminRoutes = new Hono()
newsAdminRoutes.use('*', requireAuth)

newsAdminRoutes.get('/', async (c) => {
  return c.json(await db.listAllNews(c.env.DB))
})

newsAdminRoutes.get('/:id', async (c) => {
  const row = await db.getNewsById(c.env.DB, c.req.param('id'))
  if (!row) return c.json({ error: 'Introuvable.' }, 404)
  return c.json(row)
})

newsAdminRoutes.post('/', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const error = validate(body)
  if (error) return c.json({ error }, 400)
  try {
    const id = await db.createNews(c.env.DB, body)
    return c.json({ id }, 201)
  } catch {
    return c.json({ error: 'Ce slug existe déjà.' }, 409)
  }
})

newsAdminRoutes.put('/:id', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const error = validate(body)
  if (error) return c.json({ error }, 400)
  const existing = await db.getNewsById(c.env.DB, c.req.param('id'))
  if (!existing) return c.json({ error: 'Introuvable.' }, 404)
  try {
    await db.updateNews(c.env.DB, c.req.param('id'), body)
    return c.json({ ok: true })
  } catch {
    return c.json({ error: 'Ce slug existe déjà.' }, 409)
  }
})

newsAdminRoutes.delete('/:id', async (c) => {
  await db.deleteNews(c.env.DB, c.req.param('id'))
  return c.json({ ok: true })
})
