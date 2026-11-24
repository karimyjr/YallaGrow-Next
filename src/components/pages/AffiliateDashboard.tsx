'use client'
// Affiliate self-service dashboard — V24 glass treatment.
// Login flow: email → 4-digit OTP in the user's inbox (from
// info@yallagrow.net via Resend) → types code → logged in for 7 days.
// Session is an HTTP-only cookie (yg_aff_session) backed by the
// affiliate_sessions table, TTL 7 days.

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import GlassyOtpV15 from '@/components/auth/GlassyOtpV15'

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

type LoginStep = 'email' | 'code'

export default function AffiliateDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])

  // Login form state
  const [step, setStep] = useState<LoginStep>('email')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  // Preloaded payload from /me-session, fetched in the background while
  // the Glassy V15 success animation plays. Lets the user click Continue
  // and land on the dashboard with no extra wait.
  const [pendingPayload, setPendingPayload] = useState<{ affiliate: Affiliate; referrals: Referral[] } | null>(null)

  const loadFromSession = useCallback(async () => {
    const r = await fetch('/api/affiliate/me-session', { credentials: 'include' })
    if (!r.ok) {
      if (r.status === 401) return null
      const data = await r.json().catch(() => ({ error: 'Server error' }))
      throw new Error(data.error || 'Could not load dashboard')
    }
    return await r.json() as { affiliate: Affiliate; referrals: Referral[] }
  }, [])

  // On mount: try to restore from cookie
  useEffect(() => {
    let cancelled = false
    loadFromSession()
      .then(payload => {
        if (cancelled) return
        if (payload) {
          setAffiliate(payload.affiliate)
          setReferrals(payload.referrals)
        }
      })
      .catch(err => { if (!cancelled) setError((err as Error).message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [loadFromSession])

  const sendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const r = await fetch('/api/affiliate/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Could not send the code.')
      setStep('code')
      setPendingPayload(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  // GlassyOtpV15 contract: returns { ok, error? }. On ok, we kick off the
  // /me-session fetch in the background while the animation plays
  // (boxes → X lines → merge → success card). User hits Continue when it's done.
  const verifyCode = async (codeToVerify: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const r = await fetch('/api/affiliate/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: codeToVerify }),
      })
      const data = await r.json()
      if (!r.ok) return { ok: false, error: data.error || 'Code verification failed.' }

      // Fire off the session load so it's ready by the time the user clicks Continue.
      loadFromSession()
        .then(payload => {
          if (payload) setPendingPayload(payload)
        })
        .catch(() => { /* retried on Continue click */ })

      return { ok: true }
    } catch (err) {
      return { ok: false, error: (err as Error).message }
    }
  }

  const continueToDashboard = async () => {
    if (pendingPayload) {
      setAffiliate(pendingPayload.affiliate)
      setReferrals(pendingPayload.referrals)
      return
    }
    // Fallback: /me-session hadn't resolved yet or failed — try once more.
    try {
      const payload = await loadFromSession()
      if (!payload) throw new Error('Session not established. Try again.')
      setAffiliate(payload.affiliate)
      setReferrals(payload.referrals)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const signOut = async () => {
    await fetch('/api/affiliate/signout-session', { method: 'POST', credentials: 'include' })
    setAffiliate(null)
    setReferrals([])
    setEmail(''); setStep('email'); setError(null); setPendingPayload(null)
  }

  const refresh = async () => {
    try {
      const payload = await loadFromSession()
      if (payload) setReferrals(payload.referrals)
    } catch { /* keep current data */ }
  }

  if (loading) {
    return (
      <Shell>
        <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>Loading dashboard…</div>
      </Shell>
    )
  }

  // ─────────── LOGIN FORM ───────────
  if (!affiliate) {
    if (step === 'code') {
      // V15 handles its own card + spacing; drop the 440px wrapper here
      // so the card isn't squeezed and the floating-box animation has room.
      return (
        <Shell>
          <GlassyOtpV15
            email={email}
            onVerifyCode={verifyCode}
            onResend={async () => { await sendCode() }}
            onContinue={continueToDashboard}
            onChangeEmail={() => { setStep('email'); setError(null); setPendingPayload(null) }}
            canContinue={pendingPayload !== null}
          />
          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-dim)', margin: '0 0 48px', position: 'relative', zIndex: 1 }}>
            Not an affiliate yet? <Link href="/affiliate" style={{ color: 'var(--sky)', textDecoration: 'none' }}>Apply to join →</Link>
          </p>
        </Shell>
      )
    }

    return (
      <Shell>
        <div style={{ maxWidth: '440px', margin: '80px auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--sky)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>Affiliate Portal</div>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.7rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.5px', marginBottom: '6px' }}>
              Sign in to your dashboard
            </h1>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)', margin: 0 }}>
              Enter your email. We&apos;ll send you a 4-digit code from info@yallagrow.net.
            </p>
          </div>

          <form onSubmit={sendCode} style={formCardStyle}>
            <label style={labelStyle}>Email address</label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={inputStyle}
            />

            {error && <FormError>{error}</FormError>}

            <button
              type="submit"
              disabled={submitting || !email.trim()}
              className="btn-primary"
              style={{ marginTop: '18px', width: '100%', justifyContent: 'center' }}
            >
              {submitting ? 'Sending code…' : 'Send Code'}
            </button>

            <p style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '14px', margin: '14px 0 0' }}>
              Must be the email you applied with.
            </p>
          </form>

          <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '18px' }}>
            Not an affiliate yet? <Link href="/affiliate" style={{ color: 'var(--sky)', textDecoration: 'none' }}>Apply to join →</Link>
          </p>
        </div>
      </Shell>
    )
  }

  // ─────────── DASHBOARD ───────────
  const totalPending = referrals.filter(r => r.status === 'pending').reduce((s, r) => s + Number(r.commission_amount || 0), 0)
  const totalPaid = referrals.filter(r => r.status === 'paid').reduce((s, r) => s + Number(r.commission_amount || 0), 0)
  const totalEarned = totalPending + totalPaid
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yallagrow.net'
  const referralLink = `${siteUrl}/?ref=${affiliate.ref_code}`

  return (
    <Shell>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px 60px', position: 'relative', zIndex: 1 }}>
        {/* ───────── HEADER ───────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap', marginBottom: '26px' }}>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--sky)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>Dashboard</div>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.9rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.8px', margin: 0, lineHeight: 1.1 }}>
              Welcome, {affiliate.full_name.split(' ')[0]}
            </h1>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)', margin: '6px 0 0' }}>
              {referrals.length} referral{referrals.length === 1 ? '' : 's'} logged · Status: <span style={{ color: statusColor(affiliate.status), fontWeight: 600 }}>{affiliate.status}</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={refresh} style={pillButton}>Refresh</button>
            <button onClick={signOut} style={pillButton}>Sign out</button>
          </div>
        </div>

        {/* ───────── KPI TILES ───────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          <Kpi label="Total earned" value={`$${totalEarned.toFixed(2)}`} sub={`${referrals.length} referral${referrals.length === 1 ? '' : 's'}`} color="#10a1db" />
          <Kpi label="Pending payout" value={`$${totalPending.toFixed(2)}`} sub={`${referrals.filter(r => r.status === 'pending').length} pending`} color="#f59e0b" />
          <Kpi label="Already paid" value={`$${totalPaid.toFixed(2)}`} sub={`${referrals.filter(r => r.status === 'paid').length} paid`} color="#22c55e" />
          <CodeTile code={affiliate.ref_code} />
        </div>

        {/* ───────── REFERRAL LINK ───────── */}
        <div style={{
          padding: '18px 20px',
          background: 'linear-gradient(135deg, rgba(16,161,219,0.14), rgba(141,92,255,0.06) 60%, rgba(16,161,219,0.04))',
          border: '1px solid rgba(16,161,219,0.28)',
          borderRadius: '14px',
          marginBottom: '28px',
          boxShadow: '0 10px 30px rgba(1,32,76,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
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
                ...inputStyle,
                flex: 1,
                minWidth: '240px',
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontSize: '0.8rem',
                background: 'rgba(0,0,0,0.3)',
              }}
            />
            <button
              type="button"
              className="btn-primary"
              onClick={() => { navigator.clipboard.writeText(referralLink).catch(() => {}) }}
              style={{ fontSize: '0.8rem', padding: '10px 18px' }}
            >
              Copy link
            </button>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '10px 0 0' }}>
            Share this link with businesses. When they buy a package, the referral is credited to your code and appears below.
          </p>
        </div>

        {/* ───────── REFERRALS SECTION HEADER ───────── */}
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.05rem', fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.3px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ display: 'inline-block', width: '3px', height: '16px', background: 'var(--sky)', borderRadius: '2px', boxShadow: '0 0 8px rgba(16,161,219,0.5)' }} />
            Your referrals
          </h2>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-dim)', margin: '4px 0 0', paddingLeft: '13px' }}>
            Every referral logged against your code. Statuses updated by YallaGrow admin.
          </p>
        </div>

        {/* ───────── REFERRALS TABLE ───────── */}
        {referrals.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
            border: '1px dashed rgba(255,255,255,0.12)',
            borderRadius: '14px',
            color: 'var(--text-dim)',
            fontSize: '0.86rem',
          }}>
            No referrals yet. Share your link to start earning.
          </div>
        ) : (
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
                        padding: '14px 18px',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        letterSpacing: '1.8px',
                        textTransform: 'uppercase',
                        color: 'var(--text-dim)',
                        textAlign: 'left',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                        whiteSpace: 'nowrap',
                        background: 'rgba(0,0,0,0.2)',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r, i) => (
                    <tr key={r.id} style={{ borderBottom: i < referrals.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                      <td style={{ padding: '14px 18px', fontSize: '0.84rem', color: 'var(--white)', fontWeight: 500 }}>{r.client_name}</td>
                      <td style={{ padding: '14px 18px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>${Number(r.invoice_amount).toFixed(2)}</td>
                      <td style={{ padding: '14px 18px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.commission_rate}%</td>
                      <td style={{ padding: '14px 18px', fontSize: '0.86rem', fontWeight: 700, color: 'var(--sky)' }}>${Number(r.commission_amount).toFixed(2)}</td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          fontSize: '0.6rem',
                          fontWeight: 800,
                          color: statusColor(r.status),
                          background: `${statusColor(r.status)}18`,
                          border: `1px solid ${statusColor(r.status)}44`,
                          padding: '4px 10px',
                          borderRadius: '5px',
                          textTransform: 'uppercase',
                          letterSpacing: '1.2px',
                        }}>{r.status}</span>
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: '0.74rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                        {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p style={{ marginTop: '22px', fontSize: '0.74rem', color: 'var(--text-dim)' }}>
          Payout questions? Message us on WhatsApp at <a href="https://wa.me/96176302159" style={{ color: 'var(--sky)', textDecoration: 'none' }}>+961 76 302 159</a>.
        </p>
      </div>
    </Shell>
  )
}

/* ──────────────────────────────── Pieces ──────────────────────────────── */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--dark2)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient gradient orbs — matching admin V24 */}
      <div aria-hidden="true" style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '55vw',
          height: '55vw',
          background: 'radial-gradient(circle, rgba(16,161,219,0.18), transparent 60%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-15%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(141,92,255,0.14), transparent 60%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          width: '40vw',
          height: '40vw',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(16,161,219,0.08), transparent 70%)',
          filter: 'blur(100px)',
        }} />
      </div>

      {/* Glass top bar */}
      <div style={{
        padding: '14px 4%',
        background: 'linear-gradient(180deg, rgba(6,12,20,0.75), rgba(6,12,20,0.55))',
        backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 10px 40px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Link href="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', color: 'var(--white)', textDecoration: 'none', letterSpacing: '-0.5px' }}>
          Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
        </Link>
        <span style={{
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--sky)',
          background: 'linear-gradient(180deg, rgba(16,161,219,0.18), rgba(16,161,219,0.06))',
          border: '1px solid rgba(16,161,219,0.25)',
          padding: '4px 11px',
          borderRadius: '7px',
          boxShadow: '0 0 20px rgba(16,161,219,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}>Affiliate</span>
      </div>

      {children}
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
    }}>
      <div style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-dim)', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-1px', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</div>
    </div>
  )
}

