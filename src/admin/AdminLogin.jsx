import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (!res.ok) {
      setError('Mot de passe incorrect.')
      return
    }
    navigate('/admin/news', { replace: true })
  }

  return (
    <div className="admin admin--center">
      <form className="form admin-login" onSubmit={submit}>
        <h1 className="display t-md" style={{ marginBottom: 4 }}>CIGATE — Administration</h1>
        <p className="admin-login__note">Accès réservé à l'équipe CIGATE.</p>
        <div className="field">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password" type="password" value={password} autoFocus required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="admin-error">{error}</p>}
        <div className="form__submit">
          <button className="btn btn--green" type="submit" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </div>
      </form>
    </div>
  )
}
