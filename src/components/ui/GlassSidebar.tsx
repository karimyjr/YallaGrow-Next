'use client'
// GlassSidebar — dark-navy glass sidebar inspired by the "Glassy Sidebar V10"
// reference. Two states: collapsed (icon rail, ~72px) and expanded (~248px
// with labels). Toggle button on the rail persists choice to localStorage.
//
// Used by both /admin (state-driven tabs via onSelect + activeId) and
// /affiliate/dashboard/* (URL-driven via href on items — the component
// renders <Link> when href is present).
//
// Shared layout contract: the sidebar is position: fixed and the parent
// renders the main content with left padding matching the current width.
// Expose GLASS_SIDEBAR_WIDTH_COLLAPSED/EXPANDED so consumers can match.

import { useEffect, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { Icon, type IconName } from '@/components/ui/Icons'

export const GLASS_SIDEBAR_WIDTH_COLLAPSED = 72
export const GLASS_SIDEBAR_WIDTH_EXPANDED = 248

export interface NavItem {
  id: string
  label: string
  icon: IconName
  /** Set for URL-based nav (affiliate). Omit for state-based (admin tabs). */
  href?: string
  /** Optional right-aligned badge count (e.g. pending submissions). */
  badge?: number | string
  /** Optional colored dot (e.g. sky / purple / green) shown left of label in expanded. */
  dot?: 'sky' | 'purple' | 'green' | 'orange'
}

export interface NavGroup {
  /** Section label shown above the items when expanded. Null/undefined = no label. */
  label?: string | null
  items: NavItem[]
}

export interface UserCard {
  name: string
  email?: string
  /** Shown as avatar initials when no avatarUrl. */
  initials?: string
  avatarUrl?: string
}

export interface GlassSidebarProps {
  /** Main title shown next to the logo when expanded ("Admin", "Affiliate"). */
  badge: string
  /** Groups of nav items, in render order. */
  groups: NavGroup[]
  /** Currently selected item id (both state- and URL-driven variants). */
  activeId?: string
  /** State-driven: called when a non-href item is clicked. */
  onSelect?: (id: string) => void
  /** Bottom user card. Omit to hide. */
  user?: UserCard
  /** Bottom sign-out button handler. Omit to hide. */
  onSignOut?: () => void
  /** Optional promo card above the user card (e.g. "Share your link"). */
  promo?: {
    title: string
    subtitle?: string
    ctaLabel: string
    onClick: () => void
  }
}

const STORAGE_KEY = 'yg:glass-sidebar-collapsed'

// useSyncExternalStore-compatible wrapper around localStorage + resize listener.
// This replaces the old useEffect(setState) dance, which React 19's lint
// rejects as a cascading-render pattern.
function subscribeCollapsed(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('storage', callback)
  window.addEventListener('resize', callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener('resize', callback)
  }
}
function getCollapsedSnapshot(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) return saved === '1'
  } catch { /* private mode */ }
  return window.innerWidth < 1024
}
function getCollapsedServerSnapshot(): boolean {
  // SSR default: expanded (matches desktop). The client may flip collapsed
  // on hydration — tolerable because the width transition is CSS-driven.
  return false
}