// Separate tile for the ref code — adaptive font-size so long codes
// don't overflow (which was happening on the old "KARIMIXMK" tile).
function CodeTile({ code }: { code: string }) {
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
        fontFamily: 'Syne, sans-serif',
        fontSize,
        fontWeight: 800,
        color: 'var(--white)',
        letterSpacing: '0.5px',
        lineHeight: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>{code}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>Share to earn</div>
    </div>
  )
}

/* OTP step is now handled by GlassyOtpV15 (src/components/auth/GlassyOtpV15.tsx) —
   direct port of paulcodes4 Glassy OTP V15 with floating-box animation,
   X-line morph, merge tile, and success card. */


const formCardStyle: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  padding: '26px',
  backdropFilter: 'blur(14px) saturate(1.3)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.3)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px rgba(16,161,219,0.08)',
}

function FormError({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      marginTop: '14px',
      padding: '10px 12px',
      background: 'rgba(239,68,68,0.08)',
      border: '1px solid rgba(239,68,68,0.3)',
      borderRadius: '8px',
      color: '#ff8585',
      fontSize: '0.78rem',
    }}>{children}</div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.66rem',
  fontWeight: 600,
  letterSpacing: '1px',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(249,253,254,0.03)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '11px 14px',
  color: 'var(--white)',
  width: '100%',
  fontFamily: 'Inter,sans-serif',
  fontSize: '0.86rem',
  outline: 'none',
}

const pillButton: React.CSSProperties = {
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
