'use client'
// Admin Overview — the glance screen. Opens by default.
// Pulls counts + recent rows from Supabase in parallel. No page refetches
// unless you hit the Refresh button; the other tabs own their own live data.
import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Icon } from '@/components/ui/Icons'
import { downloadCSV } from '@/lib/csv'

interface Counts {
  affiliates: number
  affiliates7d: number
  referralsPending: number
  referralsPaid: number
  commissionsPending: number
  commissionsPaid: number
  newsletterSubs: number
  newsletter7d: number
  blogPosts: number
  blogPublished: number
  contactsTotal: number
  contactsNew: number
  contacts7d: number
  packagesTotal: number
  packagesNew: number
  packages7d: number
  jobsTotal: number
  jobsNew: number
  jobs7d: number
}

interface Row { id: string; created_at?: string; status?: string; [k: string]: unknown }
type EventKind = 'contact' | 'package' | 'job' | 'newsletter' | 'affiliate'
interface ActivityItem {
  kind: EventKind
  id: string
  who: string      // person's name or email
  verb: string     // what they did ("submitted a contact message")
  at: string
}
interface TopAffiliate { id: string; name: string; email: string; referrals: number }

const KIND_META: Record<EventKind, { tag: string; color: string; verb: string }> = {
  contact:    { tag: 'CONTACT',    color: '#10a1db', verb: 'submitted a contact message' },
  package:    { tag: 'PACKAGE',    color: '#8d5cff', verb: 'requested a custom package' },
  job:        { tag: 'JOB',        color: '#ec4899', verb: 'applied for a job' },
  newsletter: { tag: 'NEWSLETTER', color: '#22c55e', verb: 'joined the newsletter' },
  affiliate:  { tag: 'AFFILIATE',  color: '#f59e0b', verb: 'signed up as an affiliate' },
}