export default function GlassSidebar({
  badge,
  groups,
  activeId,
  onSelect,
  user,
  onSignOut,
  promo,
}: GlassSidebarProps) {
  const storedCollapsed = useSyncExternalStore(subscribeCollapsed, getCollapsedSnapshot, getCollapsedServerSnapshot)
  // Local override lets the toggle button beat the storage reading until the
  // next storage/resize event (the store write below triggers one anyway).
  const [override, setOverride] = useState<boolean | null>(null)
  const collapsed = override ?? storedCollapsed
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggle = () => {
    const next = !collapsed
    setOverride(next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      // Fire a storage event in this tab so the subscriber re-reads immediately.
      window.dispatchEvent(new Event('storage'))
    } catch { /* private mode */ }
  }

  // Close the mobile drawer on nav
  const closeMobile = () => setMobileOpen(false)

  // On <640px the sidebar is a drawer slid in from the left; a floating
  // hamburger button in the top-left opens it.
  const width = collapsed ? GLASS_SIDEBAR_WIDTH_COLLAPSED : GLASS_SIDEBAR_WIDTH_EXPANDED

  // Expose current width as a CSS var on <html> so any parent content can
  // pad to match without needing to know the collapsed state. Cleared on
  // unmount so a sidebar-less page doesn't inherit stale padding.
  useEffect(() => {
    const el = document.documentElement
    el.style.setProperty('--yg-sidebar-width', `${width}px`)
    return () => { el.style.removeProperty('--yg-sidebar-width') }
  }, [width])

  return (
    <>
      {/* Mobile hamburger — shown only <640px, hidden when drawer is open */}
      <button
        type="button"
        className="gs-mobile-trigger"
        aria-label="Open navigation"
        onClick={() => setMobileOpen(true)}
        style={{ display: mobileOpen ? 'none' : undefined }}
      >
        <Icon name="menu" size={20} />
      </button>

      {/* Mobile scrim */}
      {mobileOpen && <div className="gs-scrim" onClick={closeMobile} aria-hidden="true" />}

      <aside
        className={`gs-root ${collapsed ? 'gs-collapsed' : 'gs-expanded'} ${mobileOpen ? 'gs-mobile-open' : ''}`}
        aria-label="Primary navigation"
      >
        {/* ─── HEADER: logo + badge + collapse toggle ─── */}
        <div className="gs-header">
          <Link href="/" className="gs-brand" aria-label="YallaGrow home" onClick={closeMobile}>
            <div className="gs-brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20C4 12 10 6 20 4c0 10-6 16-16 16Z" />
                <path d="M4 20 14 10" />
              </svg>
            </div>
            <div className="gs-brand-text">
              <div className="gs-brand-name">Yalla<em>Grow</em></div>
              <div className="gs-brand-badge">{badge}</div>
            </div>
          </Link>
          <button
            type="button"
            className="gs-toggle"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={toggle}
          >
            <Icon name={collapsed ? 'menu' : 'menu'} size={14} />
          </button>
        </div>

        {/* ─── NAV GROUPS ─── */}
        <nav className="gs-nav">
          {groups.map((group, gi) => (
            <div key={gi} className="gs-group">
              {group.label && <div className="gs-group-label">{group.label}</div>}
              {group.items.map(item => {
                const isActive = item.id === activeId
                const inner = (
                  <>
                    <span className="gs-item-icon" aria-hidden="true">
                      <Icon name={item.icon} size={16} />
                    </span>
                    <span className="gs-item-label">{item.label}</span>
                    {item.dot && <span className={`gs-item-dot gs-dot-${item.dot}`} aria-hidden="true" />}
                    {item.badge != null && String(item.badge) !== '0' && (
                      <span className="gs-item-badge">{item.badge}</span>
                    )}
                  </>
                )
                if (item.href) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={closeMobile}
                      className={`gs-item ${isActive ? 'gs-item-active' : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                      title={collapsed ? item.label : undefined}
                    >
                      {inner}
                    </Link>
                  )
                }
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { onSelect?.(item.id); closeMobile() }}
                    className={`gs-item ${isActive ? 'gs-item-active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    title={collapsed ? item.label : undefined}
                  >
                    {inner}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        {/* ─── FOOTER: promo + user card + sign out ─── */}
        <div className="gs-footer">
          {promo && (
            <button
              type="button"
              onClick={() => { promo.onClick(); closeMobile() }}
              className="gs-promo"
              title={collapsed ? promo.ctaLabel : undefined}
            >
              <div className="gs-promo-icon" aria-hidden="true">
                <Icon name="sparkle" size={14} />
              </div>
              <div className="gs-promo-text">
                <div className="gs-promo-title">{promo.title}</div>
                {promo.subtitle && <div className="gs-promo-sub">{promo.subtitle}</div>}
              </div>
              <span className="gs-promo-cta">{promo.ctaLabel}</span>
            </button>
          )}

          {user && (
            <div className="gs-user" title={collapsed ? user.name : undefined}>
              <div className="gs-avatar" aria-hidden="true">
                {user.avatarUrl
                  // Avatars here are tiny (34px) and only the admin user ever
                  // sees them — next/image overhead isn't worth it.
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={user.avatarUrl} alt="" />
                  : <span>{user.initials || user.name.slice(0, 1).toUpperCase()}</span>}
                <span className="gs-status-dot" />
              </div>
              <div className="gs-user-text">
                <div className="gs-user-name">{user.name}</div>
                {user.email && <div className="gs-user-email">{user.email}</div>}
              </div>
              {onSignOut && (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="gs-signout"
                  aria-label="Sign out"
                >
                  <Icon name="lock" size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      <style>{`
        /* Root — fixed on left, full height, dark navy glass */
        .gs-root {
          position: fixed;
          left: 12px;
          top: 12px;
          bottom: 12px;
          width: ${width}px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 14px 10px;
          border-radius: 22px;
          background:
            linear-gradient(180deg,
              rgba(10, 15, 26, 0.92) 0%,
              rgba(14, 20, 38, 0.86) 45%,
              rgba(22, 20, 56, 0.72) 100%);
          backdrop-filter: blur(20px) saturate(140%);
          -webkit-backdrop-filter: blur(20px) saturate(140%);
          border: 1px solid rgba(16, 161, 219, 0.14);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -1px 0 rgba(0, 0, 0, 0.3),
            0 30px 60px -20px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(16, 161, 219, 0.06);
          color: #fff;
          font-family: 'Inter', system-ui, sans-serif;
          z-index: 90;
          transition: width 0.38s cubic-bezier(0.22, 1, 0.36, 1);
          overflow: hidden;
        }

        /* ── HEADER ── */
        .gs-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 6px 4px 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .gs-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          color: inherit;
          text-decoration: none;
        }
        .gs-brand-mark {
          width: 38px;
          height: 38px;
          flex: none;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, rgba(16,161,219,0.35), rgba(106,70,217,0.25));
          border: 1px solid rgba(16,161,219,0.4);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 6px 14px -4px rgba(16,161,219,0.5);
        }
        .gs-brand-text {
          min-width: 0;
          opacity: ${collapsed ? 0 : 1};
          transform: translateX(${collapsed ? '-6px' : '0'});
          transition: opacity 0.2s, transform 0.2s;
          pointer-events: ${collapsed ? 'none' : 'auto'};
          white-space: nowrap;
          overflow: hidden;
        }
        .gs-brand-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 0.95rem;
          letter-spacing: -0.4px;
          line-height: 1.1;
        }
        .gs-brand-name em { color: #10a1db; font-style: normal; }
        .gs-brand-badge {
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: #10a1db;
          margin-top: 2px;
        }
        .gs-toggle {
          flex: none;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .gs-toggle:hover { background: rgba(16,161,219,0.14); color: #fff; }

        /* ── NAV ── */
        .gs-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 2px 0;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .gs-nav::-webkit-scrollbar { width: 4px; }
        .gs-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        .gs-group { display: flex; flex-direction: column; gap: 3px; }
        .gs-group-label {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          padding: 6px 12px 4px;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s;
          height: ${collapsed ? '0' : 'auto'};
          overflow: hidden;
        }
        .gs-item {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 9px 10px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 500;
          color: rgba(255,255,255,0.72);
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          text-align: left;
          text-decoration: none;
          font-family: inherit;
          transition: background 0.18s, color 0.18s, border-color 0.18s;
          position: relative;
          overflow: hidden;
        }
        .gs-item:hover {
          background: rgba(255,255,255,0.05);
          color: #fff;
        }
        .gs-item-active {
          background: linear-gradient(180deg, rgba(16,161,219,0.18), rgba(16,161,219,0.08));
          color: #fff;
          border-color: rgba(16,161,219,0.3);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 12px -4px rgba(16,161,219,0.3);
        }
        .gs-item-icon {
          flex: none;
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          color: inherit;
        }
        .gs-item-label {
          flex: 1;
          opacity: ${collapsed ? 0 : 1};
          transform: translateX(${collapsed ? '-4px' : '0'});
          transition: opacity 0.2s, transform 0.2s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .gs-item-dot {
          flex: none;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s;
        }
        .gs-dot-sky { background: #10a1db; box-shadow: 0 0 6px rgba(16,161,219,0.7); }
        .gs-dot-purple { background: #8d5cff; box-shadow: 0 0 6px rgba(141,92,255,0.7); }
        .gs-dot-green { background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,0.7); }
        .gs-dot-orange { background: #f59e0b; box-shadow: 0 0 6px rgba(245,158,11,0.7); }
        .gs-item-badge {
          flex: none;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          border-radius: 7px;
          font-size: 0.66rem;
          font-weight: 700;
          display: grid;
          place-items: center;
          color: #1a1410;
          background: linear-gradient(180deg, #f59e0b, #d97706);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 6px rgba(245,158,11,0.4);
          opacity: ${collapsed ? 0 : 1};
          transform: scale(${collapsed ? 0.6 : 1});
          transition: opacity 0.2s, transform 0.2s;
        }

        /* ── FOOTER ── */
        .gs-footer {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .gs-promo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(16,161,219,0.18), rgba(106,70,217,0.18));
          border: 1px solid rgba(16,161,219,0.25);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
          cursor: pointer;
          font-family: inherit;
          color: inherit;
          text-align: left;
          transition: transform 0.15s, box-shadow 0.2s;
        }
        .gs-promo:hover { transform: translateY(-1px); box-shadow: 0 8px 20px -6px rgba(16,161,219,0.35); }
        .gs-promo-icon {
          flex: none;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #10a1db, #6a46d9);
          color: #fff;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.3);
        }
        .gs-promo-text {
          flex: 1;
          min-width: 0;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s;
          overflow: hidden;
        }
        .gs-promo-title { font-size: 0.76rem; font-weight: 700; white-space: nowrap; }
        .gs-promo-sub { font-size: 0.66rem; color: rgba(255,255,255,0.55); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .gs-promo-cta {
          flex: none;
          font-size: 0.66rem;
          font-weight: 700;
          padding: 4px 9px;
          border-radius: 6px;
          background: #fff;
          color: #0a0f1a;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s;
        }

        .gs-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .gs-avatar {
          position: relative;
          flex: none;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10a1db, #6a46d9);
          display: grid;
          place-items: center;
          font-size: 0.78rem;
          font-weight: 700;
          color: #fff;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.25);
          overflow: visible;
        }
        .gs-avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
        .gs-status-dot {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid #0a0f1a;
          box-shadow: 0 0 4px rgba(34,197,94,0.7);
        }
        .gs-user-text {
          flex: 1;
          min-width: 0;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s;
          overflow: hidden;
        }
        .gs-user-name {
          font-size: 0.78rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .gs-user-email {
          font-size: 0.66rem;
          color: rgba(255,255,255,0.5);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .gs-signout {
          flex: none;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ff8585;
          cursor: pointer;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s, background 0.2s;
        }
        .gs-signout:hover { background: rgba(239, 68, 68, 0.16); }

        /* ── MOBILE: drawer + hamburger ── */
        .gs-mobile-trigger {
          display: none;
          position: fixed;
          top: 14px;
          left: 14px;
          z-index: 92;
          width: 40px;
          height: 40px;
          border-radius: 11px;
          background: linear-gradient(180deg, rgba(10,15,26,0.9), rgba(14,20,38,0.85));
          border: 1px solid rgba(16,161,219,0.2);
          color: #fff;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 10px 28px -8px rgba(0,0,0,0.5);
        }
        .gs-scrim {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 89;
          backdrop-filter: blur(3px);
        }

        @media (max-width: 640px) {
          .gs-root {
            transform: translateX(${mobileOpen ? '0' : '-120%'});
            transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), width 0.38s cubic-bezier(0.22, 1, 0.36, 1);
            width: ${GLASS_SIDEBAR_WIDTH_EXPANDED}px;  /* always expanded in drawer */
          }
          .gs-mobile-trigger { display: flex; }
          .gs-scrim { display: ${mobileOpen ? 'block' : 'none'}; }
          .gs-brand-text, .gs-item-label, .gs-item-badge, .gs-item-dot,
          .gs-group-label, .gs-promo-text, .gs-promo-cta, .gs-user-text,
          .gs-signout { opacity: 1 !important; transform: none !important; }
          .gs-group-label { height: auto !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .gs-root, .gs-brand-text, .gs-item-label, .gs-item-badge, .gs-item-dot,
          .gs-group-label, .gs-promo-text, .gs-promo-cta, .gs-user-text,
          .gs-signout, .gs-toggle, .gs-item, .gs-promo {
            transition: none !important;
          }
        }
      `}</style>
    </>
  )
}
