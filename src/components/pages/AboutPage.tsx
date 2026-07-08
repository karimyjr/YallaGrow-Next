'use client'

export default function AboutPage() {
  return (
    <div style={{paddingTop:'80px'}}>
      <div style={{padding:'80px 6%'}}>
        <span className="eyebrow" style={{marginBottom:'12px'}}>About YallaGrow</span>
        <h1 className="section-title" style={{maxWidth:'640px',marginTop:'12px',marginBottom:'24px'}}>
          We Started YallaGrow<br/>Because We Were Frustrated
        </h1>
        <p style={{fontSize:'1rem',lineHeight:1.7,color:'var(--text-muted)',maxWidth:'600px',fontWeight:300,marginBottom:'60px'}}>
          Frustrated by agencies that overpromised and underdelivered. Frustrated by pricing that excluded small businesses. So we built something different.
        </p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'48px',maxWidth:'900px'}}>
          {[
            {title:'Our Mission',desc:'To make professional marketing accessible to every business — not just the ones with big budgets. We believe great marketing should generate real, measurable results.'},
            {title:'What Makes Us Different',desc:'We treat every client like a partner. No templates, no copy-paste strategies, no inflated retainers. Just strategy, creativity, and execution tailored to your business.'},
            {title:'No Copy-Paste Strategies',desc:'Every business is different. We take the time to understand your market, your audience, and your goals before we recommend anything.'},
            {title:'How We Work',desc:'Discovery → Strategy → Execution → Optimization. We move fast, communicate clearly, and focus on what actually moves the needle for your business.'},
          ].map(b=>(
            <div key={b.title}>
              <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'1.1rem',color:'var(--white)',marginBottom:'12px'}}>{b.title}</h3>
              <p style={{fontSize:'0.85rem',lineHeight:1.7,color:'var(--text-muted)',fontWeight:300}}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
