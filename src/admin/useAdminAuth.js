import { useCallback, useEffect, useState } from 'react'

export function useAdminAuth() {
  const [status, setStatus] = useState('checking') // checking | authed | anon

  const check = useCallback(() => {
    setStatus('checking')
    fetch('/api/admin/auth/me')
      .then((r) => setStatus(r.ok ? 'authed' : 'anon'))
      .catch(() => setStatus('anon'))
  }, [])

  useEffect(() => { check() }, [check])

  return { status, recheck: check }
}
