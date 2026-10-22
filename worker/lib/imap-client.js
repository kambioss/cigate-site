// Minimal read-only IMAP client. MIME literals are consumed by byte length, so
// message text cannot be mistaken for a protocol response or tagged completion.
const encoder = new TextEncoder()
const decoder = new TextDecoder()

export function quoteImap(value) {
  if (/[\r\n\0]/.test(value)) throw new Error('Paramètre IMAP invalide.')
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

export function encodeFolder(value) {
  return value.replace(/&|[^\x20-\x7e]+/g, (part) => {
    if (part === '&') return '&-'
    let binary = ''
    for (let i = 0; i < part.length; i++) {
      const code = part.charCodeAt(i)
      binary += String.fromCharCode(code >> 8, code & 255)
    }
    return `&${btoa(binary).replace(/\//g, ',').replace(/=+$/, '')}-`
  })
}

export class ImapClient {
  constructor(socket) {
    this.socket = socket
    this.reader = socket.readable.getReader()
    this.writer = socket.writable.getWriter()
    this.buffer = new Uint8Array()
    this.sequence = 0
    socket.closed?.catch(() => {})
  }

  async readChunk() {
    let timer
    try {
      const result = await Promise.race([
        this.reader.read(),
        new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Délai IMAP dépassé.')), 15000) }),
      ])
      if (result.done) throw new Error('Connexion IMAP interrompue.')
      return result.value
    } finally { clearTimeout(timer) }
  }

  async line() {
    while (true) {
      const end = this.buffer.findIndex((byte, i) => byte === 13 && this.buffer[i + 1] === 10)
      if (end >= 0) {
        const line = decoder.decode(this.buffer.subarray(0, end))
        this.buffer = this.buffer.slice(end + 2)
        return line
      }
      if (this.buffer.length > 1024 * 1024) throw new Error('Réponse IMAP trop volumineuse.')
      const chunk = await this.readChunk()
      const next = new Uint8Array(this.buffer.length + chunk.length)
      next.set(this.buffer)
      next.set(chunk, this.buffer.length)
      this.buffer = next
    }
  }

  async literal(size) {
    const result = new Uint8Array(size)
    let offset = 0
    while (offset < size) {
      if (!this.buffer.length) this.buffer = await this.readChunk()
      const length = Math.min(size - offset, this.buffer.length)
      result.set(this.buffer.subarray(0, length), offset)
      this.buffer = this.buffer.slice(length)
      offset += length
    }
    return result
  }

  async command(command, maxBytes = 256 * 1024) {
    const tag = `C${++this.sequence}`
    await this.writer.write(encoder.encode(`${tag} ${command}\r\n`))
    const lines = [], literals = []
    let total = 0
    while (true) {
      const line = await this.line()
      if (line.startsWith(`${tag} `)) {
        if (!line.startsWith(`${tag} OK`)) throw new Error('Commande IMAP refusée. Vérifiez la boîte et le dossier configurés.')
        return { lines, literals }
      }
      if (line.startsWith('* BYE')) throw new Error('Connexion IMAP fermée par le serveur.')
      lines.push(line)
      const match = line.match(/\{(\d+)\}\s*$/)
      if (match) {
        const size = Number(match[1])
        total += size
        if (!Number.isSafeInteger(size) || total > maxBytes) throw new Error('Courriel trop volumineux ; consultez-le dans Infomaniak Mail.')
        literals.push(await this.literal(size))
      }
    }
  }

  async login(email, password, folder) {
    const greeting = await this.line()
    if (!greeting.startsWith('* OK')) throw new Error('Serveur IMAP indisponible.')
    await this.command(`LOGIN ${quoteImap(email)} ${quoteImap(password)}`)
    const selected = await this.command(`EXAMINE ${quoteImap(encodeFolder(folder))}`)
    this.uidvalidity = selected.lines.join('\n').match(/\[UIDVALIDITY (\d+)\]/i)?.[1]
    if (!this.uidvalidity) throw new Error('Identifiant du dossier IMAP indisponible.')
  }

  async recentUids() {
    const result = await this.command('UID SEARCH ALL')
    return result.lines.filter((line) => line.startsWith('* SEARCH'))
      .flatMap((line) => line.slice(8).trim().split(/\s+/)).filter((uid) => /^\d+$/.test(uid))
      .reverse()
  }

  async fetch(uid, full = false) {
    if (!/^[1-9]\d*$/.test(uid)) throw new Error('Identifiant de message invalide.')
    const result = await this.command(`UID FETCH ${uid} (BODY.PEEK[${full ? '' : 'HEADER'}])`, full ? 10 * 1024 * 1024 : 256 * 1024)
    if (!result.literals[0]) throw new Error('Le message a été déplacé ou supprimé de la boîte mail.')
    return result.literals[0]
  }

  async close() {
    try { await this.socket.close() } catch { /* La connexion est déjà fermée. */ }
  }
}
