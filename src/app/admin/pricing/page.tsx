'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const DEFAULT_RATES = { staticPost:5, carousel:1.5, reel:25, adMgmt:30, branding:120, copy:80, photo:100, video:150, strategy:90, reports:60, competitor:70 }
type Rates = typeof DEFAULT_RATES

export default function AdminPricing() {
  const [rates, setRates] = useState<Rates>(DEFAULT_RATES)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.from('site_config').select('*').eq('key', 'rates').then(({ data }) => {
      if (data && data.length > 0) try { setRates(JSON.parse(data[0].value)) } catch {}
    })
  }, [])

  const save = async () => {
    setSaving(true)
    await supabase.from('site_config').upsert({ key:'rates', value:JSON.stringify(rates) }, { onConflict:'key' })
    setSaving(false); setMsg('✓ Saved!'); setTimeout(()=>setMsg(''),2500)
  }

  const FIELDS: { key: keyof Rates; label: string; desc: string }[] = [
    { key:'staticPost', label:'Static Post', desc:'Price per static post ($)' },
    { key:'carousel', label:'Carousel Add-on', desc:'Extra per carousel vs static ($)' },
    { key:'reel', label:'UGC Reel Base', desc:'Base price per reel ($)' },
    { key:'adMgmt', label:'Ads Management Fee', desc:'Monthly management fee ($)' },
    { key:'branding', label:'Branding Add-on', desc:'Monthly ($)' },
    { key:'copy', label:'Copywriting Add-on', desc:'Monthly ($)' },
    { key:'photo', label:'Photography Add-on', desc:'Monthly ($)' },
    { key:'video', label:'Videography Add-on', desc:'Monthly ($)' },
    { key:'strategy', label:'Strategy Sessions Add-on', desc:'Monthly ($)' },
    { key:'reports', label:'Monthly Reports Add-on', desc:'Monthly ($)' },
    { key:'competitor', label:'Competitor Analysis Add-on', desc:'Monthly ($)' },
  ]

  return (
    <div style={{ maxWidth:'700px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.3rem', color:'var(--white)' }}>💰 Builder Pricing</h2>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          {msg && <span style={{ fontSize:'0.78rem', color:'#16db64' }}>{msg}</span>}
          <button onClick={save} disabled={saving} className="btn-primary">{saving?'Saving…':'Save Pricing'}</button>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {FIELDS.map(f => (
          <div key={f.key} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'12px', padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'16px' }}>
            <div>
              <div style={{ fontSize:'0.85rem', fontWeight:600, color:'var(--white)', marginBottom:'2px' }}>{f.label}</div>
              <div style={{ fontSize:'0.7rem', color:'var(--text-dim)' }}>{f.desc}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', flexShrink:0 }}>
              <span style={{ color:'var(--sky)', fontWeight:700 }}>$</span>
              <input type="number" value={rates[f.key]} onChange={e=>setRates({...rates,[f.key]:Number(e.target.value)})} style={{ width:'80px', background:'rgba(249,253,254,0.05)', border:'1px solid var(--glass-border)', borderRadius:'8px', padding:'8px 10px', color:'var(--white)', fontFamily:'Inter,sans-serif', fontSize:'0.88rem', outline:'none', textAlign:'center' }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
