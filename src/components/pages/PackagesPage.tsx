'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Pkg {
  tier: string
  subtitle: string
  for: string
  price: number
  featured?: boolean
  feats: string[]
}

const DEFAULT_PKGS: Pkg[] = [
  {
    tier: 'Launch',
    subtitle: 'Build your foundation.',
    for: 'For businesses that need a professional online presence.',
    price: 149,
    feats: [
      'Marketing strategy & brand direction',
      '8 static posts/month',
      '2 short-form videos (Reels/TikToks)',
      'Caption writing & hashtag research',
      'Content scheduling',
      'Monthly performance report',
      '1 revision per design',
    ],
  },
  {
    tier: 'Grow',
    subtitle: 'Build momentum.',
    for: 'For businesses ready for real engagement and growth.',
    price: 299,
    featured: true,
    feats: [
      'Everything in Launch, plus:',
      '12 static posts/month',
      '4 short-form videos',
      'Story content',
      'Basic community management',
      'Competitor analysis',
      'Monthly strategy call',
      'Meta Ads management (ad spend excluded)',
    ],
  },
  {
    tier: 'Dominate',
    subtitle: 'Accelerate your growth.',
    for: 'For serious brands ready to scale.',
    price: 499,
    feats: [
      'Everything in Grow, plus:',
      '16 static posts/month',
      '8 short-form videos',
      'Advanced growth strategy',
      'Complete Meta Ads management',
      'Conversion optimization',
      'Performance dashboard',
      'Priority support',
    ],
  },
]

const PHILOSOPHY = [
  { icon: '🚫', title: 'No price inflation', desc: "We charge what's fair. Not what the market allows us to get away with." },
  { icon: '🔓', title: 'No lock-in contracts', desc: "Month-to-month. Stay because we deliver results, not because you're trapped." },
  { icon: '🎯', title: 'No unnecessary upsells', desc: 'We only recommend services that genuinely move the needle for your business.' },
  { icon: '📈', title: 'We grow with you', desc: "Start small. Scale up when you're ready. Your plan grows as your business does." },
  { icon: '💬', title: 'Marketing made accessible', desc: "Professional marketing shouldn't require a $1,000+/month budget. We built this for you." },
]

const COMPARISON_ROWS = [
  ['Marketing Strategy', '✓', '✓', '✓'],
  ['Brand Direction', '✓', '✓', '✓'],
  ['Static Posts', '8/mo', '12/mo', '16/mo'],
  ['Short-form Videos', '2/mo', '4/mo', '8/mo'],
  ['Caption Writing', '✓', '✓', '✓'],
  ['Hashtag Research', '✓', '✓', '✓'],
  ['Content Scheduling', '✓', '✓', '✓'],
  ['Monthly Report', '✓', '✓', '✓'],
  ['Story Content', '—', '✓', '✓'],
  ['Community Management', '—', 'Basic', '✓'],
  ['Competitor Analysis', '—', '✓', '✓'],
  ['Monthly Strategy Call', '—', '✓', '✓'],
  ['Meta Ads Management', '—', '✓', '✓'],
  ['Advanced Growth Strategy', '—', '—', '✓'],
  ['Conversion Optimization', '—', '—', '✓'],
  ['Landing Page Review', '—', '—', '✓'],
  ['Performance Dashboard', '—', '—', '✓'],
  ['Priority Support', '—', '—', '✓'],
]

const ADD_ON_CHIPS = [
  '🎨 Logo Design', '🏷️ Brand Identity', '🌐 Website Design', '📄 Landing Pages',
  '📸 Product Photography', '🎬 Extra Reels', '📝 Extra Posts', '✍️ Copywriting',
  '📧 Email Marketing', '💬 WhatsApp Automation', '🔍 SEO', '📍 Google Business Profile',
  '🤝 Influencer Outreach',
]

