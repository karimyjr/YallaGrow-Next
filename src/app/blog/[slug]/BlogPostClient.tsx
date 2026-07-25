// src/app/blog/[slug]/BlogPostClient.tsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image: string
  author: string
  tags: string[]
  read_time: string
  published_at: string
}

// Markdown to HTML converter
function markdownToHtml(md: string): string {
  if (!md) return ''
  let html = md

  const codeBlocks: string[] = []
  html = html.replace(/```([\s\S]*?)```/g, (_, code) => {
    codeBlocks.push(code)
    return `\x00CODEBLOCK${codeBlocks.length - 1}\x00`
  })

  const inlineCode: string[] = []
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    inlineCode.push(code)
    return `\x00INLINECODE${inlineCode.length - 1}\x00`
  })

  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>')

  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')

  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
  html = html.replace(/^---$/gm, '<hr />')

  const lines = html.split('\n')
  const processedLines: string[] = []
  let inUl = false
  let inOl = false

  for (const line of lines) {
    if (/^- (.+)/.test(line)) {
      if (!inUl) { processedLines.push('<ul>'); inUl = true }
      if (inOl) { processedLines.push('</ol>'); inOl = false }
      processedLines.push(line.replace(/^- (.+)/, '<li>$1</li>'))
    } else if (/^\d+\. (.+)/.test(line)) {
      if (!inOl) { processedLines.push('<ol>'); inOl = true }
      if (inUl) { processedLines.push('</ul>'); inUl = false }
      processedLines.push(line.replace(/^\d+\. (.+)/, '<li>$1</li>'))
    } else {
      if (inUl) { processedLines.push('</ul>'); inUl = false }
      if (inOl) { processedLines.push('</ol>'); inOl = false }
      processedLines.push(line)
    }
  }
  if (inUl) processedLines.push('</ul>')
  if (inOl) processedLines.push('</ol>')
  html = processedLines.join('\n')

  html = html.split(/\n\n+/).map(block => {
    const trimmed = block.trim()
    if (!trimmed) return ''
    if (/^<(h[1-6]|ul|ol|li|blockquote|hr|img|\/|pre)/.test(trimmed)) return trimmed
    return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`
  }).join('\n\n')

  html = html.replace(/\x00INLINECODE(\d+)\x00/g, (_, i) => `<code>${inlineCode[+i]}</code>`)
  html = html.replace(/\x00CODEBLOCK(\d+)\x00/g, (_, i) => `<pre><code>${codeBlocks[+i].replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`)

  return html
}

export default function BlogPostClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState<Post[]>([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (data) {
        setPost(data)
        if (data.tags && data.tags.length > 0) {
          const { data: rel } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('published', true)
            .neq('id', data.id)
            .overlaps('tags', data.tags)
            .limit(3)
          if (rel) setRelated(rel)
        }
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <div style={{ paddingTop: '80px', padding: '120px 20px', textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', margin: '0 auto 16px', border: '3px solid rgba(16,161,219,0.15)', borderTopColor: 'var(--sky)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading post...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (!post) {
    return (
      <div style={{ paddingTop: '80px', padding: '120px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--white)', marginBottom: '10px' }}>Post not found</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>This post doesn&apos;t exist or has been unpublished.</p>
        <Link href="/blog" className="btn-primary">← Back to Blog</Link>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: '80px' }}>
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px 100px' }}>
        <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--sky)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, marginBottom: '24px' }}>
          ← Back to Blog
        </Link>

        {post.tags && post.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {post.tags.map(t => (
              <span key={t} style={{ background: 'rgba(16,161,219,0.08)', border: '1px solid rgba(16,161,219,0.2)', borderRadius: '100px', padding: '4px 12px', fontSize: '0.68rem', fontWeight: 600, color: 'var(--sky)' }}>{t}</span>
            ))}
          </div>
        )}

        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--white)', letterSpacing: '-1px', lineHeight: 1.15, marginBottom: '20px' }}>
          {post.title}
        </h1>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '32px', flexWrap: 'wrap' }}>
          <span>By <strong style={{ color: 'var(--white)' }}>{post.author}</strong></span>
          <span>·</span>
          <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          {post.read_time && <><span>·</span><span>{post.read_time}</span></>}
        </div>

        {post.cover_image && (
          <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '40px', aspectRatio: '16/9' }}>
            <img src={post.cover_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
        />

        <div style={{ marginTop: '60px', padding: '32px', background: 'linear-gradient(135deg, rgba(1,32,76,0.4), rgba(106,70,217,0.08))', border: '1px solid rgba(16,161,219,0.2)', borderRadius: '16px', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.2rem', color: 'var(--white)', marginBottom: '10px' }}>
            Ready to grow your business?
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
            Book a free 30-minute strategy call and let&apos;s discuss how we can help.
          </p>
          <a href={process.env.NEXT_PUBLIC_BOOKING_URL} target="_blank" rel="noopener" className="btn-primary">
            Book a Free Call →
          </a>
        </div>
      </article>

      {related.length > 0 && (
        <section style={{ padding: '60px 6% 100px', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--white)', marginBottom: '24px', textAlign: 'center' }}>
              Keep Reading
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="related-grid">
              {related.map(p => (
                <Link key={p.id} href={`/blog/${p.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '20px', height: '100%', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(16,161,219,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
                    <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--white)', letterSpacing: '-0.3px', lineHeight: 1.3, marginBottom: '10px' }}>
                      {p.title}
                    </h3>
                    {p.excerpt && (
                      <p style={{ fontSize: '0.78rem', color: 'rgba(249,253,254,0.6)', lineHeight: 1.6, fontWeight: 300 }}>
                        {p.excerpt.substring(0, 100)}{p.excerpt.length > 100 ? '...' : ''}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        .blog-content {
          font-size: 1.05rem;
          line-height: 1.8;
          color: rgba(249,253,254,0.85);
          font-weight: 300;
        }
        .blog-content h1 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 2rem; color: var(--white); letter-spacing: -0.5px; margin: 40px 0 20px; line-height: 1.2; }
        .blog-content h2 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.6rem; color: var(--white); letter-spacing: -0.5px; margin: 36px 0 16px; line-height: 1.25; }
        .blog-content h3 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.25rem; color: var(--white); margin: 28px 0 14px; line-height: 1.3; }
        .blog-content p { margin-bottom: 20px; }
        .blog-content a { color: var(--sky); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 2px; }
        .blog-content a:hover { color: var(--white); }
        .blog-content strong { color: var(--white); font-weight: 700; }
        .blog-content em { font-style: italic; }
        .blog-content ul, .blog-content ol { margin: 20px 0; padding-left: 24px; }
        .blog-content li { margin-bottom: 8px; }
        .blog-content blockquote { border-left: 3px solid var(--sky); padding-left: 20px; margin: 24px 0; font-style: italic; color: rgba(249,253,254,0.7); }
        .blog-content code { background: rgba(16,161,219,0.08); border: 1px solid rgba(16,161,219,0.15); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; font-family: monospace; color: var(--sky); }
        .blog-content pre { background: rgba(0,0,0,0.4); border: 1px solid var(--glass-border); border-radius: 10px; padding: 16px; overflow-x: auto; margin: 24px 0; }
        .blog-content pre code { background: transparent; border: none; padding: 0; color: var(--white); }
        .blog-content hr { border: none; border-top: 1px solid var(--glass-border); margin: 40px 0; }
        .blog-content img { max-width: 100%; border-radius: 12px; margin: 24px 0; }
        @media(max-width:900px){
          .related-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  )
}
