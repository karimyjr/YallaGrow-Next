'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  // Login route must bypass the auth gate — otherwise the gate renders null
  // on the very page the user needs to see to sign in.
  const isLoginRoute = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginRoute) {
      setChecking(false)
      return
    }
    const session = sessionStorage.getItem('yg_admin')
    if (session === 'true') {
      setAuthed(true)
    } else {
      router.push('/admin/login')
    }
    setChecking(false)
  }, [router, isLoginRoute])

  const logout = () => {
    sessionStorage.removeItem('yg_admin')
    router.push('/admin/login')
  }

  // Login page renders standalone — no admin topbar, no auth gate.
  if (isLoginRoute) return <>{children}</>

  if (checking) return null
  if (!authed) return null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark2)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ padding: '14px 4%', background: 'rgba(6,12,20,0.98)', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', color: 'var(--white)', textDecoration: 'none' }}>
            Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
          </Link>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', background: 'rgba(16,161,219,0.1)', padding: '3px 10px', borderRadius: '6px' }}>Admin Panel</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/" target="_blank" style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textDecoration: 'none', padding: '6px 12px', borderRadius: '7px', border: '1px solid var(--glass-border)' }}>View Site →</Link>
          <button onClick={logout} style={{ fontSize: '0.72rem', color: '#ff5555', background: 'transparent', border: '1px solid rgba(255,85,85,0.2)', borderRadius: '7px', padding: '6px 12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Sign Out</button>
        </div>
      </div>

      {/* Content (tabs are handled by the main admin page) */}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  )
}
