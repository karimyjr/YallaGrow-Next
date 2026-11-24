'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminOverviewPage from './overview/page'
import AdminBlogPage from './blog/page'
import AdminPackagesPage from './packages/page'
import AdminPricingPage from './pricing/page'
import AdminAffiliatesPage from './affiliates/page'
import AdminMaintenancePage from './maintenance/page'
import AdminNewsletterPage from './newsletter/page'
import AdminSubmissionsPage from './submissions/page'
import GlassSidebar, {
  GLASS_SIDEBAR_WIDTH_EXPANDED,
  type NavGroup,
} from '@/components/ui/GlassSidebar'
import type { IconName } from '@/components/ui/Icons'

const TABS: { id: string; icon: IconName; label: string; component: React.ComponentType }[] = [
  { id: 'overview', icon: 'bar-chart', label: 'Overview', component: AdminOverviewPage },
  { id: 'submissions', icon: 'clipboard', label: 'Submissions', component: AdminSubmissionsPage },
  { id: 'affiliates', icon: 'handshake', label: 'Affiliates', component: AdminAffiliatesPage },
  { id: 'newsletter', icon: 'mail', label: 'Newsletter', component: AdminNewsletterPage },
  { id: 'blog', icon: 'edit', label: 'Blog', component: AdminBlogPage },
  { id: 'packages', icon: 'package', label: 'Packages', component: AdminPackagesPage },
  { id: 'pricing', icon: 'dollar', label: 'Pricing', component: AdminPricingPage },
  { id: 'maintenance', icon: 'wrench', label: 'Maintenance', component: AdminMaintenancePage },
]

// Two visual groups in the sidebar: the main admin surfaces, then the
// content-management set. The reference ("Aurora Climate") used labeled
// groups — mirrors them without inventing fake categories.
const GROUPS: NavGroup[] = [
  {
    label: null,
    items: [
      { id: 'overview',    icon: 'bar-chart', label: 'Overview' },
      { id: 'submissions', icon: 'clipboard', label: 'Submissions' },
      { id: 'affiliates',  icon: 'handshake', label: 'Affiliates' },
      { id: 'newsletter',  icon: 'mail',      label: 'Newsletter' },
    ],
  },
  {
    label: 'Content',
    items: [
      { id: 'blog',        icon: 'edit',    label: 'Blog' },
      { id: 'packages',    icon: 'package', label: 'Packages' },
      { id: 'pricing',     icon: 'dollar',  label: 'Pricing' },
      { id: 'maintenance', icon: 'wrench',  label: 'Maintenance' },
    ],
  },
]

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component || AdminOverviewPage

  // Same sign-out that the layout top bar runs — duplicated here so the
  // sidebar can own it and the top bar stays hidden on /admin.
  const signOut = () => {
    sessionStorage.removeItem('yg_admin')
    router.push('/admin/login')
  }

  // Content gets left padding equal to the maximum (expanded) sidebar width
  // so the main area never reflows when the sidebar collapses — only the
  // sidebar's own width transitions. On <640px the sidebar is a drawer and
  // takes no layout room, so the padding drops to a small gutter.
  return (
    <div>
      <GlassSidebar
        badge="Admin"
        workspaceSubtitle="Admin console"
        groups={GROUPS}
        activeId={activeTab}
        onSelect={setActiveTab}
        user={{ name: 'Karim', email: 'info@yallagrow.net', initials: 'K' }}
        onSignOut={signOut}
        search={{
          placeholder: 'Search admin…',
          // Fuzzy-match the query against tab labels and jump to the first
          // hit. Keeps ⌘K → type → enter as a <1s navigation.
          onSubmit: (q) => {
            const needle = q.trim().toLowerCase()
            if (!needle) return
            const hit = TABS.find(t => t.label.toLowerCase().includes(needle))
            if (hit) setActiveTab(hit.id)
          },
        }}
      />

      <div
        className="admin-content"
        style={{
          // Read the sidebar's current width from the CSS var it sets on
          // <html>. Falls back to expanded if the var hasn't been set yet
          // (first paint pre-hydration). Transition keeps the content
          // gutter in sync with the sidebar's own width animation.
          paddingLeft: `calc(var(--yg-sidebar-width, ${GLASS_SIDEBAR_WIDTH_EXPANDED}px) + 24px)`,
          transition: 'padding-left 0.38s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <ActiveComponent />
      </div>

      <style>{`
        /* On mobile the sidebar is a drawer, so the content doesn't need
           to leave room for it. Hamburger lives at top:14px/left:14px so
           we reserve 64px of top padding. */
        @media (max-width: 640px) {
          .admin-content {
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-top: 64px;
          }
        }
      `}</style>
    </div>
  )
}
