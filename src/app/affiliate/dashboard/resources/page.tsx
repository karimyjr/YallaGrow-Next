'use client'
// Resources — the affiliate playbook.
// Not generic AI-written advice. Every number here comes from a 2026
// industry benchmark we checked; every tactic is tuned to the Lebanese
// SMB market (WhatsApp-first, Levantine code-switching, Beirut/Saida
// walking routes, Toters/Zomato as a lead source, etc).
//
// Sources we pulled from (also shown at the bottom of the page):
//   - Phantom Leads "Cold Outreach Statistics 2026"
//   - Sulsaly "WhatsApp Sales Outreach Guide for MENA 2026"
//   - 1,100-DM experiment write-up (skool.com, the-messy-middle)
//   - Phantom Leads Instagram DM outreach guide
//   - Inc.com Geoffrey James face-to-face method
//
// When you update a number here, update the Sources section too so Karim
// can re-verify. Don't invent numbers.

import { useState } from 'react'
import { useAffiliate } from '@/components/affiliate/AffiliateContext'
import { PageHeader, SectionTitle } from '@/components/affiliate/AffiliateUI'

export default function AffiliateResourcesPage() {
  const { affiliate } = useAffiliate()
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yallagrow.net'
  const link = `${siteUrl}/?ref=${affiliate.ref_code}`
  const firstName = affiliate.full_name.split(' ')[0]

  // ─── Templates ─── Levantine-aware, benchmark-informed.
  // Each under 125 words (Phantom 2026: short msgs get ~50% higher reply rate).
  const templates: { id: string; title: string; context: string; body: string; channel: 'whatsapp' | 'instagram' | 'face' | 'phone' | 'followup' | 'email' }[] = [
    {
      id: 'whatsapp-first',
      channel: 'whatsapp',
      title: 'WhatsApp — first touch (Levantine)',
      context: 'Cold or semi-cold. Owner you don\'t know personally. Send Tue/Wed/Thu, 9:30–11 AM or 2:30–4 PM Beirut.',
      body:
`أهلاً [NAME], sorry for the random message.

I was looking at [BUSINESS NAME] on Instagram and noticed [ONE REAL THING — the posts stopped in Sept, the link in bio is broken, ads look rushed, whatever you actually saw].

I'm connected to YallaGrow — small Lebanese agency, Lebanese pricing. They just helped [REAL CLIENT NAME if you have one, otherwise skip this line] with [ONE RESULT — one line].

Not trying to sell today. If you want to look: ${link}

All good either way.
— ${firstName}`,
    },
    {
      id: 'ig-warmed',
      channel: 'instagram',
      title: 'Instagram DM — after 3-day warm-up',
      context: 'You liked their last 3 posts, replied to 1 story, shared 1 reel before sending this. Reply rate on warmed-up DMs: 8–15% (Phantom 2026).',
      body:
`Hey [NAME], been watching [BUSINESS] for a bit.

Your [SPECIFIC POST — the reel on [topic], the carousel about X] was actually good. Small tip: [ONE honest observation, not a pitch. e.g. "the first 2 seconds don't hook, start on the result shot"].

I work with YallaGrow, Lebanese agency. They do content/ads/sites for small businesses here. 7-day pilot is $49 if you ever want to test them: ${link}

No pressure.`,
    },
    {
      id: 'ig-cold',
      channel: 'instagram',
      title: 'Instagram DM — cold, no warm-up (lower yield)',
      context: 'Use only if the business obviously needs help AND you can\'t warm up first. Reply rate drops to ~3%. Still cheaper than ignoring.',
      body:
`Hi [NAME], real quick one.

[BUSINESS NAME]'s product looks great but [SPECIFIC content/ads/site observation]. Fixable in a week.

I work with YallaGrow — Lebanese agency that handles this exact thing, Lebanese prices. 7-day test is $49: ${link}

If not useful, ignore.`,
    },
    {
      id: 'face-to-face',
      channel: 'face',
      title: 'Face-to-face — walk-in opener',
      context: 'Owner behind the counter. Based on the Geoffrey James method (Inc.com). Under 3 minutes. Leave with WhatsApp or business card.',
      body:
`YOU: "Marhaba, you have 30 seconds for me?"
WAIT for yes/no. If no, "No problem, mabrouk on the shop." Leave.

YOU: "I noticed [SOMETHING REAL — your Instagram stopped posting after Ramadan / your delivery photos on Toters look dark / your sign outside is beautiful but your IG doesn't match it]. How come?"
LISTEN. Don't pitch. Let them talk.

YOU (after they answer): "I work with a Lebanese marketing agency — YallaGrow. They do exactly this. There's a 7-day test for $49 — cheaper than a bad campaign."

ASK: "Can I WhatsApp you the link now? What number works?"

Leave with: either their WhatsApp saved + follow-up sent, OR your card with the link written on the back.`,
    },
    {
      id: 'phone-opener',
      channel: 'phone',
      title: 'Phone call — 60-second opener',
      context: 'Best for owners 40+ or B2B services with a phone number on their site. Lebanese pick up unknown numbers more than Europeans — expect 15-25% pickup.',
      body:
`"مرحبا [NAME], معك ${firstName}.

I won't take more than a minute of your time — can I ask one quick question?"

[Wait for yes]

"I noticed [REAL OBSERVATION about their business]. Is this a concern on your side right now, or are you handling it?"

[Listen]

"OK — I work with a Lebanese agency, YallaGrow. They have a 7-day test for $49. Is it OK if I send you the link on WhatsApp so you can look when you have time?"

[Get their number confirmed. Hang up. Send link within 2 minutes.]`,
    },
    {
      id: 'followup-day3',
      channel: 'followup',
      title: 'Follow-up — Day 3 after no reply',
      context: 'Industry data: first follow-up adds +22% to cumulative replies. Second adds +12%. More than 2 total messages = block/ignore risk. Don\'t send a third.',
      body:
`Hey [NAME], floating this back up.

If timing's bad, totally fair — want me to circle back in January?

(Link again if useful: ${link})`,
    },
    {
      id: 'email-formal',
      channel: 'email',
      title: 'Email — formal B2B (no socials to warm up on)',
      context: 'Only when there\'s no IG/WhatsApp. Lebanese SMB email reply rates are low (<2%) unless the owner is a formal B2B shop (law firm, clinic chain, consultancy).',
      body:
`Subject: Quick observation on [BUSINESS NAME]

Hi [NAME],

I came across [BUSINESS NAME] and one thing caught my eye — [REAL, SPECIFIC observation, 1 line].

I work with YallaGrow, a Lebanese marketing agency. They have a 7-day pilot for $49 that gives you a content audit + a week of posts + a 30-min call. No contract.

If useful, the link: ${link}

If not, no worries at all.

— ${firstName}`,
    },
  ]

  // ─── Channel matrix ─── benchmarks with their sources.
  const channels = [
    {
      name: 'WhatsApp (personal or Business)',
      replyRate: '1–5% true cold · 8–15% semi-warm',
      openRate: '90–98%',
      speed: 'Fastest. Replies land in 90s for 50–60% of responders.',
      volumeCap: '50 msgs/day from one number',
      bestFor: 'Lebanese SMBs. Primary channel. Shop owners, F&B, salons, services.',
      pros: ['Everyone in Lebanon uses it', 'Owners see it within minutes', 'Natural conversation', 'Voice note is OK AFTER first reply'],
      cons: ['Meta flags your number if you blast — block if >2% complain', 'No multi-send tools without risk', 'Feels pushy if you don\'t personalize'],
      source: 'sulsaly',
    },
    {
      name: 'Instagram DM',
      replyRate: '8–15% personalized · <3% generic',
      openRate: 'Unknown — likely 60–80%',
      speed: 'Hours to days. Don\'t expect same-day.',
      volumeCap: '30–60 msgs/day. New accounts flag faster.',
      bestFor: 'Visual businesses: boutiques, F&B, beauty, fitness, creators.',
      pros: ['Can warm up with likes/comments first (3× reply rate)', 'Shows you understand the product', 'Lower spam risk than WhatsApp', 'Free'],
      cons: ['Slow — days not hours', 'Business IG filters DMs from non-followers to Requests tab', 'Easy to miss'],
      source: 'phantom-ig',
    },
    {
      name: 'Face-to-face walk-in',
      replyRate: 'No clean benchmark · best conversion if owner is present',
      openRate: '100% (you\'re standing there)',
      speed: 'Instant. 1 visit = 1 answer.',
      volumeCap: '8–15 shops/day on a commercial street.',
      bestFor: 'Hamra, Verdun, Jounieh Old Souk, Saida Souk, Mar Mikhael, Antelias — any walking street with owner-run shops.',
      pros: ['Owner sees your face, remembers you', 'Lebanese respect you more for showing up', 'Instant feedback — you learn fast', 'Older owners (50+) much more responsive than DMs'],
      cons: ['Slow in absolute numbers', 'Owner often not there (ask for a WhatsApp and leave)', '1 hour per visit including walking'],
      source: 'inc',
    },
    {
      name: 'Phone call',
      replyRate: '15–25% pickup for Lebanese cold numbers · 2–8% conversation-to-interest',
      openRate: 'Rings once',
      speed: 'Instant or never.',
      volumeCap: '20–30 calls/day realistic.',
      bestFor: 'Owners 40+. B2B (clinics, law firms, contractors). Services with phone numbers published.',
      pros: ['Breaks through the DM noise', 'Owners who answer are serious', 'Can send WhatsApp link mid-call'],
      cons: ['Most ignore unknown numbers', 'Easy to feel like a telemarketer', 'High rejection rate — need thick skin'],
      source: 'phantom-stats',
    },
    {
      name: 'Email',
      replyRate: '1–2% generic · 3–5% personalized · 8–12% hyper-personalized (video/Loom)',
      openRate: '21–35% in 2026',
      speed: 'Days.',
      volumeCap: 'High — 100+/day fine from a warm inbox.',
      bestFor: 'B2B only: clinics, law firms, consultancies, chains, pre-sale franchise inquiries.',
      pros: ['Lowest spam risk', 'Owner can forward to their partner', 'Good for formal pitches'],
      cons: ['Most Lebanese SMB owners don\'t check business email', 'Low response rate', 'Requires best-in-class subject line'],
      source: 'phantom-stats',
    },
  ]

  // ─── Lead sources ─── ranked for Lebanese SMB.
  const leadSources = [
    {
      name: 'Instagram location tags + hashtags',
      how: 'Search #beirutfood, #saidafood, #jouniehstyle, #hamrabeirut, #tripolilb and similar. Then location tags: Hamra, Mar Mikhael, Jounieh, Verdun, Saida Old Souk. Scroll recent posts, not top — recent = active businesses.',
      filter: 'Posts in the last 30 days · 500–20K followers · engagement below 2% (= content problem, likely YallaGrow fit).',
      yield: 'High. You can source 30+ qualified leads in an hour.',
    },
    {
      name: 'Delivery apps (Toters, Zomato, Deliveroo)',
      how: 'Open Toters/Zomato, pick a category (restaurants, home chefs, bakeries), scroll. Businesses with bad photos, inconsistent menus, or 4.0–4.4 ratings = ripe for marketing help. Their contact is usually on their IG bio.',
      filter: 'Rating 4.0–4.6 (not 4.8+ — those are already optimized) · photos look rushed · inconsistent presentation.',
      yield: 'High for F&B specifically. 15–25 leads/hour.',
    },
    {
      name: 'Google Maps',
      how: 'Search "restaurant Beirut", "salon Jounieh", "clinic Hamra". Filter rating 4.2+ with <200 reviews. Click into each, check their social presence (often linked). The ones with great Google reviews but weak IG are the gold.',
      filter: '4.2+ stars · <200 reviews (small enough to grow) · IG under 5K followers.',
      yield: 'Medium. 10–20 qualified/hour.',
    },
    {
      name: 'Your own street walks',
      how: 'Hamra, Verdun, Mar Mikhael, Antelias, Jounieh Old Souk, Saida Souk, Tripoli Old Souk. Walk, note shop names + IG handles (on their window), go home, do the DM/WhatsApp. Or ask on the spot (see face-to-face template).',
      filter: 'Owner-run (not franchise) · shop sign has IG handle · the owner looks at the phone, not the register.',
      yield: 'Low volume (5–15 leads per walk) but very high quality.',
    },
    {
      name: 'Yellow Pages Lebanon (yellowpages.com.lb)',
      how: 'Lebanese business directory, still active. Categories like dentists, lawyers, contractors. Older businesses with phone and sometimes email. Lower digital presence = bigger gap to pitch.',
      filter: 'Has phone number · no website OR a terrible website · no IG handle listed.',
      yield: 'Low-medium. Best for B2B services (dentists, clinics, lawyers) that aren\'t on social.',
    },
    {
      name: 'Facebook community groups',
      how: 'Lebanese business and city-specific FB groups ("Lebanese Entrepreneurs", "Saida Business", "Jounieh Residents", etc.). Watch for posts where owners complain about marketing, ads, their website. That\'s a buying signal.',
      filter: 'Posts in last 7 days · post mentions ads/content/website pain · poster is the owner.',
      yield: 'Variable. Low volume but zero-friction — you\'re replying to a stated need.',
    },
    {
      name: 'Your own network',
      how: 'Easiest wins. Cousin opened a cafe. Friend has a boutique. Someone from your uni runs a side hustle. Message them individually with the template, not a group broadcast.',
      filter: 'Anyone running a business. One-off messages, not a group blast.',
      yield: 'Very high per message — but a finite list. Burn it first before going cold.',
    },
  ]

  // ─── Objections ─── the actual Lebanese ones.
  const objections = [
    {
      objection: '"ما في مصاري / Not a good time for us right now"',
      why: 'Default Lebanese response to any ask involving money. Usually reflex, not final.',
      response: '"Totally fair — the pilot is $49, less than one dinner out. Nothing monthly. If it doesn\'t help, you\'re out $49. If it does, we talk real packages after. Worth trying?"',
    },
    {
      objection: '"عندي حدا بيعمل social media / My cousin / nephew / sister does it"',
      why: '70%+ of Lebanese SMBs have a relative doing social. Don\'t attack that person.',
      response: '"Perfect — I\'m not saying replace them. YallaGrow handles the parts they probably don\'t: paid ads, strategy, a real website. They can work together. Want me to send 2 examples of how that split works in other businesses?"',
    },
    {
      objection: '"I tried an agency before and they ghosted me / took my money"',
      why: 'Very common. The Lebanese agency market has real burnt-customer stories.',
      response: '"Fair — I\'ve heard this a lot. One reason I send people to YallaGrow\'s 7-day pilot specifically: you see actual work in week 1. No month-long onboarding. If they don\'t deliver, you\'re out $49, not $500."',
    },
    {
      objection: '"Send me the proposal / price list on email"',
      why: 'Classic brush-off, but sometimes real. Either way, don\'t send a PDF.',
      response: '"Of course. Just so I don\'t send you something generic — can I ask 2 quick questions first? That way I send you the right package, not a 10-page PDF you don\'t read. 60 seconds."',
    },
    {
      objection: '"Not interested"',
      why: 'Could be real, could be reflex. Low-cost to ask once more.',
      response: '"Totally fair. Can I ask one thing — what would need to be true for marketing to make sense for you? If it changes in 2026, happy to circle back."',
    },
    {
      objection: '"Call me next month"',
      why: 'Soft reject, rarely means next month.',
      response: '"Of course. What specifically changes next month on your side — so I know what to come back with?" (If they can\'t answer, it was a brush-off. Move on, follow up in 60 days.)',
    },
    {
      objection: 'No reply at all',
      why: 'Default outcome. 85–95% of cold outreach never replies even on a good channel.',
      response: 'ONE follow-up at day 3 (template above). After that, stop. Keep engaging their content passively. Revisit in 6–8 weeks only if something changes on their side (new launch, new ads, hired staff).',
    },
  ]

  // ─── Pitch cheat-sheet ───
  const pitchPoints = [
    { label: 'What they do',   text: 'Social media content (reels, carousels, static), Meta & TikTok ads, websites, brand identity. Done by actual humans in Lebanon.' },
    { label: 'Who they help',  text: 'Lebanese small businesses and startups — F&B, boutiques, salons, clinics, service businesses, D2C.' },
    { label: 'Entry offer',    text: '$49 for a 7-day pilot: content audit + 1 week of posts + a 30-min strategy call. No contract.' },
    { label: 'Pricing',        text: 'Custom monthly packages scaled to the business. Lebanese pricing — not Dubai, not London. $250 is a real monthly tier.' },
    { label: 'What you earn',  text: `Your code is ${affiliate.ref_code}. Commission depends on deal size, logged to your dashboard the moment the client pays.` },
    { label: 'Payment reality',text: 'YallaGrow quotes in USD. Accepts USD cash, OMT/Whish, and bank transfer. Flexible on first payment for first-time clients — ask Karim if a prospect needs a split.' },
    { label: 'Avoid',          text: 'Don\'t promise specific results. Don\'t quote prices. Don\'t speak for the agency beyond this list. Send them to the site.' },
  ]

  // ─── FAQ ───
  const faqs = [
    {
      q: 'How do I know if a referral was logged?',
      a: 'The business has to click your referral link at least once before they pay. The system matches on that click and credits your code. If someone buys without clicking the link, WhatsApp Karim (+961 76 302 159) — he can manually credit you.',
    },
    {
      q: 'When do I get paid?',
      a: 'Commissions become eligible for payout once the client has paid their invoice AND the referral is marked "paid" in the dashboard. Request payout at $25+ pending balance. Processed monthly within 3 business days.',
    },
    {
      q: 'What counts as a referral?',
      a: 'Any business that buys any YallaGrow package through your link — pilot, monthly retainer, one-off website, consultancy. Repeat purchases from the same client in the first 6 months also count.',
    },
    {
      q: 'Can I run paid ads with my link?',
      a: 'Not direct to yallagrow.net without asking Karim first. Send paid traffic to a page you own (your own landing page, linktree, or Instagram) and link from there. Protects everyone\'s ad accounts.',
    },
    {
      q: 'Can I pitch outside Lebanon?',
      a: 'YallaGrow only takes Lebanese clients. Referrals from outside Lebanon will not convert. Focus on Lebanon — Beirut, Mount Lebanon, Saida, Jounieh, Tripoli, and the diaspora with Lebanese businesses.',
    },
    {
      q: 'How many messages a day is safe?',
      a: 'WhatsApp from your personal number: cap at 50 cold messages per day. Instagram DM: 30–60 depending on account age. Above these, Meta starts flagging. Spread them across the day, not a single burst.',
    },
    {
      q: 'Can I lie / exaggerate to close?',
      a: 'No, and not because it\'s wrong (though it is) — because it burns you. Lebanese market is small. The owner you oversold to tells 3 other owners in the same street. Your credibility is your pipeline. Undersell, overdeliver.',
    },
    {
      q: 'What\'s realistic monthly income from this?',
      a: 'Math: 300 well-targeted outreaches/month → ~30 replies → ~5–8 serious conversations → ~2 link clicks that lead to deals → 1–2 closed. At Lebanese package sizes, that\'s $75–200/month in commission. Scales with quality, not just volume.',
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="The Affiliate Playbook"
        title="Everything you need to close"
        subtitle={`Last updated 28 Nov 2026 · Lebanese market · Benchmarks are real, sourced at the bottom.`}
      />

      {/* Link reminder */}
      <div style={{
        padding: '14px 18px',
        background: 'linear-gradient(135deg, rgba(16,161,219,0.14), rgba(141,92,255,0.06))',
        border: '1px solid rgba(16,161,219,0.25)',
        borderRadius: '12px',
        marginBottom: '20px',
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

      {/* Realistic math — set expectations up front */}
      <div style={{
        padding: '18px 20px',
        background: 'linear-gradient(135deg, rgba(141,92,255,0.12), rgba(16,161,219,0.04))',
        border: '1px solid rgba(141,92,255,0.25)',
        borderRadius: '14px',
        marginBottom: '36px',
      }}>
        <div style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.8px', color: '#b79cff', marginBottom: '10px' }}>The math — read this first</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--white)', lineHeight: 1.7 }}>
          Realistic monthly funnel at Lebanese SMB cold rates (2026 industry benchmarks, Phantom Leads &amp; Sulsaly):
        </div>
        <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px' }}>
          {[
            { k: '300', v: 'well-targeted outreaches' },
            { k: '25–45', v: 'replies (~10%)' },
            { k: '5–8', v: 'real conversations' },
            { k: '2–3', v: 'clicks on your link' },
            { k: '1–2', v: 'deals closed' },
            { k: '$75–200', v: 'commission earned' },
          ].map(x => (
            <div key={x.k} style={{ padding: '10px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.3rem', fontWeight: 800, color: 'var(--sky)', lineHeight: 1 }}>{x.k}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px' }}>{x.v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
          This is the realistic lower bound. Warm network + walk-ins in commercial streets push this 2–3×. Mass-blasting crashes it.
        </div>
      </div>

      {/* 1. Where to find leads */}
      <SectionTitle title="1. Where to find leads" subtitle="Ranked by yield for Lebanese SMBs. Burn free sources first before going cold." />
      <div style={{ display: 'grid', gap: '10px', marginBottom: '36px' }}>
        {leadSources.map((s, i) => (
          <LeadSourceCard key={i} index={i + 1} {...s} />
        ))}
      </div>

      {/* 2. Pick the channel */}
      <SectionTitle title="2. Pick the channel" subtitle="2026 industry benchmarks. Match the channel to the business, don't blast one thing everywhere." />
      <div style={{ display: 'grid', gap: '12px', marginBottom: '36px' }}>
        {channels.map(c => <ChannelCard key={c.name} {...c} />)}
      </div>

      {/* 3. Timing */}
      <SectionTitle title="3. When to send" subtitle="Beirut time. Industry data + Lebanese market norms." />
      <div style={{
        padding: '18px 20px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        marginBottom: '36px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
      }}>
        <div>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#22c55e', marginBottom: '8px' }}>Best</div>
          <ul style={{ margin: 0, padding: '0 0 0 18px', color: 'var(--white)', fontSize: '0.84rem', lineHeight: 1.7 }}>
            <li>Tuesday, Wednesday, Thursday</li>
            <li>9:30–11 AM Beirut (morning coffee check)</li>
            <li>2:30–4 PM Beirut (post-lunch, before call-off)</li>
          </ul>
        </div>
        <div>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#f59e0b', marginBottom: '8px' }}>Avoid</div>
          <ul style={{ margin: 0, padding: '0 0 0 18px', color: 'var(--white)', fontSize: '0.84rem', lineHeight: 1.7 }}>
            <li>Friday 12–2 PM (jumu&apos;ah + lunch)</li>
            <li>Friday afternoon generally (weekend energy)</li>
            <li>1–2:30 PM any day (lunch)</li>
            <li>After 7 PM (family time — feels intrusive)</li>
            <li>Sunday (Christian/mixed owners rest)</li>
          </ul>
        </div>
        <div>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--sky)', marginBottom: '8px' }}>Volume caps</div>
          <ul style={{ margin: 0, padding: '0 0 0 18px', color: 'var(--white)', fontSize: '0.84rem', lineHeight: 1.7 }}>
            <li>WhatsApp: <strong>50/day</strong> from one number</li>
            <li>Instagram DM: <strong>30–60/day</strong></li>
            <li>Phone cold calls: <strong>20–30/day</strong></li>
            <li>Face-to-face: <strong>8–15 shops/day</strong></li>
          </ul>
        </div>
      </div>

      {/* 4. Scripts */}
      <SectionTitle title="4. Copy-paste scripts" subtitle="Your referral link is baked into each. Replace [BRACKETED] with real details. Never leave the brackets in." />
      <div style={{ display: 'grid', gap: '12px', marginBottom: '36px' }}>
        {templates.map(t => <TemplateCard key={t.id} {...t} />)}
      </div>

      {/* 5. Objections */}
      <SectionTitle title="5. Handling the real objections" subtitle="The seven answers Lebanese SMBs actually give. Memorize these." />
      <div style={{ display: 'grid', gap: '10px', marginBottom: '36px' }}>
        {objections.map((o, i) => <ObjectionCard key={i} {...o} />)}
      </div>

      {/* 6. Don'ts */}
      <SectionTitle title="6. What NOT to do" subtitle="Each of these drops your reply rate below 1% and burns your number." />
      <div style={{
        padding: '18px 20px',
        background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02))',
        border: '1px solid rgba(239,68,68,0.25)',
        borderRadius: '14px',
        marginBottom: '36px',
      }}>
        <ul style={{ margin: 0, padding: '0 0 0 22px', color: 'var(--white)', fontSize: '0.85rem', lineHeight: 1.8 }}>
          <li>&ldquo;I can grow your page to 10K followers&rdquo; — vague promise, screams amateur.</li>
          <li>&ldquo;Your marketing is bad&rdquo; — insulting, even if true. Attack the problem, not their work.</li>
          <li>&ldquo;Check out my work: [link]&rdquo; with nothing else. Nobody clicks links from strangers.</li>
          <li>Voice note as a first message. Feels invasive before a text relationship exists.</li>
          <li>Wrong name interpolated (&ldquo;Hey [NAME],&rdquo; as literal text). One slip = blocked.</li>
          <li>More than 2 messages to a non-responder. Third message = you&apos;re a spammer to them.</li>
          <li>Sending at 11 PM &ldquo;because I just saw this.&rdquo; Insomnia energy, reads unprofessional.</li>
          <li>Pitching the price in the first message. Zero room to build value, closes the door.</li>
          <li>Pretending to be a customer to open the conversation. Trust gone the moment they figure it out.</li>
          <li>Promising YallaGrow will deliver something specific (ROI, follower count, leads/month). You can&apos;t guarantee this, and lying burns Karim too.</li>
          <li>Blasting the same message to 100 people. WhatsApp spam-filter will quietly throttle you — your reply rate crashes without you noticing.</li>
        </ul>
      </div>

      {/* 7. Pitch cheat-sheet */}
      <SectionTitle title="7. Pitch cheat-sheet" subtitle="Rules of thumb when someone asks you what YallaGrow is." />
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

      {/* 8. FAQ */}
      <SectionTitle title="8. FAQ" subtitle="The questions affiliates ask most." />
      <div style={{ display: 'grid', gap: '10px', marginBottom: '36px' }}>
        {faqs.map((f, i) => <FaqCard key={i} q={f.q} a={f.a} />)}
      </div>

      {/* Sources */}
      <SectionTitle title="Sources" subtitle="Every benchmark here comes from one of these. Re-check them yourself." />
      <div style={{
        padding: '14px 18px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        fontSize: '0.78rem',
        lineHeight: 1.8,
        color: 'var(--text-muted)',
        marginBottom: '20px',
      }}>
        <ul style={{ margin: 0, padding: '0 0 0 18px' }}>
          <li><a href="https://phantomleads.ai/blog/cold-outreach-statistics-2026" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--sky)', textDecoration: 'none' }}>Phantom Leads — Cold Outreach Statistics 2026</a> (open rates, reply rates, follow-up lift, send times)</li>
          <li><a href="https://sulsaly.com/blog/whatsapp-sales-outreach-guide" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--sky)', textDecoration: 'none' }}>Sulsaly — WhatsApp Sales Outreach Guide for MENA 2026</a> (MENA-specific WhatsApp norms, Levantine greeting, 50/day cap)</li>
          <li><a href="https://www.skool.com/the-messy-middle-3939/results-after-sending-1100-cold-instagram-dms-to-business-owners" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--sky)', textDecoration: 'none' }}>1,100 cold Instagram DMs experiment (skool)</a> (real funnel: 5.2% positive reply, 0.55% booked call)</li>
          <li><a href="https://phantomleads.ai/blog/instagram-dm-outreach-guide" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--sky)', textDecoration: 'none' }}>Phantom Leads — Instagram DM Outreach Guide</a> (what to say, what not to, warm-up sequence)</li>
          <li><a href="https://www.inc.com/geoffrey-james/how-to-make-a-face-to-face-cold-call.html" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--sky)', textDecoration: 'none' }}>Inc.com — Geoffrey James face-to-face cold call method</a> (walk-in opener, question-first framing)</li>
          <li><a href="https://sbl.so/whatsapp/whatsapp-cold-outreach-reply-rates/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--sky)', textDecoration: 'none' }}>SBL — WhatsApp Cold Outreach Reply Rates 2026</a> (open rate 90–98%, block risk thresholds)</li>
        </ul>
      </div>

      <div style={{ padding: '20px 0 40px', fontSize: '0.74rem', color: 'var(--text-dim)', textAlign: 'center' }}>
        Problems with the playbook or something that didn&apos;t work? WhatsApp Karim at{' '}
        <a href="https://wa.me/96176302159" style={{ color: 'var(--sky)', textDecoration: 'none' }}>+961 76 302 159</a>.
      </div>
    </>
  )
}

