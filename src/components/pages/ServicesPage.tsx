'use client'
import { useState } from 'react'
import Link from 'next/link'

interface Service {
  id: string
  icon: string
  title: string
  short: string
  full: string
  deliverables: string[]
  best: string
  color: string
  bg: string
}

const SERVICES: Service[] = [
  {
    id: 'strategy',
    icon: '🎯',
    title: 'Marketing Strategy',
    short: 'Research, positioning, and roadmap.',
    full: 'Before we create anything, we understand your business, customers, competitors, and goals. Every decision has a purpose — we ask "what will move the business forward?" not "what should we post today?"',
    deliverables: [
      'Competitor & market analysis',
      'Customer personas & positioning',
      'Content pillars & messaging framework',
      '90-day growth roadmap',
      'Channel & platform recommendations',
    ],
    best: 'Businesses launching a new product, entering a new market, or realizing their current marketing has no clear direction.',
    color: '#10a1db',
    bg: 'linear-gradient(135deg, rgba(16,161,219,0.12), rgba(1,32,76,0.25))',
  },
  {
    id: 'social',
    icon: '📱',
    title: 'Social Media Management',
    short: 'Full account management, done right.',
    full: 'Full account management across Instagram, Facebook, TikTok and more. Posting, scheduling, community engagement, DM management, and monthly performance tracking.',
    deliverables: [
      'Content calendar planning',
      'Post scheduling & publishing',
      'Community management & DM replies',
      'Story management',
      'Weekly performance updates',
    ],
    best: 'Businesses that want a consistent, professional social presence but don\'t have time to manage it in-house.',
    color: '#a78bfa',
    bg: 'linear-gradient(135deg, rgba(167,139,250,0.12), rgba(106,70,217,0.15))',
  },
  {
    id: 'ads',
    icon: '💰',
    title: 'Paid Advertising',
    short: 'Meta & Google campaigns that convert.',
    full: 'Targeted Meta and Google campaigns built on data — not guesswork. We optimize for conversions, track every dollar, and report on real business outcomes.',
    deliverables: [
      'Campaign strategy & audience targeting',
      'Ad creative (visuals + copy)',
      'Landing page optimization',
      'A/B testing & ongoing optimization',
      'Weekly performance reports',
    ],
    best: 'Businesses ready to invest in growth and want measurable ROI. Minimum recommended ad spend: $300/month.',
    color: '#16db64',
    bg: 'linear-gradient(135deg, rgba(16,219,100,0.1), rgba(1,32,76,0.25))',
  },
  {
    id: 'branding',
    icon: '🎨',
    title: 'Branding & Identity',
    short: 'A brand that makes you unforgettable.',
    full: 'Logo design, visual identity, brand guidelines, typography, and color systems. Everything you need to look premium, consistent, and immediately recognizable.',
    deliverables: [
      'Logo design (primary + variations)',
      'Color palette & typography system',
      'Brand guidelines document',
      'Social media brand kit',
      'Business card & letterhead design',
    ],
    best: 'New businesses or established brands doing a rebrand. Foundational work that shapes everything else you do.',
    color: '#f472b6',
    bg: 'linear-gradient(135deg, rgba(244,114,182,0.1), rgba(106,70,217,0.15))',
  },
  {
    id: 'content',
    icon: '🎬',
    title: 'Content Creation',
    short: 'Reels, carousels, and content that performs.',
    full: 'Scroll-stopping reels, carousels, stories, and static posts designed to captivate your specific audience. Content that builds a brand, not just a feed.',
    deliverables: [
      'Short-form video (Reels, TikToks)',
      'Carousel posts',
      'Static posts & graphics',
      'Stories content',
      'UGC-style content',
    ],
    best: 'Businesses that need a strong visual presence but don\'t have in-house creative talent.',
    color: '#fb923c',
    bg: 'linear-gradient(135deg, rgba(251,146,60,0.1), rgba(1,32,76,0.25))',
  },
  {
    id: 'copy',
    icon: '✍️',
    title: 'Copywriting',
    short: 'Words that make people take action.',
    full: 'Hook-focused captions, conversion-optimized ad copy, landing page text, email sequences, and brand messaging that makes people take action.',
    deliverables: [
      'Social media captions',
      'Ad copy & hooks',
      'Landing page copy',
      'Email sequences',
      'Brand messaging framework',
    ],
    best: 'Businesses whose content looks good but doesn\'t convert. Copy is often the missing piece.',
    color: '#38bdf8',
    bg: 'linear-gradient(135deg, rgba(56,189,248,0.1), rgba(37,135,197,0.15))',
  },
  {
    id: 'web',
    icon: '🌐',
    title: 'Website Development',
    short: 'Fast, beautiful sites that convert.',
    full: 'Fast, beautiful, mobile-first websites built for conversion. From landing pages to full multi-page sites — designed to turn visitors into leads.',
    deliverables: [
      'Custom design (mobile-first)',
      'Copy & imagery integration',
      'Contact forms & lead capture',
      'SEO fundamentals',
      'Analytics setup',
    ],
    best: 'Any business that needs a website — new launches, rebrands, or replacing an outdated site that\'s hurting conversions.',
    color: '#10a1db',
    bg: 'linear-gradient(135deg, rgba(16,161,219,0.12), rgba(1,32,76,0.25))',
  },
  {
    id: 'analytics',
    icon: '📊',
    title: 'Analytics & Reporting',
    short: 'Clear insights, honest reporting.',
    full: 'Monthly performance reports with clear insights — what\'s working, what\'s not, and the exact actions we\'re taking to improve. Full transparency, always.',
    deliverables: [
      'Monthly performance reports',
      'Google Analytics setup',
      'Meta Pixel & conversion tracking',
      'Custom dashboards',
      'Actionable recommendations',
    ],
    best: 'Businesses that want to make data-driven decisions but don\'t know where to start with tracking.',
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(1,32,76,0.25))',
  },
  {
    id: 'consulting',
    icon: '🧠',
    title: 'Consulting',
    short: 'One-on-one strategy sessions.',
    full: 'One-on-one sessions to audit your current marketing, identify gaps, build a roadmap, and give you clarity on the fastest path to growth.',
    deliverables: [
      'Full marketing audit',
      '60-min strategy session',
      'Written report with findings',
      'Priority action list',
      'Follow-up email support (2 weeks)',
    ],
    best: 'Business owners who want expert eyes on their marketing without hiring a full agency.',
    color: '#c084fc',
    bg: 'linear-gradient(135deg, rgba(192,132,252,0.1), rgba(106,70,217,0.15))',
  },
]

