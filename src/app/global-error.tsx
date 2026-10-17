// src/app/global-error.tsx
'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Global Error]', error)
    console.error('[Message]', error.message)
    console.error('[Stack]', error.stack)
    if (error.digest) console.error('[Digest]', error.digest)
  }, [error])

  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: 0,
        background: '#060c14',
        color: '#f9fdfe',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ maxWidth: '500px', padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ color: '#ff8c42', marginBottom: '20px', display: 'inline-flex' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>

          <h1 style={{
            fontWeight: 800,
            fontSize: '1.6rem',
            marginBottom: '12px',
            letterSpacing: '-0.5px',
          }}>
            Something went wrong
          </h1>

          <p style={{
            fontSize: '0.95rem',
            color: 'rgba(249,253,254,0.7)',
            lineHeight: 1.7,
            marginBottom: '28px',
            fontWeight: 300,
          }}>
            The page couldn&apos;t load. Try reloading. If it keeps happening, let us know.
          </p>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
            <button
              onClick={() => reset()}
              style={{
                background: '#10a1db',
                color: '#080f1a',
                padding: '12px 28px',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                background: 'transparent',
                color: 'rgba(249,253,254,0.7)',
                padding: '12px 28px',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: 500,
                border: '1px solid rgba(249,253,254,0.1)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Back to Home
            </a>
          </div>

          {error.message && (
            <details style={{
              padding: '16px 18px',
              background: 'rgba(255,77,77,0.05)',
              border: '1px solid rgba(255,77,77,0.15)',
              borderRadius: '10px',
              textAlign: 'left',
            }}>
              <summary style={{
                fontSize: '0.78rem',
                color: 'rgba(249,253,254,0.5)',
                cursor: 'pointer',
                fontWeight: 600,
              }}>
                Technical details (for debugging)
              </summary>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(249,253,254,0.6)',
                marginTop: '12px',
                fontFamily: 'monospace',
                wordBreak: 'break-word',
                lineHeight: 1.6,
              }}>
                <div><strong>Message:</strong> {error.message}</div>
                {error.digest && <div style={{ marginTop: '8px' }}><strong>Digest:</strong> {error.digest}</div>}
                {error.stack && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>Stack:</strong>
                    <pre style={{ fontSize: '0.68rem', marginTop: '4px', whiteSpace: 'pre-wrap', color: 'rgba(249,253,254,0.5)' }}>
                      {error.stack.split('\n').slice(0, 10).join('\n')}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          <p style={{
            fontSize: '0.75rem',
            color: 'rgba(249,253,254,0.3)',
            marginTop: '24px',
          }}>
            Need help? <a href="https://wa.me/447376441603" target="_blank" rel="noopener" style={{ color: '#10a1db' }}>WhatsApp us →</a>
          </p>
        </div>
      </body>
    </html>
  )
}