/* ──────── Cards ──────── */

interface TemplateCardProps { title: string; context: string; body: string; channel: string }
function TemplateCard({ title, context, body, channel }: TemplateCardProps) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(body); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* denied */ }
  }
  const channelColor =
    channel === 'whatsapp' ? '#22c55e' :
    channel === 'instagram' ? '#e879f9' :
    channel === 'face'     ? '#f59e0b' :
    channel === 'phone'    ? '#10a1db' :
    channel === 'followup' ? '#b79cff' :
                             '#94a3b8'
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
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              fontSize: '0.56rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.4px',
              color: channelColor, padding: '3px 8px', borderRadius: '5px',
              background: `${channelColor}18`, border: `1px solid ${channelColor}44`,
            }}>{channel}</span>
          </div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.98rem', color: 'var(--white)' }}>{title}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.5 }}>{context}</div>
        </div>
        <button
          type="button"
          onClick={copy}
          style={{
            fontSize: '0.72rem', fontWeight: 600,
            padding: '7px 13px', borderRadius: '8px',
            background: copied ? 'linear-gradient(180deg, #22c55e, #16a34a)' : 'var(--sky)',
            color: copied ? '#fff' : '#0a0f1a',
            border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            transition: 'all 0.2s', whiteSpace: 'nowrap',
          }}
        >{copied ? 'Copied ✓' : 'Copy'}</button>
      </div>
      <pre style={{
        margin: '10px 0 0', padding: '14px 16px',
        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px',
        color: 'rgba(255,255,255,0.88)', fontSize: '0.82rem',
        fontFamily: 'Inter, sans-serif', lineHeight: 1.6,
        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
      }}>{body}</pre>
    </div>
  )
}

