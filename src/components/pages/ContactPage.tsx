'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [sent,setSent]=useState(false)
  const [form,setForm]=useState({name:'',email:'',company:'',service:'',message:''})

  const submit=async()=>{
    if(!form.name||!form.email||!form.message){alert('Please fill in required fields.');return}
    try{
      await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({'form-name':'contact',...form}).toString()})
      setSent(true)
    }catch{setSent(true)}
  }

  return (
    <div style={{paddingTop:'80px',padding:'120px 6% 80px'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'80px',alignItems:'start'}}>
        <div>
          <span className="eyebrow" style={{marginBottom:'12px'}}>Get In Touch</span>
          <h1 className="section-title" style={{margin:'12px 0 20px'}}>Let&apos;s Grow<br/>Together</h1>
          <p style={{fontSize:'0.9rem',lineHeight:1.7,color:'var(--text-muted)',fontWeight:300,marginBottom:'40px'}}>
            Whether you&apos;re launching your first business or scaling an established brand — we&apos;re here to help you grow.
          </p>
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            {[
              {icon:'💬',title:'WhatsApp',desc:'Fastest response',href:'https://wa.me/447376441603'},
              {icon:'📅',title:'Book a Call',desc:'Free 30-min strategy call',href:process.env.NEXT_PUBLIC_BOOKING_URL||'#'},
            ].map(c=>(
              <a key={c.title} href={c.href} target="_blank" rel="noopener" style={{display:'flex',alignItems:'center',gap:'16px',background:'var(--glass)',border:'1px solid var(--glass-border)',borderRadius:'14px',padding:'18px 20px',textDecoration:'none',transition:'border-color 0.2s'}}
                onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(16,161,219,0.2)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='var(--glass-border)'}>
                <span style={{fontSize:'1.5rem'}}>{c.icon}</span>
                <div>
                  <div style={{fontSize:'0.88rem',fontWeight:600,color:'var(--white)'}}>{c.title}</div>
                  <div style={{fontSize:'0.72rem',color:'var(--text-dim)'}}>{c.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div style={{background:'var(--glass)',border:'1px solid var(--glass-border)',borderRadius:'20px',padding:'32px'}}>
          {sent?(
            <div style={{textAlign:'center',padding:'40px 0'}}>
              <div style={{fontSize:'3rem',marginBottom:'16px'}}>✅</div>
              <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.2rem',color:'var(--white)',marginBottom:'8px'}}>Message Sent!</h3>
              <p style={{fontSize:'0.82rem',color:'var(--text-muted)'}}>We&apos;ll get back to you within 24 hours.</p>
            </div>
          ):(
            <>
              <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'1rem',color:'var(--white)',marginBottom:'20px'}}>Send Us a Message</h3>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}}>
                <input placeholder="Your Name *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={{background:'rgba(249,253,254,0.03)',border:'1px solid var(--glass-border)',borderRadius:'10px',padding:'12px 14px',color:'var(--white)',fontFamily:'Inter,sans-serif',fontSize:'0.85rem',outline:'none',width:'100%'}}/>
                <input placeholder="Email *" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} style={{background:'rgba(249,253,254,0.03)',border:'1px solid var(--glass-border)',borderRadius:'10px',padding:'12px 14px',color:'var(--white)',fontFamily:'Inter,sans-serif',fontSize:'0.85rem',outline:'none',width:'100%'}}/>
              </div>
              <input placeholder="Company / Business Name" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} style={{background:'rgba(249,253,254,0.03)',border:'1px solid var(--glass-border)',borderRadius:'10px',padding:'12px 14px',color:'var(--white)',fontFamily:'Inter,sans-serif',fontSize:'0.85rem',outline:'none',width:'100%',marginBottom:'12px'}}/>
              <textarea placeholder="Tell us about your business & goals *" rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} style={{background:'rgba(249,253,254,0.03)',border:'1px solid var(--glass-border)',borderRadius:'10px',padding:'12px 14px',color:'var(--white)',fontFamily:'Inter,sans-serif',fontSize:'0.85rem',outline:'none',width:'100%',marginBottom:'16px',resize:'vertical'}}/>
              <button onClick={submit} className="btn-primary" style={{width:'100%',justifyContent:'center'}}>Send Message →</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
