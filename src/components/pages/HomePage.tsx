'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

// Small counter component
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let current = 0
    const step = Math.max(1, Math.ceil(target / 40))
    const interval = setInterval(() => {
      current += step
      if (current >= target) {
        current = target
        clearInterval(interval)
      }
      el.textContent = String(current)
    }, 40)
    return () => clearInterval(interval)
  }, [target])
  return (
    <>
      <span ref={ref}>0</span>
      {suffix && <em style={{ fontStyle: 'normal', color: 'var(--sky)' }}>{suffix}</em>}
    </>
  )
}

const PHILOSOPHY = [
  { num: '01 — PHILOSOPHY', title: 'Marketing Is an Investment', desc: 'Not an expense. Every dollar should have a purpose. Every campaign should solve a problem.' },
  { num: '02 — APPROACH', title: 'We Think Like Owners', desc: "Not just marketers. We're interested in revenue, retention, and sustainable growth." },
  { num: '03 — DIFFERENCE', title: 'No Copy-Paste Strategies', desc: "We don't copy what works for others. We build what works specifically for you." },
  { num: '04 — MISSION', title: 'Data, Psychology, Results', desc: 'Built on real business objectives — not trends, guesswork, or vanity metrics.' },
]

const SERVICES_PREVIEW = [
  { icon: '🎯', title: 'Marketing Strategy', desc: 'Deep-dive analysis of your market, competitors, and customers — before a single post is created.', arrow: 'Enter the war room →', color: 'rgba(16,161,219,0.08)' },
  { icon: '📱', title: 'Social Media Management', desc: 'Full account management, content scheduling, and community engagement across all major platforms.', arrow: 'Step into the studio →', color: 'rgba(106,70,217,0.08)' },
  { icon: '💰', title: 'Paid Advertising', desc: 'Meta and Google campaigns targeted with precision, optimized for real ROI — not just reach.', arrow: 'Enter the control room →', color: 'rgba(37,135,197,0.08)' },
  { icon: '🎨', title: 'Branding', desc: 'Logo, identity, visual guidelines — a consistent brand that makes you instantly recognizable.', arrow: 'Visit the design studio →', color: 'rgba(16,161,219,0.06)' },
  { icon: '🎬', title: 'Content Creation', desc: 'Reels, carousels, stories, and visuals designed to stop the scroll and drive real engagement.', arrow: 'Enter the studio →', color: 'rgba(106,70,217,0.07)' },
  { icon: '🌐', title: 'Website Development', desc: 'Fast, conversion-optimized websites that turn visitors into leads and leads into customers.', arrow: 'See the tech floor →', color: 'rgba(24,96,146,0.08)' },
]

