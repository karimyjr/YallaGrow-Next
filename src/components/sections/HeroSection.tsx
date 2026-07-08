'use client'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section style={{minHeight:'100vh',display:'flex',alignItems:'center',padding:'120px 6% 80px',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 60% at 30% 50%,rgba(16,161,219,0.06) 0%,transparent 60%)',pointerEvents:'none'}}/>
      <div style={{maxWidth:'700px',position:'relative',zIndex:1}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:'8px',marginBottom:'24px'}}>
          <div style={{width:'7px',height:'7px',borderRadius:'50%',background:'var(--sky)'}}/>
          <span style={{fontSize:'0.72rem',fontWeight:600,color:'var(--sky)',letterSpacing:'1px'}}>Growth Marketing Agency · Lebanon</span>
        </div>
        <h1 style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'clamp(2.8rem,6vw,5rem)',letterSpacing:'-3px',lineHeight:1.05,marginBottom:'24px',color:'var(--white)'}}>
          We Don&apos;t Sell<br/>Marketing.<br/>We Build <span className="grad">Growth.</span>
        </h1>
        <p style={{fontSize:'1rem',lineHeight:1.7,color:'var(--text-muted)',maxWidth:'520px',fontWeight:300,marginBottom:'36px'}}>
          Strategy, social media, paid ads, and content — built for startups and small businesses ready to grow.
        </p>
        <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
          <a href={process.env.NEXT_PUBLIC_BOOKING_URL} target="_blank" rel="noopener" className="btn-primary" style={{fontSize:'0.95rem',padding:'14px 32px'}}>Book a Free Strategy Call</a>
          <Link href="/packages" className="btn-secondary" style={{fontSize:'0.95rem',padding:'14px 32px'}}>See Packages</Link>
        </div>
        <div style={{display:'flex',gap:'40px',marginTop:'48px',flexWrap:'wrap'}}>
          {[['40+','Clients Served'],['3×','Avg. Engagement Lift'],['9+','Services'],['100%','Custom Strategies']].map(([n,l])=>(
            <div key={l}>
              <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.8rem',color:'var(--white)',letterSpacing:'-1px'}}>{n}</div>
              <div style={{fontSize:'0.72rem',color:'var(--text-dim)',marginTop:'2px'}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
