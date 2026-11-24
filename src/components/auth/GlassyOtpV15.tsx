'use client'
// Glassy OTP V15 — direct port of the paulcodes4 reference HTML
// (Karim supplied the full CSS/JS, see supabase/_reference/).
// Keeps all the animations: floating boxes → X lines → merge tile →
// success view. Only change: the warm living-room background is
// replaced with a dark YallaGrow gradient so it matches the brand.

import { useEffect, useRef, useState } from 'react'

type Phase = 'idle' | 'verifying' | 'verified' | 'error' | 'success'
type Layout = 'row' | 'scatter' | 'square' | 'converge'

interface BoxPos { x: number; y: number; s: number }

const ROW_LAYOUT = (stageWidth: number): BoxPos[] => {
  const gap = 14
  const size = Math.min(64, Math.floor((stageWidth - gap * 3) / 4))
  return [0, 1, 2, 3].map(i => ({ x: (i - 1.5) * (size + gap), y: 0, s: size }))
}
const SCATTER: BoxPos[] = [
  { x: -54, y: -40, s: 48 }, { x: -48, y: 40, s: 48 },
  { x: 40,  y: -36, s: 48 }, { x: 56,  y: 34, s: 48 },
]
const SQUARE: BoxPos[] = [
  { x: -48, y: -48, s: 44 }, { x: -48, y: 48, s: 44 },
  { x: 48,  y: -48, s: 44 }, { x: 48,  y: 48, s: 44 },
]
const CONVERGE: BoxPos[] = [
  { x: -17, y: -17, s: 28 }, { x: -17, y: 17, s: 28 },
  { x: 17,  y: -17, s: 28 }, { x: 17,  y: 17, s: 28 },
]

