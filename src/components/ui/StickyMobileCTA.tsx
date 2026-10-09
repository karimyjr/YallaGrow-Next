// src/components/ui/StickyMobileCTA.tsx
'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const BOOKING_URL = 'https://calendar.app.google/3WibM5kWvizhnHJt8'

export default function StickyMobileCTA() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Hide on admin, dashboard, and the quiz/packages flows (they have their own CTAs)
  const hiddenPaths = ['/admin', '/affiliate/dashboard', '/newsletter/confirmed']
  const isHidden = hiddenPaths.some(p => pathname.startsWith(p))

  useEffect(() => {
    if (isHidden) return

    // Check if user dismissed this session
    if (sessionStorage.getItem('yg_sticky_dismissed') === '1') {
      setDismissed(true)
      return
    }

    const handleScroll = () => {
      // Show after scrolling 400px
      setVisible(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHidden, pathname])

  const close = () => {
    sessionStorage.setItem('yg_sticky_dismissed', '1')
    setDismissed(true)
  }

  if (isHidden || dismissed || !visible) return null

  return (
    <div
      className="sticky-mobile-cta"
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        right: '16px',
        zIndex: 9998,
        display: 'none',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(6,12,20,0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(16,161,219,0.3)',
        borderRadius: '14px',
        padding: '10px 10px 10px 16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,161,219,0.1)',
        animation: 'stickySlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 700,
          fontSize: '0.82rem',
          color: 'var(--white)',
          lineHeight: 1.2,
          marginBottom: '2px',
        }}>
          Ready to grow?
        </div>
        <div style={{
          fontSize: '0.68rem',
          color: 'var(--text-muted)',
          lineHeight: 1.3,
        }}>
          Free 30-min call. No commitment.
        </div>
      </div>

      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener"
        style={{
          background: 'linear-gradient(135deg, var(--sky), var(--purple))',
          color: '#fff',
          padding: '10px 18px',
          borderRadius: '10px',
          fontSize: '0.78rem',
          fontWeight: 700,
          textDecoration: 'none',
          fontFamily: 'Inter, sans-serif',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Book Call
      </a>

      <button
        onClick={close}
        aria-label="Dismiss"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-dim)',
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ✕
      </button>

      <style>{`
        @keyframes stickySlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .sticky-mobile-cta {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  )
}
