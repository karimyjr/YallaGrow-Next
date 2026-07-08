'use client'
import Link from 'next/link'

const PACKAGES = [
  {tier:'Launch',subtitle:'Build your foundation.',for:'For businesses that need a professional online presence.',price:149,feats:['Marketing strategy & brand direction','8 static posts/month','2 short-form videos (Reels/TikToks)','Caption writing & hashtag research','Content scheduling','Monthly performance report','1 revision per design']},
  {tier:'Grow',subtitle:'Build momentum.',for:'For businesses ready for real engagement and growth.',price:299,featured:true,feats:['Everything in Launch, plus:','12 static posts/month','4 short-form videos','Story content','Basic community management','Competitor analysis','Monthly strategy call','Meta Ads management (ad spend excluded)']},
  {tier:'Dominate',subtitle:'Accelerate your growth.',for:'For serious brands ready to scale.',price:499,feats:['Everything in Grow, plus:','16 static posts/month','8 short-form videos','Advanced growth strategy','Complete Meta Ads management','Conversion optimization','Performance dashboard','Priority support']},
]

export default function PackagesPage() {
  return (
    <div style={{paddingTop:'80px'}}>
      {/* Hero */}
      <div style={{padding:'80px 6% 60px',textAlign:'center'}}>
        <span className="eyebrow" style={{marginBottom:'12px'}}>Pricing</span>
        <h1 className="section-title" style={{margin:'12px auto 16px'}}>Simple. Transparent.<br/>Built for Real Businesses.</h1>
        <p className="section-sub" style={{margin:'0 auto 32px'}}>No hidden fees. No long-term lock-ins. No inflated retainers.</p>
        <div style={{display:'flex',justifyContent:'center',flexWrap:'wrap',gap:'8px 24px',marginTop:'24px'}}>
          {['No contracts','Cancel anytime','Free strategy call','2-week promise'].map(t=>(
            <div key={t} style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'0.75rem',color:'var(--text-muted)'}}>
              <span style={{color:'var(--sky)',fontWeight:700}}>✓</span>{t}
            </div>
          ))}
        </div>
        <div style={{marginTop:'20px'}}>
          <Link href="/quiz" className="btn-secondary" style={{fontSize:'0.82rem'}}>🎯 Not sure which plan? Find yours in 2 min →</Link>
        </div>
      </div>

      {/* Package cards */}
      <div style={{padding:'0 6% 80px',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px',alignItems:'stretch'}}>
        {PACKAGES.map(p=>(
          <div key={p.tier} style={{background:p.featured?'linear-gradient(135deg,rgba(1,32,76,0.6),rgba(16,161,219,0.08))':'rgba(249,253,254,0.02)',border:p.featured?'1px solid rgba(16,161,219,0.35)':'1px solid var(--glass-border)',borderRadius:'20px',padding:'36px 28px',display:'flex',flexDirection:'column',transition:'all 0.3s'}}
            onMouseEnter={e=>{if(!p.featured)e.currentTarget.style.borderColor='rgba(16,161,219,0.2)';e.currentTarget.style.transform='translateY(-4px)'}}
            onMouseLeave={e=>{if(!p.featured)e.currentTarget.style.borderColor='var(--glass-border)';e.currentTarget.style.transform='none'}}>
            {p.featured&&<div style={{display:'inline-flex',alignItems:'center',gap:'5px',background:'linear-gradient(135deg,var(--sky),var(--purple))',color:'#fff',fontSize:'0.62rem',fontWeight:800,letterSpacing:'1px',textTransform:'uppercase',padding:'4px 12px',borderRadius:'100px',marginBottom:'16px',width:'fit-content'}}>⭐ Most Popular</div>}
            <div style={{fontSize:'0.68rem',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--sky)',marginBottom:'6px'}}>{p.tier}</div>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.5rem',color:'var(--white)',marginBottom:'4px'}}>{p.tier}</div>
            <div style={{fontSize:'0.78rem',color:'var(--text-muted)',marginBottom:'4px',fontStyle:'italic'}}>{p.subtitle}</div>
            <div style={{fontSize:'0.76rem',color:'var(--text-muted)',marginBottom:'24px',lineHeight:1.5,fontWeight:300}}>{p.for}</div>
            <div style={{display:'flex',alignItems:'baseline',gap:'2px',marginBottom:'28px',paddingBottom:'24px',borderBottom:'1px solid var(--glass-border)'}}>
              <span style={{fontSize:'1.2rem',color:'var(--sky)',fontWeight:700}}>$</span>
              <span style={{fontFamily:'Syne,sans-serif',fontSize:'3rem',fontWeight:800,color:'var(--white)',letterSpacing:'-2px',lineHeight:1}}>{p.price}</span>
              <span style={{fontSize:'0.78rem',color:'var(--text-dim)',marginLeft:'4px'}}>/month</span>
            </div>
            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'10px',flex:1,marginBottom:'28px'}}>
              {p.feats.map(f=>(
                <li key={f} style={{display:'flex',gap:'10px',alignItems:'flex-start',fontSize:'0.82rem',color:'rgba(249,253,254,0.65)',lineHeight:1.5,fontWeight:300}}>
                  <span style={{color:'var(--sky)',flexShrink:0,fontWeight:700,marginTop:'1px'}}>✓</span>{f}
                </li>
              ))}
            </ul>
            <a href={process.env.NEXT_PUBLIC_BOOKING_URL} target="_blank" rel="noopener"
              style={{width:'100%',padding:'14px',borderRadius:'10px',fontSize:'0.85rem',fontWeight:700,cursor:'pointer',fontFamily:'Inter,sans-serif',transition:'all 0.25s',textAlign:'center',textDecoration:'none',display:'block',background:p.featured?'var(--sky)':'transparent',color:p.featured?'var(--dark)':'var(--sky)',border:p.featured?'1px solid var(--sky)':'1px solid rgba(16,161,219,0.3)'}}>
              Book a Free Strategy Call
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
