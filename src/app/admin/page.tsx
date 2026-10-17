'use client'
import { useState } from 'react'
import AdminBlogPage from './blog/page'
import AdminPackagesPage from './packages/page'
import AdminPricingPage from './pricing/page'
import AdminAffiliatesPage from './affiliates/page'
import AdminMaintenancePage from './maintenance/page'
import AdminNewsletterPage from './newsletter/page'
import AdminSubmissionsPage from './submissions/page'
import { Icon } from '@/components/ui/Icons'

type IconName = 'edit' | 'package' | 'dollar' | 'handshake' | 'mail' | 'wrench' | 'clipboard'
const TABS: { id: string; icon: IconName; label: string; component: React.ComponentType }[] = [
  { id: 'blog', icon: 'edit', label: 'Blog', component: AdminBlogPage },
  { id: 'packages', icon: 'package', label: 'Packages', component: AdminPackagesPage },
  { id: 'pricing', icon: 'dollar', label: 'Pricing', component: AdminPricingPage },
  { id: 'affiliates', icon: 'handshake', label: 'Affiliate Program', component: AdminAffiliatesPage },
  { id: 'newsletter', icon: 'mail', label: 'Newsletter', component: AdminNewsletterPage },
  { id: 'maintenance', icon: 'wrench', label: 'Maintenance', component: AdminMaintenancePage },
  { id: 'submissions', icon: 'clipboard', label: 'Submissions', component: AdminSubmissionsPage },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('blog')
  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component || AdminBlogPage

  return (
    <div>
      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '4px',
        padding: '0 24px',
        borderBottom: '1px solid var(--glass-border)',
        overflowX: 'auto',
        flexWrap: 'wrap',
        background: 'rgba(0,0,0,0.2)',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'rgba(16,161,219,0.08)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--sky)' : '2px solid transparent',
              padding: '14px 18px',
              cursor: 'pointer',
              color: activeTab === tab.id ? 'var(--sky)' : 'var(--text-muted)',
              fontSize: '0.88rem',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              marginBottom: '-1px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={e => {
              if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--white)'
            }}
            onMouseLeave={e => {
              if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            <Icon name={tab.icon} size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <ActiveComponent />
    </div>
  )
}