const KPI_COLORS: Record<string, string> = {
  sky: 'rgba(16,161,219,0.25)',
  purple: 'rgba(141,92,255,0.25)',
  green: 'rgba(34,197,94,0.25)',
  amber: 'rgba(245,158,11,0.25)',
  pink: 'rgba(236,72,153,0.25)',
  red: 'rgba(239,68,68,0.25)',
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState<Counts | null>(null)
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [needsAction, setNeedsAction] = useState<{ contacts: Row[]; packages: Row[]; jobs: Row[] }>({ contacts: [], packages: [], jobs: [] })
  const [topAffiliates, setTopAffiliates] = useState<TopAffiliate[]>([])
  const [maintenance, setMaintenance] = useState<{ active: boolean; title?: string } | null>(null)
  const [filter, setFilter] = useState<EventKind | 'all'>('all')

  const load = useCallback(async () => {
    setLoading(true)
    const sevenDaysAgo = Date.now() - SEVEN_DAYS_MS
    const isRecent = (iso: string) => {
      if (!iso) return false
      const t = new Date(iso).getTime()
      return !isNaN(t) && t >= sevenDaysAgo
    }

    const [affRes, refRes, nlRes, blogRes, contactsRes, packagesRes, jobsRes, maintRes] = await Promise.all([
      fetch('/api/admin/affiliates').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/admin/referrals').then(r => r.ok ? r.json() : []).catch(() => []),
      supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false }),
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

    const refsPending = referrals.filter(r => r.status === 'pending')
    const refsPaid = referrals.filter(r => r.status === 'paid')

    setCounts({
      affiliates: affiliates.length,
      affiliates7d: affiliates.filter(a => isRecent(String(a.created_at || ''))).length,
      referralsPending: refsPending.length,
      referralsPaid: refsPaid.length,
      commissionsPending: refsPending.reduce((s, r) => s + Number(r.commission_amount || 0), 0),
      commissionsPaid: refsPaid.reduce((s, r) => s + Number(r.commission_amount || 0), 0),
      newsletterSubs: nl.length,
      newsletter7d: nl.filter(n => isRecent(String(n.subscribed_at || ''))).length,
      blogPosts: blog.length,
      blogPublished: blog.filter(b => b.status === 'published').length,
      contactsTotal: contacts.length,
      contactsNew: contacts.filter(c => c.status === 'new').length,
      contacts7d: contacts.filter(c => isRecent(String(c.created_at || ''))).length,
      packagesTotal: packages.length,
      packagesNew: packages.filter(p => p.status === 'new').length,
      packages7d: packages.filter(p => isRecent(String(p.created_at || ''))).length,
      jobsTotal: jobs.length,
      jobsNew: jobs.filter(j => j.status === 'new').length,
      jobs7d: jobs.filter(j => isRecent(String(j.created_at || ''))).length,
    })

    setNeedsAction({
      contacts: contacts.filter(c => c.status === 'new').slice(0, 5),
      packages: packages.filter(p => p.status === 'new').slice(0, 5),
      jobs: jobs.filter(j => j.status === 'new').slice(0, 5),
    })

    // Activity feed — merged + sorted, every row carries its kind + verb
    const events: ActivityItem[] = []
    for (const c of contacts.slice(0, 15)) {
      events.push({ kind: 'contact', id: String(c.id), who: String(c.name || c.email || 'Contact form'), verb: KIND_META.contact.verb, at: String(c.created_at || '') })
    }
    for (const p of packages.slice(0, 15)) {
      events.push({ kind: 'package', id: String(p.id), who: String(p.name || p.email || 'Package request'), verb: KIND_META.package.verb, at: String(p.created_at || '') })
    }
    for (const j of jobs.slice(0, 15)) {
      const role = String(j.position || '').trim()
      events.push({ kind: 'job', id: String(j.id), who: String(j.name || j.email || 'Applicant'), verb: role ? `applied for ${role}` : KIND_META.job.verb, at: String(j.created_at || '') })
    }
    for (const n of nl.slice(0, 15)) {
      events.push({ kind: 'newsletter', id: String(n.id), who: String(n.email), verb: KIND_META.newsletter.verb, at: String(n.subscribed_at || '') })
    }
    for (const a of affiliates.slice(0, 15)) {
      events.push({ kind: 'affiliate', id: String(a.id), who: String(a.name || a.email || 'Affiliate'), verb: KIND_META.affiliate.verb, at: String(a.created_at || '') })
    }
    events.sort((a, b) => (a.at < b.at ? 1 : -1))
    setActivity(events.slice(0, 30))

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

  const filteredActivity = useMemo(
    () => filter === 'all' ? activity : activity.filter(e => e.kind === filter),
    [activity, filter]
  )

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
    return <div style={{ padding: '40px 24px', color: 'var(--text-dim)', textAlign: 'center' }}>Loading overview…</div>
  }

  const totalNew = counts.contactsNew + counts.packagesNew + counts.jobsNew
  const totalThisWeek = counts.contacts7d + counts.packages7d + counts.jobs7d + counts.newsletter7d + counts.affiliates7d

  return (
    <div style={{ padding: '18px 20px 60px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* ───────── HEADER ───────── */}
      <SectionHeader
        eyebrow="Dashboard"
        title="Overview"
        subtitle={`${totalThisWeek} new events this week · ${totalNew} waiting for your reply`}
        right={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {maintenance?.active && (
              <span style={{ fontSize: '0.64rem', fontWeight: 700, color: '#ffb84d', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', padding: '5px 10px', borderRadius: '7px', textTransform: 'uppercase', letterSpacing: '1px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Icon name="wrench" size={10} /> Maintenance ON
              </span>
            )}
            <button onClick={load} className="btn-secondary" style={{ fontSize: '0.72rem', padding: '7px 14px' }}>Refresh</button>
            <button onClick={exportAll} className="btn-primary" style={{ fontSize: '0.72rem', padding: '7px 14px' }}>Export all CSVs</button>
          </div>
        }
      />

      {/* ───────── SECTION 1: KPI tiles ───────── */}
      <SectionHeader title="At a glance" subtitle="Lifetime totals across all forms and programs" size="sm" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px', marginBottom: '28px' }}>
        <KpiTile label="Affiliates" value={counts.affiliates} sub={`${counts.referralsPending + counts.referralsPaid} referrals`} tone="sky" />
        <KpiTile label="Pending payouts" value={`$${counts.commissionsPending.toFixed(0)}`} sub={`${counts.referralsPending} pending`} tone="amber" />
        <KpiTile label="Paid out" value={`$${counts.commissionsPaid.toFixed(0)}`} sub={`${counts.referralsPaid} paid`} tone="green" />
        <KpiTile label="Newsletter" value={counts.newsletterSubs} sub="subscribers" tone="purple" />
        <KpiTile label="New contacts" value={counts.contactsNew} sub={`${counts.contactsTotal} total`} tone={counts.contactsNew > 0 ? 'red' : 'sky'} />
        <KpiTile label="New package requests" value={counts.packagesNew} sub={`${counts.packagesTotal} total`} tone={counts.packagesNew > 0 ? 'red' : 'sky'} />
        <KpiTile label="New job applications" value={counts.jobsNew} sub={`${counts.jobsTotal} total`} tone={counts.jobsNew > 0 ? 'red' : 'sky'} />
        <KpiTile label="Blog posts" value={counts.blogPosts} sub={`${counts.blogPublished} published`} tone="pink" />
      </div>

      {/* ───────── SECTION 2: This week ───────── */}
      <SectionHeader title="This week" subtitle="New signups and submissions in the last 7 days" size="sm" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '28px' }}>
        <MiniTile label="Contacts" value={counts.contacts7d} color={KIND_META.contact.color} />
        <MiniTile label="Package requests" value={counts.packages7d} color={KIND_META.package.color} />
        <MiniTile label="Job applicants" value={counts.jobs7d} color={KIND_META.job.color} />
        <MiniTile label="Newsletter subs" value={counts.newsletter7d} color={KIND_META.newsletter.color} />
        <MiniTile label="New affiliates" value={counts.affiliates7d} color={KIND_META.affiliate.color} />
      </div>

      {/* ───────── SECTION 3: Needs action ───────── */}
      <SectionHeader
        title="Needs your attention"
        subtitle="Submissions still marked as new"
        size="sm"
        right={<span style={{ fontSize: '0.75rem', color: totalNew > 0 ? '#ff7a7a' : 'var(--text-dim)' }}>{totalNew} waiting</span>}
      />
      <GlassCard>
        {needsAction.contacts.length === 0 && needsAction.packages.length === 0 && needsAction.jobs.length === 0 ? (
          <EmptyState icon="check" label="You're all caught up." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {needsAction.contacts.map(c => (
              <ActionRow key={`c-${c.id}`} kind="contact" title={String(c.name || c.email || 'Contact')} sub={String(c.message || c.email || '').slice(0, 80)} at={String(c.created_at || '')} />
            ))}
            {needsAction.packages.map(p => (
              <ActionRow key={`p-${p.id}`} kind="package" title={String(p.name || 'Package request')} sub={String(p.email || '')} at={String(p.created_at || '')} />
            ))}
            {needsAction.jobs.map(j => (
              <ActionRow key={`j-${j.id}`} kind="job" title={String(j.name || 'Applicant')} sub={String(j.position || j.email || '')} at={String(j.created_at || '')} />
            ))}
          </div>
        )}
        <div style={{ marginTop: '10px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>Open the Submissions tab to reply or mark as read.</div>
      </GlassCard>

      {/* ───────── SECTION 4: Recent activity ───────── */}
      <div style={{ marginTop: '28px' }}>
        <SectionHeader
          title="Recent activity"
          subtitle={`Last ${activity.length} events across every form`}
          size="sm"
          right={
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} color="#9ca3af">All</FilterChip>
              {(['contact', 'package', 'job', 'newsletter', 'affiliate'] as const).map(k => (
                <FilterChip key={k} active={filter === k} onClick={() => setFilter(k)} color={KIND_META[k].color}>
                  {KIND_META[k].tag}
                </FilterChip>
              ))}
            </div>
          }
        />
        <GlassCard>
          {filteredActivity.length === 0 ? (
            <EmptyState icon="inbox" label="No activity in this filter." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {filteredActivity.map(e => <ActivityRow key={`${e.kind}-${e.id}`} e={e} />)}
            </div>
          )}
        </GlassCard>
      </div>

      {/* ───────── SECTION 5: Top affiliates ───────── */}
      <div style={{ marginTop: '28px' }}>
        <SectionHeader title="Top affiliates" subtitle="By total referrals (all-time)" size="sm" />
        <GlassCard>
          {topAffiliates.length === 0 ? (
            <EmptyState icon="handshake" label="No affiliates yet." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {topAffiliates.map((a, i) => (
                <div key={a.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '24px 1fr auto',
                  gap: '10px',
                  alignItems: 'center',
                  padding: '11px 6px',
                  borderBottom: i < topAffiliates.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: i === 0 ? 'var(--sky)' : 'var(--text-dim)' }}>#{i + 1}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--white)' }}>{a.name}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.email}</div>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <strong style={{ color: 'var(--white)' }}>{a.referrals}</strong> refs
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}

/* ──────────────────────────────── Pieces ──────────────────────────────── */

function SectionHeader({ eyebrow, title, subtitle, right, size = 'lg' }: { eyebrow?: string; title: string; subtitle?: string; right?: React.ReactNode; size?: 'lg' | 'sm' }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      marginBottom: size === 'lg' ? '22px' : '12px',
      marginTop: size === 'lg' ? 0 : '4px',
    }}>
      <div>
        {eyebrow && (
          <div style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--sky)', marginBottom: '4px' }}>{eyebrow}</div>
        )}
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: size === 'lg' ? '1.6rem' : '0.95rem',
          fontWeight: size === 'lg' ? 800 : 700,
          color: 'var(--white)',
          margin: 0,
          letterSpacing: '-0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          {size === 'sm' && <span style={{ display: 'inline-block', width: '3px', height: '14px', background: 'var(--sky)', borderRadius: '2px' }} />}
          {title}
        </h1>
        {subtitle && <p style={{ fontSize: size === 'lg' ? '0.82rem' : '0.72rem', color: 'var(--text-dim)', margin: '4px 0 0' }}>{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}

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
    }}>
      <div style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-dim)', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-1px', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</div>
    </div>
  )
}

function MiniTile({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      padding: '12px 14px',
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '11px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '8px',
        background: `${color}22`,
        border: `1px solid ${color}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.95rem',
        color,
      }}>{value}</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{label}</div>
    </div>
  )
}

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: '14px 16px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      boxShadow: '0 10px 28px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
    }}>
      {children}
    </div>
  )
}

function Tag({ kind }: { kind: EventKind }) {
  const m = KIND_META[kind]
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '0.58rem',
      fontWeight: 800,
      letterSpacing: '1.2px',
      color: m.color,
      background: `${m.color}18`,
      border: `1px solid ${m.color}44`,
      padding: '3px 7px',
      borderRadius: '5px',
      textAlign: 'center',
      whiteSpace: 'nowrap',
    }}>{m.tag}</span>
  )
}

function ActionRow({ kind, title, sub, at }: { kind: EventKind; title: string; sub: string; at: string }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '84px 1fr auto',
      gap: '10px',
      alignItems: 'center',
      padding: '10px 10px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '9px',
    }}>
      <Tag kind={kind} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>
      </div>
      <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{timeAgo(at)}</div>
    </div>
  )
}

function ActivityRow({ e }: { e: ActivityItem }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '92px 1fr auto',
      gap: '12px',
      alignItems: 'center',
      padding: '11px 4px',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <Tag kind={e.kind} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.who}</div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.verb}</div>
      </div>
      <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{timeAgo(e.at)}</div>
    </div>
  )
}

function FilterChip({ active, onClick, color, children }: { active: boolean; onClick: () => void; color: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      fontSize: '0.58rem',
      fontWeight: 800,
      letterSpacing: '1.2px',
      color: active ? '#fff' : color,
      background: active ? color : `${color}10`,
      border: `1px solid ${active ? color : color + '40'}`,
      padding: '4px 8px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontFamily: 'Inter, sans-serif',
      transition: 'all 0.15s',
    }}>{children}</button>
  )
}

function EmptyState({ label, icon }: { label: string; icon?: 'check' | 'inbox' | 'handshake' }) {
  return (
    <div style={{ padding: '26px 10px', textAlign: 'center', fontSize: '0.84rem', color: 'var(--text-dim)' }}>
      {icon && <div style={{ marginBottom: '8px', opacity: 0.6 }}><Icon name={icon} size={22} /></div>}
      {label}
    </div>
  )
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
