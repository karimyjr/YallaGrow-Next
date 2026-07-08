'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Affiliate { id:string; full_name:string; email:string; ref_code:string; status:string; website:string }
interface Referral { id:string; client_name:string; created_at:string; invoice_amount:number; commission_amount:number; commission_rate:number; status:string }

export default function AffiliateDashboard() {
  const [session,setSession]=useState<Affiliate|null>(null)
  const [referrals,setReferrals]=useState<Referral[]>([])
  const [email,setEmail]=useState('')
  const [code,setCode]=useState('')
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    const saved=sessionStorage.getItem('yg_aff')
    if(saved){setSession(JSON.parse(saved));loadRefs(JSON.parse(saved).ref_code)}
  },[])

  const login=async()=>{
    if(!email||!code){setError('Please enter your email and referral code.');return}
    setLoading(true);setError('')
    const {data}=await supabase.from('affiliates').select('*').eq('email',email).eq('ref_code',code.toUpperCase()).limit(1)
    if(data&&data.length>0){
      sessionStorage.setItem('yg_aff',JSON.stringify(data[0]))
      setSession(data[0]);loadRefs(data[0].ref_code)
    }else{setError('Invalid credentials. Check your email and code.')}
    setLoading(false)
  }

  const loadRefs=async(refCode:string)=>{
    const {data}=await supabase.from('referrals').select('*').eq('ref_code',refCode).order('created_at',{ascending:false})
    if(data)setReferrals(data)
  }

  const logout=()=>{sessionStorage.removeItem('yg_aff');setSession(null);setReferrals([])}

  const total=referrals.filter(r=>r.status==='paid').reduce((a,r)=>a+Number(r.commission_amount||0),0)
  const pending=referrals.filter(r=>r.status==='pending'||r.status==='approved').reduce((a,r)=>a+Number(r.commission_amount||0),0)
  const link=session?`https://yallagrow.net/?ref=${session.ref_code}`:''

  const copyLink=()=>{navigator.clipboard.writeText(link).then(()=>alert('Link copied!'))}

  const statusColor:{[k:string]:string}={pending:'#ffc107',approved:'#16db64',paid:'#10a1db',rejected:'#ff4d4d'}
  const statusBg:{[k:string]:string}={pending:'rgba(255,193,7,0.1)',approved:'rgba(16,219,100,0.1)',paid:'rgba(16,161,219,0.1)',rejected:'rgba(255,77,77,0.1)'}

  return (
    <div style={{minHeight:'100vh',background:'var(--dark2)'}}>
      {/* Header */}
      <div style={{padding:'16px 6%',borderBottom:'1px solid var(--glass-border)',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,background:'rgba(6,12,20,0.95)',backdropFilter:'blur(20px)',zIndex:100}}>
        <Link href="/" style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.1rem',color:'var(--white)',textDecoration:'none',letterSpacing:'-0.5px'}}>
          Yalla<em style={{color:'var(--sky)',fontStyle:'normal'}}>Grow</em>
        </Link>
        <span style={{fontSize:'0.72rem',color:'var(--text-dim)'}}>Affiliate Dashboard</span>
        {session?(
          <button onClick={logout} className="btn-secondary" style={{fontSize:'0.72rem',padding:'7px 14px'}}>Sign Out</button>
        ):(
          <Link href="/affiliate" className="btn-secondary" style={{fontSize:'0.72rem',padding:'7px 14px'}}>← Back</Link>
        )}
      </div>

      {!session?(
        /* Login */
        <div style={{maxWidth:'420px',margin:'0 auto',padding:'80px 20px',textAlign:'center'}}>
          <div style={{fontSize:'2.5rem',marginBottom:'20px'}}>🔐</div>
          <h2 style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.4rem',color:'var(--white)',marginBottom:'8px'}}>Affiliate Login</h2>
          <p style={{fontSize:'0.82rem',color:'var(--text-muted)',marginBottom:'28px'}}>Enter your email and referral code to access your dashboard.</p>
          <input type="email" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} style={{background:'rgba(249,253,254,0.03)',border:'1px solid var(--glass-border)',borderRadius:'10px',padding:'12px 14px',color:'var(--white)',fontFamily:'Inter,sans-serif',fontSize:'0.85rem',outline:'none',width:'100%',marginBottom:'12px'}}/>
          <input placeholder="Referral Code" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} onKeyDown={e=>e.key==='Enter'&&login()} style={{background:'rgba(249,253,254,0.03)',border:'1px solid var(--glass-border)',borderRadius:'10px',padding:'12px 14px',color:'var(--white)',fontFamily:'Inter,sans-serif',fontSize:'0.85rem',outline:'none',width:'100%',marginBottom:'4px',textTransform:'uppercase'}}/>
          {error&&<p style={{fontSize:'0.75rem',color:'#ff5555',margin:'8px 0'}}>{error}</p>}
          <button onClick={login} disabled={loading} className="btn-primary" style={{width:'100%',justifyContent:'center',marginTop:'16px'}}>{loading?'Signing in…':'Sign In →'}</button>
          <p style={{fontSize:'0.72rem',color:'var(--text-dim)',marginTop:'16px'}}>Don&apos;t have an account? <Link href="/affiliate" style={{color:'var(--sky)'}}>Apply here →</Link></p>
        </div>
      ):(
        /* Dashboard */
        <div style={{padding:'32px 6%',maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'28px',flexWrap:'wrap',gap:'12px'}}>
            <div>
              <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.3rem',color:'var(--white)',letterSpacing:'-0.5px'}}>Welcome back, {session.full_name.split(' ')[0]} 👋</div>
              <div style={{fontSize:'0.72rem',color:'var(--text-dim)',marginTop:'3px',display:'flex',alignItems:'center',gap:'8px'}}>
                Affiliate Dashboard ·{' '}
                <span style={{background:session.status==='active'?'rgba(16,219,100,0.1)':'rgba(255,193,7,0.1)',color:session.status==='active'?'#16db64':'#ffc107',border:`1px solid ${session.status==='active'?'rgba(16,219,100,0.2)':'rgba(255,193,7,0.2)'}`,padding:'2px 8px',borderRadius:'100px',fontSize:'0.62rem',fontWeight:700,textTransform:'uppercase'}}>{session.status}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'12px',marginBottom:'24px'}}>
            {[
              {label:'Total Earned',value:'$'+total.toFixed(2),sub:'All time'},
              {label:'Pending',value:'$'+pending.toFixed(2),sub:'Awaiting approval',color:'#ffc107'},
              {label:'Paid Out',value:'$'+referrals.filter(r=>r.status==='paid').reduce((a,r)=>a+Number(r.commission_amount||0),0).toFixed(2),sub:'Total paid',color:'#16db64'},
              {label:'Referrals',value:referrals.length.toString(),sub:'Total tracked'},
              {label:'Conversion',value:referrals.length>0?Math.round((referrals.filter(r=>r.invoice_amount>0).length/referrals.length)*100)+'%':'0%',sub:'To client'},
            ].map(s=>(
              <div key={s.label} style={{background:'rgba(249,253,254,0.03)',border:'1px solid var(--glass-border)',borderRadius:'14px',padding:'18px 16px'}}>
                <div style={{fontSize:'0.62rem',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--text-dim)',marginBottom:'8px'}}>{s.label}</div>
                <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.5rem',color:s.color||'var(--white)',letterSpacing:'-0.5px'}}>{s.value}</div>
                <div style={{fontSize:'0.65rem',color:'var(--text-dim)',marginTop:'4px'}}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Referral link */}
          <div style={{background:'linear-gradient(135deg,rgba(16,161,219,0.06),rgba(106,70,217,0.04))',border:'1px solid rgba(16,161,219,0.2)',borderRadius:'14px',padding:'18px 22px',marginBottom:'24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px',flexWrap:'wrap'}}>
            <div>
              <div style={{fontSize:'0.62rem',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--sky)',marginBottom:'6px'}}>Your Referral Link</div>
              <div style={{fontSize:'0.8rem',color:'var(--white)',fontFamily:'monospace',wordBreak:'break-all'}}>{link}</div>
            </div>
            <button onClick={copyLink} className="btn-primary" style={{padding:'8px 18px',fontSize:'0.76rem',flexShrink:0}}>Copy Link</button>
          </div>

          {/* Referrals table */}
          <div style={{background:'rgba(249,253,254,0.02)',border:'1px solid var(--glass-border)',borderRadius:'14px',overflow:'hidden',marginBottom:'24px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderBottom:'1px solid var(--glass-border)'}}>
              <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'0.82rem',color:'var(--white)'}}>Recent Referrals</div>
              <div style={{fontSize:'0.68rem',color:'var(--text-dim)'}}>{referrals.length} referral{referrals.length!==1?'s':''}</div>
            </div>
            {referrals.length===0?(
              <div style={{textAlign:'center',padding:'40px',color:'var(--text-dim)',fontSize:'0.8rem'}}>No referrals yet. Share your link to get started.</div>
            ):(
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr>
                  {['Client','Date','Invoice','Commission','Status'].map(h=>(
                    <th key={h} style={{padding:'11px 16px',fontSize:'0.62rem',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--text-dim)',textAlign:'left',borderBottom:'1px solid var(--glass-border)',background:'rgba(249,253,254,0.01)'}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {referrals.map(r=>(
                    <tr key={r.id} style={{borderBottom:'1px solid rgba(249,253,254,0.03)'}}>
                      <td style={{padding:'13px 16px',fontSize:'0.76rem',color:'rgba(249,253,254,0.7)'}}>{r.client_name||'—'}</td>
                      <td style={{padding:'13px 16px',fontSize:'0.76rem',color:'rgba(249,253,254,0.7)'}}>{new Date(r.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'2-digit'})}</td>
                      <td style={{padding:'13px 16px',fontSize:'0.76rem',color:'rgba(249,253,254,0.7)'}}>{r.invoice_amount?'$'+Number(r.invoice_amount).toFixed(2):'Pending'}</td>
                      <td style={{padding:'13px 16px',fontSize:'0.76rem',color:'rgba(249,253,254,0.7)'}}>{r.commission_amount?'$'+Number(r.commission_amount).toFixed(2):'—'}</td>
                      <td style={{padding:'13px 16px'}}><span style={{display:'inline-block',padding:'3px 10px',borderRadius:'100px',fontSize:'0.62rem',fontWeight:700,background:statusBg[r.status]||'transparent',color:statusColor[r.status]||'var(--text-dim)',border:`1px solid ${statusColor[r.status]||'var(--glass-border)'}20`}}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
