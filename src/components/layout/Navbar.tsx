'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services', hasDropdown: true },
  { href: '/packages', label: 'Packages' },
  { href: '/quiz', label: 'Find My Plan ✦', highlight: true },
  { href: '/about', label: 'About', hideMd: true },
  { href: '/blog', label: 'Blog', hideMd: true },
  { href: '/careers', label: 'Careers', hideMd: true },
  { href: '/contact', label: 'Contact' },
]

const SERVICES = [
  { href: '/services', label: 'Marketing Strategy', desc: 'Research, positioning & roadmap', icon: '🎯' },
  { href: '/services', label: 'Social Media', desc: 'Full account management', icon: '📱' },
  { href: '/services', label: 'Paid Advertising', desc: 'Meta & Google campaigns', icon: '💰' },
  { href: '/services', label: 'Branding', desc: 'Identity & visual design', icon: '🎨' },
  { href: '/services', label: 'Content Creation', desc: 'Reels, posts & carousels', icon: '🎬' },
  { href: '/services', label: 'Copywriting', desc: 'Captions, ads & landing pages', icon: '✍️' },
  { href: '/services', label: 'Website Development', desc: 'Fast, conversion-focused sites', icon: '🌐' },
  { href: '/services', label: 'Analytics & Reporting', desc: 'Performance & insights', icon: '📊' },
  { href: '/services', label: 'Consulting', desc: '1-on-1 strategy sessions', icon: '🧠' },
]

const SERVICES_WITH_KEYS = SERVICES.map((s, i) => ({ ...s, key: `service-${i}` }))

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
        padding: scrolled ? '10px 4%' : '16px 4%',
        display: 'grid', gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center', gap: '8px',
        background: scrolled ? 'rgba(6,12,20,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--glass-border)' : 'none',
        transition: 'all 0.5s var(--transition)',
      }}>
        {/* Logo */}
        <Link href="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--white)', textDecoration: 'none', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
          Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
        </Link>

        {/* Desktop links */}
        <ul style={{ display: 'flex', gap: 0, listStyle: 'none', justifyContent: 'center', alignItems: 'center' }}>
          {NAV_LINKS.map(link => (
            <li key={link.href} style={{ position: 'relative' }}
              onMouseEnter={() => link.hasDropdown && setServicesOpen(true)}
              onMouseLeave={() => link.hasDropdown && setServicesOpen(false)}>
              <Link href={link.href} style={{
                textDecoration: 'none',
                color: link.highlight ? 'var(--sky)' : pathname === link.href ? 'var(--white)' : 'var(--text-muted)',
                fontSize: '0.68rem', fontWeight: 500, padding: '6px 7px',
                borderRadius: '7px', display: 'block', whiteSpace: 'nowrap',
                background: pathname === link.href ? 'var(--glass)' : 'transparent',
              }}>
                {link.label} {link.hasDropdown && <span style={{ fontSize: '0.5rem' }}>▼</span>}
              </Link>

              {/* Mega menu */}
              {link.hasDropdown && servicesOpen && (
                <div style={{
                  position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                  background: 'rgba(6,12,20,0.98)', border: '1px solid var(--glass-border)',
                  borderRadius: '16px', padding: '16px', marginTop: '8px',
                  display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '4px',
                  width: '560px', backdropFilter: 'blur(24px)', zIndex: 600,
                }}>
                  {SERVICES_WITH_KEYS.map(s => (
                    <Link key={s.key} href={s.href} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px', borderRadius: '10px', textDecoration: 'none',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--glass)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <span style={{ fontSize: '1.1rem', width: '28px', textAlign: 'center' }}>{s.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--white)' }}>{s.label}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>{s.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href={process.env.NEXT_PUBLIC_BOOKING_URL || '#'} target="_blank"
            style={{ background: 'transparent', border: '1px solid rgba(16,161,219,0.35)', color: 'var(--sky)', padding: '7px 12px', borderRadius: '8px', fontSize: '0.68rem', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Book a Call
          </Link>
          {/* Hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: 'none', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
            className="hamburger-btn">
            <span style={{ width: '22px', height: '1.5px', background: 'var(--white)', display: 'block' }} />
            <span style={{ width: '22px', height: '1.5px', background: 'var(--white)', display: 'block' }} />
            <span style={{ width: '22px', height: '1.5px', background: 'var(--white)', display: 'block' }} />
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 490,
          background: 'rgba(4,8,16,0.99)', backdropFilter: 'blur(32px)',
          display: 'flex', flexDirection: 'column', padding: '80px 6% 40px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '32px' }}>
            {[...NAV_LINKS, { href: '/affiliate', label: 'Affiliates ✦', highlight: true }].map(link => (
              <Link key={link.href} href={link.href}
                style={{
                  fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 800,
                  color: link.highlight ? 'var(--sky)' : 'rgba(249,253,254,0.4)',
                  textDecoration: 'none', padding: '10px 0',
                  borderBottom: '1px solid rgba(249,253,254,0.04)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                {link.label} <span style={{ fontSize: '1rem', color: 'var(--sky)', opacity: 0.6 }}>→</span>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href={process.env.NEXT_PUBLIC_BOOKING_URL || '#'} target="_blank" className="btn-primary" style={{ textAlign: 'center', width: '100%' }}>
              Book a Free Strategy Call →
            </Link>
            <Link href="/quiz" className="btn-secondary" style={{ textAlign: 'center', width: '100%' }}>
              Find My Growth Plan
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:1200px){ .hamburger-btn{display:flex!important} }
        @media(max-width:720px){ nav ul{display:none!important} }
      `}</style>
    </>
  )
}
