'use client'
// Affiliate self-service dashboard — V24 glass treatment.
// - Not logged in → magic-link login form (email only)
// - User enters email → Supabase sends magic link → user clicks link
//   in email → lands back here with a session → dashboard loads.
// Session is Supabase Auth (not sessionStorage) so it persists across
// tabs and browser restarts until they sign out.

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

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

const SITE_URL = (typeof window !== 'undefined' ? window.location.origin : 'https://yallagrow.net')

export default function AffiliateDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])

  // Login form state
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [linkSent, setLinkSent] = useState<string | null>(null)   // email we sent to

  // Load affiliate data given an authed Supabase session
  const loadAffiliate = useCallback(async (accessToken: string) => {
    const r = await fetch('/api/affiliate/me-authed', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await r.json()
    if (!r.ok) throw new Error(data.error || 'Could not load dashboard')
    return data as { affiliate: Affiliate; referrals: Referral[] }
  }, [])

  // Try the existing Supabase session on mount, and listen for sign-in
  // from the magic link redirect.
  useEffect(() => {
    let cancelled = false

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) { if (!cancelled) setLoading(false); return }
      try {
        const payload = await loadAffiliate(token)
        if (!cancelled) {
          setAffiliate(payload.affiliate)
          setReferrals(payload.referrals)
        }
      } catch (err) {
        // Signed in to Supabase but email doesn't match an affiliate
        if (!cancelled) setError((err as Error).message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    checkSession()

    // When the user comes back from the email link, Supabase picks up
    // the hash tokens and fires SIGNED_IN. Re-load with the new token.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.access_token) {
        setError(null); setLoading(true)
        loadAffiliate(session.access_token)
          .then(payload => {
            setAffiliate(payload.affiliate)
            setReferrals(payload.referrals)
          })
          .catch(err => setError((err as Error).message))
          .finally(() => setLoading(false))
      }
      if (event === 'SIGNED_OUT') {
        setAffiliate(null); setReferrals([])
      }
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [loadAffiliate])

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null); setLinkSent(null)
    setSubmitting(true)
    try {
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${SITE_URL}/affiliate/dashboard`,
          // shouldCreateUser: true so first-time affiliate logins work
          // without pre-provisioning auth users. Non-affiliates who
          // sign in will hit the /me-authed 404 and see a clear error.
          shouldCreateUser: true,
        },
      })
      if (otpErr) throw otpErr
      setLinkSent(email.trim().toLowerCase())
    } catch (err) {
      setError((err as Error).message || 'Could not send the magic link. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setAffiliate(null)
    setReferrals([])
    setEmail(''); setLinkSent(null); setError(null)
  }

  const refresh = async () => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (!token) return
    try {
      const payload = await loadAffiliate(token)
      setReferrals(payload.referrals)
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
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--sky)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>Affiliate Portal</div>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.7rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.5px', marginBottom: '6px' }}>
              Sign in to your dashboard
            </h1>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)', margin: 0 }}>
              Enter your email. We&apos;ll send you a magic link — one click signs you in.
            </p>
          </div>

          {linkSent ? (
            // ────── POST-SEND STATE ──────
            <div style={{
              background: 'linear-gradient(180deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: '16px',
              padding: '26px',
              textAlign: 'center',
              backdropFilter: 'blur(14px) saturate(1.3)',
              WebkitBackdropFilter: 'blur(14px) saturate(1.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px', color: '#22c55e' }}>✓</div>
              <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.15rem', color: 'var(--white)', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
                Check your email
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 16px' }}>
                We sent a login link to <strong style={{ color: 'var(--white)' }}>{linkSent}</strong>.
                Click it from this device and you&apos;ll be signed in.
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: '0 0 14px' }}>
                Can&apos;t find it? Check spam/promotions. Link expires in 1 hour.
              </p>
              <button
                onClick={() => { setLinkSent(null); setEmail('') }}
                style={{
                  fontSize: '0.78rem', fontWeight: 600,
                  background: 'transparent', border: 'none', color: 'var(--sky)',
                  cursor: 'pointer', textDecoration: 'underline',
                }}
              >
                Try a different email →
              </button>
            </div>
          ) : (
            // ────── EMAIL FORM ──────
            <form onSubmit={sendMagicLink} style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '26px',
              backdropFilter: 'blur(14px) saturate(1.3)',
              WebkitBackdropFilter: 'blur(14px) saturate(1.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px rgba(16,161,219,0.08)',
            }}>
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

              {error && (
                <div style={{
                  marginTop: '14px',
                  padding: '10px 12px',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '8px',
                  color: '#ff8585',
                  fontSize: '0.78rem',
                }}>{error}</div>
              )}

              <button
                type="submit"
                disabled={submitting || !email.trim()}
                className="btn-primary"
                style={{ marginTop: '18px', width: '100%', justifyContent: 'center' }}
              >
                {submitting ? 'Sending link…' : 'Send Magic Link'}
              </button>

              <p style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '14px', margin: '14px 0 0' }}>
                Must be the email you applied with.
              </p>
            </form>
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
  const referralLink = `${SITE_URL}/?ref=${affiliate.ref_code}`

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
