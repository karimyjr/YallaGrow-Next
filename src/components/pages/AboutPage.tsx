'use client'

const TAGS = ['Strategy-First', 'Data-Driven', 'Results-Obsessed', 'Lebanon-Based', 'No Templates', '3+ Years']

const BLOCKS = [
  {
    title: 'Our Mission',
    body: "To help ambitious businesses grow with marketing that's built on data, psychology, and real business objectives — not trends or guesswork. Every campaign we run, every piece of content we create, has a clear purpose tied to your growth.",
  },
  {
    title: 'What Makes Us Different',
    body: 'Most agencies focus on posting. We focus on results. Before creating content or launching campaigns, we understand your business, customers, competitors, and goals. Every decision has a purpose.',
    quote: 'Instead of asking "What should we post today?" — we ask "What will move the business forward?"',
  },
  {
    title: 'No Copy-Paste Strategies',
    body: "Too many brands follow the same trends, the same content, the same strategies. Growth doesn't come from imitation — it comes from differentiation.",
    quote: "We don't copy what works for others. We build what works for you.",
  },
  {
    title: 'How We Work',
    body: 'We operate on a simple four-step system that we apply to every client, every time — no shortcuts.',
    steps: [
      'We study your business, market, and audience.',
      'We develop a strategy tailored to your goals.',
      'We execute campaigns with precision.',
      'We analyze performance and improve continuously.',
    ],
  },
]

