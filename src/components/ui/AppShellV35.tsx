'use client'
// V35 app shell — slim dark pill-shaped left sidebar + translucent
// topbar + content area. Modeled on paulcodes4 Dashboard V35, adapted
// for YallaGrow's dark theme.
//
// Sidebar items are icon-only by default; hovering surfaces a tooltip
// with the label. Active item gets a gradient pill.

import { useState, ReactNode } from 'react'
import Link from 'next/link'
import { Icon, IconName } from '@/components/ui/Icons'

export interface ShellNavItem {
  id: string
  icon: IconName
  label: string
  badge?: number | string   // small notification number
}

interface AppShellV35Props {
  nav: ShellNavItem[]
  activeId: string
  onNavigate: (id: string) => void
  breadcrumb: string[]       // e.g. ["YallaGrow", "Admin", "Overview"]
  dateLabel?: string         // e.g. "Thu, Nov 19 · 14:22"
  userName?: string
  userRole?: string
  userBadge?: string         // e.g. "Admin" or "Affiliate"
  onSignOut?: () => void
  children: ReactNode
  topRight?: ReactNode       // extra actions to the left of the user chip
}

export default function AppShellV35({
  nav, activeId, onNavigate,
  breadcrumb, dateLabel, userName, userRole, userBadge, onSignOut,
  children, topRight,
}: AppShellV35Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--dark2)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient orbs — same system as V24 */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '55vw', height: '55vw', background: 'radial-gradient(circle, rgba(16,161,219,0.14), transparent 60%)', filter: 'blur(70px)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(141,92,255,0.11), transparent 60%)', filter: 'blur(90px)' }} />
      </div>

      {/* ───────── SLIM LEFT SIDEBAR ───────── */}
      <aside className="shell-sidebar" style={{
        position: 'fixed',
        top: '16px',
        bottom: '16px',
        left: '16px',
        width: '58px',
        background: 'linear-gradient(180deg, rgba(10,16,28,0.95), rgba(6,12,20,0.95))',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '18px',
        backdropFilter: 'blur(18px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '14px 0',
        gap: '6px',
        zIndex: 50,
      }}>
        {/* Logo circle at top */}
        <Link href="/" style={{
          width: '38px', height: '38px', borderRadius: '11px',
          background: 'linear-gradient(135deg, var(--sky), var(--purple))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1rem',
          textDecoration: 'none',
          boxShadow: '0 6px 20px rgba(16,161,219,0.35)',
          marginBottom: '10px',
        }}>Y</Link>

        {nav.map(item => {
          const isActive = item.id === activeId
          const isHovered = hoveredId === item.id
          return (
            <div key={item.id} style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => onNavigate(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                aria-label={item.label}
                style={{
                  position: 'relative',
                  width: '38px', height: '38px', borderRadius: '11px',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(16,161,219,0.25), rgba(141,92,255,0.18))'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(16,161,219,0.4)'
                    : '1px solid transparent',
                  color: isActive ? 'var(--sky)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 4px 14px rgba(16,161,219,0.25), inset 0 1px 0 rgba(255,255,255,0.06)' : 'none',
                }}
              >
                <Icon name={item.icon} size={17} />
                {item.badge !== undefined && Number(item.badge) > 0 && (
                  <span style={{
                    position: 'absolute', top: '2px', right: '2px',
                    minWidth: '14px', height: '14px',
                    background: '#ef4444', color: '#fff',
                    fontSize: '0.56rem', fontWeight: 800,
                    borderRadius: '100px', padding: '0 4px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(239,68,68,0.5)',
                  }}>{item.badge}</span>
                )}
              </button>

              {/* Tooltip pops to the right on hover */}
              {isHovered && (
                <div style={{
                  position: 'absolute',
                  left: '52px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(6,12,20,0.98)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '6px 11px',
                  fontSize: '0.72rem', color: 'var(--white)',
                  whiteSpace: 'nowrap', pointerEvents: 'none',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                  zIndex: 100,
                }}>{item.label}</div>
              )}
            </div>
          )
        })}

        <div style={{ flex: 1 }} />

        {onSignOut && (
          <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={onSignOut}
              onMouseEnter={() => setHoveredId('__signout')}
              onMouseLeave={() => setHoveredId(null)}
              aria-label="Sign out"
              style={{
                width: '38px', height: '38px', borderRadius: '11px',
                background: 'transparent', border: '1px solid transparent',
                color: '#ff7a7a', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <Icon name="lock" size={16} />
            </button>
            {hoveredId === '__signout' && (
              <div style={{
                position: 'absolute', left: '52px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(6,12,20,0.98)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', padding: '6px 11px', fontSize: '0.72rem',
                color: 'var(--white)', whiteSpace: 'nowrap', pointerEvents: 'none',
                boxShadow: '0 6px 20px rgba(0,0,0,0.4)', zIndex: 100,
              }}>Sign out</div>
            )}
          </div>
        )}
      </aside>

      {/* ───────── TOP BAR ───────── */}
      <header className="shell-topbar" style={{
        position: 'sticky',
        top: '16px',
        marginLeft: '90px',
        marginRight: '16px',
        marginTop: '16px',
        padding: '10px 18px',
        background: 'linear-gradient(180deg, rgba(10,16,28,0.75), rgba(6,12,20,0.6))',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        backdropFilter: 'blur(20px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        zIndex: 40,
      }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: '0 1 auto' }}>
          {breadcrumb.map((crumb, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '0.78rem', fontWeight: 600,
                color: i === breadcrumb.length - 1 ? 'var(--white)' : 'var(--text-muted)',
                whiteSpace: 'nowrap',
              }}>{crumb}</span>
              {i < breadcrumb.length - 1 && (
                <span style={{ color: 'var(--text-dim)', fontSize: '0.6rem' }}>›</span>
              )}
            </span>
          ))}
        </div>

        {dateLabel && (
          <>
            <span style={{ width: 1, height: '18px', background: 'rgba(255,255,255,0.1)' }} aria-hidden="true" />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{dateLabel}</span>
          </>
        )}

        <div style={{ flex: 1 }} />

        {topRight}

        {userName && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '5px 12px 5px 5px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '100px',
          }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--sky), var(--purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '0.82rem',
            }}>{userName.charAt(0).toUpperCase()}</div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--white)', fontWeight: 600 }}>{userName}</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>{userRole || userBadge}</span>
            </div>
          </div>
        )}
      </header>

      {/* ───────── CONTENT ───────── */}
      <main className="shell-content" style={{
        marginLeft: '90px',
        marginRight: '16px',
        padding: '20px 4px 60px',
        position: 'relative',
        zIndex: 1,
      }}>
        {children}
      </main>

      <style>{`
        @media (max-width: 720px) {
          .shell-sidebar {
            flex-direction: row !important;
            top: auto !important;
            bottom: 12px !important;
            left: 12px !important;
            right: 12px !important;
            width: auto !important;
            padding: 8px 10px !important;
            border-radius: 16px !important;
          }
          .shell-topbar, .shell-content {
            margin-left: 12px !important;
            margin-right: 12px !important;
          }
          .shell-content {
            padding-bottom: 90px !important;
          }
        }
      `}</style>
    </div>
  )
}
