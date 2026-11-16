// src/app/not-found.tsx
// The 404 page: interactive spider-web canvas sits behind the content.
// Move the cursor through the web and it flexes — spring-damper physics
// on every node, cursor repulsion within an interaction radius.
import Link from 'next/link'
import SpiderWeb from '@/components/ui/SpiderWeb'

export const metadata = {
  title: 'Page Not Found',
  description: "The page you're looking for doesn't exist.",
}

export default function NotFound() {
  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      background: 'var(--dark2)',
      overflow: 'hidden',
    }}>
      {/* Interactive spider web — absolute, pointer-events:none, behind content */}
      <SpiderWeb />

      <div style={{
        maxWidth: '560px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Giant 404 */}
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(6rem, 20vw, 11rem)',
          lineHeight: 0.9,
          letterSpacing: '-6px',
          background: 'linear-gradient(135deg, var(--sky), var(--purple))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '20px',
          opacity: 0.95,
          textShadow: '0 0 60px rgba(16,161,219,0.25)',
        }}>
          404
        </div>

        <span className="eyebrow" style={{ marginBottom: '14px' }}>Caught in the Web</span>

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          color: 'var(--white)',
          letterSpacing: '-1px',
          lineHeight: 1.15,
          marginTop: '12px',
          marginBottom: '16px',
        }}>
          This page doesn&apos;t exist.
        </h1>

        <p style={{
          fontSize: '0.95rem',
          color: 'rgba(249,253,254,0.7)',
          lineHeight: 1.7,
          fontWeight: 300,
          marginBottom: '36px',
          maxWidth: '420px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Either the link is broken, or whatever you were looking for has moved. Move your cursor through the web, then let&apos;s get you back on track.
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
          <Link href="/" className="btn-primary">← Back to Home</Link>
          <Link href="/packages" className="btn-secondary">Browse Packages</Link>
        </div>

        {/* Quick links */}
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          paddingTop: '28px',
          borderTop: '1px solid var(--glass-border)',
        }}>
          {[
            { href: '/services', label: 'Services' },
            { href: '/about', label: 'About' },
            { href: '/blog', label: 'Blog' },
            { href: '/contact', label: 'Contact' },
          ].map(l => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
