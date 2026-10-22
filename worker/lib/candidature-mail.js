import { connect } from 'cloudflare:sockets'
import { WorkerMailer } from 'worker-mailer'
import { ImapClient } from './imap-client.js'
import { mailConfig } from './candidature-template.js'

export async function openMailbox(env) {
  const config = mailConfig(env)
  const client = new ImapClient(connect({ hostname: 'mail.infomaniak.com', port: 993 }, { secureTransport: 'on' }))
  try {
    await client.login(config.email, config.password, config.folder)
    return client
  } catch (error) {
    await client.close()
    throw error
  }
}

export async function sendCandidateMail(env, row) {
  const { email, password } = mailConfig(env)
  const headers = { 'Auto-Submitted': 'auto-replied' }
  if (/^<[^\s<>]+>$/.test(row.message_id)) headers['In-Reply-To'] = row.message_id
  await WorkerMailer.send({
    host: 'mail.infomaniak.com', port: 465, secure: true,
    credentials: { username: email, password }, authType: ['plain', 'login'],
  }, {
    from: { name: env.CANDIDATURE_ORGANISATION || 'CIGATE', email },
    to: row.email, subject: row.response_subject, text: row.response_text, headers,
  })
}
