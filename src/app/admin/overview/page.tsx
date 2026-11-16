'use client'
// Admin Overview — the glance screen. Opens by default.
// Pulls counts + recent rows from Supabase in parallel. No page refetches
// unless you hit the Refresh button; the other tabs own their own live data.
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Icon } from '@/components/ui/Icons'
import { downloadCSV } from '@/lib/csv'

interface Counts {
  affiliates: number
  referralsPending: number
  referralsPaid: number
  commissionsPending: number
  commissionsPaid: number
  newsletterSubs: number
  blogPosts: number
  blogPublished: number
  contactsTotal: number
  contactsNew: number
  packagesTotal: number
  packagesNew: number
  jobsTotal: number
  jobsNew: number
}

interface Row { id: string; created_at?: string; status?: string; [k: string]: unknown }
interface ActivityItem {
  kind: 'contact' | 'package' | 'job' | 'newsletter' | 'affiliate'
  id: string
  label: string
  sub: string
  at: string
}
interface TopAffiliate { id: string; name: string; email: string; referrals: number }

const KPI_COLORS: Record<string, string> = {
  sky: 'rgba(16,161,219,0.25)',
  purple: 'rgba(141,92,255,0.25)',
  green: 'rgba(34,197,94,0.25)',
  amber: 'rgba(245,158,11,0.25)',
  pink: 'rgba(236,72,153,0.25)',
  red: 'rgba(239,68,68,0.25)',
}

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState<Counts | null>(null)
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [needsAction, setNeedsAction] = useState<{ contacts: Row[]; packages: Row[]; jobs: Row[] }>({ contacts: [], packages: [], jobs: [] })
  const [topAffiliates, setTopAffiliates] = useState<TopAffiliate[]>([])
  const [maintenance, setMaintenance] = useState<{ active: boolean; title?: string } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)

    // Everything in parallel
    const [
      affRes,
      refRes,
      nlRes,
      blogRes,
      contactsRes,
      packagesRes,
      jobsRes,
      maintRes,
    ] = await Promise.all([
      fetch('/api/admin/affiliates').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/admin/referrals').then(r => r.ok ? r.json() : []).catch(() => []),
      supabase.from('newsletter_subscribers').select('id,email,subscribed_at').order('subscribed_at', { ascending: false }),
      supabase.from('blog_posts').select('id,title,status,updated_at,created_at'),
      supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
      supabase.from('package_submissions').select('*').order('created_at', { ascending: false }),
      supabase.from('job_applications').select('*').order('created_at', { ascending: false }),
      supabase.from('site_config').select('*').eq('key', 'maintenance').maybeSingle(),
    ])

    const affiliates: Row[] = Array.isArray(affRes) ? affRes : []
    const referrals: Row[] = Array.isArray(refRes) ? refRes : []
    const nl: Row[] = nlRes.data || []
    const blog: Row[] = blogRes.data || []
    const contacts: Row[] = contactsRes.data || []
    const packages: Row[] = packagesRes.data || []
    const jobs: Row[] = jobsRes.data || []

    // Counts
    const refsPending = referrals.filter(r => r.status === 'pending')
    const refsPaid = referrals.filter(r => r.status === 'paid')
    const commissionsPending = refsPending.reduce((s, r) => s + Number(r.commission_amount || 0), 0)
    const commissionsPaid = refsPaid.reduce((s, r) => s + Number(r.commission_amount || 0), 0)

    setCounts({
      affiliates: affiliates.length,
      referralsPending: refsPending.length,
      referralsPaid: refsPaid.length,
      commissionsPending,
      commissionsPaid,
      newsletterSubs: nl.length,
      blogPosts: blog.length,
      blogPublished: blog.filter(b => b.status === 'published').length,
      contactsTotal: contacts.length,
      contactsNew: contacts.filter(c => c.status === 'new').length,
      packagesTotal: packages.length,
      packagesNew: packages.filter(p => p.status === 'new').length,
      jobsTotal: jobs.length,
      jobsNew: jobs.filter(j => j.status === 'new').length,
    })

    // Needs action
    setNeedsAction({
      contacts: contacts.filter(c => c.status === 'new').slice(0, 5),
      packages: packages.filter(p => p.status === 'new').slice(0, 5),
      jobs: jobs.filter(j => j.status === 'new').slice(0, 5),
    })

    // Activity feed — merge newest of each kind, pick top 12
    const events: ActivityItem[] = []
    for (const c of contacts.slice(0, 10)) {
      events.push({ kind: 'contact', id: String(c.id), label: String(c.name || c.email || 'Contact form'), sub: String(c.email || ''), at: String(c.created_at || '') })
    }
    for (const p of packages.slice(0, 10)) {
      events.push({ kind: 'package', id: String(p.id), label: String(p.name || 'Package request'), sub: String(p.email || ''), at: String(p.created_at || '') })
    }
    for (const j of jobs.slice(0, 10)) {
      events.push({ kind: 'job', id: String(j.id), label: String(j.name || 'Job application'), sub: String(j.position || j.email || ''), at: String(j.created_at || '') })
    }
    for (const n of nl.slice(0, 10)) {
      events.push({ kind: 'newsletter', id: String(n.id), label: String(n.email), sub: 'Newsletter', at: String(n.subscribed_at || '') })
    }
    for (const a of affiliates.slice(0, 10)) {
      events.push({ kind: 'affiliate', id: String(a.id), label: String(a.name || a.email || 'Affiliate'), sub: `Affiliate · ${a.email || ''}`, at: String(a.created_at || '') })
    }
    events.sort((a, b) => (a.at < b.at ? 1 : -1))
    setActivity(events.slice(0, 12))

    // Top affiliates by referral count
    const byAff: Record<string, number> = {}
    for (const r of referrals) {
      const k = String(r.affiliate_id || '')
      if (k) byAff[k] = (byAff[k] || 0) + 1
    }
    const top: TopAffiliate[] = affiliates
      .map(a => ({ id: String(a.id), name: String(a.name || '—'), email: String(a.email || ''), referrals: byAff[String(a.id)] || 0 }))
      .sort((a, b) => b.referrals - a.referrals)
      .slice(0, 5)
    setTopAffiliates(top)

    // Maintenance
    const mData = (maintRes as { data?: { value?: string } }).data
    if (mData?.value) {
      try {
        const v = JSON.parse(mData.value)
        setMaintenance({ active: !!v.active, title: v.title })
      } catch { setMaintenance(null) }
    }

    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const exportAll = async () => {
    const [contactsRes, packagesRes, jobsRes, nlRes, affRes] = await Promise.all([
      supabase.from('contact_submissions').select('*'),
      supabase.from('package_submissions').select('*'),
      supabase.from('job_applications').select('*'),
      supabase.from('newsletter_subscribers').select('*'),
      fetch('/api/admin/affiliates').then(r => r.ok ? r.json() : []).catch(() => []),
    ])
    if (contactsRes.data?.length) downloadCSV(contactsRes.data, 'yallagrow-contacts')
    if (packagesRes.data?.length) downloadCSV(packagesRes.data, 'yallagrow-packages')
    if (jobsRes.data?.length) downloadCSV(jobsRes.data, 'yallagrow-jobs')
    if (nlRes.data?.length) downloadCSV(nlRes.data, 'yallagrow-newsletter')
    if (Array.isArray(affRes) && affRes.length) downloadCSV(affRes, 'yallagrow-affiliates')
  }

  if (loading || !counts) {
    return (
      <div style={{ padding: '40px 24px', color: 'var(--text-dim)', textAlign: 'center' }}>Loading overview…</div>
    )
  }

  return (
    <div style={{ padding: '18px 24px 40px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: 'var(--white)', margin: 0, letterSpacing: '-0.5px' }}>Overview</h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: '4px 0 0' }}>At-a-glance stats, recent activity, and what needs your attention.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {maintenance?.active && (
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#ffb84d', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', padding: '5px 10px', borderRadius: '7px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <Icon name="wrench" size={10} /> Maintenance mode ON
            </span>
          )}
          <button onClick={load} className="btn-secondary" style={{ fontSize: '0.72rem', padding: '7px 14px' }}>
            Refresh
          </button>
          <button onClick={exportAll} className="btn-primary" style={{ fontSize: '0.72rem', padding: '7px 14px' }}>
            Export all CSVs
          </button>
        </div>
      </div>

      {/* KPI tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px', marginBottom: '18px' }}>
        <KpiTile label="Affiliates" value={counts.affiliates} sub={`${counts.referralsPending + counts.referralsPaid} referrals`} tone="sky" />
        <KpiTile label="Pending payouts" value={`$${counts.commissionsPending.toFixed(0)}`} sub={`${counts.referralsPending} pending`} tone="amber" />
        <KpiTile label="Paid out" value={`$${counts.commissionsPaid.toFixed(0)}`} sub={`${counts.referralsPaid} paid`} tone="green" />
        <KpiTile label="Newsletter" value={counts.newsletterSubs} sub="subscribers" tone="purple" />
        <KpiTile label="New contacts" value={counts.contactsNew} sub={`${counts.contactsTotal} total`} tone={counts.contactsNew > 0 ? 'red' : 'sky'} />
        <KpiTile label="New package requests" value={counts.packagesNew} sub={`${counts.packagesTotal} total`} tone={counts.packagesNew > 0 ? 'red' : 'sky'} />
        <KpiTile label="New job applications" value={counts.jobsNew} sub={`${counts.jobsTotal} total`} tone={counts.jobsNew > 0 ? 'red' : 'sky'} />
        <KpiTile label="Blog posts" value={counts.blogPosts} sub={`${counts.blogPublished} published`} tone="pink" />
      </div>

      {/* Two-column: needs action (left) + activity (right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '14px', marginBottom: '18px' }} className="admin-overview-split">
        {/* Needs action */}
        <GlassCard title="Needs action" subtitle="Submissions marked new, across all forms">
          {needsAction.contacts.length === 0 && needsAction.packages.length === 0 && needsAction.jobs.length === 0 ? (
            <EmptyState label="You're all caught up." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {needsAction.contacts.map(c => (
                <ActionRow key={`c-${c.id}`} tag="Contact" tagColor="#10a1db" title={String(c.name || c.email || 'Contact')} sub={String(c.message || c.email || '').slice(0, 80)} at={String(c.created_at || '')} />
              ))}
              {needsAction.packages.map(p => (
                <ActionRow key={`p-${p.id}`} tag="Package" tagColor="#8d5cff" title={String(p.name || 'Package request')} sub={String(p.email || '')} at={String(p.created_at || '')} />
              ))}
              {needsAction.jobs.map(j => (
                <ActionRow key={`j-${j.id}`} tag="Job" tagColor="#ec4899" title={String(j.name || 'Applicant')} sub={String(j.position || j.email || '')} at={String(j.created_at || '')} />
              ))}
            </div>
          )}
          <div style={{ marginTop: '10px', fontSize: '0.7rem', color: 'var(--text-dim)' }}>Open the Submissions tab to reply / mark as read.</div>
        </GlassCard>

        {/* Activity */}
        <GlassCard title="Recent activity" subtitle="Last 12 events">
          {activity.length === 0 ? (
            <EmptyState label="No activity yet." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {activity.map(e => <ActivityRow key={`${e.kind}-${e.id}`} e={e} />)}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Top affiliates */}
      <GlassCard title="Top affiliates" subtitle="By total referrals">
        {topAffiliates.length === 0 ? (
          <EmptyState label="No affiliates yet." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {topAffiliates.map((a, i) => (
              <div key={a.id} style={{
                display: 'grid',
                gridTemplateColumns: '24px 1fr auto auto',
                gap: '10px',
                alignItems: 'center',
                padding: '10px 6px',
                borderBottom: i < topAffiliates.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: i === 0 ? 'var(--sky)' : 'var(--text-dim)' }}>#{i + 1}</span>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--white)' }}>{a.name}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{a.email}</div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'right' }}>{a.referrals} refs</div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      <style>{`
        @media(max-width: 900px) {
          .admin-overview-split { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

/* ---------- Pieces ---------- */

function KpiTile({ label, value, sub, tone }: { label: string; value: string | number; sub: string; tone: string }) {
  const glow = KPI_COLORS[tone] || KPI_COLORS.sky
  return (
    <div style={{
      padding: '14px 16px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      boxShadow: `0 10px 28px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px ${glow}`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-dim)', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-1px', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</div>
    </div>
  )
}

function GlassCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{
      padding: '16px 18px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      boxShadow: '0 10px 28px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
      marginBottom: '14px',
    }}>
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.95rem', fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.3px' }}>{title}</div>
        {subtitle && <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  )
}

function ActionRow({ tag, tagColor, title, sub, at }: { tag: string; tagColor: string; title: string; sub: string; at: string }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '68px 1fr auto',
      gap: '10px',
      alignItems: 'center',
      padding: '9px 10px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '9px',
    }}>
      <span style={{
        fontSize: '0.6rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: tagColor,
        background: `${tagColor}18`,
        border: `1px solid ${tagColor}40`,
        padding: '3px 7px',
        borderRadius: '5px',
        textAlign: 'center',
      }}>{tag}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>
      </div>
      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{timeAgo(at)}</div>
    </div>
  )
}

function ActivityRow({ e }: { e: ActivityItem }) {
  const colors: Record<string, string> = {
    contact: '#10a1db',
    package: '#8d5cff',
    job: '#ec4899',
    newsletter: '#22c55e',
    affiliate: '#f59e0b',
  }
  const c = colors[e.kind]
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '6px 1fr auto',
      gap: '10px',
      alignItems: 'center',
      padding: '8px 2px',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c, boxShadow: `0 0 8px ${c}` }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.label}</div>
        <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.sub}</div>
      </div>
      <div style={{ fontSize: '0.64rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{timeAgo(e.at)}</div>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return <div style={{ padding: '18px 10px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)' }}>{label}</div>
}

function timeAgo(iso: string): string {
  if (!iso) return ''
  const t = new Date(iso).getTime()
  if (isNaN(t)) return ''
  const s = Math.floor((Date.now() - t) / 1000)
  if (s < 60) return 'now'
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  if (s < 2592000) return `${Math.floor(s / 86400)}d`
  return new Date(iso).toLocaleDateString()
}
