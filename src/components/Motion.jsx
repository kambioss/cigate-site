import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const EASE = [0.16, 0.84, 0.24, 1]
const VIEW = { once: true, amount: 0.2, margin: '0px 0px -70px 0px' }

/* ============================================================
   Reveal — huit variantes de mouvement.
   variant :
     'left'   glisse depuis la gauche
     'right'  glisse depuis la droite
     'up'     monte depuis le bas
     'down'   descend depuis le haut
     'scale'  zoom léger + fondu
     'wipe'   dévoilement par balayage (clip-path)
     'blur'   arrive net depuis un flou
     'tilt'   bascule 3D depuis le bas
   ============================================================ */
export default function Reveal({
  children, variant = 'up', delay = 0, distance = 60, duration = 0.85,
  as = 'div', className = '', style, ...rest
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as] || motion.div
  if (reduce) return <Tag className={className} style={style} {...rest}>{children}</Tag>

  const V = {
    left:  { from: { opacity: 0, x: -distance },                   to: { opacity: 1, x: 0 } },
    right: { from: { opacity: 0, x:  distance },                   to: { opacity: 1, x: 0 } },
    up:    { from: { opacity: 0, y:  38 },                         to: { opacity: 1, y: 0 } },
    down:  { from: { opacity: 0, y: -38 },                         to: { opacity: 1, y: 0 } },
    scale: { from: { opacity: 0, scale: 0.9 },                     to: { opacity: 1, scale: 1 } },
    blur:  { from: { opacity: 0, filter: 'blur(14px)', y: 22 },    to: { opacity: 1, filter: 'blur(0px)', y: 0 } },
    tilt:  { from: { opacity: 0, rotateX: -18, y: 46 },            to: { opacity: 1, rotateX: 0, y: 0 } },
    wipe:  {
      from: { opacity: 1, clipPath: 'inset(0 100% 0 0)' },
      to:   { opacity: 1, clipPath: 'inset(0 0% 0 0)' },
    },
  }[variant] || { from: { opacity: 0, y: 38 }, to: { opacity: 1, y: 0 } }

  return (
    <Tag
      className={className}
      style={variant === 'tilt' ? { perspective: 900, ...style } : style}
      initial={V.from}
      whileInView={V.to}
      viewport={VIEW}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* ---------- Cascade : décale automatiquement les enfants ---------- */
export function Stagger({ children, gap = 0.09, className = '', style, ...rest }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className} style={style} {...rest}>{children}</div>
  return (
    <motion.div
      className={className} style={style}
      initial="hidden" whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, variant = 'up', className = '', style, ...rest }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className} style={style} {...rest}>{children}</div>

  const from = {
    up:    { opacity: 0, y: 34 },
    left:  { opacity: 0, x: -44 },
    right: { opacity: 0, x: 44 },
    scale: { opacity: 0, scale: 0.9 },
    blur:  { opacity: 0, filter: 'blur(10px)', y: 20 },
    tilt:  { opacity: 0, rotateX: -16, y: 38 },
  }[variant] || { opacity: 0, y: 34 }

  return (
    <motion.div
      className={className}
      style={variant === 'tilt' ? { perspective: 800, ...style } : style}
      variants={{
        hidden: from,
        show: {
          opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)',
          transition: { duration: 0.78, ease: EASE },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Titre révélé mot par mot ---------- */
export function WordsUp({ text, className = '', delay = 0, as = 'h2' }) {
  const reduce = useReducedMotion()
  const Tag = as
  if (reduce) return <Tag className={className}>{text}</Tag>

  const words = String(text).split(' ')
  return (
    <Tag className={className} style={{ display: 'block' }}>
      <motion.span
        style={{ display: 'inline' }}
        initial="hidden" whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: delay } } }}
      >
        {words.map((w, i) => (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
            <motion.span
              style={{ display: 'inline-block' }}
              variants={{
                hidden: { y: '105%', opacity: 0 },
                show: { y: '0%', opacity: 1, transition: { duration: 0.72, ease: EASE } },
              }}
            >
              {w}
            </motion.span>
            {i < words.length - 1 && '\u00A0'}
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

/* ---------- Parallaxe verticale douce au scroll ---------- */
export function Parallax({ children, amount = 46, className = '', style }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount])
  if (reduce) return <div className={className} style={style}>{children}</div>
  return (
    <div ref={ref} className={className} style={style}>
      <motion.div style={{ y, height: '100%' }}>{children}</motion.div>
    </div>
  )
}

/* ---------- Barre de progression de lecture ---------- */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 2.5,
        background: 'linear-gradient(90deg, #2E7D3A, #17304F)',
        transformOrigin: '0%', scaleX: scrollYProgress, zIndex: 200,
      }}
    />
  )
}
