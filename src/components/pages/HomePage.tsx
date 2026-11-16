'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@/components/ui/Icons'

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
  { icon: 'target', title: 'Marketing Strategy', desc: 'Deep-dive analysis of your market, competitors, and customers — before a single post is created.', arrow: 'Enter the war room →', color: 'rgba(16,161,219,0.08)' },
  { icon: 'phone', title: 'Social Media Management', desc: 'Full account management, content scheduling, and community engagement across all major platforms.', arrow: 'Step into the studio →', color: 'rgba(106,70,217,0.08)' },
  { icon: 'dollar', title: 'Paid Advertising', desc: 'Meta and Google campaigns targeted with precision, optimized for real ROI — not just reach.', arrow: 'Enter the control room →', color: 'rgba(37,135,197,0.08)' },
  { icon: 'palette', title: 'Branding', desc: 'Logo, identity, visual guidelines — a consistent brand that makes you instantly recognizable.', arrow: 'Visit the design studio →', color: 'rgba(16,161,219,0.06)' },
  { icon: 'film', title: 'Content Creation', desc: 'Reels, carousels, stories, and visuals designed to stop the scroll and drive real engagement.', arrow: 'Enter the studio →', color: 'rgba(106,70,217,0.07)' },
  { icon: 'globe', title: 'Website Development', desc: 'Fast, conversion-optimized websites that turn visitors into leads and leads into customers.', arrow: 'See the tech floor →', color: 'rgba(24,96,146,0.08)' },
]

const PROCESS = [
  { location: 'Reception', num: '01', title: 'Understand', desc: 'We study your business, market, audience, and competitors before anything else.' },
  { location: 'Strategy Room', num: '02', title: 'Build', desc: 'We develop a tailored strategy built around your goals — not a recycled template.' },
  { location: 'Launch Center', num: '03', title: 'Launch', desc: 'We execute with precision, on time and on brand, with clear KPIs from day one.' },
  { location: 'Analytics Room', num: '04', title: 'Optimize', desc: 'We analyze performance and improve continuously — what gets measured gets better.' },
]

// Real client case studies. Numbers verified with Karim 2026-10-22.
// If any detail is off, correct in-place — these are referenced on the
// home page and need to stay accurate.
const CASE_STUDIES = [
  {
    name: 'Rare Media',
    handle: '@rare_.media',
    url: 'https://www.instagram.com/rare_.media/',
    industry: 'Monetized TikTok Accounts',
    region: 'Lebanon → Côte d’Ivoire',
    duration: '6+ months',
    tier: 'Grow + Performance Partnership',
    metrics: [
      { value: '0 → 727', label: 'Followers (organic)' },
      { value: '$60/mo', label: 'Ad spend managed' },
      { value: 'High', label: 'DM → sale conversion' },
    ],
    summary: 'Launching a personal brand in a niche most Lebanese buyers don’t trust yet — selling monetized TikTok accounts. Full content system in Lebanese Arabic, hook-first short-form, and paid Meta ads managed by our media buyer. Still working together as they expand into Côte d’Ivoire.',
    quote: {
      text: 'Starting a business in a niche people are skeptical of means fighting trust before anything else. YallaGrow built the content and the credibility in parallel — DMs started converting into sales within the first few months.',
      author: 'Founder, Rare Media',
    },
  },
  {
    name: 'TAAMIR Engineering',
    handle: '@taamirlb',
    url: 'https://www.instagram.com/taamirlb/',
    industry: 'Structural Engineering & Contracting',
    region: 'Lebanon · B2B',
    duration: '2 months (Nov–Dec 2025)',
    tier: 'Branding + B2B content strategy',
    metrics: [
      { value: '0 → 223', label: 'Followers (B2B, high-intent)' },
      { value: '2', label: 'Project inquiries from IG' },
      { value: 'Both', label: 'Converted into contracts' },
    ],
    summary: 'Built a professional B2B presence from scratch for a Lebanese engineering firm. Targeted at architects, developers, and project owners — not consumers. Full brand identity, educational Arabic carousels, and 60 days of focused content aimed at high-value leads over vanity metrics.',
    quote: {
      text: 'We needed a brand that speaks to builders and project owners, not people scrolling for entertainment. YallaGrow got that from the first call and built content that actually brings real inquiries — not just likes.',
      author: 'Founder, TAAMIR Engineering',
    },
  },
]

