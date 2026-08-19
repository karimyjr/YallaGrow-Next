'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useToast } from '@/components/ui/Toast'

export default function ContactPage() {
  const { showToast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async () => {
    if (!form.name || !form.email || !form.message) {
      showToast('Please fill in your name, email, and message.', 'error')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      showToast('Please enter a valid email address.', 'error')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/submissions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSent(true)
      } else {
        showToast('Failed to send. Please try again.', 'error')
      }
    } catch {
      showToast('Network error. Please try again.', 'error')
    }
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(249,253,254,0.03)',
    border: '1px solid var(--glass-border)',
    borderRadius: '10px',
    padding: '12px 14px',
    color: 'var(--white)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.88rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* HERO */}
      <section style={{ padding: '80px 6% 40px', textAlign: 'center' }}>
        <span className="eyebrow" style={{ marginBottom: '12px' }}>Get in Touch</span>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(2.4rem,5vw,4rem)', letterSpacing: '-2px', lineHeight: 1.05, color: 'var(--white)', marginTop: '12px' }}>
          Let&apos;s Start a<br /><span className="grad">Conversation</span>
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '520px', margin: '20px auto 0', lineHeight: 1.7, fontWeight: 300 }}>
          Whether you have a question, want to book a call, or just want to say hi — we&apos;re here.
        </p>
      </section>

      {/* CONTENT */}
      <section style={{ padding: '40px 6% 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1100px', margin: '0 auto', alignItems: 'start' }} className="contact-grid">
          {/* Left — Contact options */}
          <div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--white)', letterSpacing: '-0.5px', marginBottom: '20px' }}>
              Reach us directly
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '28px' }}>
              Prefer to skip the form? Pick the option that works best for you.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {[
                { icon: '💬', title: 'WhatsApp', desc: 'Fastest reply — usually within the hour', href: 'https://wa.me/447376441603', cta: 'Chat now →' },
                { icon: '📧', title: 'Email', desc: 'We respond to all emails within 24 hours', href: 'mailto:info@yallagrow.net', cta: 'info@yallagrow.net' },
                { icon: '📅', title: 'Book a call', desc: 'Free 30-min strategy session — no commitment', href: process.env.NEXT_PUBLIC_BOOKING_URL || 'https://calendar.app.google/3WibM5kWvizhnHJt8', cta: 'Pick a time →' },
              ].map(item => (
                <a
                  key={item.title}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener' : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    background: 'var(--glass)', border: '1px solid var(--glass-border)',
                    borderRadius: '14px', padding: '18px 20px', textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,161,219,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'none' }}
                >
                  <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--white)', marginBottom: '4px' }}>{item.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{item.desc}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--sky)', fontWeight: 600 }}>{item.cta}</div>
                  </div>
                </a>
              ))}
            </div>

            <div style={{ background: 'rgba(16,161,219,0.04)', border: '1px solid rgba(16,161,219,0.15)', borderRadius: '12px', padding: '16px 18px' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: 'var(--white)', marginBottom: '6px' }}>
                📍 Based in Lebanon
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                Working with clients globally. Fully remote-friendly.
              </p>
            </div>
          </div>

          {/* Right — Form */}
          <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '32px' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.3rem', color: 'var(--white)', marginBottom: '10px' }}>Message sent!</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  We&apos;ll get back to you within 24 hours. Check your inbox!
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--white)', marginBottom: '20px' }}>Send us a message</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }} className="form-row">
                  <input placeholder="Your Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                  <input placeholder="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                </div>

                <input placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={{ ...inputStyle, marginBottom: '12px' }} />
                <textarea placeholder="Your message... *" rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, resize: 'vertical', marginBottom: '16px' }} />

                <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '14px' }}>
                  By submitting, you agree to our <Link href="/privacy" style={{ color: 'var(--sky)' }}>Privacy Policy</Link>.
                </p>

                <button onClick={submit} disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {loading ? 'Sending...' : 'Send Message →'}
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:900px){
          .contact-grid{grid-template-columns:1fr!important}
          .form-row{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  )
}
