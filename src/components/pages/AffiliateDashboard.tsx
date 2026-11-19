'use client'
// Affiliate dashboard — V35 shell with slim sidebar + topbar + content.
// If not logged in, redirects to /affiliate/signin (where the
// Login ↔ Sign Up toggle lives). This page never shows a login form.

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AppShellV35, { ShellNavItem } from '@/components/ui/AppShellV35'

interface Affiliate {
  id: string
  full_name: string
  email: string
  country?: string
  ref_code: string
  status: string
  promotion_plan?: string
}

interface Referral {
  id: string
  client_name: string
  client_email: string | null
  invoice_amount: number
  commission_rate: number
  commission_amount: number
  status: string
  created_at: string
}

const SESSION_KEY = 'yg_affiliate_session'
const SITE_URL = (typeof window !== 'undefined' ? window.location.origin : 'https://yallagrow.net')

type Section = 'overview' | 'referrals' | 'share' | 'payouts'

export default function AffiliateDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [section, setSection] = useState<Section>('overview')
  const [now, setNow] = useState<string>('')

  const fetchMe = useCallback(async (emailArg: string, codeArg: string) => {
    const r = await fetch('/api/affiliate/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailArg, ref_code: codeArg }),
    })
    const data = await r.json()
    if (!r.ok) throw new Error(data.error || 'Could not load dashboard')
    return data as { affiliate: Affiliate; referrals: Referral[] }
  }, [])

  useEffect(() => {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) { router.replace('/affiliate/signin'); return }
    try {
      const saved = JSON.parse(raw) as { email: string; ref_code: string }
      fetchMe(saved.email, saved.ref_code)
        .then(data => { setAffiliate(data.affiliate); setReferrals(data.referrals) })
        .catch(() => {
          sessionStorage.removeItem(SESSION_KEY)
          router.replace('/affiliate/signin')
        })
        .finally(() => setLoading(false))
    } catch {
      sessionStorage.removeItem(SESSION_KEY)
      router.replace('/affiliate/signin')
    }
  }, [fetchMe, router])

  // Live clock in topbar
  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }))
    tick()
    const i = setInterval(tick, 30_000)
    return () => clearInterval(i)
  }, [])

  const signOut = () => {
    sessionStorage.removeItem(SESSION_KEY)
    router.replace('/affiliate/signin')
  }

  const refresh = async () => {
    if (!affiliate) return
    try {
      const data = await fetchMe(affiliate.email, affiliate.ref_code)
      setReferrals(data.referrals)
    } catch { /* keep current */ }
  }

  if (loading || !affiliate) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
        Loading dashboard…
      </div>
    )
  }

  const totalPending = referrals.filter(r => r.status === 'pending').reduce((s, r) => s + Number(r.commission_amount || 0), 0)
  const totalPaid = referrals.filter(r => r.status === 'paid').reduce((s, r) => s + Number(r.commission_amount || 0), 0)
  const totalEarned = totalPending + totalPaid
  const referralLink = `${SITE_URL}/?ref=${affiliate.ref_code}`

  const nav: ShellNavItem[] = [
    { id: 'overview', icon: 'bar-chart', label: 'Overview' },
    { id: 'referrals', icon: 'handshake', label: 'Referrals', badge: referrals.filter(r => r.status === 'pending').length || undefined },
    { id: 'share', icon: 'link', label: 'Share link' },
    { id: 'payouts', icon: 'dollar', label: 'Payouts' },
  ]

  return (
    <AppShellV35
      nav={nav}
      activeId={section}
      onNavigate={(id) => setSection(id as Section)}
      breadcrumb={['YallaGrow', 'Affiliate', navLabel(section)]}
      dateLabel={now}
      userName={affiliate.full_name}
      userRole={statusLabel(affiliate.status)}
      userBadge="Affiliate"
      onSignOut={signOut}
      topRight={
        <button onClick={refresh} style={pillButton}>Refresh</button>
      }
    >
      {section === 'overview' && (
        <OverviewSection
          affiliate={affiliate}
          referrals={referrals}
          totalEarned={totalEarned}
          totalPending={totalPending}
          totalPaid={totalPaid}
          referralLink={referralLink}
        />
      )}
      {section === 'referrals' && (
        <ReferralsSection referrals={referrals} />
      )}
      {section === 'share' && (
        <ShareSection referralLink={referralLink} code={affiliate.ref_code} />
      )}
      {section === 'payouts' && (
        <PayoutsSection totalPending={totalPending} totalPaid={totalPaid} referrals={referrals} />
      )}
    </AppShellV35>
  )
}

/* ────────────── Sections ────────────── */

