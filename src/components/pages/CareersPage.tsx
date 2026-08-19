'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useToast } from '@/components/ui/Toast'

const CULTURE = [
  { icon: '🚀', title: 'Move fast', desc: "No bureaucracy. You'll ship real work for real clients from day one." },
  { icon: '🎯', title: 'Own your work', desc: 'We give you responsibility, not micromanagement. Results matter more than hours.' },
  { icon: '📈', title: 'Grow with us', desc: "We're building something real. The earlier you join, the more you shape it." },
  { icon: '🤝', title: 'Honest environment', desc: 'Direct feedback, transparent decisions, no corporate politics.' },
]

interface Job {
  title: string
  icon: string
  status: string
  statusColor: 'closed' | 'open'
  iconBg: string
  iconBorder: string
  location: string
  type: string
  desc: string
  responsibilities: string[]
  requirements?: string[]
  closed?: boolean
}

const JOBS: Job[] = [
  {
    title: 'CEO / Founder',
    icon: '👤',
    status: 'Leadership — Not Open',
    statusColor: 'closed',
    iconBg: 'rgba(249,253,254,0.04)',
    iconBorder: 'var(--glass-border)',
    location: '🏢 YallaGrow HQ',
    type: 'Full-time',
    desc: "Listed for transparency. This role is not open for applications — it exists to show you who's running the ship and how we think about leadership.",
    responsibilities: [
      'Strategy & direction',
      'Sales & client acquisition',
      'Business growth decisions',
      'Client relationships',
    ],
    closed: true,
  },
  {
    title: 'Designer / Content Creator',
    icon: '🎨',
    status: 'Open Position',
    statusColor: 'open',
    iconBg: 'rgba(16,161,219,0.08)',
    iconBorder: 'rgba(16,161,219,0.15)',
    location: '📍 Lebanon / Remote',
    type: 'Full-time',
    desc: "We're looking for someone who can make brands look and feel premium. You'll work directly on client accounts — designing posts, building brand visuals, and producing short-form content that actually performs.",
    responsibilities: [
      'Create social media designs for client accounts',
      'Build brand visuals and identity assets',
      'Produce short-form content — Reels, TikTok visuals',
      'Maintain consistent visual identity across platforms',
    ],
    requirements: [
      'A strong creative eye — not just technical skills',
      'Comfortable with Canva, Photoshop, or similar',
      'You understand what performs on social media',
      'Portfolio or Instagram showing real work',
    ],
  },
  {
    title: 'Copywriter / Content Specialist',
    icon: '✍️',
    status: 'Open Position',
    statusColor: 'open',
    iconBg: 'rgba(106,70,217,0.08)',
    iconBorder: 'rgba(106,70,217,0.15)',
    location: '📍 Lebanon / Remote',
    type: 'Full-time',
    desc: "We're looking for someone who can write — not just content, but words that make people stop, read, and act. You'll write captions, ad copy, and messaging for real clients across different industries.",
    responsibilities: [
      'Write captions and social media copy',
      'Create ad copy, hooks, and CTAs',
      'Support content strategy across accounts',
      'Sharpen client messaging for conversions',
    ],
    requirements: [
      'You write clean, direct, persuasive copy',
      'You understand marketing tone — not just grammar',
      'Bilingual (Arabic/English) is a strong plus',
      'Examples of past work or personal projects',
    ],
  },
  {
    title: 'Freelance Media Buyer',
    icon: '📈',
    status: 'Open — Freelance / Part-time',
    statusColor: 'open',
    iconBg: 'rgba(37,135,197,0.08)',
    iconBorder: 'rgba(37,135,197,0.15)',
    location: '📍 Remote',
    type: 'Part-time / Freelance',
    desc: "Freelance opportunity for someone who knows how to run Meta Ads and get results. You'll manage ad campaigns for our clients — targeting, budgets, optimization — and be judged purely on performance.",
    responsibilities: [
      'Set up and manage Meta Ads campaigns',
      'Optimize for performance and ROAS',
      'Handle targeting, creative testing, and budgets',
      'Report results clearly and improve every month',
    ],
    requirements: [
      'Proven experience running Meta Ads',
      'You think in data, not just dashboards',
      'Results you can point to — ROAS, CPL, CPA',
      'Organized, reliable, works without hand-holding',
    ],
  },
]

