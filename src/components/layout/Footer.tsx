'use client'
import Link from 'next/link'
import NewsletterForm from '@/components/ui/NewsletterForm'
import NewsletterForm from '@/components/ui/NewsletterForm'

export default function Footer() {
  return (
    <footer style={{ background: 'rgba(0,0,0,0.3)', borderTop: '1px solid var(--glass-border)', padding: '60px 6% 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1.4fr', gap: '40px', marginBottom: '48px' }} className="footer-grid">
        {/* Brand column */}
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem', marginBottom: '12px' }}>
            Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '260px' }}>
            We don&apos;t sell marketing. We build growth.
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', marginBottom: '24px' }}>
            {[
              { href: 'https://www.linkedin.com/company/yallagroww/', label: 'in' },
              { href: 'https://www.instagram.com/yallagrow_/', label: '◉' },
              { href: 'https://www.facebook.com/profile.php?id=61579169077154', label: 'f' },
            ].map(s => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener"
                style={{
                  width: '36px', height: '36px', borderRadius: '9px',
                  background: 'var(--glass)', border: '1px solid var(--glass-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', textDecoration: 'none',
                  fontSize: '0.7rem', fontWeight: 700, transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,161,219,0.3)'; e.currentTarget.style.color = 'var(--sky)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                {s.label}
              </a>
            ))}
          </div>
          
          {/* Newsletter signup */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '10px' }}>
              📬 Newsletter
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '12px' }}>
              Monthly marketing tips + real case studies. No spam.
            </p>
            <NewsletterForm source="footer" />
          </div>
        </div>

        {/* Services column */}
        <div>
          <h4 style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '16px' }}>Services</h4>
          {[
            ['Marketing Strategy', '/services/strategy'],
            ['Social Media', '/services/social'],
            ['Paid Advertising', '/services/ads'],
            ['Branding', '/services/branding'],
            ['Content Creation', '/services/content'],
            ['Copywriting', '/services/copy'],
            ['Web Development', '/services/web'],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              style={{
                display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)',
                textDecoration: 'none', marginBottom: '8px', transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Pages column */}
        <div>
          <h4 style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '16px' }}>Pages</h4>
          {[
            ['Home', '/'],
            ['About', '/about'],
            ['Packages', '/packages'],
            ['Blog', '/blog'],
            ['Careers', '/careers'],
            ['Affiliate', '/affiliate'],
            ['Privacy', '/privacy'],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              style={{
                display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)',
                textDecoration: 'none', marginBottom: '8px', transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Contact column */}
        <div>
          <h4 style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '16px' }}>Contact</h4>
          <a
            href="https://wa.me/447376441603"
            target="_blank"
            rel="noopener"
            style={{
              display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)',
              textDecoration: 'none', marginBottom: '8px', transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            WhatsApp
          </a>
          <a
            href="mailto:info@yallagrow.net"
            style={{
              display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)',
              textDecoration: 'none', marginBottom: '8px', transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            info@yallagrow.net
          </a>
          <Link
            href="/contact"
            style={{ display: 'block', fontSize: '0.78rem', color: 'var(--sky)', textDecoration: 'none', marginBottom: '8px' }}
          >
            Contact Form →
          </Link>
        </div>

        {/* Newsletter column */}
        <div>
          <h4 style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '16px' }}>Newsletter</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px', fontWeight: 300 }}>
            Monthly growth tips for Lebanese businesses. No fluff, no spam.
          </p>
          <NewsletterForm source="footer" />
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid var(--glass-border)', paddingTop: '24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '8px',
      }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
          © 2025 YallaGrow Marketing Agency · All rights reserved.
        </p>
        <Link href="/privacy" style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textDecoration: 'none' }}>
          Privacy Policy
        </Link>
      </div>

      <style>{`
        @media(max-width:1100px){
          .footer-grid{grid-template-columns:1fr 1fr 1fr!important;gap:32px!important}
        }
        @media(max-width:768px){
          .footer-grid{grid-template-columns:1fr 1fr!important}
        }
        @media(max-width:500px){
          .footer-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </footer>
  )
}
