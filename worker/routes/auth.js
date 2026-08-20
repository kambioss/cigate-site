import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { createSessionToken, verifySessionToken, timingSafeEqual } from '../lib/session.js'

export const COOKIE_NAME = 'cigate_admin_session'

function cookieOpts(c) {
  return {
    httpOnly: true,
    secure: new URL(c.req.url).protocol === 'https:',
    sameSite: 'Lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  }
}

export async function requireAuth(c, next) {
  const token = getCookie(c, COOKIE_NAME)
  const valid = await verifySessionToken(c.env.ADMIN_SESSION_SECRET, token)
  if (!valid) return c.json({ error: 'Non authentifié.' }, 401)
  await next()
}

export const authRoutes = new Hono()

authRoutes.post('/login', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  if (!body.password || !timingSafeEqual(body.password, c.env.ADMIN_PASSWORD)) {
    return c.json({ error: 'Mot de passe incorrect.' }, 401)
  }
  const token = await createSessionToken(c.env.ADMIN_SESSION_SECRET)
  setCookie(c, COOKIE_NAME, token, cookieOpts(c))
  return c.json({ ok: true })
})

authRoutes.post('/logout', (c) => {
  deleteCookie(c, COOKIE_NAME, { path: '/' })
  return c.json({ ok: true })
})

authRoutes.get('/me', async (c) => {
  const token = getCookie(c, COOKIE_NAME)
  const valid = await verifySessionToken(c.env.ADMIN_SESSION_SECRET, token)
  if (!valid) return c.json({ authenticated: false }, 401)
  return c.json({ authenticated: true })
})
