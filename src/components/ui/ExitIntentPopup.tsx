'use client'
import { useState, useEffect } from 'react'
import NewsletterForm from './NewsletterForm'

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem('yg_exit_popup_shown')) {
      setDismissed(true)
      return
    }

    // Don't show on admin/dashboard/etc
    const path = window.location.pathname
    if (
      path.startsWith('/admin') ||
      path.startsWith('/affiliate/dashboard')
    ) {
      setDismissed(true)
      return
    }

    let timeoutId: NodeJS.Timeout
    let hasScrolled = false

    const handleScroll = () => {
      if (window.scrollY > 200) {
        hasScrolled = true
      }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving through top edge
      if (e.clientY < 0 && hasScrolled && !sessionStorage.getItem('yg_exit_popup_shown')) {
        setShow(true)
        sessionStorage.setItem('yg_exit_popup_shown', '1')
      }
    }

    // For mobile: trigger after 45 seconds of inactivity
    const startInactivityTimer = () => {
      timeoutId = setTimeout(() => {
        if (hasScrolled && !sessionStorage.getItem('yg_exit_popup_shown')) {
          setShow(true)
          sessionStorage.setItem('yg_exit_popup_shown', '1')
        }
      }, 45000)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    startInactivityTimer()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  const close = () => {
    setShow(false)
    setDismissed(true)
  }

  if (dismissed || !show) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 10001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={close}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(6,12,20,0.98), rgba(1,32,76,0.4))',
          border: '1px solid rgba(16,161,219,0.3)',
          borderRadius: '24px',
          padding: '40px 36px',
          maxWidth: '480px',
          width: '100%',
          position: 'relative',
          animation: 'popupIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Close button */}
        <button
          onClick={close}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            e.currentTarget.style.color = 'var(--white)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text-muted)'
          }}
        >✕</button>

        {/* Icon */}
        <div style={{
          width: '60px', height: '60px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, var(--sky), var(--purple))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem',
          marginBottom: '20px',
        }}>📬</div>

        {/* Headline */}
        <h2 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: '1.6rem',
          color: 'var(--white)',
          letterSpacing: '-0.5px',
          lineHeight: 1.2,
          marginBottom: '10px',
        }}>
          Wait — before you go!
        </h2>

        <p style={{
          fontSize: '0.92rem',
          color: 'rgba(249,253,254,0.7)',
          lineHeight: 1.65,
          fontWeight: 300,
          marginBottom: '24px',
        }}>
          Get our <strong style={{ color: 'var(--sky)' }}>free monthly marketing playbook</strong> — actionable tips, real case studies, and strategies you can apply to your business today.
        </p>

        {/* Benefits */}
        <div style={{
          background: 'rgba(16,161,219,0.05)',
          border: '1px solid rgba(16,161,219,0.15)',
          borderRadius: '12px',
          padding: '14px 16px',
          marginBottom: '20px',
        }}>
          {[
            'Weekly marketing insights',
            'Real client case studies',
            'Free resources & templates',
            'No spam — unsubscribe anytime',
          ].map(b => (
            <div key={b} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.8rem',
              color: 'rgba(249,253,254,0.75)',
              padding: '4px 0',
            }}>
              <span style={{ color: 'var(--sky)', fontWeight: 700 }}>✓</span>
              {b}
            </div>
          ))}
        </div>

        {/* Form */}
        <NewsletterForm source="exit-intent" />

        <p style={{
          fontSize: '0.7rem',
          color: 'var(--text-dim)',
          textAlign: 'center',
          marginTop: '14px',
        }}>
          Join 500+ Lebanese business owners already growing with us
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popupIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
