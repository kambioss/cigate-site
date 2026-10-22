import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { Hono } from 'hono'
import { createCandidatureRoutes } from '../routes/candidatures.js'
import { createSessionToken } from '../lib/session.js'
import { DEFAULT_TEMPLATE, mailConfig, matchesCandidateSubject, personalize } from '../lib/candidature-template.js'
import { ImapClient, encodeFolder, quoteImap } from '../lib/imap-client.js'

function database() {
  const sql = new DatabaseSync(':memory:')
  sql.exec(readFileSync(new URL('../../migrations/0002_candidatures.sql', import.meta.url), 'utf8'))
  sql.exec(readFileSync(new URL('../../migrations/0003_candidatures_ignored.sql', import.meta.url), 'utf8'))
  function statement(query, values = []) {
    return {
      bind: (...next) => statement(query, next),
      async all() { return { results: sql.prepare(query).all(...values) } },
      async first() { return sql.prepare(query).get(...values) || null },
      async run() { return { meta: { changes: Number(sql.prepare(query).run(...values).changes) } } },
    }
  }
  return { prepare: statement, batch: (items) => Promise.all(items.map((item) => item.run())), close: () => sql.close() }
}

async function fixture(t, sendMail) {
  const DB = database()
  t.after(() => DB.close())
  const env = { DB, ADMIN_SESSION_SECRET: 'test-secret', CANDIDATURE_EMAIL: 'recrutement@example.com', CANDIDATURE_PASSWORD: 'test-only', CANDIDATURE_FOLDER: 'Candidatures' }
  const sent = []
  const mailbox = {
    uidvalidity: '42', recentUids: async () => ['2', '1'], close: async () => {},
    fetch: async (uid) => new TextEncoder().encode(`From: ${uid === '1' ? 'Alice' : 'Koffi'} <candidate${uid}@example.com>\r\nSubject: Candidature\r\nDate: Thu, 22 Oct 2026 10:00:00 +0000\r\nMessage-ID: <${uid}@example.com>\r\n\r\nBonjour`),
  }
  const app = new Hono().route('/api/admin/candidatures', createCandidatureRoutes({ openMailbox: async () => mailbox, sendMail: sendMail || (async (_, row) => sent.push(row)) }))
  const token = await createSessionToken(env.ADMIN_SESSION_SECRET)
  const call = (path = '', body, extra = {}) => app.request(`http://localhost/api/admin/candidatures${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Cookie: `cigate_admin_session=${token}`, Origin: 'http://localhost', 'Content-Type': 'application/json', ...extra },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }, env)
  const rows = async () => (await (await call()).json()).items
  const selection = (items) => items.map(({ id, revision }) => ({ id, revision }))
  return { call, rows, selection, sent, env, mailbox }
}

test('requires authentication and rejects a different origin', async (t) => {
  const f = await fixture(t)
  assert.equal((await f.call('', undefined, { Cookie: '' })).status, 401)
  assert.equal((await f.call('/sync', {}, { Origin: 'https://elsewhere.example' })).status, 403)
})

test('import is idempotent and never sends mail', async (t) => {
  const f = await fixture(t)
  assert.equal((await (await f.call('/sync', {})).json()).imported, 2)
  assert.equal((await (await f.call('/sync', {})).json()).imported, 0)
  assert.equal((await f.rows()).length, 2)
  assert.equal(f.sent.length, 0)
})

test('a recipient can be added manually as a personalized unsent draft', async (t) => {
  const f = await fixture(t)
  const response = await f.call('/manual', { name: 'Aïcha Ben Salah', email: 'AICHA@example.com' })
  assert.equal(response.status, 201)
  const { item } = await response.json()
  assert.equal(item.name, 'Aïcha Ben Salah')
  assert.equal(item.email, 'aicha@example.com')
  assert.equal(item.status, 'draft')
  assert.match(item.response_text, /^Bonjour Aïcha Ben Salah,/)
  assert.equal(f.sent.length, 0)
  assert.equal((await f.call('/manual', { name: 'Doublon', email: 'aicha@example.com' })).status, 409)
  assert.equal((await f.call('/manual', { name: '', email: 'invalide' })).status, 400)
  const message = await f.call(`/${item.id}/message`)
  assert.match((await message.json()).text, /ajouté manuellement/)
})

test('message view shows the mail body and downloads the original attachment', async (t) => {
  const f = await fixture(t)
  await f.call('/sync', {})
  const row = (await f.rows())[0]
  // The fixture mailbox returns a plain text original, preserving the complete
  // RFC822 message through the .eml download path.
  const view = await f.call(`/${row.id}/message`)
  assert.equal(view.status, 200)
  assert.match((await view.json()).text, /Bonjour/)
  const downloaded = await f.call(`/${row.id}/message?download=1`)
  assert.equal(downloaded.status, 200)
  assert.match(downloaded.headers.get('content-disposition'), /attachment/)
  assert.match(await downloaded.text(), /Message-ID:/)
})

test('batch drafts personalize names, and require a separate explicit approval', async (t) => {
  const f = await fixture(t)
  await f.call('/sync', {})
  const response = await f.call('/drafts', { items: f.selection(await f.rows()), subject: 'Merci {{nom}}', text: 'Bonjour {{nom}},\nVotre adresse : {{email}}' })
  assert.equal(response.status, 200)
  const { items } = await response.json()
  for (const row of items) {
    assert.equal(row.response_subject, `Merci ${row.name}`)
    assert.equal(row.response_text, `Bonjour ${row.name},\nVotre adresse : ${row.email}`)
  }
  assert.equal(f.sent.length, 0)
  assert.equal((await f.call('/send', { items: f.selection(items) })).status, 400)
  assert.equal(f.sent.length, 0)
  assert.equal((await f.call('/send', { approved: true, items: f.selection(items) })).status, 200)
  assert.equal(f.sent.length, 2)
  assert.deepEqual(new Set(f.sent.map((row) => row.email)), new Set(['candidate1@example.com', 'candidate2@example.com']))
  assert.equal((await f.call('/send', { approved: true, items: f.selection(items) })).status, 409)
  assert.equal(f.sent.length, 2)
})

test('a stale draft blocks the entire batch without sending or locking valid rows', async (t) => {
  const f = await fixture(t)
  await f.call('/sync', {})
  const rows = await f.rows()
  await f.call('/drafts', { items: f.selection([rows[0]]), subject: 'Nouveau', text: 'Texte corrigé' })
  assert.equal((await f.call('/send', { approved: true, items: f.selection(rows) })).status, 409)
  assert.equal(f.sent.length, 0)
  assert.ok((await f.rows()).every((row) => row.status === 'draft'))
})

test('concurrent approval requests send each selected message only once', async (t) => {
  const f = await fixture(t)
  await f.call('/sync', {})
  const payload = { approved: true, items: f.selection(await f.rows()) }
  const results = await Promise.all([f.call('/send', payload), f.call('/send', payload)])
  assert.deepEqual(results.map((r) => r.status).sort(), [200, 409])
  assert.equal(f.sent.length, 2)
})

test('SMTP errors are recorded as uncertain and are never retried automatically', async (t) => {
  let attempts = 0
  const f = await fixture(t, async () => { attempts++; throw new Error('SMTP interrupted') })
  await f.call('/sync', {})
  const payload = { approved: true, items: f.selection(await f.rows()) }
  assert.equal((await f.call('/send', payload)).status, 200)
  assert.ok((await f.rows()).every((row) => row.status === 'uncertain'))
  assert.equal((await f.call('/send', payload)).status, 409)
  assert.equal(attempts, 2)
})

test('unknown template variables are rejected and a missing name uses a neutral greeting', async (t) => {
  assert.ok(personalize(DEFAULT_TEMPLATE, { name: '', email: 'a@example.com' }).startsWith('Bonjour,\n'))
  const f = await fixture(t)
  await f.call('/sync', {})
  assert.equal((await f.call('/drafts', { items: f.selection(await f.rows()), subject: 'Bonjour', text: '{{prenom}}' })).status, 400)
})

test('the existing SMTP credentials are reused only for the same mailbox', () => {
  assert.deepEqual(mailConfig({ SMTP_USER: 'contact@example.com', SMTP_PASS: 'secret', CANDIDATURE_FOLDER: 'Candidatures' }),
    { email: 'contact@example.com', password: 'secret', folder: 'Candidatures' })
  assert.throws(() => mailConfig({ SMTP_USER: 'contact@example.com', SMTP_PASS: 'secret', CANDIDATURE_EMAIL: 'jobs@example.com', CANDIDATURE_FOLDER: 'Candidatures' }))
})

test('INBOX imports application subjects and skips ordinary contact messages', async (t) => {
  assert.equal(matchesCandidateSubject('CV de Fatima', 'INBOX', {}), true)
  assert.equal(matchesCandidateSubject('Demande de devis', 'INBOX', {}), false)
  assert.equal(matchesCandidateSubject('Demande de devis', 'Candidatures', {}), true)
  const f = await fixture(t)
  f.env.CANDIDATURE_FOLDER = 'INBOX'
  f.mailbox.recentUids = async () => ['3', '2', '1']
  const fetchCandidate = f.mailbox.fetch
  f.mailbox.fetch = async (uid) => uid === '3'
    ? new TextEncoder().encode('From: Client <client@example.com>\r\nSubject: Demande de devis\r\n\r\nBonjour')
    : fetchCandidate(uid)
  const first = await f.call('/sync', {})
  assert.equal(first.status, 200)
  assert.deepEqual(((await first.json())), { imported: 2, ignored: 1, scanned: 3, remaining: 0 })
  assert.equal((await f.rows()).length, 2)
  const again = await f.call('/sync', {})
  assert.equal((await again.json()).ignored, 0)
})

test('IMAP encodes accented folder names and rejects protocol injection', () => {
  assert.equal(encodeFolder('Candidatures été & CV'), 'Candidatures &AOk-t&AOk- &- CV')
  assert.throws(() => quoteImap('test\r\nLOGOUT'))
  assert.equal(quoteImap('a"b'), '"a\\"b"')
})

test('IMAP handles fragmented literals even when their content resembles tagged replies', async () => {
  const literal = 'Subject: Bonjour\r\n\r\nC3 OK fake completion\r\n'
  const transcript = `* OK ready\r\nC1 OK logged in\r\n* OK [UIDVALIDITY 42] folder\r\nC2 OK selected\r\n* 1 FETCH (BODY[HEADER] {${new TextEncoder().encode(literal).length}}\r\n${literal})\r\nC3 OK fetched\r\n`
  const bytes = new TextEncoder().encode(transcript)
  const writes = []
  const client = new ImapClient({
    readable: new ReadableStream({ start(controller) { for (let i = 0; i < bytes.length; i += 7) controller.enqueue(bytes.slice(i, i + 7)); controller.close() } }),
    writable: new WritableStream({ write(chunk) { writes.push(new TextDecoder().decode(chunk)) } }),
    close: async () => {}, closed: Promise.resolve(),
  })
  await client.login('test@example.com', 'secret', 'Candidatures')
  assert.equal(client.uidvalidity, '42')
  assert.equal(new TextDecoder().decode(await client.fetch('1')), literal)
  assert.ok(writes[1].includes('EXAMINE'))
  assert.ok(writes[2].includes('BODY.PEEK'))
  await client.close()
})
