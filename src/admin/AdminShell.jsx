import { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAdminAuth } from './useAdminAuth'

export default function AdminShell() {
  const { status } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (status === 'anon') {
      navigate('/admin/login', { replace: true, state: { from: location.pathname } })
    }
  }, [status, navigate, location.pathname])

  async function logout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    navigate('/admin/login', { replace: true })
  }

  if (status !== 'authed') {
    return <div className="admin admin--center"><span className="admin-login__note">Chargement…</span></div>
  }

  return (
    <div className="admin">
      <header className="admin__bar">
        <span className="admin__brand">CIGATE — Administration</span>
        <nav className="admin__nav">
          <NavLink to="/admin/news" className={({ isActive }) => (isActive ? 'is-active' : '')}>
            Actualités
          </NavLink>
          <NavLink to="/admin/media" className={({ isActive }) => (isActive ? 'is-active' : '')}>
            Médiathèque
          </NavLink>
        </nav>
        <button className="btn btn--outline" onClick={logout}>Déconnexion</button>
      </header>
      <main className="admin__main">
        <Outlet />
      </main>
    </div>
  )
}