function OverviewSection({ affiliate, referrals, totalEarned, totalPending, totalPaid, referralLink }: {
  affiliate: Affiliate
  referrals: Referral[]
  totalEarned: number
  totalPending: number
  totalPaid: number
  referralLink: string
}) {
  return (
    <div>
      <SectionTitle eyebrow="Dashboard" title={`Welcome, ${affiliate.full_name.split(' ')[0]}`} subtitle={`${referrals.length} referral${referrals.length === 1 ? '' : 's'} logged against ${affiliate.ref_code}`} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <Kpi label="Total earned" value={`$${totalEarned.toFixed(2)}`} sub={`${referrals.length} referral${referrals.length === 1 ? '' : 's'}`} color="#10a1db" />
        <Kpi label="Pending payout" value={`$${totalPending.toFixed(2)}`} sub={`${referrals.filter(r => r.status === 'pending').length} pending`} color="#f59e0b" />
        <Kpi label="Already paid" value={`$${totalPaid.toFixed(2)}`} sub={`${referrals.filter(r => r.status === 'paid').length} paid`} color="#22c55e" />
        <CodeTile code={affiliate.ref_code} />
      </div>

      <ShareCard referralLink={referralLink} />

      <div style={{ marginTop: '28px' }}>
        <SectionTitle title="Recent referrals" subtitle="Last 5 logged against your code" small />
        <ReferralsTable referrals={referrals.slice(0, 5)} compact />
      </div>
    </div>
  )
}

function ReferralsSection({ referrals }: { referrals: Referral[] }) {
  return (
    <div>
      <SectionTitle eyebrow="Your work" title="All referrals" subtitle="Every referral logged against your code. Statuses updated by YallaGrow admin." />
      <ReferralsTable referrals={referrals} />
    </div>
  )
}

function ShareSection({ referralLink, code }: { referralLink: string; code: string }) {
  return (
    <div>
      <SectionTitle eyebrow="Your link" title="Share & earn" subtitle="Anyone who buys a package through this link earns you commission." />
      <ShareCard referralLink={referralLink} />

      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
        <InfoCard title="How it works">
          Send your link to business owners. When one signs up for a package, the referral automatically credits to code <strong style={{ color: 'var(--sky)' }}>{code}</strong> and appears in your Referrals tab.
        </InfoCard>
        <InfoCard title="Commission rates">
          <strong style={{ color: 'var(--white)' }}>20%</strong> on invoices under $500<br />
          <strong style={{ color: 'var(--white)' }}>30%</strong> on $500–$999<br />
          <strong style={{ color: 'var(--white)' }}>35%</strong> on $1,000+<br />
          <strong style={{ color: 'var(--white)' }}>40%</strong> special-tier for top performers
        </InfoCard>
        <InfoCard title="Payouts">
          Minimum payout: <strong style={{ color: 'var(--white)' }}>$50</strong>. We pay every month via your preferred method. WhatsApp us for questions: <a href="https://wa.me/96176302159" style={{ color: 'var(--sky)', textDecoration: 'none' }}>+961 76 302 159</a>.
        </InfoCard>
      </div>
    </div>
  )
}

