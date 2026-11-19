'use client'
// Login ↔ Sign Up toggle card with the paulcodes4-style slide
// animation. Two forms + one diagonal "welcome" panel share the
// same container; toggling swaps their translateX values in sync so
// one panel slides out as the other slides in, while the diagonal
// swoops across. No framer-motion — pure CSS transitions on
// transform/opacity/filter, driven by one boolean of state.
//
// Mobile falls back to a single stacked view with crossfade only.

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/country-codes'

const SESSION_KEY = 'yg_affiliate_session'

export default function AffiliateSignIn() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  // Login state
  const [email, setEmail] = useState('')
  const [refCode, setRefCode] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginSubmitting, setLoginSubmitting] = useState(false)

  // Signup state (mirrors the public /affiliate form fields)
  const [signup, setSignup] = useState({
    name: '',
    email: '',
    countryCode: DEFAULT_COUNTRY.code,
    phone: '',
    instagram: '',
    website: '',
    audience: '',
    plan: '',
  })
  const [signupError, setSignupError] = useState<string | null>(null)
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null)
  const [signupSubmitting, setSignupSubmitting] = useState(false)

  // If already signed in, bounce to the dashboard
  useEffect(() => {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (raw) router.replace('/affiliate/dashboard')
  }, [router])

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)
    setLoginSubmitting(true)
    try {
      const r = await fetch('/api/affiliate/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ref_code: refCode }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Could not sign in.')
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email, ref_code: refCode.toUpperCase() }))
      router.push('/affiliate/dashboard')
    } catch (err) {
      setLoginError((err as Error).message)
    } finally {
      setLoginSubmitting(false)
    }
  }

  const submitSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError(null); setSignupSuccess(null)
    if (!signup.name || !signup.email || !signup.phone) {
      setSignupError('Name, email and phone are required.')
      return
    }
    setSignupSubmitting(true)
    try {
      const country = COUNTRIES.find(c => c.code === signup.countryCode) || DEFAULT_COUNTRY
      const whatsapp = `${country.dial} ${signup.phone.replace(/\D/g, '')}`

      const r = await fetch('/api/affiliate/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signup.name,
          email: signup.email,
          whatsapp,
          instagram: signup.instagram,
          website: signup.website,
          audience: signup.audience,
          plan: signup.plan,
        }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Could not submit application.')

      setSignupSuccess(`Application received. We'll review within 48 hours and email you your referral code.`)
      setSignup({ name: '', email: '', countryCode: DEFAULT_COUNTRY.code, phone: '', instagram: '', website: '', audience: '', plan: '' })
    } catch (err) {
      setSignupError((err as Error).message)
    } finally {
      setSignupSubmitting(false)
    }
  }

  const isSignup = mode === 'signup'

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--dark2)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      {/* Ambient orbs */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(16,161,219,0.2), transparent 60%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-15%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(141,92,255,0.15), transparent 60%)', filter: 'blur(90px)' }} />
      </div>

      {/* Logo top-left */}
      <Link href="/" style={{
        position: 'absolute', top: '24px', left: '28px', zIndex: 10,
        fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.1rem',
        color: 'var(--white)', textDecoration: 'none', letterSpacing: '-0.5px',
      }}>
        Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
      </Link>

      {/* Main card */}
      <div className={`auth-card ${isSignup ? 'signup' : 'login'}`} style={{
        position: 'relative',
        width: '100%',
        maxWidth: '960px',
        height: '620px',
        background: 'linear-gradient(180deg, rgba(10,18,32,0.9), rgba(6,12,20,0.95))',
        border: '1px solid rgba(16,161,219,0.25)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px rgba(16,161,219,0.08)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}>
        {/* ───────── DIAGONAL WELCOME PANEL ───────── */}
        <div className="auth-welcome" aria-hidden="true" style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '55%',
          height: '100%',
          background: 'linear-gradient(135deg, var(--sky) 0%, #0b6ea0 65%, var(--purple) 130%)',
          clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0% 100%)',
          transition: 'transform 0.9s cubic-bezier(0.77, 0, 0.175, 1), clip-path 0.9s cubic-bezier(0.77, 0, 0.175, 1)',
          zIndex: 1,
          boxShadow: 'inset 2px 0 40px rgba(0,0,0,0.25)',
        }} />

        {/* Welcome copy */}
        <div className="auth-welcome-copy" style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '45%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px',
          zIndex: 2,
          color: '#fff',
          transition: 'transform 0.9s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.4s ease',
        }}>
          <div style={{ fontSize: '0.64rem', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', marginBottom: '10px' }}>
            {isSignup ? 'Join the program' : 'Welcome back'}
          </div>
          <h1 style={{
            fontFamily: 'Syne,sans-serif',
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 800,
            letterSpacing: '-0.8px',
            lineHeight: 1.05,
            margin: '0 0 14px',
            color: '#fff',
          }}>
            {isSignup ? 'Earn with every referral.' : 'Good to see you again.'}
          </h1>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', fontWeight: 300, margin: 0 }}>
            {isSignup
              ? 'Apply once. Get a unique code. Earn 20–40% commission on every client who signs up through your link.'
              : 'Track your referrals, see pending commissions, and grab your share link — all in one place.'}
          </p>
        </div>

        {/* ───────── LOGIN FORM ───────── */}
        <div className="auth-form login-pane" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '45%',
          height: '100%',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 3,
          transition: 'transform 0.9s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.4s ease, filter 0.4s ease',
        }}>
          <form onSubmit={submitLogin}>
            <div style={{ fontSize: '0.64rem', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '8px' }}>
              Sign in
            </div>
            <h2 style={{
              fontFamily: 'Syne,sans-serif',
              fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
              fontWeight: 800,
              letterSpacing: '-0.7px',
              color: 'var(--white)',
              margin: '0 0 24px',
              lineHeight: 1.1,
            }}>
              Affiliate portal
            </h2>

            <label style={labelStyle}>Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />

            <label style={{ ...labelStyle, marginTop: '14px' }}>Referral code</label>
            <input required value={refCode} onChange={e => setRefCode(e.target.value.toUpperCase())} placeholder="e.g. KARIMIXMK" style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: '1px' }} />

            {loginError && <FormError>{loginError}</FormError>}

            <button type="submit" disabled={loginSubmitting} className="btn-primary" style={{ marginTop: '18px', width: '100%', justifyContent: 'center' }}>
              {loginSubmitting ? 'Signing in…' : 'Sign In'}
            </button>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '18px' }}>
              Don&apos;t have an account?{' '}
              <button type="button" onClick={() => setMode('signup')} style={toggleLinkStyle}>Sign Up</button>
            </p>
          </form>
        </div>

        {/* ───────── SIGNUP FORM ───────── */}
        <div className="auth-form signup-pane" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '45%',
          height: '100%',
          padding: '32px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 3,
          overflowY: 'auto',
          transition: 'transform 0.9s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.4s ease, filter 0.4s ease',
        }}>
          <form onSubmit={submitSignup}>
            <div style={{ fontSize: '0.64rem', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '8px' }}>
              Apply
            </div>
            <h2 style={{
              fontFamily: 'Syne,sans-serif',
              fontSize: 'clamp(1.25rem, 2.2vw, 1.6rem)',
              fontWeight: 800,
              letterSpacing: '-0.6px',
              color: 'var(--white)',
              margin: '0 0 18px',
              lineHeight: 1.1,
            }}>
              Become an affiliate
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={labelStyle}>Full name *</label>
                <input required value={signup.name} onChange={e => setSignup(s => ({ ...s, name: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input required type="email" value={signup.email} onChange={e => setSignup(s => ({ ...s, email: e.target.value }))} style={inputStyle} />
              </div>
            </div>

            <label style={{ ...labelStyle, marginTop: '10px' }}>WhatsApp *</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <select value={signup.countryCode} onChange={e => setSignup(s => ({ ...s, countryCode: e.target.value }))} style={{ ...inputStyle, width: '110px', flexShrink: 0, cursor: 'pointer', paddingRight: '8px' }}>
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code} style={{ background: '#0b1220', color: '#fff' }}>{c.flag} {c.dial}</option>
                ))}
              </select>
              <input required type="tel" inputMode="numeric" value={signup.phone} onChange={e => setSignup(s => ({ ...s, phone: e.target.value.replace(/[^\d\s]/g, '') }))} placeholder="76 302 159" style={{ ...inputStyle, flex: 1 }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
              <div>
                <label style={labelStyle}>Instagram</label>
                <input value={signup.instagram} onChange={e => setSignup(s => ({ ...s, instagram: e.target.value }))} placeholder="@handle" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Audience size</label>
                <input value={signup.audience} onChange={e => setSignup(s => ({ ...s, audience: e.target.value }))} placeholder="e.g. 5k" style={inputStyle} />
              </div>
            </div>

            <label style={{ ...labelStyle, marginTop: '10px' }}>How will you promote YallaGrow?</label>
            <input value={signup.plan} onChange={e => setSignup(s => ({ ...s, plan: e.target.value }))} placeholder="DMs to friends, IG story, agency network…" style={inputStyle} />

            {signupError && <FormError>{signupError}</FormError>}
            {signupSuccess && (
              <div style={{
                marginTop: '12px', padding: '10px 12px',
                background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: '8px', color: '#86efac', fontSize: '0.78rem',
              }}>{signupSuccess}</div>
            )}

            <button type="submit" disabled={signupSubmitting} className="btn-primary" style={{ marginTop: '14px', width: '100%', justifyContent: 'center' }}>
              {signupSubmitting ? 'Submitting…' : 'Apply to join'}
            </button>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '14px' }}>
              Already have an account?{' '}
              <button type="button" onClick={() => setMode('login')} style={toggleLinkStyle}>Sign In</button>
            </p>
          </form>
        </div>

        {/* The CSS that drives the two-state animation */}
        <style>{`
          /* Login mode = default. Signup mode flips translateX on the three panes. */
          .auth-card .login-pane  { transform: translateX(0);     opacity: 1; filter: blur(0); }
          .auth-card .signup-pane { transform: translateX(122%);  opacity: 0; filter: blur(8px); pointer-events: none; }
          .auth-card .auth-welcome, .auth-card .auth-welcome-copy { transform: translateX(0); }

          .auth-card.signup .login-pane  { transform: translateX(122%); opacity: 0; filter: blur(8px); pointer-events: none; }
          .auth-card.signup .signup-pane { transform: translateX(122%); opacity: 1; filter: blur(0); }
          .auth-card.signup .auth-welcome,
          .auth-card.signup .auth-welcome-copy { transform: translateX(-100%); }

          /* Form input staggered slide for a bit of life */
          .auth-form input, .auth-form select, .auth-form button[type="submit"] {
            transition: transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease;
          }

          /* Hide scrollbars inside signup pane */
          .signup-pane::-webkit-scrollbar { display: none; }
          .signup-pane { scrollbar-width: none; }

          /* Mobile: stack everything, no horizontal slide */
          @media (max-width: 760px) {
            .auth-card {
              height: auto !important;
              min-height: 560px;
              max-width: 420px !important;
            }
            .auth-card .auth-welcome { display: none !important; }
            .auth-card .auth-welcome-copy {
              position: static !important;
              width: 100% !important;
              padding: 28px 28px 0 !important;
              transform: none !important;
              height: auto !important;
            }
            .auth-card .login-pane, .auth-card .signup-pane {
              position: static !important;
              width: 100% !important;
              padding: 20px 28px 28px !important;
              transform: none !important;
              filter: none !important;
              transition: opacity 0.3s ease !important;
            }
            .auth-card .login-pane  { opacity: 1; display: block; }
            .auth-card .signup-pane { display: none; }
            .auth-card.signup .login-pane  { display: none; opacity: 0; }
            .auth-card.signup .signup-pane { display: block; opacity: 1; pointer-events: auto; }
          }
        `}</style>
      </div>
    </div>
  )
}

/* ─────────── Pieces ─────────── */

function FormError({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      marginTop: '12px', padding: '10px 12px',
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
  fontSize: '0.64rem',
  fontWeight: 600,
  letterSpacing: '1px',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  marginBottom: '5px',
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(249,253,254,0.03)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '9px',
  padding: '10px 13px',
  color: 'var(--white)',
  width: '100%',
  fontFamily: 'Inter,sans-serif',
  fontSize: '0.84rem',
  outline: 'none',
}

const toggleLinkStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--sky)',
  cursor: 'pointer',
  fontWeight: 600,
  padding: 0,
  fontSize: '0.78rem',
  textDecoration: 'underline',
  fontFamily: 'Inter, sans-serif',
}
