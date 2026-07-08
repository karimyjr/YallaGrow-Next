'use client'

export default function CTABlock() {
  return (
    <section style={{padding:'0 6% 100px'}}>
      <div style={{background:'linear-gradient(135deg,rgba(1,32,76,0.4),rgba(106,70,217,0.15))',border:'1px solid rgba(16,161,219,0.15)',borderRadius:'24px',padding:'60px',textAlign:'center'}}>
        <h2 className="section-title" style={{marginBottom:'16px'}}>Ready to Build Something<br/>People Remember?</h2>
        <p className="section-sub" style={{margin:'0 auto 32px'}}>Let&apos;s build a marketing system that actually moves your business forward.</p>
        <div style={{display:'flex',justifyContent:'center',gap:'12px',flexWrap:'wrap'}}>
          <a href={process.env.NEXT_PUBLIC_BOOKING_URL} target="_blank" rel="noopener" className="btn-primary">Book a Free Call</a>
          <a href="https://wa.me/447376441603" target="_blank" rel="noopener" className="btn-secondary">WhatsApp Us</a>
        </div>
      </div>
    </section>
  )
}
