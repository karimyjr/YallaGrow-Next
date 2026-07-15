'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Affiliate { id:string; full_name:string; email:string; ref_code:string; country:string; status:string; website:string; promotion_plan:string; created_at:string }
interface Referral { id:string; ref_code:string; client_name:string; client_email:string; invoice_amount:number; commission_amount:number; commission_rate:number; status:string; created_at:string }

export default function AdminAffiliates() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [refForm, setRefForm] = useState({ code:'', client:'', email:'', invoice:'' })
  const [rate, setRate] = useState(30)
  const [preview, setPreview] = useState('')
  const [msg, setMsg] = useState('')

  const load = async () => {
    const [a, r] = await Promise.all([
      supabase.from('affiliates').select('*').order('created_at',{ascending:false}),
      supabase.from('referrals').select('*').order('created_at',{ascending:false}),
    ])
    if (a.data) setAffiliates(a.data)
    if (r.data) setReferrals(r.data)
  }
  useEffect(() => { load() }, [])

  const updateAff = async (id:string, status:string) => {
    await supabase.from('affiliates').update({ status }).eq('id', id); load()
  }
  const updateRef = async (id:string, status:string) => {
    await supabase.from('referrals').update({ status }).eq('id', id); load()
  }

  const calcPreview = (inv: string, r: number) => {
    const n = parseFloat(inv)
    if (n > 0) setPreview(`→ Commission: $${(n*(r/100)).toFixed(2)} (${r}% of $${n})`)
    else setPreview('')
  }

  const logReferral = async () => {
    if (!refForm.code || !refForm.client || !refForm.invoice) { alert('Fill in ref code, client name, and invoice amount.'); return }
    const inv = parseFloat(refForm.invoice)
    const commission = +(inv * (rate/100)).toFixed(2)
    await supabase.from('referrals').insert({ ref_code:refForm.code.toUpperCase(), client_name:refForm.client, client_email:refForm.email, invoice_amount:inv, commission_amount:commission, commission_rate:rate, status:'pending' })
    setMsg(`✓ Logged: $${commission} commission`); setRefForm({code:'',client:'',email:'',invoice:''}); setPreview(''); load()
    setTimeout(()=>setMsg(''),3000)
  }

  const statusColor: Record<string,string> = { pending:'#ffc107', active:'#16db64', approved:'#16db64', paid:'#10a1db', rejected:'#ff4d4d', suspended:'#ff4d4d' }
  const statusBg: Record<string,string> = { pending:'rgba(255,193,7,0.1)', active:'rgba(16,219,100,0.1)', approved:'rgba(16,219,100,0.1)', paid:'rgba(16,161,219,0.1)', rejected:'rgba(255,77,77,0.1)', suspended:'rgba(255,77,77,0.1)' }

  const inputStyle = { background:'rgba(249,253,254,0.03)', border:'1px solid var(--glass-border)', borderRadius:'8px', padding:'8px 12px', color:'var(--white)', fontFamily:'Inter,sans-serif', fontSize:'0.82rem', outline:'none' } as React.CSSProperties

  const pendingRefs = referrals.filter(r => r.invoice_amount > 0 && r.status !== 'paid' && r.status !== 'rejected')

  return (
    <div style={{ maxWidth:'1000px' }}>
      <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.3rem', color:'var(--white)', marginBottom:'24px' }}>🤝 Affiliate Management</h2>

      {/* Log referral */}
      <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'24px', marginBottom:'32px' }}>
        <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.95rem', color:'var(--white)', marginBottom:'16px' }}>Log a Referral Manually</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'10px' }}>
          <input placeholder="Affiliate Ref Code *" value={refForm.code} onChange={e=>setRefForm({...refForm,code:e.target.value.toUpperCase()})} style={{...inputStyle,textTransform:'uppercase'}}/>
          <input placeholder="Client Name *" value={refForm.client} onChange={e=>setRefForm({...refForm,client:e.target.value})} style={inputStyle}/>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'12px' }}>
          <input placeholder="Client Email (optional)" type="email" value={refForm.email} onChange={e=>setRefForm({...refForm,email:e.target.value})} style={inputStyle}/>
          <input placeholder="First Invoice Amount ($) *" type="number" value={refForm.invoice} onChange={e=>{setRefForm({...refForm,invoice:e.target.value});calcPreview(e.target.value,rate)}} style={inputStyle}/>
        </div>
        {/* Rate buttons */}
        <div style={{ marginBottom:'12px' }}>
          <div style={{ fontSize:'0.68rem', color:'var(--text-dim)', marginBottom:'8px' }}>Commission Rate</div>
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
            {[20,25,30,35,40].map(r=>(
              <button key={r} onClick={()=>{setRate(r);calcPreview(refForm.invoice,r)}} style={{ padding:'8px 18px', borderRadius:'8px', fontSize:'0.82rem', fontWeight:700, cursor:'pointer', fontFamily:'Syne,sans-serif', border:'1px solid', background:rate===r?'var(--sky)':'var(--glass)', color:rate===r?'var(--dark)':'var(--text-muted)', borderColor:rate===r?'var(--sky)':'var(--glass-border)', transition:'all 0.2s' }}>{r}%</button>
            ))}
          </div>
          {preview && <div style={{ fontSize:'0.78rem', color:'var(--sky)', fontWeight:600, marginTop:'8px' }}>{preview}</div>}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={logReferral} className="btn-primary">Log Referral & Calculate Commission</button>
          {msg && <span style={{ fontSize:'0.78rem', color:'#16db64' }}>{msg}</span>}
        </div>
      </div>

      {/* Affiliates */}
      <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.7rem', letterSpacing:'2px', textTransform:'uppercase', color:'var(--sky)', marginBottom:'12px' }}>Affiliate Applications ({affiliates.length})</h3>
      <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'32px' }}>
        {affiliates.map(a => (
          <div key={a.id} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'12px', padding:'14px 18px', display:'flex', alignItems:'center', gap:'14px', flexWrap:'wrap' }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:'0.85rem', fontWeight:600, color:'var(--white)', marginBottom:'2px' }}>{a.full_name} <span style={{ color:'var(--text-dim)', fontWeight:400, fontSize:'0.72rem' }}>· {a.email}</span></div>
              <div style={{ fontSize:'0.68rem', color:'var(--text-dim)' }}>Code: <strong style={{ color:'var(--sky)' }}>{a.ref_code}</strong> · {a.country || '—'} · {new Date(a.created_at).toLocaleDateString()}</div>
            </div>
            <span style={{ padding:'3px 10px', borderRadius:'100px', fontSize:'0.62rem', fontWeight:700, background:statusBg[a.status]||'transparent', color:statusColor[a.status]||'var(--text-dim)', border:`1px solid ${statusColor[a.status] || 'var(--glass-border)'}40` }}>{a.status}</span>
            <div style={{ display:'flex', gap:'6px' }}>
              {a.status === 'pending' && <>
                <button onClick={()=>updateAff(a.id,'active')} style={{ padding:'5px 12px', borderRadius:'7px', fontSize:'0.7rem', fontWeight:600, background:'rgba(16,219,100,0.1)', border:'1px solid rgba(16,219,100,0.3)', color:'#16db64', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>Approve</button>
                <button onClick={()=>updateAff(a.id,'rejected')} style={{ padding:'5px 12px', borderRadius:'7px', fontSize:'0.7rem', fontWeight:600, background:'rgba(255,77,77,0.1)', border:'1px solid rgba(255,77,77,0.3)', color:'#ff4d4d', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>Reject</button>
              </>}
              {a.status === 'active' && <button onClick={()=>updateAff(a.id,'suspended')} style={{ padding:'5px 12px', borderRadius:'7px', fontSize:'0.7rem', fontWeight:600, background:'rgba(255,77,77,0.1)', border:'1px solid rgba(255,77,77,0.3)', color:'#ff4d4d', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>Suspend</button>}
            </div>
          </div>
        ))}
        {affiliates.length === 0 && <div style={{ textAlign:'center', padding:'32px', color:'var(--text-dim)', fontSize:'0.82rem' }}>No applications yet.</div>}
      </div>

      {/* Pending referrals */}
      <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.7rem', letterSpacing:'2px', textTransform:'uppercase', color:'var(--sky)', marginBottom:'12px' }}>Referrals Pending Action ({pendingRefs.length})</h3>
      <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
        {pendingRefs.map(r => (
          <div key={r.id} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'12px', padding:'14px 18px', display:'flex', alignItems:'center', gap:'14px', flexWrap:'wrap' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'0.85rem', fontWeight:600, color:'var(--white)', marginBottom:'2px' }}>{r.client_name || 'Unknown'} <span style={{ color:'var(--text-dim)', fontWeight:400, fontSize:'0.72rem' }}>→ {r.ref_code}</span></div>
              <div style={{ fontSize:'0.68rem', color:'var(--text-dim)' }}>Invoice: ${Number(r.invoice_amount).toFixed(2)} · Commission: ${Number(r.commission_amount).toFixed(2)} ({r.commission_rate}%) · {new Date(r.created_at).toLocaleDateString()}</div>
            </div>
            <span style={{ padding:'3px 10px', borderRadius:'100px', fontSize:'0.62rem', fontWeight:700, background:statusBg[r.status]||'transparent', color:statusColor[r.status]||'var(--text-dim)', border:`1px solid ${statusColor[r.status]||'var(--glass-border)'}40` }}>{r.status}</span>
            <div style={{ display:'flex', gap:'6px' }}>
              {r.status === 'pending' && <>
                <button onClick={()=>updateRef(r.id,'approved')} style={{ padding:'5px 12px', borderRadius:'7px', fontSize:'0.7rem', fontWeight:600, background:'rgba(16,219,100,0.1)', border:'1px solid rgba(16,219,100,0.3)', color:'#16db64', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>Approve</button>
                <button onClick={()=>updateRef(r.id,'rejected')} style={{ padding:'5px 12px', borderRadius:'7px', fontSize:'0.7rem', fontWeight:600, background:'rgba(255,77,77,0.1)', border:'1px solid rgba(255,77,77,0.3)', color:'#ff4d4d', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>Reject</button>
              </>}
              {r.status === 'approved' && <button onClick={()=>updateRef(r.id,'paid')} style={{ padding:'5px 12px', borderRadius:'7px', fontSize:'0.7rem', fontWeight:600, background:'rgba(16,161,219,0.1)', border:'1px solid rgba(16,161,219,0.3)', color:'var(--sky)', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>Mark Paid</button>}
            </div>
          </div>
        ))}
        {pendingRefs.length === 0 && <div style={{ textAlign:'center', padding:'32px', color:'var(--text-dim)', fontSize:'0.82rem' }}>No referrals pending action.</div>}
      </div>
    </div>
  )
}
