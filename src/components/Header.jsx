import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV } from '../data/content'
import Logo from './Logo'

export default function Header() {
  const [stuck, setStuck] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

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
          <Link to="/" className="logo" aria-label="CIGATE — accueil">
            <Logo />
          </Link>

          <nav className="mainnav">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'}
                className={({ isActive }) => (isActive ? 'is-active' : '')}>
                {n.label}
              </NavLink>
            ))}
          </nav>

          <Link to="/contact" className="hdr__cta">Demander un devis</Link>

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
                <Link to={n.to}>{n.label}</Link>
              </motion.div>
            ))}
            <Link to="/contact">Demander un devis</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
