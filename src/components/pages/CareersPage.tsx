'use client'
import { useState } from 'react'

const ROLES=[
  {title:'CEO / Founder',status:'closed',icon:'👤',type:'Leadership',desc:'Strategy & direction, sales & client acquisition, business growth decisions, client relationships.',open:false},
  {title:'Designer / Content Creator',status:'open',icon:'🎨',type:'Full-time',desc:"We're looking for someone who can make brands look and feel premium.",open:true,
    responsibilities:['Create social media designs for client accounts','Build brand visuals and identity assets','Produce short-form content — Reels, TikTok visuals','Maintain consistent visual identity across platforms'],
    requirements:['A strong creative eye','Comfortable with Canva, Photoshop, or similar','You understand what performs on social media','Portfolio or Instagram showing real work']},
  {title:'Copywriter / Content Specialist',status:'open',icon:'✍️',type:'Full-time',desc:"We're looking for someone who can write — not just content, but words that make people stop, read, and act.",open:true,
    responsibilities:['Write captions and social media copy','Create ad copy, hooks, and CTAs','Support content strategy across accounts','Sharpen client messaging for conversions'],
    requirements:['You write clean, direct, persuasive copy','You understand marketing tone','Bilingual Arabic/English is a strong plus','Examples of past work or personal projects']},
  {title:'Freelance Media Buyer',status:'open',icon:'📈',type:'Freelance',desc:'Freelance opportunity for someone who knows how to run Meta Ads and get results.',open:true,
    responsibilities:['Set up and manage Meta Ads campaigns','Optimize for performance and ROAS','Handle targeting, creative testing, and budgets','Report results clearly'],
    requirements:['Proven experience running Meta Ads','You think in data, not just dashboards','Results you can point to — ROAS, CPL, CPA','Organized and reliable']},
]

