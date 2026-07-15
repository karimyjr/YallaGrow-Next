'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { usePathname } from 'next/navigation'

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const [maintenance, setMaintenance] = useState(false)
  const [settings, setSettings] = useState({ title:"We'll Be Right Back", msg:"We're currently updating our website. This won't take long.", icon:'🔧' })
  const pathname = usePathname()

  useEffect(() => {
    // Never block admin
    if (pathname.startsWith('/admin')) return
    // Check if admin session exists
    if (sessionStorage.getItem('yg_admin') === 'true') return

    supabase.from('site_config').select('value').eq('key','maintenance').single().then(({ data }) => {
      if (data) {
        try {
          const s = JSON.parse(data.value)
          if (s.active) {
            setSettings({ title: s.title || "We'll Be Right Back", msg: s.msg || '', icon: s.icon || '🔧' })
            setMaintenance(true)
          }
        } catch {}
      }
    })
  }, [pathname])

  if (maintenance) {
    return (
      <div style={{ minHeight:'100vh', background:'#060c14', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'40px' }}>
        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.5rem', color:'#f9fdfe', marginBottom:'40px' }}>
          Yalla<em style={{ color:'#10a1db', fontStyle:'normal' }}>Grow</em>
        </div>
        <div style={{ width:'72px', height:'72px', borderRadius:'18px', background:'rgba(16,161,219,0.1)', border:'1px solid rgba(16,161,219,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', margin:'0 auto 28px', animation:'pulse 2s ease-in-out infinite' }}>
          {settings.icon}
        </div>
        <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'clamp(1.8rem,5vw,3rem)', color:'#f9fdfe', letterSpacing:'-1px', marginBottom:'16px', lineHeight:1.1 }}>{settings.title}</h1>
        <p style={{ fontSize:'1rem', color:'rgba(249,253,254,0.5)', maxWidth:'480px', lineHeight:1.7, fontWeight:300, marginBottom:'32px' }}>{settings.msg}</p>
        <a href="https://wa.me/447376441603" target="_blank" rel="noopener" style={{ color:'#10a1db', fontSize:'0.82rem', textDecoration:'none' }}>Need help? WhatsApp us →</a>
        <style>{`@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(16,161,219,0.3)}50%{box-shadow:0 0 0 20px rgba(16,161,219,0)}}`}</style>
      </div>
    )
  }

  return <>{children}</>
}
