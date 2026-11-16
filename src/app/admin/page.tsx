'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
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
  { id: 'affiliates', icon: 'handshake', label: 'Affiliates', component: AdminAffiliatesPage },
  { id: 'newsletter', icon: 'mail', label: 'Newsletter', component: AdminNewsletterPage },
  { id: 'maintenance', icon: 'wrench', label: 'Maintenance', component: AdminMaintenancePage },
  { id: 'submissions', icon: 'clipboard', label: 'Submissions', component: AdminSubmissionsPage },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('blog')
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component || AdminBlogPage

  // Liquid pill tracks hover first, falls back to active tab.
  const targetTab = hoveredTab ?? activeTab

  return (
    <div>
      {/* Glassy pill tab nav */}
      <div style={{
        padding: '20px 24px 0',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div
          onMouseLeave={() => setHoveredTab(null)}
          style={{
            display: 'inline-flex',
            gap: '2px',
            padding: '5px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            backdropFilter: 'blur(18px) saturate(1.3)',
            WebkitBackdropFilter: 'blur(18px) saturate(1.3)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
            overflowX: 'auto',
            maxWidth: '100%',
          }}
          className="admin-tabs-strip"
        >
          {TABS.map(tab => {
            const isTarget = tab.id === targetTab
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                onMouseEnter={() => setHoveredTab(tab.id)}
                style={{
                  position: 'relative',
                  background: 'transparent',
                  border: 'none',
                  padding: '9px 14px',
                  cursor: 'pointer',
                  color: isActive ? 'var(--white)' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  borderRadius: '10px',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  zIndex: 1,
                }}
              >
                {isTarget && (
                  <motion.div
                    layoutId="admin-tab-pill"
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: isActive
                        ? 'linear-gradient(180deg, rgba(16,161,219,0.22), rgba(16,161,219,0.08))'
                        : 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                      border: isActive
                        ? '1px solid rgba(16,161,219,0.32)'
                        : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      boxShadow: isActive
                        ? '0 6px 24px rgba(16,161,219,0.2), inset 0 1px 0 rgba(255,255,255,0.08)'
                        : '0 2px 10px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
                      zIndex: -1,
                      pointerEvents: 'none',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32, mass: 0.6 }}
                  />
                )}
                <span style={{ color: isActive ? 'var(--sky)' : 'inherit', display: 'inline-flex', alignItems: 'center' }}>
                  <Icon name={tab.icon} size={13} />
                </span>
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Tab Content */}
      <div style={{ padding: '12px 0' }}>
        <ActiveComponent />
      </div>

      <style>{`
        .admin-tabs-strip::-webkit-scrollbar { display: none; }
        .admin-tabs-strip { scrollbar-width: none; }
      `}</style>
    </div>
  )
}