const PROCESS = [
  { location: 'Reception', num: '01', title: 'Understand', desc: 'We study your business, market, audience, and competitors before anything else.' },
  { location: 'Strategy Room', num: '02', title: 'Build', desc: 'We develop a tailored strategy built around your goals — not a recycled template.' },
  { location: 'Launch Center', num: '03', title: 'Launch', desc: 'We execute with precision, on time and on brand, with clear KPIs from day one.' },
  { location: 'Analytics Room', num: '04', title: 'Optimize', desc: 'We analyze performance and improve continuously — what gets measured gets better.' },
]

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 6% 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 30% 50%, rgba(16,161,219,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: '45%', height: '100%', opacity: 0.4, pointerEvents: 'none', background: 'linear-gradient(135deg, transparent 0%, rgba(1,32,76,0.2) 100%)' }} />

        <div style={{ maxWidth: '700px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--sky)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--sky)', letterSpacing: '1px' }}>Lebanon&apos;s Premium Growth Agency</span>
          </div>

          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2.8rem, 6vw, 5rem)', letterSpacing: '-3px', lineHeight: 1.05, marginBottom: '24px', color: 'var(--white)' }}>
            We Don&apos;t Sell<br />Marketing.<br />
            We Build <span className="grad">Growth.</span>
          </h1>

          <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-muted)', maxWidth: '520px', fontWeight: 300, marginBottom: '36px' }}>
            Most agencies focus on posting. We focus on results. Every strategy is built around your business, your audience, and your goals — never a template.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <a href={process.env.NEXT_PUBLIC_BOOKING_URL} target="_blank" rel="noopener" className="btn-primary" style={{ fontSize: '0.95rem', padding: '14px 32px' }}>Book a Free Strategy Call</a>
            <Link href="/services" className="btn-secondary" style={{ fontSize: '0.95rem', padding: '14px 32px' }}>Explore Services</Link>
          </div>

          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            {[[22, '+', 'Campaigns Delivered'], [3, '+', 'Years Experience'], [9, '+', 'Services Offered'], [100, '%', 'Custom Strategies']].map(([n, s, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: 'var(--white)', letterSpacing: '-1px' }}>
                  <Counter target={n as number} suffix={s as string} />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section style={{ padding: '100px 6%', background: 'rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="eyebrow" style={{ marginBottom: '12px' }}>Our Philosophy</span>
          <h2 className="section-title" style={{ margin: '12px auto 12px' }}>How We Think About Growth</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>Four truths that guide every decision we make.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', maxWidth: '1200px', margin: '0 auto' }} className="phil-grid">
          {PHILOSOPHY.map(p => (
            <div key={p.num} style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '18px', padding: '32px 24px', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,161,219,0.2)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'none' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1.5px', color: 'var(--sky)', marginBottom: '16px' }}>{p.num}</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: 'var(--white)', marginBottom: '12px', letterSpacing: '-0.5px' }}>{p.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 300 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ padding: '100px 6%' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="eyebrow" style={{ marginBottom: '12px' }}>What We Do</span>
          <h2 className="section-title" style={{ margin: '12px auto 12px' }}>Services That Move Businesses</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>Full-spectrum marketing — from strategy to execution.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', maxWidth: '1200px', margin: '0 auto' }} className="svc-grid">
          {SERVICES_PREVIEW.map(s => (
            <div key={s.title} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '18px', padding: '32px 28px', transition: 'all 0.3s', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,161,219,0.25)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'none' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '60%', height: '60%', background: `radial-gradient(circle at top right, ${s.color}, transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(16,161,219,0.08)', border: '1px solid rgba(16,161,219,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: '20px', position: 'relative' }}>{s.icon}</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--white)', marginBottom: '10px', position: 'relative' }}>{s.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.65, fontWeight: 300, marginBottom: '16px', position: 'relative' }}>{s.desc}</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--sky)', fontWeight: 600, position: 'relative' }}>{s.arrow}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '44px' }}>
          <Link href="/services" className="btn-secondary">View All 9 Services →</Link>
        </div>
      </section>

      {/* PROCESS */}
      <section style={{ padding: '100px 6%', background: 'rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="eyebrow" style={{ marginBottom: '12px' }}>How We Work</span>
          <h2 className="section-title" style={{ margin: '12px auto 12px' }}>Your Growth, Step by Step</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>A repeatable system — not a one-time event.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', maxWidth: '1100px', margin: '0 auto', position: 'relative' }} className="proc-grid">
          <div style={{ position: 'absolute', top: '52px', left: '12.5%', right: '12.5%', height: '1px', background: 'linear-gradient(90deg, var(--sky), var(--purple))', opacity: 0.3 }} />
          {PROCESS.map(p => (
            <div key={p.num} style={{ textAlign: 'center', padding: '0 20px', position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '12px' }}>{p.location}</div>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(1,32,76,0.9), rgba(16,161,219,0.1))', border: '1px solid rgba(16,161,219,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--sky)' }}>{p.num}</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--white)', marginBottom: '10px' }}>{p.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.65, fontWeight: 300 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FIND YOUR PLAN CTA */}
      <section style={{ padding: '100px 6%', textAlign: 'center' }}>
        <span className="eyebrow" style={{ marginBottom: '12px' }}>Pricing</span>
        <h2 className="section-title" style={{ margin: '12px auto 16px' }}>Not Sure Which Plan<br />Is Right for You?</h2>
        <p className="section-sub" style={{ margin: '0 auto 36px' }}>Answer 6 quick questions and get a personalized plan recommendation in under 2 minutes.</p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <Link href="/quiz" className="btn-primary" style={{ fontSize: '1rem', padding: '16px 40px' }}>Find My Growth Plan →</Link>
          <Link href="/packages" className="btn-secondary" style={{ fontSize: '0.82rem' }}>Or browse all packages</Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '0 6% 100px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(1,32,76,0.5), rgba(106,70,217,0.15))', border: '1px solid rgba(16,161,219,0.2)', borderRadius: '28px', padding: '60px 40px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>Ready to Build Something<br />People Remember?</h2>
          <p className="section-sub" style={{ margin: '0 auto 32px' }}>Let&apos;s build a marketing system that actually moves your business forward.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <a href={process.env.NEXT_PUBLIC_BOOKING_URL} target="_blank" rel="noopener" className="btn-primary">Book a Free Call</a>
            <a href="https://wa.me/447376441603" target="_blank" rel="noopener" className="btn-secondary">WhatsApp Us</a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @media(max-width:900px){
          .phil-grid,.svc-grid,.proc-grid,.testi-grid{grid-template-columns:1fr 1fr!important}
        }
        @media(max-width:600px){
          .phil-grid,.svc-grid,.proc-grid,.testi-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  )
}