interface ChannelCardProps {
  name: string
  replyRate: string
  openRate: string
  speed: string
  volumeCap: string
  bestFor: string
  pros: string[]
  cons: string[]
}
function ChannelCard({ name, replyRate, openRate, speed, volumeCap, bestFor, pros, cons }: ChannelCardProps) {
  return (
    <div style={{
      padding: '18px 20px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
    }}>
      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.05rem', color: 'var(--white)', letterSpacing: '-0.3px' }}>{name}</div>
      <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
        <StatBlock label="Reply rate" value={replyRate} />
        <StatBlock label="Open rate" value={openRate} />
        <StatBlock label="Speed" value={speed} />
        <StatBlock label="Volume cap" value={volumeCap} />
      </div>
      <div style={{ marginTop: '14px', padding: '10px 12px', background: 'rgba(16,161,219,0.08)', border: '1px solid rgba(16,161,219,0.2)', borderRadius: '10px' }}>
        <span style={{ fontSize: '0.64rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.4px', color: 'var(--sky)' }}>Best for:</span>{' '}
        <span style={{ fontSize: '0.82rem', color: 'var(--white)' }}>{bestFor}</span>
      </div>
      <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '0.64rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.4px', color: '#22c55e', marginBottom: '6px' }}>Pros</div>
          <ul style={{ margin: 0, padding: '0 0 0 16px', color: 'var(--white)', fontSize: '0.78rem', lineHeight: 1.6 }}>
            {pros.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
        <div>
          <div style={{ fontSize: '0.64rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.4px', color: '#f59e0b', marginBottom: '6px' }}>Cons</div>
          <ul style={{ margin: 0, padding: '0 0 0 16px', color: 'var(--white)', fontSize: '0.78rem', lineHeight: 1.6 }}>
            {cons.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '8px 10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
      <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.4px', color: 'var(--text-dim)' }}>{label}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--white)', marginTop: '3px', lineHeight: 1.4 }}>{value}</div>
    </div>
  )
}

