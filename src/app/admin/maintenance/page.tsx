'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminMaintenance() {
  const [active, setActive] = useState(false)
  const [title, setTitle] = useState("We'll Be Right Back")
  const [message, setMessage] = useState("We're currently updating our website. This won't take long.")
  const [icon, setIcon] = useState('🔧')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.from('site_config').select('*').eq('key','maintenance').then(({data})=>{
      if (data && data.length > 0) {
        try {
          const s = JSON.parse(data[0].value)
          setActive(s.active||false); setTitle(s.title||"We'll Be Right Back"); setMessage(s.msg||''); setIcon(s.icon||'🔧')
        } catch {}
      }
    })
  }, [])

  const save = async (newActive?: boolean) => {
    const a = newActive !== undefined ? newActive : active
    setSaving(true)
    await supabase.from('site_config').upsert({ key:'maintenance', value:JSON.stringify({ active:a, title, msg:message, icon }) }, { onConflict:'key' })
    setSaving(false); setMsg('✓ Saved!'); setTimeout(()=>setMsg(''),2500)
  }

  const toggle = async () => {
    const next = !active; setActive(next); await save(next)
  }

  const inputStyle = { width:'100%', background:'rgba(249,253,254,0.03)', border:'1px solid var(--glass-border)', borderRadius:'10px', padding:'10px 14px', color:'var(--white)', fontFamily:'Inter,sans-serif', fontSize:'0.85rem', outline:'none' } as React.CSSProperties

  return (
    <div style={{ maxWidth:'600px' }}>
      <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.3rem', color:'var(--white)', marginBottom:'24px' }}>🔧 Maintenance Mode</h2>

      {/* Toggle */}
      <div style={{ background:'var(--glass)', border:`1px solid ${active?'rgba(255,77,77,0.3)':'var(--glass-border)'}`, borderRadius:'16px', padding:'24px', marginBottom:'24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.95rem', color:'var(--white)', marginBottom:'4px' }}>Maintenance Mode</h3>
          <p style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>When ON, all visitors see the maintenance page</p>
          <div style={{ marginTop:'8px', display:'inline-flex', alignItems:'center', gap:'6px', padding:'4px 10px', borderRadius:'100px', fontSize:'0.65rem', fontWeight:700, background:active?'rgba(255,77,77,0.1)':'rgba(16,219,100,0.1)', color:active?'#ff4d4d':'#16db64', border:`1px solid ${active?'rgba(255,77,77,0.2)':'rgba(16,219,100,0.2)'}` }}>
            <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'currentColor' }}/>
            {active ? '🔴 MAINTENANCE ON — SITE IS DOWN FOR VISITORS' : '🟢 WEBSITE LIVE'}
          </div>
        </div>
        <button onClick={toggle} disabled={saving}
          style={{ position:'relative', width:'52px', height:'28px', borderRadius:'28px', border:`1px solid ${active?'rgba(255,77,77,0.4)':'var(--glass-border)'}`, background:active?'rgba(255,77,77,0.2)':'rgba(249,253,254,0.1)', cursor:'pointer', transition:'all 0.3s', flexShrink:0 }}>
          <div style={{ position:'absolute', width:'20px', height:'20px', borderRadius:'50%', background:active?'#ff4d4d':'rgba(249,253,254,0.4)', top:'3px', left:active?'27px':'3px', transition:'all 0.3s' }}/>
        </button>
      </div>

      {/* Customize */}
      <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'24px' }}>
        <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.85rem', color:'var(--sky)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'16px' }}>Customize Maintenance Page</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'10px', marginBottom:'10px' }}>
          <div>
            <label style={{ fontSize:'0.62rem', color:'var(--text-dim)', display:'block', marginBottom:'4px' }}>Title</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} style={inputStyle}/>
          </div>
          <div>
            <label style={{ fontSize:'0.62rem', color:'var(--text-dim)', display:'block', marginBottom:'4px' }}>Icon</label>
            <input value={icon} onChange={e=>setIcon(e.target.value)} style={{...inputStyle,width:'60px',textAlign:'center'}}/>
          </div>
        </div>
        <div style={{ marginBottom:'16px' }}>
          <label style={{ fontSize:'0.62rem', color:'var(--text-dim)', display:'block', marginBottom:'4px' }}>Message</label>
          <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={3} style={{...inputStyle,resize:'vertical'}}/>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={()=>save()} disabled={saving} className="btn-primary">{saving?'Saving…':'Save Settings'}</button>
          {msg && <span style={{ fontSize:'0.78rem', color:'#16db64' }}>{msg}</span>}
        </div>
      </div>

      <div style={{ marginTop:'16px', background:'rgba(255,193,7,0.05)', border:'1px solid rgba(255,193,7,0.15)', borderRadius:'12px', padding:'14px 18px', fontSize:'0.75rem', color:'rgba(249,253,254,0.5)', lineHeight:1.6 }}>
        ⚠️ <strong style={{ color:'rgba(249,253,254,0.7)' }}>Important:</strong> When maintenance is ON, all visitors see the maintenance page immediately. You can still access <strong style={{ color:'var(--sky)' }}>/admin</strong> because your browser has the admin session.
      </div>
    </div>
  )
}
