// src/app/thank-you/page.tsx
'use client'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

const BOOKING_URL = 'https://calendar.app.google/3WibM5kWvizhnHJt8'

interface ContentConfig {
  icon: string
  title: string
  message: string
  cta: string
  ctaSub: string
  ctaHref: string
}

function ThankYouContent() {
  const params = useSearchParams()
  const type = params.get('type') || 'contact'
  const [confetti, setConfetti] = useState(false)

  useEffect(() => {
    setTimeout(() => setConfetti(true), 300)
  }, [])

  const configs: Record<string, ContentConfig> = {
    package: {
      icon: '📦',
      title: 'Package request received!',
      message: "We got the details of your custom package. We'll review it and reach out within 24 hours to lock in your free strategy call.",
      cta: 'Book Your Strategy Call Now',
      ctaSub: "Don't wait — grab a time that works for you.",
      ctaHref: BOOKING_URL,
    },
    contact: {
      icon: '💬',
      title: 'Message received!',
      message: "Thanks for reaching out. We respond to every message within 24 hours — usually much faster. Keep an eye on your inbox.",
      cta: 'Explore Our Packages',
      ctaSub: 'See what we can build together.',
      ctaHref: '/packages',
    },
    career: {
      icon: '💼',
      title: 'Application received!',
      message: "Thanks for applying to join the YallaGrow team. We review every application personally and will get back to you within 3-5 business days.",
      cta: 'Learn More About Us',
      ctaSub: 'See what makes YallaGrow tick.',
      ctaHref: '/about',
    },
    newsletter: {
      icon: '📬',
      title: "You're on the list!",
      message: "Check your inbox for a confirmation email. Click the link inside to officially join the YallaGrow newsletter.",
      cta: 'Read Our Blog',
      ctaSub: 'Jump into some insights while you wait.',
      ctaHref: '/blog',
    },
    default: {
      icon: '✓',
      title: 'All done!',
      message: "We've received your submission and will get back to you soon.",
      cta: 'Back to Home',
      ctaSub: '',
      ctaHref: '/',
    },
  }

  const content: ContentConfig = configs[type] || configs.default
  const isExternal = content.ctaHref === BOOKING_URL

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(16,161,219,0.08), transparent 60%)',
        pointerEvents: 'none',
      }} />

      {confetti && [...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: i % 2 === 0 ? 'var(--sky)' : 'var(--purple)',
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            opacity: 0.4,
            animation: `floatUp ${3 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`,
          }}
        />
      ))}

      <div style={{ maxWidth: '520px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: '96px',
          height: '96px',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, rgba(16,161,219,0.15), rgba(106,70,217,0.08))',
          border: '1px solid rgba(16,161,219,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.6rem',
          margin: '0 auto 28px',
          animation: 'bounceIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 10px 40px rgba(16,161,219,0.15)',
        }}>
          {content.icon}
        </div>

        <span className="eyebrow" style={{ marginBottom: '14px' }}>Success</span>

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
          color: 'var(--white)',
          letterSpacing: '-1px',
          lineHeight: 1.15,
          marginTop: '14px',
          marginBottom: '18px',
        }}>
          {content.title}
        </h1>

        <p style={{
          fontSize: '1rem',
          color: 'rgba(249,253,254,0.7)',
          lineHeight: 1.75,
          fontWeight: 300,
          marginBottom: '36px',
        }}>
          {content.message}
        </p>

        <div style={{
          background: 'linear-gradient(135deg, rgba(1,32,76,0.5), rgba(16,161,219,0.1))',
          border: '1px solid rgba(16,161,219,0.25)',
          borderRadius: '20px',
          padding: '28px 24px',
          marginBottom: '24px',
        }}>
          {content.ctaSub && (
            <p style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              marginBottom: '14px',
              lineHeight: 1.5,
            }}>
              {content.ctaSub}
            </p>
          )}
          {isExternal ? (
            <a href={content.ctaHref} target="_blank" rel="noopener" className="btn-primary" style={{ fontSize: '0.92rem' }}>
              {content.cta} →
            </a>
          ) : (
            <Link href={content.ctaHref} className="btn-primary" style={{ fontSize: '0.92rem' }}>
              {content.cta} →
            </Link>
          )}
        </div>

        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          fontWeight: 500,
        }}>
          ← Back to Home
        </Link>
      </div>

      <style>{`
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.5); }
          60% { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-30px); opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <ThankYouContent />
    </Suspense>
  )
}
