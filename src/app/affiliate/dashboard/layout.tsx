'use client'
// Session gate + sidebar frame shared by every /affiliate/dashboard/* page.
// Fetches /me-session once on mount, then:
//   - no session + on the root (/affiliate/dashboard):    show <AffiliateLogin>
//   - no session + on any sub-route (/referrals, …):      redirect to root
//   - session:                                            render sidebar + AffiliateProvider + children

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import GlassSidebar, {
  GLASS_SIDEBAR_WIDTH_EXPANDED,
  type NavGroup,
} from '@/components/ui/GlassSidebar'
import { AffiliateProvider, type Affiliate, type Referral } from '@/components/affiliate/AffiliateContext'
import AffiliateLogin from '@/components/affiliate/AffiliateLogin'

const ROOT_PATH = '/affiliate/dashboard'

const GROUPS: NavGroup[] = [
  {
    label: null,
    items: [
      { id: 'overview',  icon: 'home',      label: 'Overview',  href: '/affiliate/dashboard' },
      { id: 'referrals', icon: 'handshake', label: 'Referrals', href: '/affiliate/dashboard/referrals' },
      { id: 'payouts',   icon: 'dollar',    label: 'Payouts',   href: '/affiliate/dashboard/payouts' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { id: 'resources', icon: 'folder', label: 'Resources', href: '/affiliate/dashboard/resources' },
    ],
  },
]

export default function AffiliateDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname() || ROOT_PATH
  const [payload, setPayload] = useState<{ affiliate: Affiliate; referrals: Referral[] } | null>(null)
  const [checking, setChecking] = useState(true)

  // Initial session check — reads the httpOnly session cookie by hitting
  // /me-session. Not sessionStorage, so no setState-in-effect concern about
  // a syncExternalStore refactor.
  useEffect(() => {
    let cancelled = false
    fetch('/api/affiliate/me-session', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(p => { if (!cancelled) setPayload(p) })
      .catch(() => { /* treated as no session */ })
      .finally(() => { if (!cancelled) setChecking(false) })
    return () => { cancelled = true }
  }, [])

  // Sub-route guard: if the user hits /referrals etc. without a session,
  // bounce them to the root where the login form lives.
  useEffect(() => {
    if (checking) return
    if (!payload && pathname !== ROOT_PATH) router.replace(ROOT_PATH)
  }, [checking, payload, pathname, router])

  const refresh = async () => {
    const r = await fetch('/api/affiliate/me-session', { credentials: 'include' })
    if (!r.ok) return
    const p = await r.json()
    setPayload(p)
  }

  const signOut = async () => {
    await fetch('/api/affiliate/signout-session', { method: 'POST', credentials: 'include' })
    setPayload(null)
    router.replace(ROOT_PATH)
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark2)', display: 'grid', placeItems: 'center', color: 'var(--text-dim)', fontSize: '0.86rem' }}>
        Loading dashboard…
      </div>
    )
  }

  // Not logged in → root shows the login form; sub-routes already redirected above.
  if (!payload) {
    if (pathname === ROOT_PATH) return <AffiliateLogin onLoggedIn={setPayload} />
    return null  // redirect is in flight
  }

  // Logged in — provide context, render sidebar + content frame.
  const activeId =
    pathname.startsWith('/affiliate/dashboard/referrals') ? 'referrals' :
    pathname.startsWith('/affiliate/dashboard/payouts')   ? 'payouts'   :
    pathname.startsWith('/affiliate/dashboard/resources') ? 'resources' :
                                                            'overview'

  const firstName = payload.affiliate.full_name.split(' ')[0]

  return (
    <AffiliateProvider value={{ affiliate: payload.affiliate, referrals: payload.referrals, refresh, signOut }}>
      <div style={{
        minHeight: '100vh',
        background: 'var(--dark2)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient orbs */}
        <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '55vw', height: '55vw', background: 'radial-gradient(circle, rgba(16,161,219,0.18), transparent 60%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '-15%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(141,92,255,0.14), transparent 60%)', filter: 'blur(80px)' }} />
        </div>

        <GlassSidebar
          badge="Affiliate"
          workspaceSubtitle="Affiliate portal"
          groups={GROUPS}
          activeId={activeId}
          user={{
            name: firstName,
            email: payload.affiliate.email,
            initials: firstName.slice(0, 1).toUpperCase(),
          }}
          onSignOut={signOut}
          promo={{
            title: 'Share your link',
            subtitle: 'Copy & send to a client',
            ctaLabel: 'Copy',
            onClick: () => {
              const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yallagrow.net'
              navigator.clipboard.writeText(`${siteUrl}/?ref=${payload.affiliate.ref_code}`).catch(() => {})
            },
          }}
          search={{
            placeholder: 'Jump to section…',
            // ⌘K → fuzzy-match against the section label, then route.
            onSubmit: (q) => {
              const needle = q.trim().toLowerCase()
              if (!needle) return
              const allItems = GROUPS.flatMap(g => g.items)
              const hit = allItems.find(i => i.label.toLowerCase().includes(needle))
              if (hit?.href) router.push(hit.href)
            },
          }}
        />

        <div
          className="aff-content"
          style={{
            paddingLeft: `calc(var(--yg-sidebar-width, ${GLASS_SIDEBAR_WIDTH_EXPANDED}px) + 24px)`,
            paddingRight: '24px',
            paddingTop: '32px',
            paddingBottom: '60px',
            position: 'relative',
            zIndex: 1,
            transition: 'padding-left 0.38s cubic-bezier(0.22, 1, 0.36, 1)',
            maxWidth: '1200px',
          }}
        >
          {children}
        </div>

        <style>{`
          @media (max-width: 640px) {
            .aff-content {
              padding-left: 16px !important;
              padding-right: 16px !important;
              padding-top: 72px !important;  /* room for hamburger */
            }
          }
        `}</style>
      </div>
    </AffiliateProvider>
  )
}
