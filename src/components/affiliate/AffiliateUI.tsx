// Small shared UI primitives used across the affiliate dashboard pages
// (KPI tile, code tile, page header, section header). Inline styles to
// match the existing admin/overview look without pulling in Tailwind.

import { statusColor } from './AffiliateContext'

export function Kpi({ label, value, sub, color = '#10a1db' }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{
      padding: '16px 18px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '13px',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      boxShadow: `0 10px 28px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px ${color}33`,
    }}>
      <div style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-dim)', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-1px', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

/** Referral code display tile — same look as Kpi but purple-accent and code font. */
export function CodeTile({ code }: { code: string }) {
  const len = code.length
  const fontSize = len > 10 ? '1.1rem' : len > 8 ? '1.25rem' : '1.4rem'
  return (
    <div style={{
      padding: '16px 18px',
      background: 'linear-gradient(135deg, rgba(141,92,255,0.14), rgba(16,161,219,0.08))',
      border: '1px solid rgba(141,92,255,0.3)',
      borderRadius: '13px',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      boxShadow: '0 10px 28px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(141,92,255,0.25)',
      minWidth: 0,
    }}>
      <div style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-dim)', marginBottom: '6px' }}>Your code</div>
      <div style={{
        fontFamily: 'Syne, sans-serif', fontSize,
        fontWeight: 800, color: 'var(--white)', letterSpacing: '0.5px', lineHeight: 1,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{code}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>Share to earn</div>
    </div>
  )
}

/** Page-top title + subtitle header. */
export function PageHeader({ eyebrow, title, subtitle, right }: {
  eyebrow: string
  title: string
  subtitle?: string
  right?: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap', marginBottom: '26px' }}>
      <div>
        <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--sky)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>{eyebrow}</div>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.9rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.8px', margin: 0, lineHeight: 1.1 }}>
          {title}
        </h1>
        {subtitle && <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)', margin: '6px 0 0' }}>{subtitle}</p>}
      </div>
      {right && <div style={{ display: 'flex', gap: '8px' }}>{right}</div>}
    </div>
  )
}

/** Section title like the referrals table heading. */
export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.05rem', fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.3px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ display: 'inline-block', width: '3px', height: '16px', background: 'var(--sky)', borderRadius: '2px', boxShadow: '0 0 8px rgba(16,161,219,0.5)' }} />
        {title}
      </h2>
      {subtitle && <p style={{ fontSize: '0.76rem', color: 'var(--text-dim)', margin: '4px 0 0', paddingLeft: '13px' }}>{subtitle}</p>}
    </div>
  )
}

/** Pill button for header actions (Refresh, Export, etc.). */
export const pillButton: React.CSSProperties = {
  fontSize: '0.72rem',
  padding: '7px 14px',
  color: 'var(--text-muted)',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  transition: 'all 0.2s',
}

/** Status-colored pill shown in referral tables. */
export function StatusPill({ status }: { status: string }) {
  const color = statusColor(status)
  return (
    <span style={{
      fontSize: '0.6rem',
      fontWeight: 800,
      color,
      background: `${color}18`,
      border: `1px solid ${color}44`,
      padding: '4px 10px',
      borderRadius: '5px',
      textTransform: 'uppercase',
      letterSpacing: '1.2px',
    }}>{status}</span>
  )
}
