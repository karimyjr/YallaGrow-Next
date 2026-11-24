'use client'
// Resources — ready-to-send DMs, pitch snippets, and FAQ for affiliates.
// Every template substitutes the affiliate's own referral link so they can
// copy and paste without editing.

import { useState } from 'react'
import { useAffiliate } from '@/components/affiliate/AffiliateContext'
import { PageHeader, SectionTitle } from '@/components/affiliate/AffiliateUI'

export default function AffiliateResourcesPage() {
  const { affiliate } = useAffiliate()
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yallagrow.net'
  const link = `${siteUrl}/?ref=${affiliate.ref_code}`
  const firstName = affiliate.full_name.split(' ')[0]

  const templates: { id: string; title: string; context: string; body: string }[] = [
    {
      id: 'whatsapp-intro',
      title: 'WhatsApp — first reach-out',
      context: 'For a cold DM to a Lebanese small-business owner who you know is doing their marketing themselves.',
      body:
`Hey, hope you're doing well! I've been following your page and I think you have a great product but your marketing could seriously bring in more customers.

I work with YallaGrow — they're a small Lebanese agency that does content, ads, and websites for businesses like yours, with Lebanese pricing. They already work with a few local brands.

If you want, take a look here (my referral link): ${link}

No pressure, happy to answer any question.
— ${firstName}`,
    },
    {
      id: 'instagram-dm',
      title: 'Instagram DM — after engaging with a post',
      context: 'For a warm DM after you liked/commented on their posts.',
      body:
`Your last post was actually really good — the hook pulled me in. Curious how you handle the content side, is it you or someone else?

Reason I'm asking is I work with YallaGrow, a Lebanese marketing agency that does reels/ads/sites for small businesses. If you ever want a hand, this is my link: ${link}

Not trying to sell, just offering in case it helps.`,
    },
    {
      id: 'email-cold',
      title: 'Email — cold pitch',
      context: 'For businesses with a website or a contact email and no social presence to engage with.',
      body:
`Subject: Quick idea for [BUSINESS NAME]

Hi [NAME],

I came across [BUSINESS NAME] and it stood out — [one real detail you noticed: product, service, location, review].

The one thing I'd change is [social media / ads / website / landing page]. That's probably why [outcome they're missing].

I work with YallaGrow — a Lebanese agency that handles exactly this, with Lebanese pricing (not the Dubai one). They offer a 7-day pilot for $49 so you can test it without committing.

If it's useful, here's the link: ${link}

Happy to answer questions.

— ${firstName}`,
    },
    {
      id: 'post-caption',
      title: 'Caption — your own Instagram post or story',
      context: 'For a soft-recommendation post on your own feed/story.',
      body:
`I don't usually plug things but I've seen what @yallagrow_ is doing for small Lebanese businesses and it's actually good.

Content that converts, ads that aren't thrown away, websites that load. Lebanese pricing.

If you own a business or know someone who does, link in bio or here: ${link}`,
    },
  ]

  const pitchPoints = [
    { label: 'What they do',   text: 'Social media content (reels, carousels, static), Meta & TikTok ads, websites, brand identity. Done by actual humans in Lebanon.' },
    { label: 'Who they help',  text: 'Lebanese small businesses and startups — restaurants, boutiques, clinics, service businesses, D2C brands.' },
    { label: 'Entry offer',    text: '$49 for a 7-day pilot: content audit + 1 week of posts + a 30-min strategy call. No contract.' },
    { label: 'Pricing',        text: 'Custom monthly packages scaled to the business. Lebanese pricing — not Dubai, not London.' },
    { label: 'What you earn',  text: `Your code is ${affiliate.ref_code}. Commission depends on the deal size and gets logged on your dashboard the moment they pay.` },
    { label: 'Avoid',          text: 'Don\'t promise specific results, don\'t quote prices, don\'t say the agency does anything beyond the list above. Send them to the site to decide.' },
  ]

  const faqs = [
    {
      q: 'How do I know if a referral was logged?',
      a: 'The business has to click your referral link at least once before they buy. The system matches on that click and credits your code. If someone buys without clicking the link, tell Karim on WhatsApp — he can manually credit you.',
    },
    {
      q: 'When do I get paid?',
      a: 'Commissions become eligible for payout once the client has paid their invoice and the referral is marked "paid" in the system. You can request a payout once your pending balance hits $25. Processed monthly within 3 business days.',
    },
    {
      q: 'What counts as a referral?',
      a: 'Any business that buys any YallaGrow package through your link — pilot, monthly retainer, one-off website. Repeat purchases from the same client in the first 6 months also count.',
    },
    {
      q: 'Can I run paid ads with my link?',
      a: 'Not to the YallaGrow domain directly without asking. Send paid traffic to a page you own (your own landing page / linktree) and link from there. Protects everyone\'s ad accounts.',
    },
    {
      q: 'Can I pitch outside Lebanon?',
      a: 'YallaGrow only takes Lebanese clients right now, so referrals from outside Lebanon will not convert. Focus on Lebanon.',
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Everything you need to pitch"
        subtitle="Copy-paste templates with your referral link already filled in."
      />

      {/* Link reminder */}
      <div style={{
        padding: '14px 18px',
        background: 'linear-gradient(135deg, rgba(16,161,219,0.14), rgba(141,92,255,0.06))',
        border: '1px solid rgba(16,161,219,0.25)',
        borderRadius: '12px',
        marginBottom: '28px',
        display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.6px', color: 'var(--sky)', marginBottom: '4px' }}>Your referral link</div>
          <code style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: '0.84rem', color: 'var(--white)', wordBreak: 'break-all' }}>{link}</code>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => { navigator.clipboard.writeText(link).catch(() => {}) }}
          style={{ fontSize: '0.78rem', padding: '9px 16px' }}
        >
          Copy link
        </button>
      </div>

      {/* Templates */}
      <SectionTitle title="Copy-paste messages" subtitle="Every template has your referral link already baked in." />
      <div style={{ display: 'grid', gap: '12px', marginBottom: '36px' }}>
        {templates.map(t => <TemplateCard key={t.id} title={t.title} context={t.context} body={t.body} />)}
      </div>

      {/* Pitch points */}
      <SectionTitle title="Pitch cheat-sheet" subtitle="Rules of thumb when someone asks you what YallaGrow is." />
      <div style={{
        padding: '4px 0',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        overflow: 'hidden',
        marginBottom: '36px',
      }}>
        {pitchPoints.map((p, i) => (
          <div key={p.label} style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(140px, 180px) 1fr',
            gap: '18px',
            padding: '14px 18px',
            borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)',
            alignItems: 'start',
          }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--sky)' }}>{p.label}</div>
            <div style={{ fontSize: '0.84rem', color: 'var(--white)', lineHeight: 1.6 }}>{p.text}</div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <SectionTitle title="FAQ" subtitle="The questions affiliates ask most." />
      <div style={{ display: 'grid', gap: '10px' }}>
        {faqs.map((f, i) => <FaqCard key={i} q={f.q} a={f.a} />)}
      </div>
    </>
  )
}

