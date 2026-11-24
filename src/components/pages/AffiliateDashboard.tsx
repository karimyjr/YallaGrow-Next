'use client'
// Affiliate self-service dashboard — V24 glass treatment.
// Login flow: email → 4-digit OTP in the user's inbox (from
// info@yallagrow.net via Resend) → types code → logged in for 7 days.
// Session is an HTTP-only cookie (yg_aff_session) backed by the
// affiliate_sessions table, TTL 7 days.

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

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

// 30-second resend timer, matches the "Resend in 0:30" countdown in
// the paulcodes4 Glassy OTP V15 reference.
const RESEND_SECONDS = 30

export default function AffiliateDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])

  // Login form state
  const [step, setStep] = useState<LoginStep>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [verified, setVerified] = useState(false)   // brief green success state before dashboard loads
  const [resendIn, setResendIn] = useState(0)        // seconds left before user can resend

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

  // Resend countdown — ticks down to 0 once a code has been sent
  useEffect(() => {
    if (resendIn <= 0) return
    const id = setInterval(() => {
      setResendIn(s => (s <= 1 ? 0 : s - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [resendIn])

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
      setCode('')
      setResendIn(RESEND_SECONDS)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const verifyCode = async (codeToVerify: string) => {
    setError(null)
    setSubmitting(true)
    try {
      const r = await fetch('/api/affiliate/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: codeToVerify }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Code verification failed.')

      // Brief "Verified" success state before loading the dashboard
      setVerified(true)

      const payload = await loadFromSession()
      if (!payload) throw new Error('Session not established. Try again.')

      // Short delay to show the green success state
      await new Promise(resolve => setTimeout(resolve, 600))
      setAffiliate(payload.affiliate)
      setReferrals(payload.referrals)
    } catch (err) {
      setError((err as Error).message)
      setVerified(false)
      setCode('')
    } finally {
      setSubmitting(false)
    }
  }

  const signOut = async () => {
    await fetch('/api/affiliate/signout-session', { method: 'POST', credentials: 'include' })
    setAffiliate(null)
    setReferrals([])
    setEmail(''); setCode(''); setStep('email'); setError(null)
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
    return (
      <Shell>
        <div style={{ maxWidth: '440px', margin: '80px auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
          {step === 'email' && (
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--sky)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>Affiliate Portal</div>
              <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.7rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.5px', marginBottom: '6px' }}>
                Sign in to your dashboard
              </h1>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)', margin: 0 }}>
                Enter your email. We&apos;ll send you a 4-digit code from info@yallagrow.net.
              </p>
            </div>
          )}

          {step === 'email' ? (
            // ────── STEP 1: EMAIL ──────
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
          ) : (
            // ────── STEP 2: GLASSY OTP CARD ──────
            <GlassyOtpCard
              email={email}
              code={code}
              onChange={setCode}
              onVerify={verifyCode}
              onResend={() => sendCode()}
              onChangeEmail={() => { setStep('email'); setCode(''); setError(null); setVerified(false); setResendIn(0) }}
              submitting={submitting}
              verified={verified}
              error={error}
              resendIn={resendIn}
            />
          )}

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

/* ──────────────────────────────────────────────────────────────
   GlassyOtpCard — paulcodes4 "Glassy OTP V15" style card
   - Envelope icon header with red notification dot
   - "Check your inbox" title + masked email subtext
   - 4 separate digit boxes with auto-advance + backspace
   - Verify button with Verifying / Verified states
   - Countdown timer on Resend ("Resend in 0:28")
   ────────────────────────────────────────────────────────────── */

interface OtpCardProps {
  email: string
  code: string
  onChange: (next: string) => void
  onVerify: (code: string) => void | Promise<void>
  onResend: () => void
  onChangeEmail: () => void
  submitting: boolean
  verified: boolean
  error: string | null
  resendIn: number
}

function GlassyOtpCard({ email, code, onChange, onVerify, onResend, onChangeEmail, submitting, verified, error, resendIn }: OtpCardProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([null, null, null, null])
  const complete = code.length === 4

  // Autosubmit when 4 digits are entered
  useEffect(() => {
    if (complete && !submitting && !verified && !error) {
      onVerify(code)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  // Focus first box on mount
  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  const handleDigitChange = (idx: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1)
    if (!digit) return
    const chars = code.padEnd(4, ' ').split('')
    chars[idx] = digit
    const next = chars.join('').replace(/ /g, '').slice(0, 4)
    onChange(next)
    if (idx < 3) inputsRef.current[idx + 1]?.focus()
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (code[idx]) {
        // Remove the digit at this index
        const chars = code.split('')
        chars[idx] = ''
        onChange(chars.join(''))
      } else if (idx > 0) {
        // Move back and clear previous
        const chars = code.split('')
        chars[idx - 1] = ''
        onChange(chars.join(''))
        inputsRef.current[idx - 1]?.focus()
      }
      e.preventDefault()
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputsRef.current[idx - 1]?.focus()
      e.preventDefault()
    } else if (e.key === 'ArrowRight' && idx < 3) {
      inputsRef.current[idx + 1]?.focus()
      e.preventDefault()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (!pasted) return
    e.preventDefault()
    onChange(pasted)
    const nextFocus = Math.min(pasted.length, 3)
    inputsRef.current[nextFocus]?.focus()
  }

  const canResend = resendIn === 0 && !submitting && !verified

  return (
    <div style={{
      position: 'relative',
      background: 'linear-gradient(145deg, rgba(40,48,65,0.55), rgba(18,24,38,0.75))',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '24px',
      padding: '36px 28px 28px',
      backdropFilter: 'blur(22px) saturate(1.4)',
      WebkitBackdropFilter: 'blur(22px) saturate(1.4)',
      boxShadow:
        '0 40px 90px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(255,255,255,0.03)',
      overflow: 'hidden',
    }}>
      {/* Inner subtle gradient */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16,161,219,0.10), transparent 70%)',
      }} />

      {/* ───── Envelope icon ───── */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px', position: 'relative', zIndex: 1 }}>
        <div style={{
          position: 'relative',
          width: '56px', height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(60,70,90,0.9), rgba(30,38,54,0.95))',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2"/>
            <path d="m3 7 9 6 9-6"/>
          </svg>
          {/* red notification dot */}
          {!verified && (
            <div style={{
              position: 'absolute',
              top: '8px', right: '8px',
              width: '10px', height: '10px',
              borderRadius: '50%',
              background: '#ef4444',
              border: '2px solid rgba(30,38,54,0.95)',
              boxShadow: '0 0 10px rgba(239,68,68,0.6)',
            }} />
          )}
        </div>
      </div>

      {/* ───── Title + masked email ───── */}
      <div style={{ textAlign: 'center', marginBottom: '22px', position: 'relative', zIndex: 1 }}>
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem',
          color: '#fff', letterSpacing: '-0.5px', margin: '0 0 6px',
        }}>
          Check your inbox
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.5 }}>
          Enter the 4-digit code we sent to<br />
          <span style={{
            display: 'inline-block',
            marginTop: '6px',
            padding: '3px 10px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            fontSize: '0.74rem',
            color: 'rgba(255,255,255,0.8)',
            fontFamily: 'SF Mono, Menlo, Consolas, monospace',
          }}>{maskEmail(email)}</span>
        </p>
      </div>

      {/* ───── 4 digit boxes ───── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '22px', position: 'relative', zIndex: 1 }}>
        {[0, 1, 2, 3].map(i => {
          const filled = !!code[i]
          return (
            <input
              key={i}
              ref={el => { inputsRef.current[i] = el }}
              type="text"
              inputMode="numeric"
              pattern="\d{1}"
              maxLength={1}
              value={code[i] || ''}
              onChange={e => handleDigitChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              onFocus={e => e.target.select()}
              disabled={submitting || verified}
              style={{
                width: '58px',
                height: '70px',
                textAlign: 'center',
                fontFamily: 'Syne, sans-serif',
                fontSize: '1.9rem',
                fontWeight: 700,
                color: verified ? '#fff' : '#fff',
                background: verified
                  ? 'linear-gradient(180deg, rgba(34,197,94,0.25), rgba(34,197,94,0.1))'
                  : filled
                    ? 'linear-gradient(180deg, rgba(16,161,219,0.18), rgba(16,161,219,0.05))'
                    : 'linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
                border: verified
                  ? '1px solid rgba(34,197,94,0.6)'
                  : filled
                    ? '1px solid rgba(16,161,219,0.55)'
                    : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                outline: 'none',
                transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
                boxShadow: verified
                  ? '0 0 20px rgba(34,197,94,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                  : filled
                    ? '0 0 16px rgba(16,161,219,0.25), inset 0 1px 0 rgba(255,255,255,0.08)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.03)',
                caretColor: 'var(--sky)',
              }}
            />
          )
        })}
      </div>

      {error && <div style={{ position: 'relative', zIndex: 1, marginBottom: '14px' }}><FormError>{error}</FormError></div>}

      {/* ───── Verify button ───── */}
      <button
        type="button"
        onClick={() => complete && onVerify(code)}
        disabled={!complete || submitting || verified}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '14px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.9rem',
          fontWeight: 700,
          cursor: complete && !submitting && !verified ? 'pointer' : 'default',
          border: 'none',
          transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          ...(verified
            ? {
                background: 'linear-gradient(180deg, #22c55e, #16a34a)',
                color: '#fff',
                boxShadow: '0 10px 30px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
              }
            : submitting
              ? {
                  background: 'rgba(255,255,255,0.9)',
                  color: '#0b1220',
                  boxShadow: '0 6px 20px rgba(255,255,255,0.15)',
                }
              : complete
                ? {
                    background: 'linear-gradient(180deg, #0b1220, #040812)',
                    color: '#fff',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }
                : {
                    background: 'rgba(0,0,0,0.3)',
                    color: 'rgba(255,255,255,0.3)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }),
        }}
      >
        {verified ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Verified
          </>
        ) : submitting ? 'Verifying…' : 'Verify code'}
      </button>

      {/* ───── Resend footer ───── */}
      <div style={{
        textAlign: 'center',
        marginTop: '18px',
        fontSize: '0.74rem',
        color: 'rgba(255,255,255,0.5)',
        position: 'relative',
        zIndex: 1,
      }}>
        Didn&apos;t get a code?{' '}
        {canResend ? (
          <button
            type="button"
            onClick={() => { onResend() }}
            style={{
              background: 'transparent', border: 'none', color: 'var(--sky)',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.74rem',
              fontFamily: 'Inter, sans-serif', padding: 0,
            }}
          >
            Resend →
          </button>
        ) : (
          <span style={{ color: 'rgba(255,255,255,0.35)' }}>
            Resend in {formatMMSS(resendIn)}
          </span>
        )}
      </div>

      {/* Use different email link */}
      <div style={{ textAlign: 'center', marginTop: '8px', position: 'relative', zIndex: 1 }}>
        <button
          type="button"
          onClick={onChangeEmail}
          disabled={submitting || verified}
          style={{
            background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.7rem', fontWeight: 500,
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            padding: 0, textDecoration: 'none',
          }}
        >
          ← Use a different email
        </button>
      </div>
    </div>
  )
}

/** Mask an email as "ka●●●i@gmail.com" */
function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email
  if (local.length <= 2) return `${local[0]}●●●${local.slice(-1)}@${domain}`
  const first = local.slice(0, 2)
  const last = local.slice(-1)
  return `${first}●●●●${last}@${domain}`
}

/** Format seconds as M:SS */
function formatMMSS(s: number): string {
  const m = Math.floor(s / 60)
  const ss = String(s % 60).padStart(2, '0')
  return `${m}:${ss}`
}

const formCardStyle: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  padding: '26px',
  backdropFilter: 'blur(14px) saturate(1.3)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.3)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px rgba(16,161,219,0.08)',
}

const textLinkStyle: React.CSSProperties = {
  fontSize: '0.74rem',
  fontWeight: 600,
  background: 'transparent',
  border: 'none',
  color: 'var(--sky)',
  cursor: 'pointer',
  textDecoration: 'none',
  padding: 0,
  fontFamily: 'Inter, sans-serif',
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
