'use client'
import Link from 'next/link'

export default function PricingCTASection() {
  return (
    <section style={{padding:'100px 6%',textAlign:'center'}}>
      <span className="eyebrow" style={{marginBottom:'12px'}}>Pricing</span>
      <h2 className="section-title" style={{margin:'12px auto 16px',maxWidth:'520px'}}>Not Sure Which Plan<br/>Is Right for You?</h2>
      <p className="section-sub" style={{margin:'0 auto 36px'}}>Answer 6 quick questions and get a personalized plan in under 2 minutes.</p>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'12px'}}>
        <Link href="/quiz" className="btn-primary" style={{fontSize:'1rem',padding:'16px 40px'}}>Find My Growth Plan →</Link>
        <Link href="/packages" className="btn-secondary" style={{fontSize:'0.82rem'}}>Or browse all packages</Link>
      </div>
    </section>
  )
}
