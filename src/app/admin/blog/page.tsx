'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/Toast'

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image: string
  author: string
  tags: string[]
  published: boolean
  featured: boolean
  read_time: string
  created_at: string
  updated_at: string
  published_at: string | null
}

const EMPTY_POST: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'published_at'> = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  cover_image: '',
  author: 'YallaGrow',
  tags: [],
  published: false,
  featured: false,
  read_time: '5 min read',
}

export default function AdminBlogPage() {
  const { showToast } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [editing, setEditing] = useState<Post | typeof EMPTY_POST | null>(null)
  const [search, setSearch] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  const loadPosts = useCallback(async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('updated_at', { ascending: false })
    if (data) setPosts(data)
  }, [])

  useEffect(() => { loadPosts() }, [loadPosts])

  const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const save = async () => {
    if (!editing) return
    if (!editing.title.trim()) { showToast('Title is required', 'error'); return }
    if (!editing.slug.trim()) { showToast('Slug is required', 'error'); return }

    const payload = {
      slug: editing.slug,
      title: editing.title,
      excerpt: editing.excerpt,
      content: editing.content,
      cover_image: editing.cover_image,
      author: editing.author,
      tags: editing.tags,
      published: editing.published,
      featured: editing.featured,
      read_time: editing.read_time,
      updated_at: new Date().toISOString(),
      published_at: editing.published && !('published_at' in editing && editing.published_at)
        ? new Date().toISOString()
        : ('published_at' in editing ? editing.published_at : null),
    }

    const isNew = !('id' in editing)
    if (isNew) {
      const { error } = await supabase.from('blog_posts').insert(payload)
      if (error) {
        if (error.code === '23505') {
          showToast('A post with that slug already exists', 'error')
        } else {
          showToast('Failed to save: ' + error.message, 'error')
        }
        return
      }
      showToast('Post created successfully!', 'success')
    } else {
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', (editing as Post).id)
      if (error) { showToast('Failed to update: ' + error.message, 'error'); return }
      showToast('Post updated successfully!', 'success')
    }
    setEditing(null)
    loadPosts()
  }

  const del = async (post: Post) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    await supabase.from('blog_posts').delete().eq('id', post.id)
    showToast('Post deleted', 'info')
    loadPosts()
  }

  const togglePublish = async (post: Post) => {
    const newState = !post.published
    await supabase.from('blog_posts').update({
      published: newState,
      published_at: newState ? new Date().toISOString() : null,
    }).eq('id', post.id)
    showToast(newState ? 'Post published!' : 'Post unpublished', 'success')
    loadPosts()
  }

  const openEditor = (post: Post | null) => {
    if (post) {
      setEditing(post)
      setTagsInput(post.tags?.join(', ') || '')
    } else {
      setEditing({ ...EMPTY_POST })
      setTagsInput('')
    }
  }

  const updateEditing = (updates: Partial<typeof EMPTY_POST>) => {
    if (!editing) return
    setEditing({ ...editing, ...updates })
  }

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement
    if (!textarea || !editing) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = editing.content
    const selected = text.substring(start, end)
    const newText = text.substring(0, start) + before + selected + after + text.substring(end)
    updateEditing({ content: newText })
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 10)
  }

  const filteredPosts = posts.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.slug?.toLowerCase().includes(search.toLowerCase())
  )

  // ============ EDITOR VIEW ============
  if (editing) {
    return (
      <div style={{ padding: '32px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <button onClick={() => setEditing(null)} style={{
          background: 'none', border: 'none', color: 'var(--sky)',
          fontSize: '0.85rem', cursor: 'pointer', marginBottom: '20px',
        }}>← Back to Posts</button>

        <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--white)', marginBottom: '20px' }}>
          {'id' in editing ? 'Edit Post' : 'New Post'}
        </h2>

        {/* Title & Slug */}
        <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
          <label style={labelStyle}>Title *</label>
          <input
            value={editing.title}
            onChange={e => {
              const title = e.target.value
              updateEditing({
                title,
                slug: !('id' in editing) || editing.slug === slugify(editing.title) ? slugify(title) : editing.slug,
              })
            }}
            placeholder="Your post title..."
            style={{ ...inputStyle, marginBottom: '12px' }}
          />
          <label style={labelStyle}>Slug (URL) *</label>
          <input
            value={editing.slug}
            onChange={e => updateEditing({ slug: slugify(e.target.value) })}
            placeholder="your-post-url"
            style={{ ...inputStyle, marginBottom: '12px', fontFamily: 'monospace' }}
          />
          <label style={labelStyle}>Excerpt (short summary shown on blog list)</label>
          <textarea
            value={editing.excerpt}
            onChange={e => updateEditing({ excerpt: e.target.value })}
            placeholder="A short 1-2 sentence summary..."
            rows={2}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* Metadata */}
        <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>Author</label>
              <input value={editing.author} onChange={e => updateEditing({ author: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Read time</label>
              <input value={editing.read_time} onChange={e => updateEditing({ read_time: e.target.value })} placeholder="5 min read" style={inputStyle} />
            </div>
          </div>
          <label style={labelStyle}>Cover Image URL</label>
          <input
            value={editing.cover_image}
            onChange={e => updateEditing({ cover_image: e.target.value })}
            placeholder="https://..."
            style={{ ...inputStyle, marginBottom: '12px' }}
          />
          <label style={labelStyle}>Tags (comma-separated)</label>
          <input
            value={tagsInput}
            onChange={e => {
              setTagsInput(e.target.value)
              updateEditing({ tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })
            }}
            placeholder="marketing, strategy, social media"
            style={inputStyle}
          />
        </div>

        {/* Content editor with markdown toolbar */}
        <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
          <label style={{ ...labelStyle, marginBottom: '10px' }}>Content (Markdown)</label>

          {/* Markdown toolbar */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px', padding: '10px', background: 'rgba(249,253,254,0.02)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <ToolbarBtn onClick={() => insertMarkdown('# ')}>H1</ToolbarBtn>
            <ToolbarBtn onClick={() => insertMarkdown('## ')}>H2</ToolbarBtn>
            <ToolbarBtn onClick={() => insertMarkdown('### ')}>H3</ToolbarBtn>
            <ToolbarBtn onClick={() => insertMarkdown('**', '**')}><strong>B</strong></ToolbarBtn>
            <ToolbarBtn onClick={() => insertMarkdown('*', '*')}><em>I</em></ToolbarBtn>
            <ToolbarBtn onClick={() => insertMarkdown('~~', '~~')}><s>S</s></ToolbarBtn>
            <ToolbarBtn onClick={() => insertMarkdown('[', '](url)')}>🔗 Link</ToolbarBtn>
            <ToolbarBtn onClick={() => insertMarkdown('![alt](', ')')}>🖼 Image</ToolbarBtn>
            <ToolbarBtn onClick={() => insertMarkdown('\n- ')}>• List</ToolbarBtn>
            <ToolbarBtn onClick={() => insertMarkdown('\n1. ')}>1. List</ToolbarBtn>
            <ToolbarBtn onClick={() => insertMarkdown('\n> ')}>❝ Quote</ToolbarBtn>
            <ToolbarBtn onClick={() => insertMarkdown('`', '`')}>Code</ToolbarBtn>
            <ToolbarBtn onClick={() => insertMarkdown('\n```\n', '\n```\n')}>Code Block</ToolbarBtn>
            <ToolbarBtn onClick={() => insertMarkdown('\n---\n')}>― HR</ToolbarBtn>
          </div>

          <textarea
            id="content-editor"
            value={editing.content}
            onChange={e => updateEditing({ content: e.target.value })}
            placeholder="Write your post content in markdown...

# Heading 1
## Heading 2

Regular paragraph text with **bold** and *italic*.

- Bullet point
- Another point

[Link text](https://example.com)

![Image alt text](https://example.com/image.jpg)

> A blockquote for emphasis

`inline code`

```
code block
```"
            rows={20}
            style={{
              ...inputStyle,
              resize: 'vertical',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              lineHeight: 1.6,
              minHeight: '400px',
            }}
          />

          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '10px' }}>
            💡 <strong>Tip:</strong> Highlight text first, then click the toolbar buttons to wrap it. Uses standard markdown syntax.
          </div>
        </div>

        {/* Publish settings */}
        <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '0.85rem', color: 'var(--white)', marginBottom: '14px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Settings</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={editing.published} onChange={e => updateEditing({ published: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: 'var(--sky)' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--white)' }}>Published (visible to public)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={editing.featured} onChange={e => updateEditing({ featured: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: 'var(--sky)' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--white)' }}>Featured (show at top)</span>
            </label>
          </div>
        </div>

        {/* Save buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button>
          <button onClick={save} className="btn-primary">{'id' in editing ? 'Update Post' : 'Create Post'}</button>
        </div>
      </div>
    )
  }

  // ============ LIST VIEW ============
  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--white)', marginBottom: '4px' }}>📝 Blog Posts</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Manage your blog posts.</p>
        </div>
        <button onClick={() => openEditor(null)} className="btn-primary">+ New Post</button>
      </div>

      <input
        placeholder="🔍 Search posts..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ ...inputStyle, maxWidth: '400px', marginBottom: '20px' }}
      />

      {filteredPosts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
          {posts.length === 0 ? 'No posts yet. Create your first one!' : 'No posts match your search.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredPosts.map(p => (
            <div key={p.id} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <strong style={{ color: 'var(--white)', fontSize: '0.95rem' }}>{p.title}</strong>
                  {p.featured && <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '4px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>★ Featured</span>}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  <code style={{ color: 'var(--sky)' }}>/{p.slug}</code> · {p.author} · {new Date(p.updated_at).toLocaleDateString()}
                  {p.tags?.length > 0 && <> · {p.tags.slice(0, 3).join(', ')}</>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button onClick={() => togglePublish(p)} style={p.published ? statusActive : statusSuspended}>
                  {p.published ? '● Published' : '○ Draft'}
                </button>
                <button onClick={() => openEditor(p)} style={btnPrimary}>Edit</button>
                <button onClick={() => del(p)} style={btnDelete}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ToolbarBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'rgba(16,161,219,0.05)',
        border: '1px solid var(--glass-border)',
        color: 'var(--white)',
        padding: '5px 10px',
        borderRadius: '6px',
        fontSize: '0.75rem',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,161,219,0.15)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(16,161,219,0.05)'}
    >{children}</button>
  )
}

const inputStyle: React.CSSProperties = { background: 'rgba(249,253,254,0.03)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '10px 12px', color: 'var(--white)', fontFamily: 'Inter,sans-serif', fontSize: '0.85rem', outline: 'none', width: '100%' }
const labelStyle: React.CSSProperties = { fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '6px', display: 'block', fontWeight: 600, letterSpacing: '0.5px' }
const btnPrimary: React.CSSProperties = { background: 'var(--sky)', color: 'var(--dark)', border: 'none', padding: '7px 14px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }
const btnDelete: React.CSSProperties = { background: 'transparent', color: 'var(--text-dim)', border: '1px solid var(--glass-border)', padding: '5px 10px', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer' }
const statusActive: React.CSSProperties = { fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: '100px', letterSpacing: '1px', background: 'rgba(16,219,100,0.1)', color: '#16db64', border: '1px solid rgba(16,219,100,0.25)', cursor: 'pointer' }
const statusSuspended: React.CSSProperties = { fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: '100px', letterSpacing: '1px', background: 'rgba(255,193,7,0.1)', color: '#ffc107', border: '1px solid rgba(255,193,7,0.25)', cursor: 'pointer' }
