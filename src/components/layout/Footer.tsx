'use client'

export default function Footer() {
  return (
    <footer style={{ background: 'rgba(0,0,0,0.3)', borderTop: '1px solid var(--glass-border)', padding: '60px 6% 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem', marginBottom: '12px' }}>
            Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '260px' }}>
            We don't sell marketing. We build growth.
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '16px' }}>Services</h4>
        </div>
        <div>
          <h4 style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '16px' }}>Pages</h4>
        </div>
        <div>
          <h4 style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '16px' }}>Contact</h4>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px' }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>© 2025 YallaGrow Marketing Agency · All rights reserved.</p>
      </div>
    </footer>
  )
}
