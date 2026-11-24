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
    // This is a legitimate "read sessionStorage on mount" auth gate — not a
    // sync between React and some external store. React 19's strict lint
    // flags any setState in an effect, but refactoring to useSyncExternalStore
    // for a one-shot auth check would just add noise. Explicit disable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isLoginRoute) { setChecking(false); return }
    const session = sessionStorage.getItem('yg_admin')
    if (session === 'true') setAuthed(true)
    else router.push('/admin/login')
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

  // The sidebar on /admin carries the brand, nav, and sign-out, so the
  // legacy top bar would be redundant there. Keep it only on direct hits
  // to sub-routes (/admin/overview, /admin/submissions, etc.) that don't
  // mount the sidebar themselves. Most people go through /admin.
  const hideTopBar = pathname === '/admin'

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--dark2)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient gradient orbs — fixed, blurred, behind everything */}
      <div aria-hidden="true" style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '55vw',
          height: '55vw',
          background: 'radial-gradient(circle, rgba(16,161,219,0.18), transparent 60%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-15%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(141,92,255,0.14), transparent 60%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          width: '40vw',
          height: '40vw',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(16,161,219,0.08), transparent 70%)',
          filter: 'blur(100px)',
        }} />
      </div>

      {/* Legacy glass top bar — kept for direct hits to sub-routes (/admin/overview,
          /admin/submissions, etc.) that don't mount the sidebar themselves. The
          main /admin entry renders the sidebar, which carries its own brand +
          sign-out, so the top bar is hidden there. */}
      {!hideTopBar && (
      <div style={{
        padding: '14px 4%',
        background: 'linear-gradient(180deg, rgba(6,12,20,0.75), rgba(6,12,20,0.55))',
        backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 10px 40px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', color: 'var(--white)', textDecoration: 'none', letterSpacing: '-0.5px' }}>
            Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
          </Link>
          <span style={{
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--sky)',
            background: 'linear-gradient(180deg, rgba(16,161,219,0.18), rgba(16,161,219,0.06))',
            border: '1px solid rgba(16,161,219,0.25)',
            padding: '4px 11px',
            borderRadius: '7px',
            boxShadow: '0 0 20px rgba(16,161,219,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}>Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/" target="_blank" style={{
            fontSize: '0.7rem',
            color: 'var(--text-dim)',
            textDecoration: 'none',
            padding: '7px 13px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s',
          }}>View Site →</Link>
          <button onClick={logout} style={{
            fontSize: '0.7rem',
            color: '#ff7a7a',
            background: 'rgba(255,85,85,0.06)',
            border: '1px solid rgba(255,85,85,0.18)',
            borderRadius: '8px',
            padding: '7px 13px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s',
          }}>Sign Out</button>
        </div>
      </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
