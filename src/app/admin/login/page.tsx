'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const login = () => {
    if (user === 'karim' && pass === 'yallagrow2025') {
      sessionStorage.setItem('yg_admin', 'true')
      router.push('/admin')
    } else {
      setError('Invalid credentials.')
    }
  }

  const inputStyle = {
    width: '100%', background: 'rgba(249,253,254,0.03)',
    border: '1px solid var(--glass-border)', borderRadius: '10px',
    padding: '12px 14px', color: 'var(--white)',
    fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', outline: 'none',
    marginBottom: '12px',
  } as React.CSSProperties

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ width: '100%', maxWidth: '380px', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: 'var(--white)', marginBottom: '4px' }}>
          Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
        </div>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '28px' }}>Admin Panel</div>
        <input placeholder="Username" value={user} onChange={e => setUser(e.target.value)} style={inputStyle} />
        <input placeholder="Password" type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} style={inputStyle} />
        {error && <p style={{ fontSize: '0.75rem', color: '#ff5555', marginBottom: '12px' }}>{error}</p>}
        <button onClick={login} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Sign In →</button>
      </div>
    </div>
  )
}
