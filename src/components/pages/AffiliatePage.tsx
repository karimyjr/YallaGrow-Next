'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const COUNTRIES=['Lebanon','United Arab Emirates','Saudi Arabia','Kuwait','Qatar','Bahrain','Oman','Jordan','Egypt','Iraq','United Kingdom','United States','Canada','France','Germany','Australia','Other']

export default function AffiliatePage() {
  const [form,setForm]=useState({name:'',email:'',country:'',audience:'',instagram:'',website:'',linkedin:'',plan:'',terms:false})
  const [sent,setSent]=useState(false)
  const [loading,setLoading]=useState(false)

  const generateCode=(name:string)=>name.replace(/\s+/g,'').toUpperCase().slice(0,6)+Math.random().toString(36).toUpperCase().slice(2,6)

  const submit=async()=>{
    if(!form.name||!form.email||!form.country||!form.audience||!form.instagram||!form.plan){alert('Please fill in all required fields.');return}
    if(!form.terms){alert('Please accept the Terms & Conditions.');return}
    setLoading(true)
    const refCode=generateCode(form.name)
    try{
      await supabase.from('affiliates').insert({full_name:form.name,email:form.email,country:form.country,audience_size:form.audience,website:form.instagram+(form.website?' | '+form.website:'')+(form.linkedin?' | '+form.linkedin:''),promotion_plan:form.plan,ref_code:refCode,status:'pending'})
      setSent(true)
    }catch{setSent(true)}
    setLoading(false)
  }

  const inputStyle={background:'rgba(249,253,254,0.03)',border:'1px solid var(--glass-border)',borderRadius:'10px',padding:'12px 14px',color:'var(--white)',fontFamily:'Inter,sans-serif',fontSize:'0.85rem',outline:'none',width:'100%'}

  return (
    <div style={{paddingTop:'80px'}}>
      {/* Hero */}
      <div style={{padding:'80px 6%',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 60% at 50% 0%,rgba(16,161,219,0.09) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'rgba(16,161,219,0.1)',border:'1px solid rgba(16,161,219,0.2)',color:'var(--sky)',fontSize:'0.7rem',fontWeight:700,padding:'5px 16px',borderRadius:'100px',marginBottom:'24px',letterSpacing:'1px',textTransform:'uppercase'}}>💰 Affiliate Program</div>
          <h1 style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'clamp(2.4rem,6vw,4rem)',color:'var(--white)',letterSpacing:'-2px',lineHeight:1.1,marginBottom:'20px'}}>
            Grow With Us.<br/><span className="grad">Earn With Us.</span>
          </h1>
          <p style={{fontSize:'1rem',lineHeight:1.7,color:'var(--text-muted)',maxWidth:'560px',margin:'0 auto 36px',fontWeight:300}}>
            Partner with YallaGrow and earn generous commissions by referring businesses that need marketing services.
          </p>
          <div style={{display:'flex',justifyContent:'center',gap:'12px',flexWrap:'wrap'}}>
            <a href="#apply" className="btn-primary" style={{fontSize:'0.95rem',padding:'14px 32px'}}>Become an Affiliate →</a>
            <a href="#how" className="btn-secondary">Learn More</a>
          </div>
          <div style={{display:'flex',justifyContent:'center',flexWrap:'wrap',gap:'8px 32px',marginTop:'32px'}}>
            {['Up to 35% commission','60-day cookie tracking','Monthly payouts','No cap on earnings'].map(t=>(
              <div key={t} style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'0.75rem',color:'var(--text-muted)'}}><span style={{color:'var(--sky)',fontWeight:700}}>✓</span>{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div id="how" style={{padding:'80px 6%',borderTop:'1px solid var(--glass-border)',textAlign:'center'}}>
        <span className="eyebrow" style={{marginBottom:'12px'}}>Process</span>
        <h2 className="section-title" style={{margin:'12px auto 48px'}}>How It Works</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0',position:'relative',maxWidth:'900px',margin:'0 auto'}}>
          <div style={{position:'absolute',top:'27px',left:'12.5%',right:'12.5%',height:'1px',background:'linear-gradient(90deg,var(--sky),var(--purple))',opacity:0.25}}/>
          {[{n:'1',t:'Apply to Join',d:'Fill out the form. We review within 48 hours.'},{n:'2',t:'Get Your Link',d:'Receive your unique referral link.'},{n:'3',t:'Share YallaGrow',d:'Share with businesses in your network.'},{n:'4',t:'Earn Commissions',d:'When a referral buys, you earn automatically.'}].map(s=>(
            <div key={s.n} style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'0 20px'}}>
              <div style={{width:'54px',height:'54px',borderRadius:'50%',background:'linear-gradient(135deg,rgba(16,161,219,0.12),rgba(106,70,217,0.08))',border:'1px solid rgba(16,161,219,0.25)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.1rem',color:'var(--sky)',marginBottom:'20px',position:'relative',zIndex:1}}>{s.n}</div>
              <h4 style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'0.9rem',color:'var(--white)',marginBottom:'8px'}}>{s.t}</h4>
              <p style={{fontSize:'0.75rem',color:'var(--text-muted)',lineHeight:1.6,fontWeight:300}}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Commission table */}
      <div style={{padding:'80px 6%',borderTop:'1px solid var(--glass-border)',textAlign:'center'}}>
        <span className="eyebrow" style={{marginBottom:'12px'}}>Earnings</span>
        <h2 className="section-title" style={{margin:'12px auto 48px'}}>Commission Structure</h2>
        <div style={{maxWidth:'640px',margin:'0 auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',marginBottom:'20px',border:'1px solid var(--glass-border)',borderRadius:'14px',overflow:'hidden'}}>
            <thead><tr style={{background:'linear-gradient(135deg,rgba(16,161,219,0.08),rgba(106,70,217,0.06))'}}>
              <th style={{padding:'14px 24px',fontSize:'0.68rem',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--sky)',textAlign:'left',borderBottom:'1px solid rgba(16,161,219,0.15)'}}>Client&apos;s First Invoice</th>
              <th style={{padding:'14px 24px',fontSize:'0.68rem',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--sky)',textAlign:'left',borderBottom:'1px solid rgba(16,161,219,0.15)'}}>Your Commission</th>
              <th style={{padding:'14px 24px',fontSize:'0.68rem',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--sky)',textAlign:'left',borderBottom:'1px solid rgba(16,161,219,0.15)'}}>Example</th>
            </tr></thead>
            <tbody>
              <tr style={{borderBottom:'1px solid var(--glass-border)'}}><td style={{padding:'20px 24px',color:'rgba(249,253,254,0.75)',fontSize:'0.88rem'}}>$179 – $999</td><td style={{padding:'20px 24px'}}><span style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.5rem',color:'var(--sky)'}}>20%</span></td><td style={{padding:'20px 24px',color:'var(--text-muted)',fontSize:'0.82rem'}}>$299 → <strong style={{color:'var(--white)'}}>$59.80</strong></td></tr>
              <tr><td style={{padding:'20px 24px',color:'rgba(249,253,254,0.75)',fontSize:'0.88rem'}}>$1,000+</td><td style={{padding:'20px 24px'}}><span style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.8rem',background:'linear-gradient(135deg,var(--sky),var(--purple))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>35%</span></td><td style={{padding:'20px 24px',color:'var(--text-muted)',fontSize:'0.82rem'}}>$1,200 → <strong style={{color:'var(--white)'}}>$420</strong></td></tr>
            </tbody>
          </table>
          <div style={{background:'rgba(249,253,254,0.02)',border:'1px solid var(--glass-border)',borderRadius:'12px',padding:'20px',display:'flex',flexDirection:'column',gap:'8px'}}>
            {['Commission is paid once, on the client&apos;s first successful payment only.','35% applies exclusively when the first invoice is $1,000 or above.','No recurring commissions — this is a one-time referral reward.','Custom packages qualify for the 35% tier if initial invoice exceeds $1,000.'].map(n=>(
              <div key={n} style={{display:'flex',gap:'10px',fontSize:'0.75rem',color:'rgba(249,253,254,0.5)',lineHeight:1.5,fontWeight:300}} dangerouslySetInnerHTML={{__html:'<span style="color:var(--sky);flex-shrink:0;font-weight:700">→</span> '+n}}/>
            ))}
          </div>
        </div>
      </div>

      {/* T&C */}
      <div id="terms" style={{padding:'80px 6%',borderTop:'1px solid var(--glass-border)',textAlign:'center'}}>
        <span className="eyebrow" style={{marginBottom:'12px'}}>Legal</span>
        <h2 className="section-title" style={{margin:'12px auto 32px'}}>Terms & Conditions</h2>
        <div style={{maxWidth:'720px',margin:'0 auto',background:'rgba(249,253,254,0.02)',border:'1px solid var(--glass-border)',borderRadius:'16px',padding:'32px',textAlign:'left'}}>
          <h4 style={{fontSize:'0.72rem',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--sky)',marginBottom:'16px'}}>Affiliate Program Terms</h4>
          {['Commission is only paid after the referred client&apos;s first successful payment clears.','No commission for refunded or cancelled purchases within the refund period.','The referred client must be a new client with no existing relationship with YallaGrow.','Self-referrals are strictly prohibited.','Fraudulent referrals result in immediate account termination and forfeiture of all unpaid commissions.','YallaGrow reserves the right to review and investigate any referral before approving commission.','Minimum payout threshold is $50. Balances roll over to the following month.','YallaGrow reserves the right to modify commission rates with 30 days notice.'].map(t=>(
            <div key={t} style={{display:'flex',gap:'10px',fontSize:'0.76rem',color:'rgba(249,253,254,0.5)',lineHeight:1.6,fontWeight:300,marginBottom:'10px'}} dangerouslySetInnerHTML={{__html:'<span style="color:rgba(16,161,219,0.5);flex-shrink:0;font-weight:700">§</span> '+t}}/>
          ))}
        </div>
      </div>

      {/* Apply form */}
      <div id="apply" style={{padding:'80px 6%',borderTop:'1px solid var(--glass-border)',textAlign:'center'}}>
        <span className="eyebrow" style={{marginBottom:'12px'}}>Apply</span>
        <h2 className="section-title" style={{margin:'12px auto 12px'}}>Become an Affiliate</h2>
        <p style={{fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:'40px'}}>Takes less than 3 minutes. We review all applications within 48 hours.</p>
        <div style={{maxWidth:'640px',margin:'0 auto',background:'var(--glass)',border:'1px solid var(--glass-border)',borderRadius:'20px',padding:'32px',textAlign:'left'}}>
          {sent?(
            <div style={{textAlign:'center',padding:'40px 0'}}>
              <div style={{fontSize:'3rem',marginBottom:'16px'}}>🎉</div>
              <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.3rem',color:'var(--white)',marginBottom:'8px'}}>Application Received!</h3>
              <p style={{fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:'20px'}}>We&apos;ll review and get back to you within 48 hours.</p>
              <Link href="/" className="btn-secondary">Back to Home</Link>
            </div>
          ):(
            <>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}}>
                <input placeholder="Full Name *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={inputStyle}/>
                <input placeholder="Email Address *" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} style={inputStyle}/>
              </div>
              <select value={form.country} onChange={e=>setForm({...form,country:e.target.value})} style={{...inputStyle,color:form.country?'var(--white)':'var(--text-dim)',marginBottom:'12px'}}>
                <option value="">Select your country... *</option>
                {COUNTRIES.map(c=><option key={c}>{c}</option>)}
              </select>
              <select value={form.audience} onChange={e=>setForm({...form,audience:e.target.value})} style={{...inputStyle,color:form.audience?'var(--white)':'var(--text-dim)',marginBottom:'12px'}}>
                <option value="">Select audience size... *</option>
                <option value="no_audience">No audience — I refer through my network</option>
                <option value="small">Small audience (under 10K followers)</option>
                <option value="influencer">Influencer (10K+ followers)</option>
              </select>
              <input placeholder="Instagram Username * (e.g. @yourusername)" value={form.instagram} onChange={e=>setForm({...form,instagram:e.target.value})} style={{...inputStyle,marginBottom:'12px'}}/>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}}>
                <input placeholder="Website (optional)" type="url" value={form.website} onChange={e=>setForm({...form,website:e.target.value})} style={inputStyle}/>
                <input placeholder="LinkedIn (optional)" type="url" value={form.linkedin} onChange={e=>setForm({...form,linkedin:e.target.value})} style={inputStyle}/>
              </div>
              <textarea placeholder="How do you plan to promote YallaGrow? *" rows={4} value={form.plan} onChange={e=>setForm({...form,plan:e.target.value})} style={{...inputStyle,marginBottom:'16px',resize:'vertical'}}/>
              <div style={{display:'flex',alignItems:'flex-start',gap:'12px',marginBottom:'16px',padding:'14px',background:'rgba(249,253,254,0.02)',border:'1px solid var(--glass-border)',borderRadius:'10px'}}>
                <input type="checkbox" checked={form.terms} onChange={e=>setForm({...form,terms:e.target.checked})} style={{width:'18px',height:'18px',marginTop:'2px',accentColor:'var(--sky)',flexShrink:0,cursor:'pointer'}}/>
                <label style={{fontSize:'0.78rem',color:'rgba(249,253,254,0.6)',lineHeight:1.6,cursor:'pointer'}}>
                  I have read and agree to the <a href="#terms" style={{color:'var(--sky)'}}>Affiliate Terms & Conditions</a> and <Link href="/privacy" style={{color:'var(--sky)'}}>Privacy Policy</Link>. *
                </label>
              </div>
              <button onClick={submit} disabled={loading} className="btn-primary" style={{width:'100%',justifyContent:'center'}}>
                {loading?'Submitting…':'Submit Application →'}
              </button>
            </>
          )}
        </div>
        <div style={{marginTop:'32px'}}>
          <div style={{display:'inline-block',background:'linear-gradient(135deg,rgba(16,161,219,0.08),rgba(106,70,217,0.05))',border:'1px solid rgba(16,161,219,0.2)',borderRadius:'16px',padding:'20px 32px'}}>
            <p style={{fontSize:'0.88rem',fontWeight:600,color:'var(--white)',marginBottom:'4px'}}>Already an affiliate?</p>
            <p style={{fontSize:'0.75rem',color:'var(--text-muted)',marginBottom:'16px'}}>Sign in to track referrals, earnings and payouts.</p>
            <Link href="/affiliate/dashboard" className="btn-primary" style={{padding:'11px 24px',fontSize:'0.85rem'}}>Access My Dashboard →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
