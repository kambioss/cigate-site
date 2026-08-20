import { motion, useReducedMotion } from 'framer-motion'

/** Transition douce entre les pages. */
export default function PageShell({ children }) {
  const reduce = useReducedMotion()
  if (reduce) return <main>{children}</main>
  return (
    <motion.main
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 0.84, 0.24, 1] }}
    >
      {children}
    </motion.main>
  )
}
