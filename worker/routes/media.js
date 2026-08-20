import { Hono } from 'hono'
import { requireAuth } from './auth.js'

const MAX_SIZE = 8 * 1024 * 1024 // 8 Mo

const EXT_BY_TYPE = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
}

export const mediaAdminRoutes = new Hono()
mediaAdminRoutes.use('*', requireAuth)

mediaAdminRoutes.get('/', async (c) => {
  const list = await c.env.MEDIA.list()
  const items = list.keys.map((k) => ({ key: k.name, url: `/media/${k.name}`, ...(k.metadata || {}) }))
  items.sort((a, b) => (b.uploadedAt || '').localeCompare(a.uploadedAt || ''))
  return c.json(items)
})

mediaAdminRoutes.post('/', async (c) => {
  const form = await c.req.formData().catch(() => null)
  const file = form?.get('file')
  if (!file || typeof file === 'string') return c.json({ error: 'Fichier manquant.' }, 400)
  if (!EXT_BY_TYPE[file.type]) return c.json({ error: 'Format d’image non supporté.' }, 400)
  if (file.size > MAX_SIZE) return c.json({ error: 'Image trop volumineuse (8 Mo max).' }, 400)

  const key = `${crypto.randomUUID()}.${EXT_BY_TYPE[file.type]}`
  const bytes = await file.arrayBuffer()
  const metadata = {
    contentType: file.type,
    filename: file.name || key,
    size: bytes.byteLength,
    uploadedAt: new Date().toISOString(),
  }
  await c.env.MEDIA.put(key, bytes, { metadata })
  return c.json({ key, url: `/media/${key}`, ...metadata }, 201)
})

mediaAdminRoutes.delete('/:key', async (c) => {
  await c.env.MEDIA.delete(c.req.param('key'))
  return c.json({ ok: true })
})

export const mediaPublicRoutes = new Hono()

mediaPublicRoutes.get('/:key', async (c) => {
  const key = c.req.param('key')
  const obj = await c.env.MEDIA.getWithMetadata(key, { type: 'arrayBuffer' })
  if (!obj || !obj.value) return c.notFound()
  const contentType = obj.metadata?.contentType || 'application/octet-stream'
  return new Response(obj.value, {
    headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=31536000, immutable' },
  })
})
