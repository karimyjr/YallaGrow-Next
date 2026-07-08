'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('yg_cookie_consent')
    if (!consent) setTimeout(() => setShow(true), 1500)
  }, [])

  const accept = () => { localStorage.setItem('yg_cookie_consent', 'accepted'); setShow(false) }
  const decline = () => { localStorage.setItem('yg_cookie_consent', 'declined'); setShow(false) }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
      background: 'rgba(6,12,20,0.97)', border: '1px solid var(--glass-border)',
      backdropFilter: 'blur(24px)', borderRadius: '16px', padding: '20px 24px',
      zIndex: 9000, display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
      maxWidth: '680px', width: 'calc(100% - 40px)', boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
    }}>
      <p style={{ fontSize: '0.78rem', color: 'rgba(249,253,254,0.65)', lineHeight: 1.6, flex: 1, minWidth: '220px' }}>
        🍪 We use cookies to improve your experience. By continuing, you agree to our{' '}
        <Link href="/privacy" style={{ color: 'var(--sky)' }}>Privacy Policy</Link>.
      </p>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button onClick={decline} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
          Decline
        </button>
        <button onClick={accept} className="btn-primary" style={{ padding: '8px 20px' }}>
          Accept All
        </button>
      </div>
    </div>
  )
}
