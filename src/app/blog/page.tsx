'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  cover_image: string
  author: string
  tags: string[]
  featured: boolean
  read_time: string
  published_at: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })
      if (data) setPosts(data)
      setLoading(false)
    }
    load()
  }, [])

  const featured = posts.filter(p => p.featured)
  const regular = posts.filter(p => !p.featured)

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* HERO */}
      <section style={{ padding: '80px 6% 40px', textAlign: 'center' }}>
        <span className="eyebrow" style={{ marginBottom: '12px' }}>Blog</span>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(2.4rem,5vw,4rem)', letterSpacing: '-2px', lineHeight: 1.05, color: 'var(--white)', marginTop: '12px' }}>
          Insights That<br />Drive <span className="grad">Growth</span>
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '520px', margin: '20px auto 0', lineHeight: 1.7, fontWeight: 300 }}>
          Actionable strategies, case studies, and lessons from running a marketing agency in Lebanon.
        </p>
      </section>

      {/* CONTENT */}
      <section style={{ padding: '40px 6% 100px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ width: '40px', height: '40px', margin: '0 auto 16px', border: '3px solid rgba(16,161,219,0.15)', borderTopColor: 'var(--sky)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Loading posts...
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✍️</div>
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'var(--white)', marginBottom: '8px' }}>Coming Soon</h3>
            <p style={{ fontSize: '0.9rem' }}>We&apos;re working on some great content. Check back soon!</p>
          </div>
        ) : (
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Featured post */}
            {featured.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '16px' }}>⭐ Featured</div>
                <Link href={`/blog/${featured[0].slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <article style={{
                    background: 'linear-gradient(135deg, rgba(1,32,76,0.4), rgba(16,161,219,0.06))',
                    border: '1px solid rgba(16,161,219,0.2)',
                    borderRadius: '20px',
                    padding: '40px',
                    display: 'grid',
                    gridTemplateColumns: featured[0].cover_image ? '1fr 1fr' : '1fr',
                    gap: '32px',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                  }} className="featured-card"
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(16,161,219,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(16,161,219,0.2)'}>
                    <div>
                      {featured[0].tags && featured[0].tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
                          {featured[0].tags.slice(0, 3).map(t => (
                            <span key={t} style={{ background: 'rgba(16,161,219,0.08)', border: '1px solid rgba(16,161,219,0.2)', borderRadius: '100px', padding: '3px 10px', fontSize: '0.65rem', fontWeight: 600, color: 'var(--sky)' }}>{t}</span>
                          ))}
                        </div>
                      )}
                      <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: 'var(--white)', letterSpacing: '-0.5px', lineHeight: 1.15, marginBottom: '14px' }}>
                        {featured[0].title}
                      </h2>
                      <p style={{ fontSize: '0.92rem', color: 'rgba(249,253,254,0.65)', lineHeight: 1.7, fontWeight: 300, marginBottom: '20px' }}>
                        {featured[0].excerpt}
                      </p>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                        <span>{featured[0].author}</span>
                        <span>·</span>
                        <span>{new Date(featured[0].published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        {featured[0].read_time && <><span>·</span><span>{featured[0].read_time}</span></>}
                      </div>
                    </div>
                    {featured[0].cover_image && (
                      <div style={{ borderRadius: '14px', overflow: 'hidden', aspectRatio: '4/3' }}>
                        <img src={featured[0].cover_image} alt={featured[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </article>
                </Link>
              </div>
            )}

            {/* Regular posts grid */}
            {regular.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>All Posts</div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="posts-grid">
                  {regular.map(p => (
                    <Link key={p.id} href={`/blog/${p.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                      <article style={{
                        background: 'var(--glass)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        transition: 'all 0.2s',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,161,219,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'none' }}>
                        {p.cover_image && (
                          <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                            <img src={p.cover_image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}
                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          {p.tags && p.tags.length > 0 && (
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px', flexWrap: 'wrap' }}>
                              {p.tags.slice(0, 2).map(t => (
                                <span key={t} style={{ background: 'rgba(16,161,219,0.08)', border: '1px solid rgba(16,161,219,0.15)', borderRadius: '100px', padding: '2px 8px', fontSize: '0.6rem', fontWeight: 600, color: 'var(--sky)' }}>{t}</span>
                              ))}
                            </div>
                          )}
                          <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--white)', letterSpacing: '-0.3px', lineHeight: 1.3, marginBottom: '10px' }}>
                            {p.title}
                          </h3>
                          {p.excerpt && (
                            <p style={{ fontSize: '0.82rem', color: 'rgba(249,253,254,0.6)', lineHeight: 1.6, fontWeight: 300, marginBottom: '16px', flex: 1 }}>
                              {p.excerpt}
                            </p>
                          )}
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 'auto' }}>
                            <span>{new Date(p.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            {p.read_time && <><span>·</span><span>{p.read_time}</span></>}
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <style>{`
        @media(max-width:900px){
          .posts-grid{grid-template-columns:1fr 1fr!important}
          .featured-card{grid-template-columns:1fr!important;padding:24px!important}
        }
        @media(max-width:600px){
          .posts-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  )
}