export default function PackagesPage() {
  const [pkgs, setPkgs] = useState<Pkg[]>(DEFAULT_PKGS)

  useEffect(() => {
    supabase
      .from('site_config')
      .select('value')
      .eq('key', 'packages')
      .single()
      .then(({ data }) => {
        if (data?.value) {
          try {
            const parsed = JSON.parse(data.value)
            if (Array.isArray(parsed) && parsed.length > 0) {
              setPkgs(parsed)
            }
          } catch {}
        }
      })
  }, [])

  const cellStyle = { padding: '14px 16px', borderBottom: '1px solid var(--glass-border)', textAlign: 'center' as const, color: 'rgba(249,253,254,0.7)', fontSize: '0.82rem' }

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* HERO */}
      <div style={{ padding: '80px 6% 60px', textAlign: 'center' }}>
        <span className="eyebrow" style={{ marginBottom: '12px' }}>Pricing</span>
        <h1 className="section-title" style={{ margin: '12px auto 16px' }}>Simple. Transparent.<br />Built for Real Businesses.</h1>
        <p className="section-sub" style={{ margin: '0 auto 32px' }}>No hidden fees. No long-term lock-ins. No inflated retainers.<br />Pick the plan that fits where your business is right now.</p>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px 24px' }}>
          {['No contracts', 'Cancel anytime', 'Free strategy call', '2-week promise'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--sky)', fontWeight: 700 }}>✓</span>{t}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '28px' }}>
          <Link href="/quiz" className="btn-secondary" style={{ fontSize: '0.82rem' }}>🎯 Not sure which plan? Find yours in 2 min →</Link>
        </div>
      </div>

      {/* PACKAGE CARDS */}
      <section style={{ padding: '0 6% 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'stretch', maxWidth: '1200px', margin: '0 auto' }} className="pkg-grid">
          {pkgs.map((p, i) => (
            <div
              key={i}
              style={{
                background: p.featured ? 'linear-gradient(135deg, rgba(1,32,76,0.6), rgba(16,161,219,0.08))' : 'rgba(249,253,254,0.02)',
                border: p.featured ? '1px solid rgba(16,161,219,0.35)' : '1px solid var(--glass-border)',
                borderRadius: '20px', padding: '36px 28px', display: 'flex', flexDirection: 'column', transition: 'all 0.3s',
              }}
              onMouseEnter={e => { if (!p.featured) e.currentTarget.style.borderColor = 'rgba(16,161,219,0.2)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { if (!p.featured) e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'none' }}
            >
              {p.featured && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'linear-gradient(135deg, var(--sky), var(--purple))', color: '#fff', fontSize: '0.62rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '100px', marginBottom: '16px', width: 'fit-content' }}>⭐ Most Popular</div>
              )}
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '6px' }}>{p.tier}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: 'var(--white)', marginBottom: '4px' }}>{p.tier}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', fontStyle: 'italic' }}>{p.subtitle}</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5, fontWeight: 300 }}>{p.for}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '1.2rem', color: 'var(--sky)', fontWeight: 700 }}>$</span>
                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '3rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-2px', lineHeight: 1 }}>{p.price}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginLeft: '4px' }}>/month</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, marginBottom: '28px', padding: 0 }}>
                {p.feats.map((f, fi) => (
                  <li key={fi} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '0.82rem', color: 'rgba(249,253,254,0.65)', lineHeight: 1.5, fontWeight: 300 }}>
                    <span style={{ color: 'var(--sky)', flexShrink: 0, fontWeight: 700, marginTop: '1px' }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <a href={process.env.NEXT_PUBLIC_BOOKING_URL} target="_blank" rel="noopener" style={{ width: '100%', padding: '14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.25s', textAlign: 'center', textDecoration: 'none', display: 'block', background: p.featured ? 'var(--sky)' : 'transparent', color: p.featured ? 'var(--dark)' : 'var(--sky)', border: p.featured ? '1px solid var(--sky)' : '1px solid rgba(16,161,219,0.3)' }}>
                Book a Free Strategy Call
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section style={{ padding: '100px 6%', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="eyebrow" style={{ marginBottom: '12px' }}>Philosophy</span>
          <h2 className="section-title" style={{ margin: '12px auto' }}>Why Our Pricing<br />Is Different</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', maxWidth: '1200px', margin: '0 auto' }} className="pkg-phil-grid">
          {PHILOSOPHY.map(p => (
            <div key={p.title} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '24px 20px', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,161,219,0.2)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'none' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '12px' }}>{p.icon}</div>
              <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--white)', marginBottom: '8px' }}>{p.title}</h4>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 300 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section style={{ padding: '100px 6%' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="eyebrow" style={{ marginBottom: '12px' }}>Compare</span>
          <h2 className="section-title" style={{ margin: '12px auto' }}>What&apos;s Included</h2>
        </div>
        <div style={{ maxWidth: '900px', margin: '0 auto', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--glass-border)', borderRadius: '16px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: 'rgba(16,161,219,0.04)' }}>
                <th style={{ padding: '18px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Feature</th>
                <th style={{ padding: '18px 16px', textAlign: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--white)' }}>
                  Launch<br /><span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--sky)' }}>$149/mo</span>
                </th>
                <th style={{ padding: '18px 16px', textAlign: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--white)', background: 'rgba(16,161,219,0.08)', position: 'relative' }}>
                  Grow<br /><span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--sky)' }}>$299/mo</span>
                </th>
                <th style={{ padding: '18px 16px', textAlign: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--white)' }}>
                  Dominate<br /><span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--sky)' }}>$499/mo</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr key={i} style={{ transition: 'background 0.2s' }}>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--glass-border)', color: 'rgba(249,253,254,0.8)', fontSize: '0.82rem', fontWeight: 500 }}>{row[0]}</td>
                  <td style={cellStyle}>{row[1]}</td>
                  <td style={{ ...cellStyle, background: 'rgba(16,161,219,0.04)' }}>{row[2]}</td>
                  <td style={cellStyle}>{row[3]}</td>
                </tr>
              ))}
              <tr>
                <td style={{ padding: '20px 16px' }}></td>
                <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                  <a href={process.env.NEXT_PUBLIC_BOOKING_URL} target="_blank" rel="noopener" style={{ padding: '10px 24px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, border: '1px solid rgba(16,161,219,0.3)', color: 'var(--sky)', textDecoration: 'none', display: 'inline-block' }}>Get Started</a>
                </td>
                <td style={{ padding: '20px 16px', textAlign: 'center', background: 'rgba(16,161,219,0.04)' }}>
                  <a href={process.env.NEXT_PUBLIC_BOOKING_URL} target="_blank" rel="noopener" style={{ padding: '10px 24px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, background: 'var(--sky)', color: 'var(--dark)', textDecoration: 'none', display: 'inline-block' }}>Get Started</a>
                </td>
                <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                  <a href={process.env.NEXT_PUBLIC_BOOKING_URL} target="_blank" rel="noopener" style={{ padding: '10px 24px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, border: '1px solid rgba(16,161,219,0.3)', color: 'var(--sky)', textDecoration: 'none', display: 'inline-block' }}>Get Started</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CUSTOMIZE / ADD-ONS */}
      <section style={{ padding: '100px 6%', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <span className="eyebrow" style={{ marginBottom: '12px' }}>Flexible</span>
          <h2 className="section-title" style={{ margin: '12px auto' }}>Need Something Different?</h2>
          <p className="section-sub" style={{ margin: '12px auto 40px', maxWidth: '500px' }}>Every business is unique. Build a custom package by selecting only the services you actually need.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '36px' }}>
            {ADD_ON_CHIPS.map(chip => (
              <div key={chip} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '100px', padding: '10px 18px', fontSize: '0.82rem', color: 'rgba(249,253,254,0.75)', transition: 'all 0.2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,161,219,0.3)'; e.currentTarget.style.color = 'var(--white)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'rgba(249,253,254,0.75)' }}>
                {chip}
              </div>
            ))}
          </div>
          <a href={process.env.NEXT_PUBLIC_BOOKING_URL} target="_blank" rel="noopener" className="btn-primary" style={{ fontSize: '1rem', padding: '16px 40px' }}>
            Build My Package →
          </a>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '10px' }}>Book a call and we&apos;ll build a custom estimate together.</p>
        </div>
      </section>

      {/* STARTUP PROMISE */}
      <section style={{ padding: '100px 6%' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(1,32,76,0.4), rgba(106,70,217,0.08))', border: '1px solid rgba(16,161,219,0.2)', borderRadius: '24px', padding: '48px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🤝</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(16,161,219,0.1)', border: '1px solid rgba(16,161,219,0.2)', color: 'var(--sky)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '5px 14px', borderRadius: '100px', marginBottom: '20px' }}>The YallaGrow Startup Promise</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: 'var(--white)', marginBottom: '20px', letterSpacing: '-1px' }}>We Stand Behind Our Work</h2>
          <p style={{ fontSize: '0.95rem', color: 'rgba(249,253,254,0.6)', lineHeight: 1.75, fontWeight: 300, marginBottom: '16px' }}>We know investing in marketing can feel risky — especially for a growing business.</p>
          <p style={{ fontSize: '0.95rem', color: 'rgba(249,253,254,0.6)', lineHeight: 1.75, fontWeight: 300, marginBottom: '32px' }}>
            That&apos;s why if, after your first month, you genuinely believe we delivered less value than what you paid for, we&apos;ll continue working with you for an additional <strong style={{ color: 'var(--white)' }}>two weeks at no extra cost.</strong>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
            {['No unrealistic guarantees', 'No promises of overnight success', 'Just a commitment to exceptional value'].map(n => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: 'rgba(249,253,254,0.7)' }}>
                <span style={{ color: 'var(--sky)', fontWeight: 700 }}>✓</span>{n}
              </div>
            ))}
          </div>
          <a href={process.env.NEXT_PUBLIC_BOOKING_URL} target="_blank" rel="noopener" className="btn-primary" style={{ marginTop: '32px' }}>
            Book a Free Strategy Call →
          </a>
        </div>
      </section>

      <style>{`
        @media(max-width:900px){
          .pkg-grid{grid-template-columns:1fr 1fr!important}
          .pkg-phil-grid{grid-template-columns:repeat(3,1fr)!important}
        }
        @media(max-width:600px){
          .pkg-grid,.pkg-phil-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  )
}
