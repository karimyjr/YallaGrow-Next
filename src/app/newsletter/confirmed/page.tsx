'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Icon } from '@/components/ui/Icons'

type IconKey = 'check' | 'alert' | 'close' | 'help'

function ConfirmedContent() {
  const params = useSearchParams()
  const status = params.get('status')

  const config: { icon: IconKey; title: string; message: string; color: string } = ({
    success: {
      icon: 'check' as const,
      title: 'Subscription confirmed!',
      message: "You're all set. Check your inbox — we just sent you a welcome email with everything you need to know.",
      color: '#16db64',
    },
    already: {
      icon: 'check' as const,
      title: "You're already subscribed",
      message: 'Your email is already confirmed and on our list. Nothing more to do.',
      color: '#10a1db',
    },
    invalid: {
      icon: 'alert' as const,
      title: 'Invalid or expired link',
      message: 'This confirmation link is invalid or has already been used. Try subscribing again.',
      color: '#ffc107',
    },
    error: {
      icon: 'close' as const,
      title: 'Something went wrong',
      message: "We couldn't process your confirmation. Please try again or contact us.",
      color: '#ff4d4d',
    },
  } as Record<string, { icon: IconKey; title: string; message: string; color: string }>)[status || 'success'] || {
    icon: 'help' as const,
    title: 'Unknown status',
    message: "We're not sure what happened. Please try again.",
    color: '#ff4d4d',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
      <div style={{ maxWidth: '480px', textAlign: 'center' }}>
        <div style={{
          color: config.color,
          marginBottom: '20px',
          display: 'inline-flex',
        }}><Icon name={config.icon} size={64} /></div>

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
