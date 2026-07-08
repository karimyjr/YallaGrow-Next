'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Post { id:string; title:string; excerpt:string; category:string; date:string; emoji:string; readtime:string }

export default function BlogPage() {
  const [posts,setPosts]=useState<Post[]>([])

  useEffect(()=>{
    supabase.from('blogs').select('*').order('created_at',{ascending:false}).then(({data})=>{
      if(data&&data.length>0) setPosts(data)
      else setPosts([
        {id:'1',title:'How Lebanese Businesses Can Win on Social Media in 2025',excerpt:'The landscape has shifted. Here is what actually works for small businesses in Lebanon right now.',category:'Social Media',date:'Jun 2025',emoji:'📱',readtime:'5 min'},
        {id:'2',title:'Why Your Ads Aren\u2019t Converting (And How to Fix It)',excerpt:'Most businesses blame the algorithm. The real problem is almost always the offer, the audience, or the creative.',category:'Paid Ads',date:'May 2025',emoji:'💰',readtime:'7 min'},
        {id:'3',title:'The Content Calendar That Actually Works for Small Teams',excerpt:'You don\u2019t need to post every day. You need to post the right things consistently.',category:'Content',date:'Apr 2025',emoji:'📅',readtime:'4 min'},
      ])
    })
  },[])

  return (
    <div style={{paddingTop:'80px'}}>
      <div style={{padding:'80px 6%'}}>
        <span className="eyebrow" style={{marginBottom:'12px'}}>Insights & Ideas</span>
        <h1 className="section-title" style={{margin:'12px 0 16px'}}>The YallaGrow Blog</h1>
        <p className="section-sub" style={{marginBottom:'60px'}}>Practical marketing insights from our team.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px'}}>
          {posts.map(p=>(
            <div key={p.id} style={{background:'var(--glass)',border:'1px solid var(--glass-border)',borderRadius:'16px',overflow:'hidden',transition:'all 0.3s',cursor:'pointer'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(16,161,219,0.2)';e.currentTarget.style.transform='translateY(-4px)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--glass-border)';e.currentTarget.style.transform='none'}}>
              <div style={{background:'linear-gradient(135deg,rgba(16,161,219,0.08),rgba(106,70,217,0.06))',padding:'32px 24px',fontSize:'2.5rem',textAlign:'center'}}>{p.emoji||'📝'}</div>
              <div style={{padding:'24px'}}>
                <div style={{display:'flex',gap:'8px',marginBottom:'12px',flexWrap:'wrap'}}>
                  <span style={{fontSize:'0.62rem',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:'var(--sky)',background:'rgba(16,161,219,0.1)',padding:'3px 8px',borderRadius:'6px'}}>{p.category}</span>
                  <span style={{fontSize:'0.65rem',color:'var(--text-dim)'}}>{p.readtime} read</span>
                </div>
                <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'0.95rem',color:'var(--white)',marginBottom:'8px',lineHeight:1.4}}>{p.title}</h3>
                <p style={{fontSize:'0.75rem',color:'var(--text-muted)',lineHeight:1.6,fontWeight:300}}>{p.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