export default function ServicesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* HERO */}
      <div style={{ padding: '80px 6% 60px', textAlign: 'center' }}>
        <span className="eyebrow" style={{ marginBottom: '12px' }}>Our Services</span>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(2.4rem,5vw,4rem)', letterSpacing: '-2px', lineHeight: 1.05, marginTop: '12px', color: 'var(--white)' }}>
          Everything Your<br /><span className="grad">Brand Needs</span>
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '520px', margin: '20px auto 0', lineHeight: 1.7, fontWeight: 300 }}>
          From strategy to execution — we handle the full picture so you can focus on running your business.
        </p>
      </div>

      {/* SERVICES GRID */}
      <section style={{ padding: '40px 6% 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', maxWidth: '1200px', margin: '0 auto' }} className="services-grid">
          {SERVICES.map(s => {
            const isExpanded = expandedId === s.id
            return (
              <div
                key={s.id}
                onClick={() => setExpandedId(isExpanded ? null : s.id)}
                style={{
                  background: 'var(--glass)',
                  border: isExpanded ? `1px solid ${s.color}55` : '1px solid var(--glass-border)',
                  borderRadius: '18px',
                  padding: '28px',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  gridColumn: isExpanded ? 'span 3' : 'span 1',
                }}
                className={isExpanded ? 'service-expanded' : ''}
                onMouseEnter={e => { if (!isExpanded) { e.currentTarget.style.borderColor = `${s.color}30`; e.currentTarget.style.transform = 'translateY(-4px)' } }}
                onMouseLeave={e => { if (!isExpanded) { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'none' } }}>
                
                {/* Glow effect */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '60%', height: '60%', background: `radial-gradient(circle at top right, ${s.color}15, transparent 70%)`, pointerEvents: 'none' }} />
                
                <div style={{ position: 'relative' }}>
                  {/* Icon */}
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: s.bg, border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: '20px' }}>
                    {s.icon}
                  </div>

                  {/* Title */}
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.15rem', color: 'var(--white)', marginBottom: '8px', letterSpacing: '-0.3px' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.65, fontWeight: 300, marginBottom: '16px' }}>
                    {isExpanded ? s.full : s.short}
                  </p>

                  {/* Expand indicator */}
                  {!isExpanded && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: s.color, fontWeight: 600 }}>
                      Learn more <span>→</span>
                    </div>
                  )}

                  {/* Expanded content */}
                  {isExpanded && (
                    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${s.color}20`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="expanded-content">
                      <div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: s.color, marginBottom: '12px' }}>
                          What&apos;s included
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {s.deliverables.map(d => (
                            <li key={d} style={{ display: 'flex', gap: '10px', fontSize: '0.82rem', color: 'rgba(249,253,254,0.7)', lineHeight: 1.5, fontWeight: 300 }}>
                              <span style={{ color: s.color, flexShrink: 0, fontWeight: 700 }}>→</span>{d}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: s.color, marginBottom: '12px' }}>
                          Best for
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'rgba(249,253,254,0.7)', lineHeight: 1.65, fontWeight: 300, marginBottom: '20px' }}>
                          {s.best}
                        </p>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <a href={process.env.NEXT_PUBLIC_BOOKING_URL} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} className="btn-primary" style={{ fontSize: '0.78rem', padding: '9px 18px' }}>Book a Call →</a>
                          <button onClick={e => { e.stopPropagation(); setExpandedId(null) }} className="btn-secondary" style={{ fontSize: '0.78rem', padding: '9px 18px' }}>Close</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '40px 6% 100px' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(1,32,76,0.5),rgba(106,70,217,0.12))', border: '1px solid rgba(16,161,219,0.2)', borderRadius: '24px', padding: '60px 40px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>Not Sure Which<br />Service You Need?</h2>
          <p className="section-sub" style={{ margin: '0 auto 32px' }}>
            Book a free 30-minute consultation and we&apos;ll map out exactly what your business needs.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <a href={process.env.NEXT_PUBLIC_BOOKING_URL} target="_blank" rel="noopener" className="btn-primary">Book a Free Consultation</a>
            <Link href="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:900px){
          .services-grid{grid-template-columns:1fr 1fr!important}
          .service-expanded{grid-column:span 2!important}
          .expanded-content{grid-template-columns:1fr!important;gap:20px!important}
        }
        @media(max-width:600px){
          .services-grid{grid-template-columns:1fr!important}
          .service-expanded{grid-column:span 1!important}
        }
      `}</style>
    </div>
  )
}
