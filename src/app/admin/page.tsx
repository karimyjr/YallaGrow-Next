'use client'
// Admin shell — V35 sidebar + topbar wraps every sub-page. The
// sidebar replaces the old top tab strip; same 8 destinations.

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminOverviewPage from './overview/page'
import AdminBlogPage from './blog/page'
import AdminPackagesPage from './packages/page'
import AdminPricingPage from './pricing/page'
import AdminAffiliatesPage from './affiliates/page'
import AdminMaintenancePage from './maintenance/page'
import AdminNewsletterPage from './newsletter/page'
import AdminSubmissionsPage from './submissions/page'
import AppShellV35, { ShellNavItem } from '@/components/ui/AppShellV35'
import type { IconName } from '@/components/ui/Icons'

const TABS: { id: string; icon: IconName; label: string; component: React.ComponentType }[] = [
  { id: 'overview',    icon: 'bar-chart', label: 'Overview',    component: AdminOverviewPage },
  { id: 'submissions', icon: 'clipboard', label: 'Submissions', component: AdminSubmissionsPage },
  { id: 'affiliates',  icon: 'handshake', label: 'Affiliates',  component: AdminAffiliatesPage },
  { id: 'newsletter',  icon: 'mail',      label: 'Newsletter',  component: AdminNewsletterPage },
  { id: 'blog',        icon: 'edit',      label: 'Blog',        component: AdminBlogPage },
  { id: 'packages',    icon: 'package',   label: 'Packages',    component: AdminPackagesPage },
  { id: 'pricing',     icon: 'dollar',    label: 'Pricing',     component: AdminPricingPage },
  { id: 'maintenance', icon: 'wrench',    label: 'Maintenance', component: AdminMaintenancePage },
]

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [now, setNow] = useState<string>('')

  // Live clock
  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }))
    tick()
    const i = setInterval(tick, 30_000)
    return () => clearInterval(i)
  }, [])

  const active = TABS.find(t => t.id === activeTab) || TABS[0]
  const ActiveComponent = active.component

  const signOut = () => {
    sessionStorage.removeItem('yg_admin')
    router.push('/admin/login')
  }

  const nav: ShellNavItem[] = TABS.map(t => ({ id: t.id, icon: t.icon, label: t.label }))

  return (
    <AppShellV35
      nav={nav}
      activeId={activeTab}
      onNavigate={setActiveTab}
      breadcrumb={['YallaGrow', 'Admin', active.label]}
      dateLabel={now}
      userName="Karim"
      userRole="Founder"
      userBadge="Admin"
      onSignOut={signOut}
      topRight={
        <a
          href="/"
          target="_blank"
          rel="noopener"
          style={{
            fontSize: '0.72rem', padding: '7px 14px',
            color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
            textDecoration: 'none', fontFamily: 'Inter, sans-serif',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
          }}
        >
          View site ↗
        </a>
      }
    >
      <ActiveComponent />
    </AppShellV35>
  )
}
