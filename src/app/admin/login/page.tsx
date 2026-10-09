// src/app/admin/login/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/components/ui/Toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async () => {
    if (!username.trim() || !password.trim()) {
      showToast('Enter username and password', 'error')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })

      if (res.ok) {
        // Mark local session for UI gates (actual auth is via httpOnly cookie)
        sessionStorage.setItem('yg_admin', 'true')
        showToast('Welcome back, Karim!', 'success')
        router.push('/admin')
      } else {
        const data = await res.json().catch(() => ({ error: 'Login failed' }))
        if (res.status === 429) {
          showToast(data.error || 'Too many attempts. Wait 15 minutes.', 'error')
        } else {
          showToast(data.error || 'Invalid credentials', 'error')
        }
      }
    } catch {
      showToast('Network error. Try again.', 'error')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'var(--dark2)',
    }}>
      {/* Back link */}
      <Link
        href="/"
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          padding: '8px 14px',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          background: 'rgba(249,253,254,0.03)',
        }}
      >
        ← Back
      </Link>

      <div style={{ maxWidth: '420px', width: '100%' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: '1.4rem',
            color: 'var(--white)',
            marginBottom: '8px',
          }}>
            Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
          </div>
          <div style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--sky)',
          }}>
            Admin Panel
          </div>
        </div>

        {/* Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(16,161,219,0.15), rgba(106,70,217,0.08))',
          border: '1px solid rgba(16,161,219,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          margin: '0 auto 20px',
        }}>
          🔐
        </div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: '1.6rem',
          color: 'var(--white)',
          textAlign: 'center',
          marginBottom: '8px',
          letterSpacing: '-0.5px',
        }}>
          Sign in
        </h1>

        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginBottom: '28px',
        }}>
          Enter your credentials to continue.
        </p>

        {/* Form card */}
        <div style={{
          background: 'var(--glass)',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          padding: '28px',
        }}>
          <label style={{
            fontSize: '0.7rem',
            color: 'var(--text-dim)',
            marginBottom: '6px',
            display: 'block',
            fontWeight: 600,
            letterSpacing: '0.5px',
          }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            style={inputStyle}
          />

          <label style={{
            fontSize: '0.7rem',
            color: 'var(--text-dim)',
            marginTop: '14px',
            marginBottom: '6px',
            display: 'block',
            fontWeight: 600,
            letterSpacing: '0.5px',
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            autoComplete="current-password"
            style={inputStyle}
          />

          <button
            onClick={login}
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: '20px',
              fontSize: '0.9rem',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </div>

        <p style={{
          fontSize: '0.72rem',
          color: 'var(--text-dim)',
          textAlign: 'center',
          marginTop: '20px',
          lineHeight: 1.5,
        }}>
          Rate limited: 5 attempts per 15 minutes.
        </p>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(249,253,254,0.03)',
  border: '1px solid var(--glass-border)',
  borderRadius: '10px',
  padding: '12px 14px',
  color: 'var(--white)',
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.2s',
}
