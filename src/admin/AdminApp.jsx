import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLogin from './AdminLogin'
import AdminShell from './AdminShell'
import AdminNewsList from './AdminNewsList'
import AdminNewsForm from './AdminNewsForm'
import AdminMedia from './AdminMedia'

export default function AdminApp() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminShell />}>
        <Route index element={<Navigate to="/admin/news" replace />} />
        <Route path="news" element={<AdminNewsList />} />
        <Route path="news/new" element={<AdminNewsForm />} />
        <Route path="news/:id" element={<AdminNewsForm />} />
        <Route path="media" element={<AdminMedia />} />
      </Route>
    </Routes>
  )
}