function TemplateCard({ title, context, body }: { title: string; context: string; body: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(body)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* clipboard denied */ }
  }
  return (
    <div style={{
      padding: '18px 20px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.98rem', color: 'var(--white)' }}>{title}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>{context}</div>
        </div>
        <button
          type="button"
          onClick={copy}
          style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            padding: '7px 13px',
            borderRadius: '8px',
            background: copied ? 'linear-gradient(180deg, #22c55e, #16a34a)' : 'var(--sky)',
            color: copied ? '#fff' : '#0a0f1a',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
        >{copied ? 'Copied ✓' : 'Copy'}</button>
      </div>
      <pre style={{
        margin: '10px 0 0',
        padding: '14px 16px',
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '10px',
        color: 'rgba(255,255,255,0.88)',
        fontSize: '0.82rem',
        fontFamily: 'Inter, sans-serif',
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>{body}</pre>
    </div>
  )
}

function FaqCard({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%',
          padding: '14px 18px',
          background: 'transparent',
          border: 'none',
          color: 'var(--white)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.88rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          textAlign: 'left',
        }}
      >
        <span>{q}</span>
        <span style={{ color: 'var(--sky)', fontSize: '0.9rem', transform: open ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.25s' }}>+</span>
      </button>
      {open && (
        <div style={{
          padding: '0 18px 16px',
          color: 'rgba(255,255,255,0.75)',
          fontSize: '0.82rem',
          lineHeight: 1.6,
        }}>{a}</div>
      )}
    </div>
  )
}
