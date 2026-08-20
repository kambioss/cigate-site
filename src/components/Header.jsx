import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'
import Logo from './Logo'

export default function Header() {
  const [stuck, setStuck] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { lang, tf, t, switchPath, otherLang } = useI18n()
  const navTo = (to) => (lang === 'en' ? (to === '/' ? '/en' : `/en${to}`) : to)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header className={`hdr ${stuck || open ? 'hdr--stuck' : ''}`}>
        <div className="hdr__inner">
          <Link to={navTo('/')} className="logo" aria-label="CIGATE">
            <Logo />
          </Link>

          <nav className="mainnav">
            {NAV.map((n) => (
              <NavLink key={n.to} to={navTo(n.to)} end={n.to === '/'}
                className={({ isActive }) => (isActive ? 'is-active' : '')}>
                {tf(n.label)}
              </NavLink>
            ))}
          </nav>

          <Link to={switchPath} className="hdr__lang" aria-label={otherLang === 'en' ? 'Switch to English' : 'Passer en français'}>
            {otherLang.toUpperCase()}
          </Link>

          <Link to={navTo('/contact')} className="hdr__cta">{t('nav.cta')}</Link>

          <button className={`burger ${open ? 'is-open' : ''}`}
            onClick={() => setOpen((o) => !o)} aria-expanded={open}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}>
            <span /><span /><span />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="drawer"
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.32, ease: [0.16, 0.84, 0.24, 1] }}>
            {NAV.map((n, i) => (
              <motion.div key={n.to}
                initial={{ opacity: 0, x: -26 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i + 0.07, duration: 0.45, ease: [0.16, 0.84, 0.24, 1] }}>
                <Link to={navTo(n.to)}>{tf(n.label)}</Link>
              </motion.div>
            ))}
            <Link to={switchPath}>{otherLang === 'en' ? 'English' : 'Français'}</Link>
            <Link to={navTo('/contact')}>{t('nav.cta')}</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