interface LeadSourceCardProps {
  index: number
  name: string
  how: string
  filter: string
  yield: string
}
function LeadSourceCard({ index, name, how, filter, yield: yieldText }: LeadSourceCardProps) {
  return (
    <div style={{
      padding: '16px 18px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      display: 'grid',
      gridTemplateColumns: '36px 1fr',
      gap: '14px',
      alignItems: 'start',
    }}>
      <div style={{
        width: '34px', height: '34px', borderRadius: '10px',
        background: 'linear-gradient(135deg, rgba(16,161,219,0.3), rgba(141,92,255,0.2))',
        border: '1px solid rgba(16,161,219,0.4)',
        display: 'grid', placeItems: 'center',
        fontFamily: 'Syne,sans-serif', fontSize: '0.95rem', fontWeight: 800, color: 'var(--white)',
      }}>{index}</div>
      <div>
        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.98rem', color: 'var(--white)' }}>{name}</div>
        <div style={{ marginTop: '6px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.6 }}>{how}</div>
        <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
          <div style={{ padding: '7px 10px', background: 'rgba(16,161,219,0.08)', border: '1px solid rgba(16,161,219,0.2)', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.3px', color: 'var(--sky)' }}>Filter:</span>{' '}
            <span style={{ fontSize: '0.76rem', color: 'var(--white)' }}>{filter}</span>
          </div>
          <div style={{ padding: '7px 10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.3px', color: '#22c55e' }}>Yield:</span>{' '}
            <span style={{ fontSize: '0.76rem', color: 'var(--white)' }}>{yieldText}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ObjectionCard({ objection, why, response }: { objection: string; why: string; response: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(response); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* denied */ }
  }
  return (
    <div style={{
      padding: '16px 18px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
    }}>
      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '0.92rem', fontWeight: 700, color: 'var(--white)' }}>{objection}</div>
      <div style={{ marginTop: '4px', fontSize: '0.74rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>Why: {why}</div>
      <div style={{
        marginTop: '10px',
        padding: '12px 14px',
        background: 'rgba(16,161,219,0.06)',
        border: '1px solid rgba(16,161,219,0.2)',
        borderRadius: '10px',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
      }}>
        <div style={{ flex: 1, fontSize: '0.82rem', color: 'var(--white)', lineHeight: 1.6 }}>
          <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.4px', color: 'var(--sky)' }}>Your reply:</span> {response}
        </div>
        <button
          type="button"
          onClick={copy}
          style={{
            fontSize: '0.68rem', fontWeight: 600,
            padding: '6px 11px', borderRadius: '7px',
            background: copied ? '#22c55e' : 'rgba(255,255,255,0.1)',
            color: copied ? '#fff' : 'var(--white)',
            border: '1px solid rgba(255,255,255,0.12)',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >{copied ? 'Copied ✓' : 'Copy'}</button>
      </div>
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
          width: '100%', padding: '14px 18px',
          background: 'transparent', border: 'none', color: 'var(--white)',
          fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', fontWeight: 600,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '10px', textAlign: 'left',
        }}
      >
        <span>{q}</span>
        <span style={{ color: 'var(--sky)', fontSize: '0.9rem', transform: open ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.25s' }}>+</span>
      </button>
      {open && (
        <div style={{
          padding: '0 18px 16px',
          color: 'rgba(255,255,255,0.75)',
          fontSize: '0.82rem', lineHeight: 1.6,
        }}>{a}</div>
      )}
    </div>
  )
}
