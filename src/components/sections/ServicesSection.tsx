'use client'
import Link from 'next/link'

const SERVICES=[
  {icon:'🎯',title:'Marketing Strategy',desc:'Deep-dive analysis of your market, competitors, and customers.',href:'/services'},
  {icon:'📱',title:'Social Media',desc:'Consistent, strategic content that builds your brand.',href:'/services'},
  {icon:'💰',title:'Paid Advertising',desc:'Meta and Google campaigns that turn budget into results.',href:'/services'},
  {icon:'🎨',title:'Branding & Identity',desc:'A brand system that makes you instantly recognizable.',href:'/services'},
  {icon:'🎬',title:'Content Creation',desc:'Reels, posts, and carousels that stop the scroll.',href:'/services'},
  {icon:'🌐',title:'Website Development',desc:'Fast, mobile-first websites designed to convert.',href:'/services'},
]

export default function ServicesSection() {
  return (
    <section style={{padding:'100px 6%',background:'rgba(0,0,0,0.2)'}}>
      <div style={{textAlign:'center',marginBottom:'60px'}}>
        <span className="eyebrow" style={{marginBottom:'12px'}}>What We Do</span>
        <h2 className="section-title" style={{margin:'12px auto',maxWidth:'520px'}}>Everything Your Business<br/>Needs to Grow Online</h2>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px',}}>
        {SERVICES.map(s=>(
          <Link key={s.href} href={s.href} style={{textDecoration:'none'}}>
            <div style={{background:'var(--glass)',border:'1px solid var(--glass-border)',borderRadius:'16px',padding:'28px 24px',transition:'all 0.3s',height:'100%'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(16,161,219,0.25)';e.currentTarget.style.transform='translateY(-4px)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--glass-border)';e.currentTarget.style.transform='none'}}>
              <div style={{fontSize:'1.8rem',marginBottom:'16px'}}>{s.icon}</div>
              <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'1rem',color:'var(--white)',marginBottom:'8px'}}>{s.title}</h3>
              <p style={{fontSize:'0.78rem',color:'var(--text-muted)',lineHeight:1.6,fontWeight:300}}>{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      <div style={{textAlign:'center',marginTop:'40px'}}>
        <Link href="/services" className="btn-secondary">View All Services →</Link>
      </div>
    </section>
  )
}
