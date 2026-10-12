// src/app/affiliate/dashboard/error.tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log full error to browser console for debugging
    console.error('Dashboard error:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    if (error.digest) console.error('Error digest:', error.digest)
  }, [error])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--dark2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      zIndex: 1000,
    }}>
      <div style={{ maxWidth: '480px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: '1.6rem',
          color: 'var(--white)',
          marginBottom: '12px',
          letterSpacing: '-0.5px',
        }}>
          Something went wrong
        </h1>

        <p style={{
          fontSize: '0.9rem',
          color: 'rgba(249,253,254,0.7)',
          lineHeight: 1.7,
          fontWeight: 300,
          marginBottom: '28px',
        }}>
          The dashboard couldn&apos;t load. This is likely a temporary issue — try reloading. If it keeps happening, let us know.
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
          <button
            onClick={() => reset()}
            className="btn-primary"
          >
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>

        {/* Debug details — only shown if error message exists */}
        {error.message && (
          <details style={{
            marginTop: '20px',
            padding: '14px 16px',
            background: 'rgba(255,77,77,0.05)',
            border: '1px solid rgba(255,77,77,0.15)',
            borderRadius: '10px',
            textAlign: 'left',
          }}>
            <summary style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 600,
            }}>
              Technical details (for debugging)
            </summary>
            <div style={{
              fontSize: '0.72rem',
              color: 'rgba(249,253,254,0.5)',
              marginTop: '10px',
              fontFamily: 'monospace',
              wordBreak: 'break-word',
              lineHeight: 1.6,
            }}>
              <div><strong>Message:</strong> {error.message}</div>
              {error.digest && <div style={{ marginTop: '6px' }}><strong>Digest:</strong> {error.digest}</div>}
            </div>
          </details>
        )}

        <p style={{
          fontSize: '0.72rem',
          color: 'var(--text-dim)',
          marginTop: '24px',
        }}>
          Need help? <a href="https://wa.me/447376441603" target="_blank" rel="noopener" style={{ color: 'var(--sky)' }}>Message us on WhatsApp →</a>
        </p>
      </div>
    </div>
  )
}
