'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const DEFAULT_PKGS = [
  { tier:'Launch', subtitle:'Build your foundation.', for:'For businesses that need a professional online presence.', price:149, feats:['Marketing strategy & brand direction','8 static posts/month','2 short-form videos','Caption writing & hashtag research','Content scheduling','Monthly performance report'] },
  { tier:'Grow', subtitle:'Build momentum.', for:'For businesses ready for real engagement and growth.', price:299, featured:true, feats:['Everything in Launch, plus:','12 static posts/month','4 short-form videos','Story content','Basic community management','Competitor analysis','Monthly strategy call','Meta Ads management'] },
  { tier:'Dominate', subtitle:'Accelerate your growth.', for:'For serious brands ready to scale.', price:499, feats:['Everything in Grow, plus:','16 static posts/month','8 short-form videos','Advanced growth strategy','Complete Meta Ads management','Conversion optimization','Performance dashboard','Priority support'] },
]

export default function AdminPackages() {
  const [pkgs, setPkgs] = useState(DEFAULT_PKGS)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.from('site_config').select('*').eq('key', 'packages').then(({ data }) => {
      if (data && data.length > 0) {
        try { setPkgs(JSON.parse(data[0].value)) } catch {}
      }
    })
  }, [])

  const save = async () => {
    setSaving(true)
    await supabase.from('site_config').upsert({ key: 'packages', value: JSON.stringify(pkgs) }, { onConflict: 'key' })
    setSaving(false); setMsg('✓ Saved!'); setTimeout(() => setMsg(''), 2500)
  }

  const updatePkg = (i: number, field: string, val: string | number) => {
    const updated = [...pkgs]
    ;(updated[i] as Record<string,unknown>)[field] = val
    setPkgs(updated)
  }

  const updateFeat = (pi: number, fi: number, val: string) => {
    const updated = [...pkgs]
    updated[pi].feats[fi] = val
    setPkgs(updated)
  }

  const addFeat = (pi: number) => {
    const updated = [...pkgs]
    updated[pi].feats.push('')
    setPkgs(updated)
  }

  const removeFeat = (pi: number, fi: number) => {
    const updated = [...pkgs]
    updated[pi].feats.splice(fi, 1)
    setPkgs(updated)
  }

  const inputStyle = { width:'100%', background:'rgba(249,253,254,0.03)', border:'1px solid var(--glass-border)', borderRadius:'8px', padding:'8px 12px', color:'var(--white)', fontFamily:'Inter,sans-serif', fontSize:'0.82rem', outline:'none' } as React.CSSProperties

  return (
    <div style={{ maxWidth:'1000px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.3rem', color:'var(--white)' }}>📦 Packages</h2>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          {msg && <span style={{ fontSize:'0.78rem', color:'#16db64' }}>{msg}</span>}
          <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save All Packages'}</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
        {pkgs.map((p, pi) => (
          <div key={pi} style={{ background:'var(--glass)', border:`1px solid ${p.featured?'rgba(16,161,219,0.3)':'var(--glass-border)'}`, borderRadius:'16px', padding:'20px' }}>
            {p.featured && <div style={{ fontSize:'0.6rem', fontWeight:700, letterSpacing:'1px', color:'var(--sky)', marginBottom:'8px', textTransform:'uppercase' }}>⭐ Featured</div>}
            <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'16px' }}>
              <div>
                <label style={{ fontSize:'0.62rem', color:'var(--text-dim)', display:'block', marginBottom:'3px' }}>Tier Name</label>
                <input value={p.tier} onChange={e=>updatePkg(pi,'tier',e.target.value)} style={inputStyle}/>
              </div>
              <div>
                <label style={{ fontSize:'0.62rem', color:'var(--text-dim)', display:'block', marginBottom:'3px' }}>Subtitle</label>
                <input value={p.subtitle} onChange={e=>updatePkg(pi,'subtitle',e.target.value)} style={inputStyle}/>
              </div>
              <div>
                <label style={{ fontSize:'0.62rem', color:'var(--text-dim)', display:'block', marginBottom:'3px' }}>Tagline</label>
                <input value={p.for} onChange={e=>updatePkg(pi,'for',e.target.value)} style={inputStyle}/>
              </div>
              <div>
                <label style={{ fontSize:'0.62rem', color:'var(--text-dim)', display:'block', marginBottom:'3px' }}>Price ($/month)</label>
                <input type="number" value={p.price} onChange={e=>updatePkg(pi,'price',Number(e.target.value))} style={inputStyle}/>
              </div>
            </div>
            <div>
              <label style={{ fontSize:'0.62rem', color:'var(--text-dim)', display:'block', marginBottom:'8px' }}>Features</label>
              {p.feats.map((f, fi) => (
                <div key={fi} style={{ display:'flex', gap:'6px', marginBottom:'6px' }}>
                  <input value={f} onChange={e=>updateFeat(pi,fi,e.target.value)} style={{...inputStyle,marginBottom:0}}/>
                  <button onClick={()=>removeFeat(pi,fi)} style={{ background:'rgba(255,77,77,0.1)', border:'1px solid rgba(255,77,77,0.2)', borderRadius:'6px', color:'#ff4d4d', cursor:'pointer', padding:'0 8px', fontSize:'0.8rem', flexShrink:0 }}>×</button>
                </div>
              ))}
              <button onClick={()=>addFeat(pi)} style={{ fontSize:'0.72rem', color:'var(--sky)', background:'rgba(16,161,219,0.08)', border:'1px solid rgba(16,161,219,0.2)', borderRadius:'7px', padding:'6px 12px', cursor:'pointer', fontFamily:'Inter,sans-serif', marginTop:'4px' }}>+ Add Feature</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
