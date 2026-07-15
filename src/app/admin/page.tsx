'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Post { id: string; title: string; excerpt: string; content: string; category: string; readtime: string; date: string; emoji: string }
const EMPTY: Omit<Post,'id'> = { title:'', excerpt:'', content:'', category:'', readtime:'5 min', date:'', emoji:'📝' }

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [form, setForm] = useState<Omit<Post,'id'>>(EMPTY)
  const [editId, setEditId] = useState<string|null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const load = async () => {
    const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false })
    if (data) setPosts(data)
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.title) { alert('Title is required'); return }
    setSaving(true)
    if (editId) {
      await supabase.from('blogs').update({ ...form, date: form.date || new Date().toLocaleDateString('en-GB',{month:'short',year:'numeric'}) }).eq('id', editId)
    } else {
      await supabase.from('blogs').insert({ ...form, date: form.date || new Date().toLocaleDateString('en-GB',{month:'short',year:'numeric'}) })
    }
    setForm(EMPTY); setEditId(null); setSaving(false); setMsg('✓ Saved!'); load()
    setTimeout(() => setMsg(''), 2500)
  }

  const del = async (id: string) => {
    if (!confirm('Delete this post?')) return
    await supabase.from('blogs').delete().eq('id', id); load()
  }

  const edit = (p: Post) => { setForm({ title:p.title, excerpt:p.excerpt, content:p.content, category:p.category, readtime:p.readtime, date:p.date, emoji:p.emoji }); setEditId(p.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const inputStyle = { width:'100%', background:'rgba(249,253,254,0.03)', border:'1px solid var(--glass-border)', borderRadius:'10px', padding:'10px 14px', color:'var(--white)', fontFamily:'Inter,sans-serif', fontSize:'0.85rem', outline:'none', marginBottom:'10px' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.3rem', color:'var(--white)' }}>{editId ? '✏️ Edit Post' : '✏️ New Post'}</h2>
        {msg && <span style={{ fontSize:'0.78rem', color:'#16db64' }}>{msg}</span>}
      </div>

      {/* Form */}
      <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'24px', marginBottom:'32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
          <input placeholder="Title *" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={inputStyle}/>
          <input placeholder="Category (e.g. Social Media)" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={inputStyle}/>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px' }}>
          <input placeholder="Emoji (e.g. 📱)" value={form.emoji} onChange={e=>setForm({...form,emoji:e.target.value})} style={inputStyle}/>
          <input placeholder="Read time (e.g. 5 min)" value={form.readtime} onChange={e=>setForm({...form,readtime:e.target.value})} style={inputStyle}/>
          <input placeholder="Date (e.g. Jun 2025)" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inputStyle}/>
        </div>
        <textarea placeholder="Excerpt (short summary)" rows={2} value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})} style={{...inputStyle,resize:'vertical'}}/>
        <textarea placeholder="Full content (supports basic HTML)" rows={6} value={form.content} onChange={e=>setForm({...form,content:e.target.value})} style={{...inputStyle,resize:'vertical'}}/>
        <div style={{ display:'flex', gap:'10px' }}>
          <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving…' : editId ? 'Update Post' : 'Publish Post'}</button>
          {editId && <button onClick={()=>{setForm(EMPTY);setEditId(null)}} className="btn-secondary">Cancel</button>}
        </div>
      </div>

      {/* Posts list */}
      <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.85rem', color:'var(--sky)', letterSpacing:'2px', textTransform:'uppercase', marginBottom:'16px' }}>All Posts ({posts.length})</h3>
      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {posts.map(p => (
          <div key={p.id} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'12px', padding:'16px 20px', display:'flex', alignItems:'center', gap:'16px' }}>
            <span style={{ fontSize:'1.5rem' }}>{p.emoji}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:'0.88rem', fontWeight:600, color:'var(--white)', marginBottom:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.title}</div>
              <div style={{ fontSize:'0.68rem', color:'var(--text-dim)' }}>{p.category} · {p.date} · {p.readtime} read</div>
            </div>
            <div style={{ display:'flex', gap:'8px', flexShrink:0 }}>
              <button onClick={()=>edit(p)} style={{ padding:'6px 14px', borderRadius:'7px', fontSize:'0.72rem', fontWeight:600, background:'transparent', border:'1px solid rgba(16,161,219,0.3)', color:'var(--sky)', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>Edit</button>
              <button onClick={()=>del(p.id)} style={{ padding:'6px 14px', borderRadius:'7px', fontSize:'0.72rem', fontWeight:600, background:'transparent', border:'1px solid rgba(255,77,77,0.3)', color:'#ff4d4d', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>Delete</button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text-dim)', fontSize:'0.82rem' }}>No posts yet. Write your first one above.</div>}
      </div>
    </div>
  )
}