const RESEND_SECONDS = 25
const MAIL_ICON_SVG = `<svg class="i" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email
  if (local.length <= 2) return `${local[0]}●●●${local.slice(-1)}@${domain}`
  return `${local.slice(0, 2)}●●●●${local.slice(-1)}@${domain}`
}

interface Props {
  email: string
  onVerifyCode: (code: string) => Promise<{ ok: boolean; error?: string }>
  onResend: () => Promise<void>
  onContinue: () => void
  onChangeEmail: () => void
  canContinue: boolean
}

export default function GlassyOtpV15({ email, onVerifyCode, onResend, onContinue, onChangeEmail, canContinue }: Props) {
  const [code, setCode] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [layout, setLayout] = useState<Layout>('row')
  const [remaining, setRemaining] = useState(RESEND_SECONDS)
  const [stageWidth, setStageWidth] = useState(260)
  const [verifiedAt, setVerifiedAt] = useState<Date | null>(null)
  const [popIndex, setPopIndex] = useState(-1)
  const [linksDraw, setLinksDraw] = useState({ l1: false, l2: false, retract: false })
  const [mergeShow, setMergeShow] = useState(false)
  const [viewOtpLeaving, setViewOtpLeaving] = useState(false)
  const [viewSuccessShow, setViewSuccessShow] = useState(false)
  const [shaking, setShaking] = useState(false)

  const stageRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const runIdRef = useRef(0)
  const busyRef = useRef(false)

  const sleep = (ms: number, id: number) =>
    new Promise<void>((resolve, reject) => setTimeout(() => (id === runIdRef.current ? resolve() : reject(new Error('cancelled'))), ms))

  // Measure stage width for row layout
  useEffect(() => {
    if (!stageRef.current) return
    const resize = () => stageRef.current && setStageWidth(stageRef.current.clientWidth)
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Resend countdown
  useEffect(() => {
    if (remaining <= 0) return
    const t = setInterval(() => setRemaining(s => (s <= 1 ? 0 : s - 1)), 1000)
    return () => clearInterval(t)
  }, [remaining])

  const submit = async () => {
    if (phase !== 'idle' || code.length !== 4 || busyRef.current) return
    busyRef.current = true
    const id = ++runIdRef.current

    try {
      await sleep(260, id)

      setPhase('verifying')
      setLayout('scatter')
      // Kick off the verify API in parallel with the animation
      const verifyPromise = onVerifyCode(code)
      // Hold the scatter/float for ~1500ms to give the API room
      await sleep(1500, id)
      const result = await verifyPromise

      if (!result.ok) {
        // Error path
        setPhase('error')
        setLayout('row')
        await sleep(100, id)
        setShaking(true)
        await sleep(1200, id)
        setShaking(false)
        setCode('')
        setPhase('idle')
        busyRef.current = false
        inputRef.current?.focus({ preventScroll: true })
        return
      }

      // Success path
      setPhase('verified')
      setVerifiedAt(new Date())
      setLayout('square')
      await sleep(320, id)
      setLinksDraw(s => ({ ...s, l1: true }))
      await sleep(240, id)
      setLinksDraw(s => ({ ...s, l2: true }))
      await sleep(620, id)

      setLinksDraw(s => ({ ...s, retract: true }))
      setLayout('converge')
      await sleep(380, id)
      setMergeShow(true)
      await sleep(1300, id)

      setViewOtpLeaving(true)
      await sleep(260, id)
      setPhase('success')
      setViewSuccessShow(true)
      await sleep(700, id)
      busyRef.current = false
    } catch {
      // Cancelled by run-id change
    }
  }

  // Auto-submit when code hits 4
  useEffect(() => {
    if (code.length === 4 && phase === 'idle' && !busyRef.current) {
      void submit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  // Compute box positions based on layout
  const positions: BoxPos[] =
    layout === 'row'      ? ROW_LAYOUT(stageWidth) :
    layout === 'scatter'  ? SCATTER :
    layout === 'square'   ? SQUARE :
    /* converge */          CONVERGE

  const trustedLabel = verifiedAt
    ? `Verified at ${verifiedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} · for 7 days`
    : 'This browser'

  return (
    <div className="v15-outer">
      <main className="card" data-phase={phase}>
        <div className="views">
          {/* ───── OTP VIEW ───── */}
          <section className={`view view-otp ${viewOtpLeaving ? 'leaving' : ''}`} aria-labelledby="otpTitle">
            <div className="icon-wrap" aria-hidden="true">
              <div className="icon" dangerouslySetInnerHTML={{ __html: MAIL_ICON_SVG }} />
              <span className="dot" />
              <svg className="orbit" viewBox="0 0 68 68"><circle cx="34" cy="34" r="32" /></svg>
            </div>
            <h1 id="otpTitle">Check your inbox</h1>
            <p className="sub">
              Enter the 4-digit code we sent<br />to
              <span className="email-chip">{maskEmail(email)}</span>
            </p>

            <div ref={stageRef} className={`stage ${layout === 'scatter' ? 'floating' : ''} ${layout === 'converge' ? 'converge' : ''} ${shaking ? 'shake' : ''}`}>
              <input
                ref={inputRef}
                className="otp-input"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={4}
                pattern="[0-9]*"
                aria-label="4-digit verification code"
                value={code}
                disabled={phase !== 'idle'}
                onChange={e => {
                  if (phase !== 'idle' || busyRef.current) { e.preventDefault(); return }
                  const next = e.target.value.replace(/\D/g, '').slice(0, 4)
                  const newPop = next.length > code.length ? next.length - 1 : -1
                  setCode(next)
                  setPopIndex(newPop)
                  if (newPop >= 0) setTimeout(() => setPopIndex(-1), 320)
                }}
                onKeyDown={e => { if (e.key === 'Enter') submit() }}
              />
              {[0, 1, 2, 3].map(i => {
                const p = positions[i]
                const filled = !!code[i]
                const active = phase === 'idle' && i === code.length && code.length < 4
                return (
                  <div
                    key={i}
                    className={`box ${filled ? 'filled' : ''} ${active ? 'active' : ''} ${popIndex === i ? 'pop' : ''}`}
                    aria-hidden="true"
                    style={{
                      '--x': `${p.x}px`,
                      '--y': `${p.y}px`,
                      '--s': `${p.s}px`,
                      opacity: mergeShow ? 0 : 1,
                    } as React.CSSProperties}
                  >
                    <div className="face">{code[i] || ''}</div>
                  </div>
                )
              })}

              {/* X lines SVG */}
              <svg className={`links ${linksDraw.retract ? 'retract' : ''}`} viewBox="-80 -80 160 160" aria-hidden="true">
                <g>
                  <line pathLength={1} x1="-25" y1="-25" x2="25" y2="25" className={linksDraw.l1 ? 'draw' : ''} />
                  <line pathLength={1} x1="25" y1="-25" x2="-25" y2="25" className={linksDraw.l2 ? 'draw' : ''} />
                </g>
                <circle className="spark" r={3} cx={0} cy={0} />
              </svg>

              {/* Merge tile */}
              <div className={`merge ${mergeShow ? 'show' : ''}`} aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
            </div>

            <button
              className={`btn verify ${code.length === 4 && phase === 'idle' ? 'ready' : ''}`}
              type="button"
              disabled={phase !== 'idle' || code.length !== 4}
              onClick={submit}
            >
              {phase === 'verifying' ? <><span className="spinner" aria-hidden="true" />Verifying...</> :
               phase === 'verified'  ? <><svg className="i" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>Verified</> :
               phase === 'error'     ? 'Incorrect code' :
                                       'Verify code'}
            </button>

            <p className="resend">
              Didn&rsquo;t get a code?{' '}
              {remaining > 0 ? (
                <strong>
                  <svg className="ring" viewBox="0 0 14 14" aria-hidden="true">
                    <circle className="track" cx={7} cy={7} r={5.2} />
                    <circle className="prog"  cx={7} cy={7} r={5.2}
                      style={{ strokeDashoffset: 32.67 * (1 - remaining / RESEND_SECONDS) }}
                    />
                  </svg>
                  Resend in 0:{String(remaining).padStart(2, '0')}
                </strong>
              ) : (
                <button type="button" className="resend-btn" onClick={() => { void onResend(); setRemaining(RESEND_SECONDS) }}>
                  Resend code
                </button>
              )}
            </p>

            <button type="button" className="change-email" onClick={onChangeEmail}>
              Use a different email
            </button>
          </section>

          {/* ───── SUCCESS VIEW ───── */}
          <section className={`view view-success ${viewSuccessShow ? 'show' : ''}`} aria-labelledby="okTitle">
            <div className="badge-wrap" aria-hidden="true">
              <div className="badge">
                <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
            </div>
            <h2 id="okTitle" className="reveal" style={{ transitionDelay: '.12s' }}>You&rsquo;re verified</h2>
            <p className="sub reveal" style={{ transitionDelay: '.2s' }}>
              Your email is confirmed and this<br />browser is now trusted. Welcome back.
            </p>
            <ul className="rows" role="list">
              <li className="row reveal" style={{ transitionDelay: '.3s' }}>
                <span className="row-icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: MAIL_ICON_SVG }} />
                <span className="row-text">
                  <span className="row-title">Email confirmed</span>
                  <span className="row-sub">{maskEmail(email)}</span>
                </span>
                <span className="tick" style={{ transitionDelay: '.65s' }} aria-hidden="true">
                  <svg className="i" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
              </li>
              <li className="row reveal" style={{ transitionDelay: '.4s' }}>
                <span className="row-icon" aria-hidden="true">
                  <svg className="i" viewBox="0 0 24 24">
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </span>
                <span className="row-text">
                  <span className="row-title">Device trusted</span>
                  <span className="row-sub">{trustedLabel}</span>
                </span>
                <span className="tick" style={{ transitionDelay: '.8s' }} aria-hidden="true">
                  <svg className="i" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
              </li>
            </ul>
            <button
              className="btn continue reveal"
              type="button"
              style={{ transitionDelay: '.5s' }}
              onClick={onContinue}
              disabled={!canContinue}
            >
              {canContinue ? <>Continue <svg className="i" viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></> : 'Loading your dashboard…'}
            </button>
          </section>
        </div>
      </main>

      {/* All styles inlined — direct port with brand-swapped background */}
      <style>{`
        .v15-outer {
          /* No background of its own — the parent Shell paints the dark
             navy + sky/purple ambient orbs. We just center the card. */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 60px 16px 48px;
          color: #fff;
          font-family: 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          position: relative;
          z-index: 1;
        }
        .v15-outer button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
        .v15-outer svg.i { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex: none; }

        .card {
          position: relative;
          width: min(372px, 100%);
          border-radius: 30px;
          padding: 30px 32px 24px;
          /* YallaGrow glass: dark navy tinted with sky + purple */
          background: linear-gradient(180deg,
            rgba(10, 15, 26, 0.88) 0%,
            rgba(16, 24, 44, 0.74) 45%,
            rgba(44, 36, 84, 0.52) 100%);
          backdrop-filter: blur(22px) saturate(140%);
          -webkit-backdrop-filter: blur(22px) saturate(140%);
          border: 1px solid rgba(16, 161, 219, 0.18);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.10),
            inset 0 -1px 0 rgba(0, 0, 0, 0.35),
            0 30px 70px -20px rgba(0, 0, 0, 0.65),
            0 0 0 1px rgba(16, 161, 219, 0.08);
          overflow: hidden;
        }
        .views { display: grid; }
        .view { grid-area: 1 / 1; display: flex; flex-direction: column; align-items: center; text-align: center; }
        .view-otp { transition: filter 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1); }
        .view-otp.leaving { filter: blur(16px); opacity: 0; transform: scale(0.97); pointer-events: none; }

        .icon-wrap { position: relative; width: 58px; height: 58px; margin-bottom: 18px; }
        .icon {
          width: 100%; height: 100%; border-radius: 50%;
          display: grid; place-items: center;
          background: linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08));
          border: 1px solid rgba(255, 255, 255, 0.28);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 18px -6px rgba(0,0,0,0.5);
        }
        .icon svg { width: 20px; height: 20px; fill: none; stroke: #fff; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .dot {
          position: absolute; top: 9px; right: 9px; width: 11px; height: 11px; border-radius: 50%;
          background: #ef4444; border: 2px solid #0a0f1a;
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.7);
          transition: transform 0.35s cubic-bezier(0.34,1.36,0.5,1), opacity 0.25s;
        }
        .card[data-phase="verifying"] .dot, .card[data-phase="verified"] .dot, .card[data-phase="success"] .dot { transform: scale(0); opacity: 0; }
        .orbit {
          position: absolute; inset: -5px; width: calc(100% + 10px); height: calc(100% + 10px);
          opacity: 0; transition: opacity 0.3s;
        }
        .orbit circle { fill: none; stroke: rgba(255,255,255,0.7); stroke-width: 1.6; stroke-linecap: round; stroke-dasharray: 34 200; }
        .card[data-phase="verifying"] .orbit { opacity: 1; animation: v15-spin 1s linear infinite; }

        .card h1, .card h2 { font-size: 22px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.25; text-wrap: balance; margin: 0; }
        .card .sub { margin-top: 8px; font-size: 13.5px; line-height: 1.55; color: rgba(255,255,255,0.62); }
        .email-chip {
          display: inline-block; margin-left: 4px; padding: 1px 8px; border-radius: 7px;
          background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.16);
          color: #fff; font-weight: 600; letter-spacing: 0.01em;
        }

        .stage { position: relative; width: 100%; height: 150px; margin: 18px 0 14px; cursor: text; }
        .stage.shake { animation: v15-shake 0.5s cubic-bezier(0.22,1,0.36,1); }
        .otp-input {
          position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0;
          font-size: 16px; color: transparent; caret-color: transparent; background: transparent; border: 0; outline: none; z-index: 3;
        }
        .otp-input:disabled { pointer-events: none; }
        .box {
          --x: 0px; --y: 0px; --s: 64px;
          position: absolute; left: 50%; top: 50%;
          width: var(--s); height: var(--s);
          transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y)));
          transition: transform 0.7s cubic-bezier(0.34,1.36,0.5,1), width 0.5s cubic-bezier(0.22,1,0.36,1), height 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.35s cubic-bezier(0.22,1,0.36,1);
          z-index: 1;
        }
        .face {
          width: 100%; height: 100%; border-radius: 15px;
          display: grid; place-items: center;
          font-size: 26px; font-weight: 600; color: #fff;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.07);
          transition: background 0.4s, border-color 0.4s, box-shadow 0.4s, font-size 0.4s, border-radius 0.4s;
        }
        .box.filled .face {
          background: linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08));
          border-color: rgba(255, 255, 255, 0.32);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 6px 14px -6px rgba(0,0,0,0.45);
        }
        .box.pop .face { animation: v15-pop 0.32s cubic-bezier(0.34,1.36,0.5,1); }
        .box.active .face {
          background: rgba(255, 255, 255, 0.1);
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.07), 0 9px 16px -9px rgba(16,161,219,0.95), inset 0 -2px 0 rgba(16,161,219,0.55);
        }
        .box.active .face::after {
          content: ""; width: 2px; height: 26px; border-radius: 2px;
          background: #10a1db; box-shadow: 0 0 8px rgba(16,161,219,0.8);
          animation: v15-blink 1s steps(1) infinite;
        }
        .stage.floating .face { animation: v15-bob 2.4s ease-in-out infinite; font-size: 22px; border-radius: 13px; }
        .stage.floating .box:nth-child(3) .face { animation-delay: -0.6s; }
        .stage.floating .box:nth-child(4) .face { animation-delay: -1.2s; }
        .stage.floating .box:nth-child(5) .face { animation-delay: -1.8s; }
        .card[data-phase="verified"] .face {
          animation: none; font-size: 18px; border-radius: 12px;
          background: linear-gradient(180deg, rgba(74,222,128,0.42), rgba(22,163,74,0.32));
          border-color: rgba(134, 239, 172, 0.8);
          box-shadow: 0 0 18px rgba(34,197,94,0.45), inset 0 1px 0 rgba(255,255,255,0.3);
        }
        .stage.converge .face { font-size: 11px; border-radius: 8px; }
        .card[data-phase="error"] .face {
          background: rgba(239, 68, 68, 0.16);
          border-color: rgba(248, 113, 113, 0.85);
          box-shadow: 0 0 16px rgba(239,68,68,0.35);
        }

        .links { position: absolute; left: 50%; top: 50%; width: 160px; height: 160px; transform: translate(-50%, -50%); overflow: visible; pointer-events: none; z-index: 2; }
        .links g { transform-origin: 0 0; transition: transform 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.45s; }
        .links.retract g { transform: scale(0); opacity: 0; }
        .links line { opacity: 0; transition: opacity 0.15s; stroke: #fff; stroke-width: 2.2; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; filter: drop-shadow(0 0 4px rgba(255,255,255,0.9)); }
        .links line.draw { opacity: 1; transition: stroke-dashoffset 0.38s cubic-bezier(0.22,1,0.36,1); stroke-dashoffset: 0; }
        .spark { fill: #fff; opacity: 0; filter: drop-shadow(0 0 6px #fff); transition: opacity 0.2s; }
        .links.retract .spark { opacity: 1; }

        .merge {
          position: absolute; left: 50%; top: 50%; width: 66px; height: 66px; margin: -33px 0 0 -33px;
          border-radius: 19px; display: grid; place-items: center; z-index: 2;
          background: linear-gradient(180deg, #4ade80, #16a34a);
          border: 1px solid rgba(255,255,255,0.4);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -3px 6px rgba(0,0,0,0.12), 0 12px 30px -6px rgba(34,197,94,0.7);
          transform: scale(0) rotate(-40deg); opacity: 0;
          transition: transform 0.6s cubic-bezier(0.34,1.36,0.5,1), opacity 0.25s;
        }
        .merge.show { transform: scale(1) rotate(0); opacity: 1; }
        .merge::before {
          content: ""; position: absolute; inset: -9px; border-radius: 26px;
          border: 1.5px solid rgba(134,239,172,0.6); opacity: 0; transform: scale(0.85);
          transition: opacity 0.5s 0.35s, transform 0.6s 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .merge.show::before { opacity: 1; transform: scale(1); }
        .merge svg { width: 28px; height: 28px; stroke: #fff; stroke-width: 3; fill: none; stroke-linecap: round; stroke-linejoin: round; }
        .merge path { stroke-dasharray: 24; stroke-dashoffset: 24; }
        .merge.show path { transition: stroke-dashoffset 0.4s 0.3s cubic-bezier(0.22,1,0.36,1); stroke-dashoffset: 0; }

        .btn {
          width: 100%; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-size: 14.5px; font-weight: 600;
          transition: background 0.35s, color 0.35s, border-color 0.35s, box-shadow 0.35s, transform 0.15s;
        }
        .btn:active:not(:disabled) { transform: scale(0.98); }
        .verify {
          background: rgba(190, 150, 120, 0.22);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.42);
          cursor: not-allowed;
        }
        .verify.ready, .card[data-phase="verifying"] .verify {
          background: #fbfaf9; color: #1c1917; border-color: #fff; cursor: pointer;
          box-shadow: 0 10px 24px -10px rgba(255,255,255,0.45);
        }
        .card[data-phase="verifying"] .verify { cursor: progress; }
        .card[data-phase="verified"] .verify {
          background: linear-gradient(180deg, #4ade80, #22c55e); color: #fff; border-color: rgba(255,255,255,0.35);
          box-shadow: 0 12px 26px -10px rgba(34,197,94,0.8), inset 0 1px 0 rgba(255,255,255,0.4);
        }
        .card[data-phase="error"] .verify {
          background: rgba(239, 68, 68, 0.2); color: #fecaca; border-color: rgba(248,113,113,0.6);
        }
        .spinner { width: 15px; height: 15px; border-radius: 50%; border: 2px solid rgba(28,25,23,0.2); border-top-color: #1c1917; animation: v15-spin 0.7s linear infinite; }

        .resend { margin-top: 16px; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.62); }
        .resend strong { color: #fff; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; font-variant-numeric: tabular-nums; }
        .ring { width: 14px; height: 14px; transform: rotate(-90deg); }
        .ring circle { fill: none; stroke-width: 1.8; }
        .ring .track { stroke: rgba(255,255,255,0.2); }
        .ring .prog { stroke: #fff; stroke-linecap: round; stroke-dasharray: 32.67; transition: stroke-dashoffset 1s linear; }
        .resend-btn { color: #fff; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
        .change-email { margin-top: 10px; font-size: 12px; color: rgba(255,255,255,0.5); }

        .view-success { visibility: hidden; pointer-events: none; }
        .view-success.show { visibility: visible; pointer-events: auto; }
        .reveal { opacity: 0; transform: translateY(10px); filter: blur(6px); transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1), filter 0.55s cubic-bezier(0.22,1,0.36,1); }
        .view-success.show .reveal { opacity: 1; transform: none; filter: none; }
        .badge-wrap { position: relative; width: 62px; height: 62px; margin-bottom: 20px; }
        .badge-wrap::before, .badge-wrap::after {
          content: ""; position: absolute; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, rgba(34,197,94,0.22), rgba(34,197,94,0) 70%);
        }
        .badge-wrap::before { inset: -18px; border: 1px solid rgba(134,239,172,0.18); }
        .badge-wrap::after { inset: -40px; border: 1px solid rgba(134,239,172,0.08); }
        .view-success.show .badge-wrap::before { animation: v15-halo 2.6s ease-in-out infinite; }
        .view-success.show .badge-wrap::after { animation: v15-halo 2.6s ease-in-out -1.3s infinite; }
        .badge {
          position: relative; width: 100%; height: 100%; border-radius: 50%; display: grid; place-items: center;
          background: linear-gradient(180deg, #4ade80, #16a34a);
          border: 1px solid rgba(255,255,255,0.4);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.55), 0 10px 28px -6px rgba(34,197,94,0.75);
          transform: scale(0.4); opacity: 0;
          transition: transform 0.65s cubic-bezier(0.34,1.36,0.5,1), opacity 0.3s;
        }
        .view-success.show .badge { transform: scale(1); opacity: 1; }
        .badge svg { width: 24px; height: 24px; stroke: #fff; stroke-width: 3; fill: none; stroke-linecap: round; stroke-linejoin: round; }
        .badge path { stroke-dasharray: 24; stroke-dashoffset: 24; }
        .view-success.show .badge path { transition: stroke-dashoffset 0.45s 0.35s cubic-bezier(0.22,1,0.36,1); stroke-dashoffset: 0; }

        .rows { width: 100%; display: flex; flex-direction: column; gap: 10px; margin: 20px 0 18px; text-align: left; list-style: none; padding: 0; }
        .row {
          display: flex; align-items: center; gap: 12px; padding: 11px 12px; border-radius: 14px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .row-icon { width: 32px; height: 32px; border-radius: 9px; display: grid; place-items: center; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); }
        .row-icon svg { width: 15px; height: 15px; fill: none; stroke: #fff; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .row-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
        .row-title { font-size: 13.5px; font-weight: 600; }
        .row-sub { font-size: 12px; color: rgba(255,255,255,0.5); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .tick {
          width: 21px; height: 21px; border-radius: 50%; display: grid; place-items: center;
          background: #22c55e; box-shadow: 0 0 10px rgba(34,197,94,0.7), inset 0 1px 0 rgba(255,255,255,0.4);
          transform: scale(0); transition: transform 0.45s cubic-bezier(0.34,1.36,0.5,1);
        }
        .tick svg { width: 11px; height: 11px; stroke: #fff; stroke-width: 3.5; fill: none; stroke-linecap: round; stroke-linejoin: round; }
        .view-success.show .tick { transform: scale(1); }
        .continue { background: #fbfaf9; color: #1c1917; border: 1px solid #fff; box-shadow: 0 10px 24px -10px rgba(255,255,255,0.45); }
        .continue:disabled { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.4); cursor: default; }
        .continue svg { transition: transform 0.2s; }
        .continue:hover svg { transform: translateX(2px); }

        @keyframes v15-spin { to { transform: rotate(360deg); } }
        @keyframes v15-blink { 50% { opacity: 0; } }
        @keyframes v15-pop { 0% { transform: scale(0.82); } 100% { transform: scale(1); } }
        @keyframes v15-bob { 0%, 100% { transform: translate(0, 0) rotate(0); } 50% { transform: translate(1px, -4px) rotate(2deg); } }
        @keyframes v15-shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-9px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(3px); } }
        @keyframes v15-halo { 0%, 100% { transform: scale(0.94); opacity: 0.7; } 50% { transform: scale(1.04); opacity: 1; } }

        @media (max-width: 380px) { .card { padding: 26px 20px 22px; } }
        @media (prefers-reduced-motion: reduce) {
          .v15-outer *, .v15-outer *::before, .v15-outer *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.12s !important; }
        }
      `}</style>
    </div>
  )
}