const TEAM = [
  {
    role: 'Founder · CEO',
    title: 'Strategy & Sales',
    desc: 'The person your business works with directly. Leads positioning, defines direction, manages client relationships, and ensures everything we do is tied to a real business outcome.',
    responsibilities: [
      'Leads strategy and market positioning',
      'Handles client acquisition and onboarding',
      'Oversees all active client relationships',
      'Defines marketing direction per project',
    ],
    color: '#10a1db',
    bg: 'linear-gradient(135deg,rgba(16,161,219,0.15),rgba(1,32,76,0.3))',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    role: 'Designer · Creator',
    title: 'Visual Content & Brand',
    desc: 'The visual identity of your brand across every platform. Creates content that stops the scroll, builds recognition, and communicates your message without needing a caption.',
    responsibilities: [
      'Designs social media posts and creatives',
      'Produces Reels and short-form video content',
      'Maintains visual consistency across campaigns',
      'Builds brand assets and marketing materials',
    ],
    color: '#a78bfa',
    bg: 'linear-gradient(135deg,rgba(106,70,217,0.15),rgba(1,32,76,0.3))',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={12} cy={12} r={3} />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    role: 'Copywriter · Content',
    title: 'Words That Convert',
    desc: 'The voice behind every caption, ad, and campaign. Writes copy that hooks attention, communicates clearly, and moves people toward action — without sounding like a sales pitch.',
    responsibilities: [
      'Writes captions and post copy',
      'Creates ad hooks and conversion-focused copy',
      'Supports content strategy with messaging',
      'Refines communication across all touchpoints',
    ],
    color: '#38bdf8',
    bg: 'linear-gradient(135deg,rgba(16,161,219,0.1),rgba(37,135,197,0.15))',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    role: 'Freelance · Ads',
    title: 'Paid Media & Performance',
    desc: 'Brought in on campaigns that require paid advertising. Works on a project basis, which means you only pay for this expertise when you actually need it — no unnecessary overhead.',
    responsibilities: [
      'Manages Meta Ads (Facebook & Instagram)',
      'Optimizes targeting and ad performance',
      'Handles campaign scaling and budget allocation',
      'Engaged on a project basis as needed',
    ],
    color: '#34d399',
    bg: 'linear-gradient(135deg,rgba(16,219,100,0.1),rgba(1,32,76,0.3))',
    note: 'Engaged per project — not a fixed overhead cost.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
]

export default function AboutPage() {
  return (
    <div style={{ paddingTop: '80px' }}>
      {/* HERO */}
      <div style={{ padding: '80px 6% 60px' }}>
        <span className="eyebrow" style={{ marginBottom: '12px' }}>About YallaGrow</span>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(2.4rem,5vw,4rem)', letterSpacing: '-2px', lineHeight: 1.05, marginTop: '12px', color: 'var(--white)' }}>
          We Don&apos;t Sell<br />Marketing.<br />
          We Build <span className="grad">Growth.</span>
        </h1>
      </div>

      {/* MISSION + VALUES */}
      <section style={{ padding: '0 6% 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '48px', maxWidth: '1200px', margin: '0 auto', alignItems: 'start' }} className="about-grid">

          {/* Sticky card */}
          <div style={{ position: 'sticky', top: '100px' }} className="about-sticky">
            <div style={{ background: 'linear-gradient(135deg,rgba(1,32,76,0.5),rgba(16,161,219,0.08))', border: '1px solid rgba(16,161,219,0.2)', borderRadius: '20px', padding: '32px' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.5rem', color: 'var(--white)', letterSpacing: '-0.5px', lineHeight: 1.25, marginBottom: '20px' }}>
                Every business has potential. Our job is to unlock it.
              </div>
              <div style={{ fontSize: '0.88rem', color: 'rgba(249,253,254,0.65)', lineHeight: 1.75, fontWeight: 300, marginBottom: '24px' }}>
                Through strategy, creativity, and execution — we build marketing systems that generate attention, build trust, and drive revenue.
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {TAGS.map(t => (
                  <span key={t} style={{ background: 'rgba(16,161,219,0.08)', border: '1px solid rgba(16,161,219,0.2)', borderRadius: '100px', padding: '5px 12px', fontSize: '0.68rem', fontWeight: 600, color: 'var(--sky)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Content blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {BLOCKS.map(b => (
              <div key={b.title} style={{ paddingBottom: '40px', borderBottom: '1px solid var(--glass-border)' }}>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.5rem', color: 'var(--white)', marginBottom: '14px', letterSpacing: '-0.5px' }}>{b.title}</h3>
                <p style={{ fontSize: '0.92rem', color: 'rgba(249,253,254,0.65)', lineHeight: 1.75, fontWeight: 300, marginBottom: b.quote || b.steps ? '20px' : 0 }}>{b.body}</p>
                {b.quote && (
                  <blockquote style={{ borderLeft: '2px solid var(--sky)', paddingLeft: '20px', margin: 0, fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(249,253,254,0.8)', lineHeight: 1.7 }}>
                    {b.quote}
                  </blockquote>
                )}
                {b.steps && (
                  <ul style={{ listStyle: 'none', padding: 0, marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {b.steps.map((step, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', fontSize: '0.9rem', color: 'rgba(249,253,254,0.7)', lineHeight: 1.6 }}>
                        <span style={{ background: 'rgba(16,161,219,0.1)', border: '1px solid rgba(16,161,219,0.25)', color: 'var(--sky)', borderRadius: '8px', padding: '3px 10px', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '0.7rem', flexShrink: 0 }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM ARCHITECTURE */}
      <section style={{ padding: '80px 6% 60px', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="eyebrow" style={{ marginBottom: '12px' }}>The Team</span>
          <h2 className="section-title" style={{ margin: '12px auto' }}>Lean by Design.<br />Effective by Default.</h2>
          <p className="section-sub" style={{ maxWidth: '520px', margin: '12px auto 0' }}>
            We&apos;re not a 50-person agency with layers of account managers. We&apos;re a small, specialized team where every person directly touches your work.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '20px', maxWidth: '1100px', margin: '0 auto' }} className="team-grid">
          {TEAM.map(m => (
            <div key={m.role} style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '28px', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${m.color}40`; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: m.bg, border: `1px solid ${m.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color }}>
                  {m.icon}
                </div>
                <div style={{ background: `${m.color}15`, border: `1px solid ${m.color}30`, color: m.color, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '100px' }}>
                  {m.role}
                </div>
              </div>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.2rem', color: 'var(--white)', marginBottom: '10px', letterSpacing: '-0.5px' }}>{m.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(249,253,254,0.6)', lineHeight: 1.65, fontWeight: 300, marginBottom: '20px' }}>{m.desc}</p>
              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '10px' }}>Responsibilities</div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {m.responsibilities.map(r => (
                    <li key={r} style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: 'rgba(249,253,254,0.65)', lineHeight: 1.5, fontWeight: 300 }}>
                      <span style={{ color: m.color, flexShrink: 0, fontWeight: 700 }}>→</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
              {m.note && (
                <div style={{ marginTop: '16px', padding: '10px 14px', background: `${m.color}10`, border: `1px solid ${m.color}25`, borderRadius: '10px', fontSize: '0.72rem', color: m.color, fontWeight: 600 }}>
                  {m.note}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', maxWidth: '640px', margin: '60px auto 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--glass-border), transparent)' }} />
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
            We stay lean so your budget goes into execution, not unnecessary overhead.
          </p>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--glass-border), transparent)' }} />
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 6% 100px' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(1,32,76,0.5),rgba(106,70,217,0.12))', border: '1px solid rgba(16,161,219,0.2)', borderRadius: '24px', padding: '60px 40px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>Let&apos;s Grow Together</h2>
          <p className="section-sub" style={{ margin: '0 auto 32px' }}>
            Whether you&apos;re launching your first business or scaling an established brand, we&apos;re here to help.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <a href={process.env.NEXT_PUBLIC_BOOKING_URL} target="_blank" rel="noopener" className="btn-primary">Book a Free Strategy Call</a>
            <a href="/contact" className="btn-secondary">Contact Us</a>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:900px){
          .about-grid{grid-template-columns:1fr!important}
          .about-sticky{position:static!important}
          .team-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  )
}
