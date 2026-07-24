'use client'
import PerformancePartnership from '@/components/pages/PerformancePartnership'
import Link from 'next/link'

export default function PartnershipPage() {
  return (
    <div style={{ paddingTop: '80px' }}>
      {/* HERO */}
      <section style={{ padding: '80px 6% 40px', textAlign: 'center' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg,var(--sky),var(--purple))', color: '#fff', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1.5px', padding: '6px 16px', borderRadius: '100px', textTransform: 'uppercase', marginBottom: '20px' }}>
          🔒 Invite-Only
        </span>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2.4rem, 5vw, 4rem)', letterSpacing: '-2px', lineHeight: 1.05, color: 'var(--white)', marginBottom: '20px' }}>
          Performance<br /><span className="grad">Partnership</span>
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(249,253,254,0.65)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.75, fontWeight: 300 }}>
          For select businesses ready to grow with a partner who&apos;s just as invested as they are. Skip the retainer. We win when you win.
        </p>
      </section>

      {/* The full performance partnership component with calculators */}
      <PerformancePartnership />

      {/* CTA */}
      <section style={{ padding: '40px 6% 100px' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(1,32,76,0.5),rgba(106,70,217,0.15))', border: '1px solid rgba(16,161,219,0.2)', borderRadius: '24px', padding: '60px 40px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>Think You&apos;re a Fit?</h2>
          <p className="section-sub" style={{ margin: '0 auto 32px' }}>
            Performance partnerships are reserved for businesses with clear traction and growth potential. Let&apos;s discuss if it&apos;s right for you.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <a href={process.env.NEXT_PUBLIC_BOOKING_URL} target="_blank" rel="noopener" className="btn-primary">Book a Discovery Call</a>
            <Link href="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
