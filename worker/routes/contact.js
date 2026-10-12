import { Hono } from 'hono'
import { WorkerMailer } from 'worker-mailer'

const MAX = { nom: 120, organisation: 160, email: 160, tel: 40, domaine: 200, message: 5000 }

function clean(body) {
  const out = {}
  for (const [key, max] of Object.entries(MAX)) {
    const value = typeof body[key] === 'string' ? body[key].trim() : ''
    out[key] = value.slice(0, max)
  }
  return out
}

function validate(f) {
  if (!f.nom) return 'Le nom est requis.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return 'Adresse électronique invalide.'
  if (!f.message) return 'Le message est requis.'
  return null
}

export const contactRoutes = new Hono()

contactRoutes.post('/', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  // Champ piège invisible : rempli uniquement par les robots.
  if (body.website) return c.json({ ok: true })

  const f = clean(body)
  const error = validate(f)
  if (error) return c.json({ error }, 400)

  // Les valeurs collées dans le dashboard Cloudflare arrivent parfois avec des espaces ou un retour à la ligne.
  const env = Object.fromEntries(
    ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM', 'CONTACT_TO']
      .map((key) => [key, String(c.env[key] ?? '').trim()]),
  )
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    return c.json({ error: "L'envoi de courriel n'est pas configuré." }, 503)
  }

  const port = Number(env.SMTP_PORT || 465)
  const to = env.CONTACT_TO || 'contact@cigate-int.com'
  const text = [
    `Nom : ${f.nom}`,
    `Organisation : ${f.organisation || '—'}`,
    `Courriel : ${f.email}`,
    `Téléphone : ${f.tel || '—'}`,
    `Domaine : ${f.domaine || '—'}`,
    '',
    f.message,
  ].join('\n')

  try {
    await WorkerMailer.send(
      {
        host: env.SMTP_HOST,
        port,
        secure: port === 465,
        credentials: { username: env.SMTP_USER, password: env.SMTP_PASS },
        authType: ['plain', 'login'],
      },
      {
        from: { name: 'Site CIGATE', email: env.SMTP_FROM || env.SMTP_USER },
        to,
        reply: { name: f.nom, email: f.email },
        subject: `Demande via le site — ${f.domaine || 'Contact'}`,
        text,
      },
    )
    return c.json({ ok: true })
  } catch (err) {
    console.error('SMTP send failed', err)
    return c.json({ error: "Le message n'a pas pu être envoyé." }, 502)
  }
})
