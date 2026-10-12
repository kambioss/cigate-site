import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollTop from './components/ScrollTop'
import { ScrollProgress } from './components/Motion'
import Home from './pages/Home'
import QuiSommesNous from './pages/QuiSommesNous'
import NotreExpertise from './pages/NotreExpertise'
import Formations from './pages/Formations'
import Actualites from './pages/Actualites'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import AdminApp from './admin/AdminApp'

const ROUTES = [
  { fr: '/', en: '/en', Component: Home },
  { fr: '/qui-sommes-nous', en: '/en/qui-sommes-nous', Component: QuiSommesNous },
  { fr: '/notre-expertise', en: '/en/notre-expertise', Component: NotreExpertise },
  { fr: '/formations', en: '/en/formations', Component: Formations },
  { fr: '/actualites', en: '/en/actualites', Component: Actualites },
  { fr: '/contact', en: '/en/contact', Component: Contact },
]

export default function App() {
  const location = useLocation()

  if (location.pathname.startsWith('/admin')) {
    return <AdminApp />
  }

  return (
    <>
      <ScrollProgress />
      <ScrollTop />
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {ROUTES.flatMap(({ fr, en, Component }) => [
            <Route key={fr} path={fr} element={<Component />} />,
            <Route key={en} path={en} element={<Component />} />,
          ])}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  )
}