// Single-card crossfade carousel. One card renders at a time;
// AnimatePresence(mode="wait") makes the old slide out before the new
// slides in — so cards never overlap. 320ms ease, no 3D transforms,
// no perspective, no lag.
function CaseStudyCarousel() {
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(1)   // +1 = next, -1 = prev (drives slide direction)
  const total = CASE_STUDIES.length
  const next = () => { setDir(1);  setIdx(i => (i + 1) % total) }
  const prev = () => { setDir(-1); setIdx(i => (i - 1 + total) % total) }
  const goTo = (i: number) => { setDir(i > idx ? 1 : -1); setIdx(i) }

  const cs = CASE_STUDIES[idx]

  return (
    <div style={{ position: 'relative', maxWidth: '920px', margin: '0 auto', padding: '32px 0 16px' }}>
      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: '10% 15% 20% 15%',
        background: 'radial-gradient(ellipse at center, rgba(16,161,219,0.14), transparent 65%)',
        filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Card stage — fixed-height container so swaps don't jump */}
      <div style={{ position: 'relative', minHeight: 'clamp(460px, 48vw, 500px)', padding: '0 clamp(60px, 7vw, 76px)', zIndex: 1 }}>
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={cs.handle}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'linear-gradient(140deg, rgba(249,253,254,0.07), rgba(249,253,254,0.015) 60%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(16,161,219,0.2)',
              borderRadius: '24px',
              boxShadow: '0 28px 70px rgba(1,32,76,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
              padding: 'clamp(26px, 4vw, 44px) clamp(24px, 4vw, 44px) 30px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top sheen */}
            <div aria-hidden="true" style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(16,161,219,0.5), transparent)',
            }} />

            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '22px', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.3rem, 2.4vw, 1.7rem)', color: 'var(--white)', letterSpacing: '-0.5px', lineHeight: 1.1, marginBottom: '6px' }}>
                  {cs.name}
                </h3>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.5px', lineHeight: 1.5 }}>
                  {cs.industry} &middot; {cs.region}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', letterSpacing: '0.5px' }}>
                  {cs.duration}
                </div>
              </div>
              <a href={cs.url} target="_blank" rel="noopener" style={{ fontSize: '0.76rem', color: 'var(--sky)', textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
                {cs.handle} <Icon name="link" size={11} />
              </a>
            </div>

            {/* Quote */}
            <blockquote style={{ margin: 0, marginBottom: '26px' }}>
              <p style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 500,
                fontSize: 'clamp(0.98rem, 1.7vw, 1.2rem)',
                lineHeight: 1.5,
                color: 'var(--white)',
                letterSpacing: '-0.2px',
                fontStyle: 'italic',
                marginBottom: '12px',
              }}>
                &ldquo;{cs.quote.text}&rdquo;
              </p>
              <footer style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                — {cs.quote.author}
              </footer>
            </blockquote>

            {/* Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '14px',
              padding: '18px 0 2px',
              borderTop: '1px solid rgba(16,161,219,0.18)',
            }}>
              {cs.metrics.map(m => (
                <div key={m.label}>
                  <div style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 800,
                    fontSize: 'clamp(0.95rem, 1.7vw, 1.2rem)',
                    background: 'linear-gradient(135deg, var(--sky), var(--purple))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.5px',
                    lineHeight: 1.1,
                    marginBottom: '4px',
                  }}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, lineHeight: 1.3 }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Delivered */}
            <div style={{ fontSize: '0.64rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600, marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(249,253,254,0.05)' }}>
              Delivered: <span style={{ color: 'var(--sky)' }}>{cs.tier}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav arrows — positioned inside the padded stage */}
      <button
        onClick={prev}
        aria-label="Previous case study"
        style={{
          position: 'absolute', left: '6px', top: '50%', transform: 'translateY(-50%)',
          width: '44px', height: '44px', borderRadius: '50%',
          background: 'rgba(6,12,20,0.7)', border: '1px solid rgba(16,161,219,0.3)',
          color: 'var(--white)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10,
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          transition: 'border-color 0.2s, background 0.2s',
          boxShadow: '0 10px 24px rgba(1,32,76,0.4)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--sky)'; e.currentTarget.style.background = 'rgba(16,161,219,0.12)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(16,161,219,0.3)'; e.currentTarget.style.background = 'rgba(6,12,20,0.7)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>

      <button
        onClick={next}
        aria-label="Next case study"
        style={{
          position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
          width: '44px', height: '44px', borderRadius: '50%',
          background: 'rgba(6,12,20,0.7)', border: '1px solid rgba(16,161,219,0.3)',
          color: 'var(--white)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10,
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          transition: 'border-color 0.2s, background 0.2s',
          boxShadow: '0 10px 24px rgba(1,32,76,0.4)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--sky)'; e.currentTarget.style.background = 'rgba(16,161,219,0.12)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(16,161,219,0.3)'; e.currentTarget.style.background = 'rgba(6,12,20,0.7)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '22px' }}>
        {CASE_STUDIES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to case study ${i + 1}`}
            style={{
              width: i === idx ? '28px' : '8px',
              height: '8px',
              borderRadius: '100px',
              background: i === idx ? 'var(--sky)' : 'rgba(249,253,254,0.2)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 6% 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 30% 50%, rgba(16,161,219,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: '45%', height: '100%', opacity: 0.4, pointerEvents: 'none', background: 'linear-gradient(135deg, transparent 0%, rgba(1,32,76,0.2) 100%)' }} />

        <div style={{ maxWidth: '700px', position: 'relative', zIndex: 1 }}>

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

          {/* LEBANON TRUST BAR — the three questions every LB SMB asks before paying */}
          <div style={{
            marginTop: '44px',
            padding: '18px 22px',
            background: 'rgba(16,161,219,0.04)',
            border: '1px solid rgba(16,161,219,0.18)',
            borderRadius: '14px',
            maxWidth: '560px',
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px 24px', marginBottom: '10px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'rgba(249,253,254,0.78)', fontWeight: 500 }}>
                <span style={{ color: 'var(--sky)', display: 'inline-flex' }}><Icon name="map-pin" size={14} /></span>
                Lebanese team
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'rgba(249,253,254,0.78)', fontWeight: 500 }}>
                <span style={{ color: 'var(--sky)', display: 'inline-flex' }}><Icon name="dollar" size={14} /></span>
                Whish &middot; OMT &middot; Cash USD
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'rgba(249,253,254,0.78)', fontWeight: 500 }}>
                <span style={{ color: 'var(--sky)', display: 'inline-flex' }}><Icon name="unlock" size={14} /></span>
                Month-to-month
              </div>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
              Fresh dollars only — no lollars, no long-term contracts, no bank transfer games.
            </div>
          </div>
        </div>
      </section>

      {/* MEET THE FOUNDER — the person you'll actually work with */}
      <section style={{ padding: '100px 6%' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '48px', alignItems: 'center' }} className="founder-grid">
          {/* Founder photo */}
          <div style={{
            width: '240px',
            height: '240px',
            borderRadius: '28px',
            border: '1px solid rgba(16,161,219,0.3)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(1,32,76,0.4)',
          }} className="founder-avatar">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/karim.jpg"
              alt="Karim, YallaGrow founder"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 20%',
                display: 'block',
              }}
            />
            {/* Subtle brand tint overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(16,161,219,0.08), transparent 50%)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Bio */}
          <div>
            <span className="eyebrow" style={{ marginBottom: '12px' }}>Who you&apos;re actually working with</span>
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              color: 'var(--white)',
              letterSpacing: '-1px',
              lineHeight: 1.1,
              margin: '14px 0 20px',
            }}>
              Hi, I&apos;m Karim.<br />
              <span className="grad">I run YallaGrow.</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'rgba(249,253,254,0.72)', lineHeight: 1.75, fontWeight: 300, marginBottom: '20px' }}>
              I started YallaGrow in June 2024 while studying at Sagesse University — so I know exactly what it feels like to build a business on limited time and real money. Every strategy call, every pitch, every important decision on your account goes through me. Not an account manager, not a sales rep.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '28px' }}>
              If we work together, you get my direct WhatsApp. If something isn&apos;t working, I&apos;m the one who fixes it. That&apos;s the whole promise.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="https://wa.me/96176302159" target="_blank" rel="noopener" className="btn-primary" style={{ fontSize: '0.88rem' }}>
                WhatsApp me directly →
              </a>
              <Link href="/about" className="btn-secondary" style={{ fontSize: '0.88rem' }}>More about the team</Link>
            </div>
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
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(16,161,219,0.08)', border: '1px solid rgba(16,161,219,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', position: 'relative', color: 'var(--sky)' }}>
                <Icon name={s.icon as any} size={26} />
              </div>
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

      {/* CASE STUDIES — carousel of real client proof */}
      <section style={{ padding: '120px 6%', position: 'relative', overflow: 'hidden' }}>
        {/* Soft radial gradient background */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(16,161,219,0.12) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 50% 80%, rgba(106,70,217,0.08) 0%, transparent 55%)', pointerEvents: 'none' }} />

        <div style={{ textAlign: 'center', marginBottom: '72px', position: 'relative', zIndex: 1 }}>
          <span className="eyebrow" style={{ marginBottom: '16px' }}>Proof</span>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            color: 'var(--white)',
            letterSpacing: '-1.5px',
            lineHeight: 1.05,
            margin: '18px auto 20px',
            maxWidth: '720px',
          }}>
            Lebanese businesses.<br />
            <span className="grad">Grown from zero.</span>
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 300, maxWidth: '560px', margin: '0 auto' }}>
            Not fake &ldquo;10x growth&rdquo; promises. Real clients, real timelines, real numbers you can verify on Instagram right now.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <CaseStudyCarousel />
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px', position: 'relative', zIndex: 1 }}>
          <a href={process.env.NEXT_PUBLIC_BOOKING_URL} target="_blank" rel="noopener" className="btn-primary" style={{ fontSize: '0.9rem' }}>
            Could your brand be next? Book a strategy call →
          </a>
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
            <a href="https://wa.me/96176302159" target="_blank" rel="noopener" className="btn-secondary">WhatsApp Us</a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @media(max-width:900px){
          .phil-grid,.svc-grid,.proc-grid,.testi-grid{grid-template-columns:1fr 1fr!important}
          .founder-grid{grid-template-columns:1fr!important;gap:28px!important;text-align:center}
          .founder-avatar{margin:0 auto}
        }
        @media(max-width:720px){
          /* Shrink side-card offsets so neighbors still peek on narrower screens */
          .case-stage{perspective:1200px!important}
          .case-arrow{width:44px!important;height:44px!important;left:0!important;right:0!important}
          .case-arrow:last-of-type{left:auto!important;right:0!important}
        }
        @media(max-width:600px){
          .phil-grid,.svc-grid,.proc-grid,.testi-grid{grid-template-columns:1fr!important}
          .case-metrics{grid-template-columns:repeat(3,1fr)!important;gap:10px!important}
          .founder-avatar{width:180px!important;height:180px!important}
        }
      `}</style>
    </div>
  )
}
