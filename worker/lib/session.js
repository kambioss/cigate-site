const enc = new TextEncoder()
const dec = new TextDecoder()

function toBase64Url(bytes) {
  let str = ''
  for (const b of bytes) str += String.fromCharCode(b)
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(b64url) {
  const pad = (4 - (b64url.length % 4)) % 4
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad)
  const str = atob(b64)
  const bytes = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i)
  return bytes
}

function getKey(secret) {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}

/** Jeton de session signé (HMAC), valable `ttlSeconds`. Pas de stockage côté serveur. */
export async function createSessionToken(secret, ttlSeconds = 60 * 60 * 12) {
  const payloadB64 = toBase64Url(enc.encode(JSON.stringify({ exp: Date.now() + ttlSeconds * 1000 })))
  const key = await getKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payloadB64))
  return `${payloadB64}.${toBase64Url(new Uint8Array(sig))}`
}

export async function verifySessionToken(secret, token) {
  if (!token) return false
  const [payloadB64, sigB64] = token.split('.')
  if (!payloadB64 || !sigB64) return false
  try {
    const key = await getKey(secret)
    const valid = await crypto.subtle.verify('HMAC', key, fromBase64Url(sigB64), enc.encode(payloadB64))
    if (!valid) return false
    const payload = JSON.parse(dec.decode(fromBase64Url(payloadB64)))
    return typeof payload.exp === 'number' && payload.exp > Date.now()
  } catch {
    return false
  }
}

/** Comparaison en temps constant (évite les attaques par timing sur le mot de passe). */
export function timingSafeEqual(a, b) {
  const aBytes = enc.encode(String(a ?? ''))
  const bBytes = enc.encode(String(b ?? ''))
  if (aBytes.length !== bBytes.length) return false
  let diff = 0
  for (let i = 0; i < aBytes.length; i++) diff |= aBytes[i] ^ bBytes[i]
  return diff === 0
}