function PayoutsSection({ totalPending, totalPaid, referrals }: { totalPending: number; totalPaid: number; referrals: Referral[] }) {
  const paidReferrals = referrals.filter(r => r.status === 'paid')
  return (
    <div>
      <SectionTitle eyebrow="Money" title="Payouts" subtitle="Everything that's been paid out, plus what's queued." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }} className="payout-grid">
        <Kpi label="Pending payout" value={`$${totalPending.toFixed(2)}`} sub="paid out on next cycle" color="#f59e0b" />
        <Kpi label="Lifetime paid" value={`$${totalPaid.toFixed(2)}`} sub={`${paidReferrals.length} referral${paidReferrals.length === 1 ? '' : 's'}`} color="#22c55e" />
      </div>

      <SectionTitle title="Paid referrals" subtitle="Everything we've settled so far" small />
      <ReferralsTable referrals={paidReferrals} />

      <style>{`
        @media (max-width: 720px) { .payout-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}

/* ────────────── Pieces ────────────── */

function SectionTitle({ eyebrow, title, subtitle, small }: { eyebrow?: string; title: string; subtitle?: string; small?: boolean }) {
  return (
    <div style={{ marginBottom: small ? '12px' : '22px' }}>
      {eyebrow && (
        <div style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--sky)', marginBottom: '6px' }}>{eyebrow}</div>
      )}
      <h1 style={{
        fontFamily: 'Syne,sans-serif',
        fontSize: small ? '1rem' : 'clamp(1.4rem, 3vw, 1.8rem)',
        fontWeight: 800,
        letterSpacing: '-0.5px',
        color: 'var(--white)',
        margin: 0,
        display: 'flex', alignItems: 'center', gap: '10px',
        lineHeight: 1.1,
      }}>
        {small && <span style={{ display: 'inline-block', width: '3px', height: '14px', background: 'var(--sky)', borderRadius: '2px', boxShadow: '0 0 8px rgba(16,161,219,0.5)' }} />}
        {title}
      </h1>
      {subtitle && <p style={{ fontSize: small ? '0.74rem' : '0.86rem', color: 'var(--text-dim)', margin: '6px 0 0', paddingLeft: small ? '13px' : 0 }}>{subtitle}</p>}
    </div>
  )
}

function Kpi({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{
      padding: '16px 18px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '13px',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      boxShadow: `0 10px 28px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px ${color}33`,
      transition: 'transform 0.2s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
    >
      <div style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-dim)', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-1px', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</div>
    </div>
  )
}

function CodeTile({ code }: { code: string }) {
  const len = code.length
  const fontSize = len > 10 ? '1.1rem' : len > 8 ? '1.25rem' : '1.4rem'
  return (
    <div style={{
      padding: '16px 18px',
      background: 'linear-gradient(135deg, rgba(141,92,255,0.14), rgba(16,161,219,0.08))',
      border: '1px solid rgba(141,92,255,0.3)',
      borderRadius: '13px',
      boxShadow: '0 10px 28px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(141,92,255,0.25)',
      minWidth: 0,
    }}>
      <div style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-dim)', marginBottom: '6px' }}>Your code</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize, fontWeight: 800, color: 'var(--white)', letterSpacing: '0.5px', lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{code}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>Share to earn</div>
    </div>
  )
}

function ShareCard({ referralLink }: { referralLink: string }) {
  return (
    <div style={{
      padding: '18px 20px',
      background: 'linear-gradient(135deg, rgba(16,161,219,0.14), rgba(141,92,255,0.06) 60%, rgba(16,161,219,0.04))',
      border: '1px solid rgba(16,161,219,0.28)',
      borderRadius: '14px',
      boxShadow: '0 10px 30px rgba(1,32,76,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
    }}>
      <div style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.8px', color: 'var(--sky)', marginBottom: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--sky)', boxShadow: '0 0 8px var(--sky)' }} />
        Your referral link
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <input
          readOnly
          value={referralLink}
          onClick={e => (e.target as HTMLInputElement).select()}
          style={{
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '11px 14px',
            color: 'var(--white)',
            flex: 1, minWidth: '240px',
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: '0.8rem',
            outline: 'none',
          }}
        />
        <button className="btn-primary" onClick={() => { navigator.clipboard.writeText(referralLink).catch(() => {}) }} style={{ fontSize: '0.8rem', padding: '10px 18px' }}>
          Copy link
        </button>
      </div>
    </div>
  )
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      padding: '16px 18px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '13px',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      boxShadow: '0 10px 28px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
    }}>
      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '0.92rem', fontWeight: 700, color: 'var(--white)', marginBottom: '10px' }}>{title}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{children}</div>
    </div>
  )
}

function ReferralsTable({ referrals, compact }: { referrals: Referral[]; compact?: boolean }) {
  if (referrals.length === 0) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
        border: '1px dashed rgba(255,255,255,0.12)',
        borderRadius: '14px',
        color: 'var(--text-dim)',
        fontSize: '0.86rem',
      }}>
        No referrals yet.
      </div>
    )
  }
  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      overflow: 'hidden',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      boxShadow: '0 10px 28px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Client', 'Invoice', 'Rate', 'Commission', 'Status', 'Date'].map(h => (
                <th key={h} style={{
                  padding: compact ? '10px 14px' : '14px 18px',
                  fontSize: '0.6rem', fontWeight: 700, letterSpacing: '1.8px',
                  textTransform: 'uppercase', color: 'var(--text-dim)',
                  textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.08)',
                  whiteSpace: 'nowrap', background: 'rgba(0,0,0,0.2)',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {referrals.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: i < referrals.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                <td style={{ padding: compact ? '10px 14px' : '14px 18px', fontSize: '0.84rem', color: 'var(--white)', fontWeight: 500 }}>{r.client_name}</td>
                <td style={{ padding: compact ? '10px 14px' : '14px 18px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>${Number(r.invoice_amount).toFixed(2)}</td>
                <td style={{ padding: compact ? '10px 14px' : '14px 18px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.commission_rate}%</td>
                <td style={{ padding: compact ? '10px 14px' : '14px 18px', fontSize: '0.86rem', fontWeight: 700, color: 'var(--sky)' }}>${Number(r.commission_amount).toFixed(2)}</td>
                <td style={{ padding: compact ? '10px 14px' : '14px 18px' }}>
                  <span style={{
                    fontSize: '0.6rem', fontWeight: 800,
                    color: statusColor(r.status), background: `${statusColor(r.status)}18`,
                    border: `1px solid ${statusColor(r.status)}44`,
                    padding: '4px 10px', borderRadius: '5px',
                    textTransform: 'uppercase', letterSpacing: '1.2px',
                  }}>{r.status}</span>
                </td>
                <td style={{ padding: compact ? '10px 14px' : '14px 18px', fontSize: '0.74rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                  {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const pillButton: React.CSSProperties = {
  fontSize: '0.72rem', padding: '7px 14px',
  color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
  cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 500,
}

function statusColor(s: string): string {
  switch (s) {
    case 'paid': return '#22c55e'
    case 'pending': return '#f59e0b'
    case 'approved': return '#10a1db'
    case 'active': return '#22c55e'
    case 'rejected': return '#ef4444'
    case 'cancelled': return '#ef4444'
    default: return '#9ca3af'
  }
}

function statusLabel(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function navLabel(id: Section): string {
  switch (id) {
    case 'overview': return 'Overview'
    case 'referrals': return 'Referrals'
    case 'share': return 'Share link'
    case 'payouts': return 'Payouts'
  }
}
