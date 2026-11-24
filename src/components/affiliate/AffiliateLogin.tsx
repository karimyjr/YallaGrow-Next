'use client'
// Full-screen affiliate login. Extracted from the original monolithic
// AffiliateDashboard so the /affiliate/dashboard/layout.tsx can render it
// directly when the user has no session — without the sidebar chrome.
//
// Flow: email form (step 1) → GlassyOtpV15 (step 2) → on verified success
// calls onLoggedIn with the fetched session payload. The parent layout
// then re-renders with the sidebar + dashboard around the children.

import { useState } from 'react'
import Link from 'next/link'
import GlassyOtpV15 from '@/components/auth/GlassyOtpV15'
import type { Affiliate, Referral } from './AffiliateContext'

interface Props {
  /** Called after the OTP sequence finishes and /me-session returns a payload. */
  onLoggedIn: (payload: { affiliate: Affiliate; referrals: Referral[] }) => void
}

type Step = 'email' | 'code'

export default function AffiliateLogin({ onLoggedIn }: Props) {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Session payload preloaded during the V15 success animation; Continue
  // hands it to the parent. See verifyCode / continueToDashboard below.
  const [pendingPayload, setPendingPayload] = useState<{ affiliate: Affiliate; referrals: Referral[] } | null>(null)

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

      // Prefetch the session payload so Continue lands on the dashboard
      // with no extra wait after the V15 success animation.
      fetch('/api/affiliate/me-session', { credentials: 'include' })
        .then(res => res.ok ? res.json() : null)
        .then(payload => { if (payload) setPendingPayload(payload) })
        .catch(() => { /* retried on Continue click */ })

      return { ok: true }
    } catch (err) {
      return { ok: false, error: (err as Error).message }
    }
  }

  const continueToDashboard = async () => {
    if (pendingPayload) {
      onLoggedIn(pendingPayload)
      return
    }
    try {
      const r = await fetch('/api/affiliate/me-session', { credentials: 'include' })
      if (!r.ok) throw new Error('Session not established. Try again.')
      const payload = await r.json()
      onLoggedIn(payload)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--dark2)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient gradient orbs */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '55vw', height: '55vw', background: 'radial-gradient(circle, rgba(16,161,219,0.18), transparent 60%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-15%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(141,92,255,0.14), transparent 60%)', filter: 'blur(80px)' }} />
      </div>

      {/* Top bar */}
      <div style={{
        padding: '14px 4%',
        background: 'linear-gradient(180deg, rgba(6,12,20,0.75), rgba(6,12,20,0.55))',
        backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', color: 'var(--white)', textDecoration: 'none', letterSpacing: '-0.5px' }}>
          Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
        </Link>
        <span style={{
          fontSize: '0.6rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
          color: 'var(--sky)',
          background: 'linear-gradient(180deg, rgba(16,161,219,0.18), rgba(16,161,219,0.06))',
          border: '1px solid rgba(16,161,219,0.25)',
          padding: '4px 11px', borderRadius: '7px',
          boxShadow: '0 0 20px rgba(16,161,219,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}>Affiliate</span>
      </div>

      {step === 'code' ? (
        <>
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
        </>
      ) : (
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

          <form onSubmit={sendCode} style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '26px',
            backdropFilter: 'blur(14px) saturate(1.3)',
            WebkitBackdropFilter: 'blur(14px) saturate(1.3)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px rgba(16,161,219,0.08)',
          }}>
            <label style={{ display: 'block', fontSize: '0.66rem', fontWeight: 600, letterSpacing: '1px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Email address</label>
            <input
              type="email" required autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                background: 'rgba(249,253,254,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '11px 14px',
                color: 'var(--white)',
                width: '100%',
                fontFamily: 'Inter,sans-serif',
                fontSize: '0.86rem',
                outline: 'none',
              }}
            />

            {error && (
              <div style={{
                marginTop: '14px', padding: '10px 12px',
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
              {submitting ? 'Sending code…' : 'Send Code'}
            </button>

            <p style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textAlign: 'center', margin: '14px 0 0' }}>
              Must be the email you applied with.
            </p>
          </form>

          <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '18px' }}>
            Not an affiliate yet? <Link href="/affiliate" style={{ color: 'var(--sky)', textDecoration: 'none' }}>Apply to join →</Link>
          </p>
        </div>
      )}
    </div>
  )
}
