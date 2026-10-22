import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLogin from './AdminLogin'
import AdminShell from './AdminShell'
import AdminNewsList from './AdminNewsList'
import AdminNewsForm from './AdminNewsForm'
import AdminMedia from './AdminMedia'
import AdminCandidatures from './AdminCandidatures'
import { useEffect } from 'react'

export default function AdminApp() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminShell />}>
        <Route index element={<Navigate to="/admin/news" replace />} />
        <Route path="news" element={<AdminNewsList />} />
        <Route path="news/new" element={<AdminNewsForm />} />
        <Route path="news/:id" element={<AdminNewsForm />} />
        <Route path="media" element={<AdminMedia />} />
        <Route path="candidatures" element={<AdminCandidatures />} />
      </Route>
    </Routes>
  )
}
