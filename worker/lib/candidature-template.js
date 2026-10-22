export const DEFAULT_SUBJECT = 'Accusé de réception de votre candidature'
export const DEFAULT_TEMPLATE = "Bonjour {{nom}},\n\nNous accusons réception de votre candidature et vous remercions de l'intérêt que vous portez à notre organisation.\n\nNous examinerons votre dossier et vous contacterons si votre profil correspond aux besoins du poste.\n\nCordialement,\nL'équipe CIGATE"

export function mailConfig(env) {
  const smtpUser = String(env.SMTP_USER || '').trim()
  const email = String(env.CANDIDATURE_EMAIL || smtpUser).trim()
  const password = String(env.CANDIDATURE_PASSWORD || (email.toLowerCase() === smtpUser.toLowerCase() ? env.SMTP_PASS : '') || '')
  const folder = String(env.CANDIDATURE_FOLDER || '').trim()
  if (!email || !password || !folder) throw new Error('La boîte des candidatures doit être configurée dans les paramètres du serveur.')
  return { email, password, folder }
}

export function personalize(template, row) {
  const name = row.name.trim()
  let text = template
  if (!name) text = text.replace(/Bonjour\s+\{\{nom\}\}\s*,?/gi, 'Bonjour,')
  return text.replace(/\{\{nom\}\}/g, () => name).replace(/\{\{email\}\}/g, () => row.email)
}

export function validateDraft(body) {
  if (typeof body.subject !== 'string' || !body.subject.trim() || body.subject.length > 200 || /[\r\n]/.test(body.subject)) return 'Objet invalide (200 caractères maximum).'
  if (typeof body.text !== 'string' || !body.text.trim() || body.text.length > 10000) return 'Réponse requise (10 000 caractères maximum).'
  if (/\{\{(?!nom\}\}|email\}\})/.test(body.subject + body.text)) return 'Variables disponibles : {{nom}} et {{email}}.'
  return null
}
