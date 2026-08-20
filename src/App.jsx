import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollTop from './components/ScrollTop'
import { ScrollProgress } from './components/Motion'
import Home from './pages/Home'
import QuiSommesNous from './pages/QuiSommesNous'
import NotreExpertise from './pages/NotreExpertise'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

export default function App() {
  const location = useLocation()
  return (
    <>
      <ScrollProgress />
      <ScrollTop />
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
          <Route path="/notre-expertise" element={<NotreExpertise />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  )
}
