export const DEFAULT_SUBJECT = 'Suite à votre candidature – Consultant/Formateur indépendant SIG'
export const DEFAULT_TEMPLATE = "Bonjour {{nom}},\n\nNous avons pris connaissance de votre candidature au poste de Consultant/Formateur indépendant en systèmes d’information géographique (SIG).\n\nAprès examen, nous sommes au regret de vous informer que, malgré l’intérêt de votre profil, votre candidature n’a pas été retenue.\n\nNous conserverons néanmoins votre candidature dans notre base afin de pouvoir vous recontacter si une future possibilité de collaboration correspondant à votre profil se présente.\n\nNous vous remercions pour l’intérêt porté à CIGATE et vous prions de recevoir nos salutations cordiales.\n\nL’équipe CIGATE"
export const DEFAULT_SUBJECT_TERMS = 'candidature,postulation,application,recrutement,emploi,cv'

export function mailConfig(env) {
  const smtpUser = String(env.SMTP_USER || '').trim()
  const email = String(env.CANDIDATURE_EMAIL || smtpUser).trim()
  const password = String(env.CANDIDATURE_PASSWORD || (email.toLowerCase() === smtpUser.toLowerCase() ? env.SMTP_PASS : '') || '')
  const folder = String(env.CANDIDATURE_FOLDER || '').trim()
  if (!email || !password || !folder) throw new Error('La boîte des candidatures doit être configurée dans les paramètres du serveur.')
  return { email, password, folder }
}

export function subjectTerms(env) {
  return String(env.CANDIDATURE_SUBJECT_TERMS || DEFAULT_SUBJECT_TERMS)
    .split(',').map((term) => term.trim().toLocaleLowerCase('fr')).filter(Boolean)
}

export function matchesCandidateSubject(subject, folder, env) {
  if (folder.toUpperCase() !== 'INBOX') return true
  const normalized = String(subject || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr')
  return subjectTerms(env).some((term) => {
    const normalizedTerm = term.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return normalizedTerm === 'cv' ? /\bcv\b/.test(normalized) : normalized.includes(normalizedTerm)
  })
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
