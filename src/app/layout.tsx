'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const TABS = [
  { href: '/admin', label: '📝 Blog', exact: true },
  { href: '/admin/packages', label: '📦 Packages' },
  { href: '/admin/pricing', label: '💰 Pricing' },
  { href: '/admin/affiliates', label: '🤝 Affiliates' },
  { href: '/admin/maintenance', label: '🔧 Maintenance' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    const session = sessionStorage.getItem('yg_admin')
    if (session === 'true') {
      setAuthed(true)
    } else if (!isLoginPage) {
      router.push('/admin/login')
    }
    setChecking(false)
  }, [router, isLoginPage])

  // On login page — just render it, no chrome
  if (isLoginPage) {
    return <>{children}</>
  }

  if (checking) return (
    <div style={{ minHeight: '100vh', background: '#060c14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(249,253,254,0.3)', fontSize: '0.82rem' }}>Loading...</div>
    </div>
  )

  if (!authed) return null

  const logout = () => {
    sessionStorage.removeItem('yg_admin')
    router.push('/admin/login')
  }

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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', padding: '12px 4%', background: 'rgba(6,12,20,0.5)', borderBottom: '1px solid var(--glass-border)', flexWrap: 'wrap' }}>
        {TABS.map(tab => {
          const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
          return (
            <Link key={tab.href} href={tab.href} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none', background: active ? 'rgba(16,161,219,0.12)' : 'transparent', color: active ? 'var(--sky)' : 'var(--text-muted)', border: active ? '1px solid rgba(16,161,219,0.2)' : '1px solid transparent', transition: 'all 0.2s' }}>
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '32px 4%' }}>
        {children}
      </div>
    </div>
  )
}