export default function CareersPage() {
  const [form,setForm]=useState({name:'',email:'',phone:'',role:'',portfolio:'',linkedin:'',message:''})
  const [sent,setSent]=useState(false)

  const submit=async()=>{
    if(!form.name||!form.email||!form.role){alert('Please fill in required fields.');return}
    try{
      await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({'form-name':'job-application',...form}).toString()})
      setSent(true)
    }catch{setSent(true)}
  }

  return (
    <div style={{paddingTop:'80px'}}>
      {/* Hero */}
      <div style={{padding:'80px 6% 60px',textAlign:'center'}}>
        <span className="eyebrow" style={{marginBottom:'12px'}}>Join the Team</span>
        <h1 className="section-title" style={{margin:'12px auto 16px'}}>Open Positions<br/>at YallaGrow</h1>
        <p className="section-sub" style={{margin:'0 auto'}}>We&apos;re a small, execution-focused agency. We don&apos;t hire for titles — we hire for results.</p>
        <div style={{display:'flex',justifyContent:'center',gap:'0',marginTop:'32px',background:'var(--glass)',border:'1px solid var(--glass-border)',borderRadius:'16px',padding:'18px 28px',width:'fit-content',margin:'32px auto 0'}}>
          {[['3','Open roles'],['Lebanon','Based / Remote'],['Small','Tight-knit team']].map(([n,l],i,arr)=>(
            <div key={l} style={{display:'flex',alignItems:'center'}}>
              <div style={{textAlign:'center',padding:'0 24px'}}>
                <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.1rem',color:'var(--white)'}}>{n}</div>
                <div style={{fontSize:'0.68rem',color:'var(--text-dim)'}}>{l}</div>
              </div>
              {i<arr.length-1&&<div style={{width:'1px',height:'36px',background:'var(--glass-border)'}}/>}
            </div>
          ))}
        </div>
      </div>

      {/* Roles */}
      <div style={{padding:'0 6% 80px',display:'flex',flexDirection:'column',gap:'16px'}}>
        {ROLES.map(r=>(
          <div key={r.title} style={{background:'rgba(249,253,254,0.02)',border:'1px solid var(--glass-border)',borderRadius:'20px',padding:'32px',opacity:r.open?1:0.5,transition:'all 0.3s'}}
            onMouseEnter={e=>r.open&&(e.currentTarget.style.borderColor='rgba(16,161,219,0.15)')}
            onMouseLeave={e=>r.open&&(e.currentTarget.style.borderColor='var(--glass-border)')}>
            <div style={{display:'flex',alignItems:'flex-start',gap:'20px',marginBottom:'16px',flexWrap:'wrap'}}>
              <div style={{width:'52px',height:'52px',borderRadius:'14px',background:'var(--glass)',border:'1px solid var(--glass-border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',flexShrink:0}}>{r.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:r.open?'var(--sky)':'var(--text-dim)',marginBottom:'4px'}}>{r.open?r.type+' — Open':'Leadership — Not Open'}</div>
                <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.2rem',color:'var(--white)',marginBottom:'4px'}}>{r.title}</h3>
              </div>
              {r.open&&<a href="#apply" className="btn-primary" style={{padding:'10px 20px',fontSize:'0.8rem'}}>Apply →</a>}
            </div>
            <p style={{fontSize:'0.85rem',lineHeight:1.8,color:'rgba(249,253,254,0.6)',fontWeight:300,marginBottom:r.responsibilities?'24px':0}}>{r.desc}</p>
            {r.responsibilities&&(
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'32px'}}>
                <div>
                  <div style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--sky)',marginBottom:'12px'}}>What you&apos;ll do</div>
                  {r.responsibilities.map(res=><div key={res} style={{display:'flex',gap:'8px',fontSize:'0.78rem',color:'rgba(249,253,254,0.6)',marginBottom:'8px',fontWeight:300}}><span style={{color:'var(--sky)',flexShrink:0}}>→</span>{res}</div>)}
                </div>
                <div>
                  <div style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--sky)',marginBottom:'12px'}}>What we&apos;re looking for</div>
                  {r.requirements?.map(req=><div key={req} style={{display:'flex',gap:'8px',fontSize:'0.78rem',color:'rgba(249,253,254,0.6)',marginBottom:'8px',fontWeight:300}}><span style={{color:'var(--sky)',flexShrink:0}}>✓</span>{req}</div>)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Apply form */}
      <div id="apply" style={{background:'rgba(249,253,254,0.01)',borderTop:'1px solid var(--glass-border)',padding:'80px 6%'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'64px',maxWidth:'1100px',margin:'0 auto',alignItems:'start'}}>
          <div>
            <span className="eyebrow" style={{marginBottom:'12px'}}>Apply</span>
            <h2 className="section-title" style={{margin:'12px 0 16px'}}>Work With Us</h2>
            <p style={{fontSize:'0.88rem',color:'var(--text-muted)',lineHeight:1.7,fontWeight:300}}>No lengthy cover letters. Just send your portfolio and tell us which role you&apos;re applying for.</p>
          </div>
          <div style={{background:'var(--glass)',border:'1px solid var(--glass-border)',borderRadius:'20px',padding:'32px'}}>
            {sent?<div style={{textAlign:'center',padding:'40px 0'}}><div style={{fontSize:'3rem',marginBottom:'16px'}}>✅</div><h3 style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:'var(--white)',marginBottom:'8px'}}>Application received.</h3><p style={{fontSize:'0.82rem',color:'var(--text-muted)'}}>We respond to every application within a few days.</p></div>:(
              <>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}}>
                  <input placeholder="Full Name *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={{background:'rgba(249,253,254,0.03)',border:'1px solid var(--glass-border)',borderRadius:'10px',padding:'12px 14px',color:'var(--white)',fontFamily:'Inter,sans-serif',fontSize:'0.85rem',outline:'none',width:'100%'}}/>
                  <input placeholder="Email *" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} style={{background:'rgba(249,253,254,0.03)',border:'1px solid var(--glass-border)',borderRadius:'10px',padding:'12px 14px',color:'var(--white)',fontFamily:'Inter,sans-serif',fontSize:'0.85rem',outline:'none',width:'100%'}}/>
                </div>
                <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} style={{background:'rgba(249,253,254,0.03)',border:'1px solid var(--glass-border)',borderRadius:'10px',padding:'12px 14px',color:form.role?'var(--white)':'var(--text-dim)',fontFamily:'Inter,sans-serif',fontSize:'0.85rem',outline:'none',width:'100%',marginBottom:'12px'}}>
                  <option value="">Applying for... *</option>
                  <option>Designer / Content Creator</option>
                  <option>Copywriter / Content Specialist</option>
                  <option>Freelance Media Buyer</option>
                </select>
                <input placeholder="Portfolio / Instagram / Behance link" value={form.portfolio} onChange={e=>setForm({...form,portfolio:e.target.value})} style={{background:'rgba(249,253,254,0.03)',border:'1px solid var(--glass-border)',borderRadius:'10px',padding:'12px 14px',color:'var(--white)',fontFamily:'Inter,sans-serif',fontSize:'0.85rem',outline:'none',width:'100%',marginBottom:'12px'}}/>
                <textarea placeholder="Why you? Keep it short and real." rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} style={{background:'rgba(249,253,254,0.03)',border:'1px solid var(--glass-border)',borderRadius:'10px',padding:'12px 14px',color:'var(--white)',fontFamily:'Inter,sans-serif',fontSize:'0.85rem',outline:'none',width:'100%',marginBottom:'16px',resize:'vertical'}}/>
                <button onClick={submit} className="btn-primary" style={{width:'100%',justifyContent:'center'}}>Send Application →</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