export default function CareersPage() {
  const { showToast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '', portfolio: '', linkedin: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const scrollToApply = () => document.getElementById('applySection')?.scrollIntoView({ behavior: 'smooth' })

  const submit = async () => {
    if (!form.name || !form.email || !form.role) { showToast('Please fill in name, email, and role.', 'error'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/submissions/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSent(true)
      } else {
        showToast('Failed to submit. Please try again.', 'error')
      }
    } catch { showToast('Network error. Please try again.', 'error') }
    setLoading(false)
  }

  const inputStyle = { width: '100%', background: 'rgba(249,253,254,0.03)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '12px 14px', color: 'var(--white)', fontFamily: 'Inter,sans-serif', fontSize: '0.88rem', outline: 'none' } as React.CSSProperties

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* HERO */}
      <div style={{ padding: '80px 6% 60px', textAlign: 'center' }}>
        <span className="eyebrow" style={{ marginBottom: '12px' }}>Join the Team</span>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(2.4rem,5vw,4rem)', letterSpacing: '-2px', lineHeight: 1.05, marginTop: '12px', color: 'var(--white)' }}>
          Open Positions<br />at YallaGrow
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '520px', margin: '20px auto 0', lineHeight: 1.7, fontWeight: 300 }}>
          We&apos;re a small, execution-focused marketing agency based in Lebanon. We don&apos;t hire for titles — we hire for results. If you&apos;re good at what you do and want to work on real client projects, we want to hear from you.
        </p>

        {/* Stats bar */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0', marginTop: '32px', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '18px 28px' }} className="careers-stats-bar">
          {[
            { n: '3', l: 'Open roles' },
            { n: 'Lebanon', l: 'Based / Remote' },
            { n: 'Small', l: 'Tight-knit team' },
          ].map((s, i, arr) => (
            <div key={s.l} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ textAlign: 'center', padding: '0 24px' }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--white)', lineHeight: 1.2 }}>{s.n}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px' }}>{s.l}</div>
              </div>
              {i < arr.length - 1 && <div style={{ width: '1px', height: '36px', background: 'var(--glass-border)' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* CULTURE STRIP */}
      <section style={{ padding: '40px 6% 80px', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', maxWidth: '1100px', margin: '0 auto' }} className="culture-grid">
          {CULTURE.map(c => (
            <div key={c.title} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '24px', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,161,219,0.2)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'none' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '12px' }}>{c.icon}</div>
              <h4 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--white)', marginBottom: '8px' }}>{c.title}</h4>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 300 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POSITIONS */}
      <section style={{ padding: '80px 6%' }}>
        <div style={{ marginBottom: '48px', maxWidth: '1100px', margin: '0 auto 48px' }}>
          <span className="eyebrow" style={{ marginBottom: '12px' }}>Roles</span>
          <h2 className="section-title" style={{ marginTop: '12px' }}>Who We&apos;re Looking For</h2>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {JOBS.map((j, ji) => (
            <div key={j.title} style={{
              background: 'rgba(249,253,254,0.02)',
              border: '1px solid var(--glass-border)',
              borderRadius: '20px',
              padding: '32px',
              opacity: j.closed ? 0.6 : 1,
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { if (!j.closed) { e.currentTarget.style.borderColor = 'rgba(16,161,219,0.15)' } }}
              onMouseLeave={e => { if (!j.closed) e.currentTarget.style.borderColor = 'var(--glass-border)' }}>

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: j.iconBg, border: `1px solid ${j.iconBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                  {j.icon}
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: j.statusColor === 'open' ? '#16db64' : 'var(--text-dim)', marginBottom: '6px' }}>
                    {j.status}
                  </div>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.2rem', color: 'var(--white)', marginBottom: '6px' }}>{j.title}</h3>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{j.location}</span>
                    <span>{j.type}</span>
                  </div>
                </div>
                {!j.closed && (
                  <button onClick={scrollToApply} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.82rem', flexShrink: 0 }}>Apply →</button>
                )}
              </div>

              <p style={{ fontSize: '0.88rem', color: 'rgba(249,253,254,0.65)', lineHeight: 1.7, fontWeight: 300, marginBottom: j.responsibilities ? '24px' : 0 }}>
                {j.desc}
              </p>

              {/* Responsibilities + Requirements */}
              {j.responsibilities && (
                <div style={{ display: 'grid', gridTemplateColumns: j.requirements ? '1fr 1fr' : '1fr', gap: '32px' }} className="job-cols">
                  <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '12px' }}>
                      {j.requirements ? "What you'll do" : 'What this role covers'}
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {j.responsibilities.map(r => (
                        <li key={r} style={{ display: 'flex', gap: '10px', fontSize: '0.82rem', color: 'rgba(249,253,254,0.65)', lineHeight: 1.5, fontWeight: 300 }}>
                          <span style={{ color: 'var(--sky)', flexShrink: 0, fontWeight: 700 }}>→</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {j.requirements && (
                    <div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '12px' }}>
                        What we&apos;re looking for
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {j.requirements.map(r => (
                          <li key={r} style={{ display: 'flex', gap: '10px', fontSize: '0.82rem', color: 'rgba(249,253,254,0.65)', lineHeight: 1.5, fontWeight: 300 }}>
                            <span style={{ color: '#16db64', flexShrink: 0, fontWeight: 700 }}>✓</span>{r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* APPLY SECTION */}
      <section id="applySection" style={{ padding: '80px 6% 100px', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', maxWidth: '1100px', margin: '0 auto', alignItems: 'start' }} className="apply-grid">

          {/* Left */}
          <div>
            <span className="eyebrow" style={{ marginBottom: '12px' }}>Apply</span>
            <h2 className="section-title" style={{ marginTop: '12px', marginBottom: '16px' }}>Work With Us</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.75, fontWeight: 300, marginBottom: '32px' }}>
              No lengthy cover letters. No corporate forms. Just send your portfolio, past work, or a link to your Instagram / Behance — and tell us which role you&apos;re applying for.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: '📁', text: 'Portfolio or work samples' },
                { icon: '🔗', text: 'Instagram / Behance / LinkedIn' },
                { icon: '💬', text: "Which role you want & why you'd be a good fit" },
              ].map(i => (
                <div key={i.text} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{i.icon}</span>
                  <span style={{ fontSize: '0.82rem', color: 'rgba(249,253,254,0.75)' }}>{i.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '32px' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.3rem', color: 'var(--white)', marginBottom: '10px' }}>Application received.</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  We&apos;ll review your work and get back to you within a few days. No ghosting — we respond to every application.
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--white)', marginBottom: '20px' }}>Send Your Application</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <input placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                  <input placeholder="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <input placeholder="WhatsApp Number" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={{ ...inputStyle, color: form.role ? 'var(--white)' : 'var(--text-dim)' }}>
                    <option value="">Applying for... *</option>
                    <option>Designer / Content Creator</option>
                    <option>Copywriter / Content Specialist</option>
                    <option>Freelance Media Buyer</option>
                  </select>
                </div>
                <input placeholder="Portfolio / Instagram / Behance link" type="url" value={form.portfolio} onChange={e => setForm({ ...form, portfolio: e.target.value })} style={{ ...inputStyle, marginBottom: '12px' }} />
                <input placeholder="LinkedIn (optional)" type="url" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} style={{ ...inputStyle, marginBottom: '12px' }} />
                <textarea placeholder="Why you? Keep it short and real." rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, resize: 'vertical', marginBottom: '14px' }} />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '14px' }}>
                  By submitting, you agree to our <Link href="/privacy" style={{ color: 'var(--sky)' }}>Privacy Policy</Link>.
                </p>
                <button onClick={submit} disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {loading ? 'Sending...' : 'Send Application →'}
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:900px){
          .culture-grid{grid-template-columns:1fr 1fr!important}
          .job-cols{grid-template-columns:1fr!important}
          .apply-grid{grid-template-columns:1fr!important}
        }
        @media(max-width:600px){
          .culture-grid{grid-template-columns:1fr!important}
          .careers-stats-bar{flex-direction:column!important;gap:8px!important}
        }
      `}</style>
    </div>
  )
}
