import { MARQUEE } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'

export default function Marquee() {
  const { tf } = useI18n()
  const line = (k) => (
    <span key={k} aria-hidden={k === 'b'}>
      {MARQUEE.map((w) => <span key={w.fr}>{tf(w)}</span>)}
    </span>
  )
  return <div className="marquee"><div className="marquee__track">{line('a')}{line('b')}</div></div>
}
