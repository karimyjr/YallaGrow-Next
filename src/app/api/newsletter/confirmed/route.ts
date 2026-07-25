'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ConfirmedContent() {
  const params = useSearchParams()
  const status = params.get('status')

  const config = {
    success: {
      icon: '🎉',
      title: 'Subscription confirmed!',
      message: "You're all set. Check your inbox — we just sent you a welcome email with everything you need to know.",
      color: '#16db64',
    },
    already: {
      icon: '✓',
      title: "You're already subscribed",
      message: 'Your email is already confirmed and on our list. Nothing more to do!',
      color: '#10a1db',
    },
    invalid: {
      icon: '⚠️',
      title: 'Invalid or expired link',
      message: 'This confirmation link is invalid or has already been used. Try subscribing again.',
      color: '#ffc107',
    },
    error: {
      icon: '❌',
      title: 'Something went wrong',
      message: "We couldn't process your confirmation. Please try again or contact us.",
      color: '#ff4d4d',
    },
  }[status || 'success'] || {
    icon: '❓',
    title: 'Unknown status',
    message: "We're not sure what happened. Please try again.",
    color: '#ff4d4d',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
      <div style={{ maxWidth: '480px', textAlign: 'center' }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '20px',
        }}>{config.icon}</div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          color: 'var(--white)',
          letterSpacing: '-0.5px',
          lineHeight: 1.2,
          marginBottom: '16px',
        }}>
          {config.title}
        </h1>

        <p style={{
          fontSize: '1rem',
          color: 'rgba(249,253,254,0.65)',
          lineHeight: 1.7,
          fontWeight: 300,
          marginBottom: '32px',
        }}>
          {config.message}
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary">← Back to Home</Link>
          <Link href="/blog" className="btn-secondary">Read Our Blog</Link>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmedPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <ConfirmedContent />
    </Suspense>
  )
}
