import { Hono } from 'hono'
import PostalMime from 'postal-mime'
import { requireAuth } from './auth.js'
import { DEFAULT_SUBJECT, DEFAULT_TEMPLATE, mailConfig, personalize, validateDraft } from '../lib/candidature-template.js'

const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/
const find = (db, id) => db.prepare('SELECT * FROM candidatures WHERE id=?').bind(id).first()
const parseMail = (raw) => PostalMime.parse(raw, { maxNestingDepth: 30, maxHeadersSize: 262144 })

function validItems(items) {
  return Array.isArray(items) && items.length > 0 && items.length <= 20 &&
    items.every((item) => item && typeof item.id === 'string' && /^[a-f0-9]{64}$/.test(item.id) && Number.isSafeInteger(item.revision) && item.revision > 0) &&
    new Set(items.map((item) => item.id)).size === items.length
}

export function createCandidatureRoutes({ openMailbox, sendMail }) {
  const routes = new Hono()
  routes.use('*', async (c, next) => {
    c.header('Cache-Control', 'no-store')
    c.header('X-Robots-Tag', 'noindex, nofollow')
    await next()
  })
  routes.use('*', requireAuth)
  routes.use('*', async (c, next) => {
    if (!['GET', 'HEAD'].includes(c.req.method) && c.req.header('Origin') !== new URL(c.req.url).origin) {
      return c.json({ error: 'Origine de la demande invalide.' }, 403)
    }
    await next()
  })

  routes.get('/', async (c) => {
    const { results } = await c.env.DB.prepare('SELECT * FROM candidatures ORDER BY received_at DESC LIMIT 500').all()
    return c.json({ items: results, configured: Boolean(c.env.CANDIDATURE_EMAIL && c.env.CANDIDATURE_PASSWORD && c.env.CANDIDATURE_FOLDER), mailbox: c.env.CANDIDATURE_EMAIL || '', defaultSubject: DEFAULT_SUBJECT, defaultTemplate: DEFAULT_TEMPLATE })
  })

  routes.post('/sync', async (c) => {
    let mailbox
    try {
      const config = mailConfig(c.env)
      mailbox = await openMailbox(c.env)
      const uids = await mailbox.recentUids()
      let imported = 0, ignored = 0, scanned = 0
      for (const uid of uids) {
        if (imported >= 30) break
        scanned++
        const source = [config.email.toLowerCase(), config.folder, mailbox.uidvalidity, uid].join('\0')
        const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(source))
        const id = Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('')
        if (await find(c.env.DB, id)) continue
        const mail = await parseMail(await mailbox.fetch(uid))
        const header = (key) => mail.headers.find((item) => item.key === key)?.value?.trim().toLowerCase()
        const address = mail.from?.address || ''
        if (!EMAIL.test(address) || address.toLowerCase() === config.email.toLowerCase() ||
          mail.headers.filter((item) => item.key === 'from').length !== 1 ||
          (header('auto-submitted') && header('auto-submitted') !== 'no') ||
          ['bulk', 'junk', 'list'].includes(header('precedence')) || header('list-id') ||
          header('list-unsubscribe') || header('return-path') === '<>') {
          ignored++
          continue
        }
        const row = { name: (mail.from?.name || '').replace(/[\r\n]/g, ' ').slice(0, 160), email: address }
        const date = Number.isFinite(Date.parse(mail.date)) ? new Date(mail.date).toISOString() : new Date().toISOString()
        const result = await c.env.DB.prepare(`INSERT OR IGNORE INTO candidatures
          (id, mailbox, folder, uidvalidity, uid, name, email, subject, received_at, message_id, response_subject, response_text)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
          id, config.email.toLowerCase(), config.folder, mailbox.uidvalidity, uid,
          row.name, row.email, (mail.subject || '(Sans objet)').slice(0, 500), date,
          (mail.messageId || '').slice(0, 998), DEFAULT_SUBJECT, personalize(DEFAULT_TEMPLATE, row),
        ).run()
        imported += result.meta.changes
      }
      return c.json({ imported, ignored, scanned, remaining: uids.length - scanned })
    } catch (error) {
      return c.json({ error: error.message || 'Impossible de consulter Infomaniak.' }, 502)
    } finally { await mailbox?.close() }
  })

  routes.get('/:id/message', async (c) => {
    const row = await find(c.env.DB, c.req.param('id'))
    if (!row) return c.json({ error: 'Candidature introuvable.' }, 404)
    let mailbox
    try {
      const config = mailConfig(c.env)
      if (row.mailbox !== config.email.toLowerCase() || row.folder !== config.folder) return c.json({ error: 'Cette candidature appartient à une autre boîte ou à un autre dossier.' }, 409)
      mailbox = await openMailbox(c.env)
      if (row.uidvalidity !== mailbox.uidvalidity) return c.json({ error: 'Le dossier mail a été recréé. Récupérez à nouveau les candidatures.' }, 409)
      const raw = await mailbox.fetch(row.uid, true)
      if (c.req.query('download') === '1') {
        c.header('Content-Disposition', `attachment; filename="candidature-${row.uid}.eml"`)
        c.header('Content-Type', 'message/rfc822')
        c.header('X-Content-Type-Options', 'nosniff')
        return c.body(raw)
      }
      const mail = await parseMail(raw)
      return c.json({ text: (mail.text || 'Ce message ne contient pas de version texte. Téléchargez le courriel pour le consulter.').slice(0, 100000), attachments: mail.attachments.map((item) => ({ filename: item.filename || 'Pièce jointe', mimeType: item.mimeType })) })
    } catch (error) {
      return c.json({ error: error.message || 'Impossible de lire le message.' }, 502)
    } finally { await mailbox?.close() }
  })

  // Preparing a batch only saves drafts. The returned revisions identify exactly
  // the individualized messages that the administrator subsequently reviews.
  routes.post('/drafts', async (c) => {
    const body = await c.req.json().catch(() => ({}))
    const error = validateDraft(body)
    if (error || !validItems(body.items)) return c.json({ error: error || 'Sélectionnez de 1 à 20 candidatures.' }, 400)
    const prepared = []
    for (const item of body.items) {
      const row = await find(c.env.DB, item.id)
      if (!row || row.status !== 'draft' || row.revision !== item.revision) return c.json({ error: 'Une candidature a changé. Actualisez la liste avant de préparer les réponses.' }, 409)
      if (item.name !== undefined) {
        if (typeof item.name !== 'string' || item.name.length > 160 || /[\r\n]/.test(item.name)) return c.json({ error: 'Nom invalide.' }, 400)
        row.name = item.name.trim()
      }
      prepared.push({ ...row, response_subject: personalize(body.subject.trim(), row), response_text: personalize(body.text.trim(), row) })
    }
    const results = await c.env.DB.batch(prepared.map((row) => c.env.DB.prepare(`UPDATE candidatures SET
      name=?, response_subject=?, response_text=?, revision=revision+1
      WHERE id=? AND revision=? AND status='draft'`).bind(row.name, row.response_subject, row.response_text, row.id, row.revision)))
    if (results.some((result) => result.meta.changes !== 1)) return c.json({ error: 'Un brouillon a été modifié ailleurs. Actualisez la liste.' }, 409)
    return c.json({ items: prepared.map((row) => ({ ...row, revision: row.revision + 1 })) })
  })

  routes.post('/send', async (c) => {
    const body = await c.req.json().catch(() => ({}))
    if (body.approved !== true || !validItems(body.items)) return c.json({ error: 'La validation explicite des réponses est requise.' }, 400)
    let config
    try { config = mailConfig(c.env) } catch (error) { return c.json({ error: error.message }, 503) }
    const token = crypto.randomUUID()
    const conditions = body.items.map(() => '(id=? AND revision=?)').join(' OR ')
    const args = body.items.flatMap((item) => [item.id, item.revision])
    // A single UPDATE reserves these versions. Concurrent requests cannot send
    // the same draft. On an incomplete reservation, release it without sending.
    const { results: reserved } = await c.env.DB.prepare(`UPDATE candidatures SET status='sending', send_token=?
      WHERE status='draft' AND mailbox=? AND (${conditions}) RETURNING *`)
      .bind(token, config.email.toLowerCase(), ...args).all()
    if (reserved.length !== body.items.length) {
      await c.env.DB.prepare("UPDATE candidatures SET status='draft', send_token=NULL WHERE send_token=? AND status='sending'").bind(token).run()
      return c.json({ error: 'Une réponse a changé ou a déjà été envoyée. Actualisez et vérifiez de nouveau le lot.' }, 409)
    }
    const outcomes = []
    for (const row of reserved) {
      try {
        await sendMail(c.env, row)
      } catch {
        await c.env.DB.prepare("UPDATE candidatures SET status='uncertain' WHERE id=? AND send_token=?").bind(row.id, token).run()
        outcomes.push({ id: row.id, status: 'uncertain' })
        continue
      }
      // If persistence fails after SMTP accepted the message, leave 'sending'.
      // Never automatically retry an ambiguous send.
      await c.env.DB.prepare("UPDATE candidatures SET status='sent', sent_at=? WHERE id=? AND send_token=?")
        .bind(new Date().toISOString(), row.id, token).run()
      outcomes.push({ id: row.id, status: 'sent' })
    }
    return c.json({ items: outcomes })
  })
  return routes
}
