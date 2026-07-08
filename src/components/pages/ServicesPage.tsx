'use client'
import Link from 'next/link'

const SERVICES=[
  {icon:'🎯',title:'Marketing Strategy',desc:'Research, positioning and roadmap for your business.',href:'/services/strategy'},
  {icon:'📱',title:'Social Media Management',desc:'Full account management — content, posting, engagement.',href:'/services/social'},
  {icon:'💰',title:'Paid Advertising',desc:'Meta and Google campaigns optimized for results.',href:'/services/ads'},
  {icon:'🎨',title:'Branding & Identity',desc:'Logo, colors, typography, and full brand system.',href:'/services/branding'},
  {icon:'🎬',title:'Content Creation',desc:'Reels, carousels, stories, and UGC content.',href:'/services/content'},
  {icon:'✍️',title:'Copywriting',desc:'Captions, ad copy, landing pages, and email.',href:'/services/copy'},
  {icon:'🌐',title:'Website Development',desc:'Fast, conversion-focused websites and landing pages.',href:'/services/web'},
  {icon:'📊',title:'Analytics & Reporting',desc:'Performance tracking, insights, and monthly reports.',href:'/services/analytics'},
  {icon:'🧠',title:'Consulting',desc:'1-on-1 strategy sessions and marketing audits.',href:'/services/consulting'},
]

export default function ServicesPage() {
  return (
    <div style={{paddingTop:'80px'}}>
      <div style={{padding:'80px 6%'}}>
        <span className="eyebrow" style={{marginBottom:'12px'}}>Our Services</span>
        <h1 className="section-title" style={{margin:'12px 0 16px'}}>Everything You Need<br/>to Grow Online</h1>
        <p className="section-sub" style={{marginBottom:'60px'}}>Nine core services. One focused goal: growing your business.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
          {SERVICES.map(s=>(
            <Link key={s.href} href={s.href} style={{textDecoration:'none'}}>
              <div style={{background:'var(--glass)',border:'1px solid var(--glass-border)',borderRadius:'16px',padding:'28px 24px',transition:'all 0.3s',height:'100%'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(16,161,219,0.25)';e.currentTarget.style.transform='translateY(-4px)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--glass-border)';e.currentTarget.style.transform='none'}}>
                <div style={{fontSize:'1.8rem',marginBottom:'14px'}}>{s.icon}</div>
                <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'0.95rem',color:'var(--white)',marginBottom:'8px'}}>{s.title}</h3>
                <p style={{fontSize:'0.76rem',color:'var(--text-muted)',lineHeight:1.6,fontWeight:300}}>{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
