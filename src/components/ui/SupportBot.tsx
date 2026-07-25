'use client'
import { useState, useRef, useEffect } from 'react'

interface Option {
  label: string
  emoji?: string
  action: 'response' | 'menu' | 'external' | 'input'
  response?: string
  submenu?: string
  url?: string
}

interface Menu {
  title?: string
  message: string
  options: Option[]
}

// ============================================
// KNOWLEDGE BASE — organized as guided menus
// ============================================
const MENUS: Record<string, Menu> = {
  root: {
    message: "Hey there! 👋 I'm YallaBot — YallaGrow's assistant.\n\nWhat can I help you with today?",
    options: [
      { label: 'View pricing', emoji: '💰', action: 'menu', submenu: 'pricing' },
      { label: 'Explore services', emoji: '🎯', action: 'menu', submenu: 'services' },
      { label: 'Book a strategy call', emoji: '📅', action: 'response', response: "Great! Book your free 30-minute strategy call here:\n\n👉 https://calendar.app.google/3WibM5kWvizhnHJt8\n\nNo commitment, no credit card — just a real conversation about your business." },
      { label: 'Affiliate program', emoji: '🤝', action: 'menu', submenu: 'affiliate' },
      { label: 'About YallaGrow', emoji: 'ℹ️', action: 'menu', submenu: 'about' },
      { label: 'Talk to a human', emoji: '💬', action: 'external', url: 'https://api.whatsapp.com/send/?phone=447376441603&text=Hi%20YallaGrow%2C%20I%20need%20some%20help&type=phone_number&app_absent=0' },
    ],
  },

  pricing: {
    message: "We have 3 monthly packages plus a Build-Your-Own option:\n\n💚 **Launch** — $149/mo\n⭐ **Grow** — $299/mo (most popular)\n🔥 **Dominate** — $499/mo\n\nWhich one would you like to know more about?",
    options: [
      { label: 'Launch — $149/mo', emoji: '💚', action: 'response', response: "**Launch — $149/mo** includes:\n\n✓ 8 static posts/month\n✓ 2 short-form videos\n✓ Caption writing & hashtag research\n✓ Monthly performance report\n\nPerfect for businesses starting their marketing journey. Ready to book a call?" },
      { label: 'Grow — $299/mo', emoji: '⭐', action: 'response', response: "**Grow — $299/mo** (most popular) includes:\n\n✓ 12 static posts/month\n✓ 4 short-form videos\n✓ Meta Ads management\n✓ Monthly strategy call\n\nBalanced content + ads for businesses ready to scale." },
      { label: 'Dominate — $499/mo', emoji: '🔥', action: 'response', response: "**Dominate — $499/mo** includes:\n\n✓ 16 static posts/month\n✓ 8 short-form videos\n✓ Full Meta Ads management\n✓ Performance dashboard\n✓ Priority support\n\nFor serious brands ready to scale aggressively." },
      { label: 'Build my own package', emoji: '🛠', action: 'response', response: "You can build your own custom package with our interactive builder:\n\n👉 yallagrow.net/packages\n\nMix and match posts, reels, ads, website, and add-ons to fit your exact needs. You'll see live pricing as you build." },
      { label: 'Take the plan quiz', emoji: '🎯', action: 'response', response: "Not sure which plan is right? Take our free 2-minute quiz:\n\n👉 yallagrow.net/quiz\n\nWe'll recommend the perfect package based on your business type, goals, and budget." },
      { label: 'Performance Partnership', emoji: '🚀', action: 'response', response: "Our **Performance Partnership** is invite-only. Instead of a monthly retainer, we combine a strategic upfront deposit with performance-based compensation. We grow together.\n\nWe offer 2 models:\n1️⃣ Net Profit Share\n2️⃣ Per-Sale Commission\n\nLearn more: yallagrow.net/partnership" },
      { label: '← Back to main menu', action: 'menu', submenu: 'root' },
    ],
  },

  services: {
    message: "We offer 9 core services. Which one interests you?",
    options: [
      { label: 'Marketing Strategy', emoji: '🎯', action: 'response', response: "**Marketing Strategy**\n\nBefore we create anything, we understand your business, customers, competitors, and goals. Every decision has a purpose.\n\nIncludes:\n✓ Competitor & market analysis\n✓ Customer personas\n✓ Content pillars\n✓ 90-day growth roadmap\n\nLearn more: yallagrow.net/services" },
      { label: 'Social Media', emoji: '📱', action: 'response', response: "**Social Media Management**\n\nFull account management across Instagram, Facebook, TikTok and more.\n\nIncludes:\n✓ Content calendar planning\n✓ Post scheduling\n✓ Community management\n✓ Weekly performance updates" },
      { label: 'Paid Ads', emoji: '💰', action: 'response', response: "**Paid Advertising**\n\nMeta and TikTok ads with a $30/month management fee + your ad spend.\n\n✓ Campaign strategy & audience targeting\n✓ Ad creative (visuals + copy)\n✓ A/B testing & optimization\n✓ Weekly reports\n\nMinimum recommended budget: $50-100/month." },
      { label: 'Branding', emoji: '🎨', action: 'response', response: "**Branding & Identity**\n\nLogo design, visual identity, brand guidelines, typography, and color systems.\n\n✓ Logo (primary + variations)\n✓ Color palette & typography\n✓ Brand guidelines document\n✓ Social media brand kit" },
      { label: 'Content Creation', emoji: '🎬', action: 'response', response: "**Content Creation**\n\nReels, carousels, stories, and static posts designed to captivate your audience.\n\n✓ Short-form video (Reels, TikToks)\n✓ Carousel posts\n✓ Static posts & graphics\n✓ UGC-style content" },
      { label: 'Copywriting', emoji: '✍️', action: 'response', response: "**Copywriting**\n\nWords that make people take action.\n\n✓ Social media captions\n✓ Ad copy & hooks\n✓ Landing page copy\n✓ Email sequences" },
      { label: 'Website Development', emoji: '🌐', action: 'menu', submenu: 'website' },
      { label: 'Analytics & Reports', emoji: '📊', action: 'response', response: "**Analytics & Reporting**\n\nMonthly performance reports with clear insights.\n\n✓ Google Analytics setup\n✓ Meta Pixel & conversion tracking\n✓ Custom dashboards\n✓ Actionable recommendations" },
      { label: 'Consulting', emoji: '🧠', action: 'response', response: "**Consulting**\n\nOne-on-one sessions to audit your marketing and build a growth roadmap.\n\n✓ Full marketing audit\n✓ 60-min strategy session\n✓ Written report with findings\n✓ Follow-up email support (2 weeks)" },
      { label: '← Back to main menu', action: 'menu', submenu: 'root' },
    ],
  },

  website: {
    message: "We build websites in 3 tiers plus offer consultancy. What are you looking for?",
    options: [
      { label: 'Starter site ($150)', emoji: '🚀', action: 'response', response: "**Starter Site — $150**\n\n✓ Single-page website\n✓ Fully mobile responsive\n✓ 1-2 sections (hero + contact)\n✓ Basic contact form\n✓ Delivered in 3-5 days\n\nPerfect for freelancers or personal brands." },
      { label: 'Business site ($151-300)', emoji: '💼', action: 'response', response: "**Business Site — $151-300**\n\n✓ Up to 5 pages\n✓ Mobile responsive\n✓ Contact form + WhatsApp integration\n✓ Basic SEO setup\n✓ Google Analytics\n✓ Delivered in 1-2 weeks\n\nGreat for small businesses and service providers." },
      { label: 'Advanced site ($301-600)', emoji: '⚡', action: 'response', response: "**Advanced Site — $301-600**\n\n✓ Up to 10 pages\n✓ Custom animations\n✓ Blog / CMS integration\n✓ Advanced SEO\n✓ Newsletter signup\n✓ Multi-language support\n✓ Delivered in 2-3 weeks\n\nIdeal for growing brands and e-commerce." },
      { label: 'Custom site ($600+)', emoji: '💎', action: 'response', response: "**Custom Website ($600+)**\n\nFor bigger budgets, we build fully custom sites tailored to your business. Let's talk on a strategy call to design your project together.\n\n👉 Book a call: yallagrow.net/quiz" },
      { label: 'Website Consultancy ($139)', emoji: '🎓', action: 'response', response: "**Website Consultancy + Free Audit — $139**\n\nAlready have a website? Get a full expert review:\n\n✓ Full technical + UX audit\n✓ Conversion rate analysis\n✓ Page speed + SEO review\n✓ Mobile experience audit\n✓ 60-min strategy call\n✓ Written report" },
      { label: '← Back to services', action: 'menu', submenu: 'services' },
    ],
  },

  affiliate: {
    message: "Our affiliate program pays you to refer businesses to YallaGrow.\n\nWhat would you like to know?",
    options: [
      { label: 'How much can I earn?', emoji: '💵', action: 'response', response: "You earn:\n\n💰 **20% commission** on invoices $179-$999\n💎 **35% commission** on invoices $1,000+\n♾️ **No cap** on how many referrals you can bring\n\nCommissions paid via WhatsApp coordination once your balance reaches $50." },
      { label: 'How does tracking work?', emoji: '🔗', action: 'response', response: "Each affiliate gets a unique referral code. When someone signs up mentioning your code (during signup or their consultation call), it's credited to your account. Simple!" },
      { label: 'How do I apply?', emoji: '📝', action: 'response', response: "Apply here to become an affiliate:\n\n👉 yallagrow.net/affiliate\n\nApplications are reviewed within 24-48 hours. Once approved, you'll get your unique code and access to the dashboard." },
      { label: 'Existing affiliate login', emoji: '🔐', action: 'response', response: "Sign in to your affiliate dashboard here:\n\n👉 yallagrow.net/affiliate/dashboard\n\nUse your email + referral code to access earnings, referrals, and marketing resources." },
      { label: '← Back to main menu', action: 'menu', submenu: 'root' },
    ],
  },

  about: {
    message: "What would you like to know about us?",
    options: [
      { label: 'Where are you based?', emoji: '📍', action: 'response', response: "We're based in **Lebanon** 🇱🇧 and work with clients globally — small businesses, startups, and personal brands anywhere in the world." },
      { label: 'Who is on the team?', emoji: '👥', action: 'response', response: "We're a lean, specialized team:\n\n🎯 **Founder/CEO** — Strategy & sales\n🎨 **Designer** — Content & brand\n✍️ **Copywriter** — Words that convert\n📈 **Media Buyer** (freelance) — Paid ads\n\nEvery person touches your work directly — no agency middlemen." },
      { label: 'How fast do you deliver?', emoji: '⚡', action: 'response', response: "Timelines by project:\n\n📱 Monthly packages: Content starts within 1 week\n🌐 Websites: 3 days (Starter) to 3 weeks (Advanced)\n🎨 Branding: 1-2 weeks\n📊 Ad campaigns: Live within 5-7 days\n\nWe move fast without cutting corners." },
      { label: 'Do you have any guarantees?', emoji: '🤝', action: 'response', response: "Every partnership starts with a free strategy call to confirm we're the right fit.\n\nWe don't do refunds after work has started, but we're transparent and communicative — if something isn't right, we work with you to fix it. Most clients stay 6+ months." },
      { label: 'How to contact you?', emoji: '📞', action: 'response', response: "Reach us via:\n\n💬 **WhatsApp:** +44 7376 441603 (fastest)\n📧 **Email:** info@yallagrow.net\n📞 **Book a call:** yallagrow.net/quiz" },
      { label: 'Are you hiring?', emoji: '💼', action: 'response', response: "Yes! Currently open positions:\n\n🎨 Designer / Content Creator\n✍️ Copywriter / Content Specialist\n📈 Freelance Media Buyer\n\nApply at yallagrow.net/careers" },
      { label: '← Back to main menu', action: 'menu', submenu: 'root' },
    ],
  },
}

interface Message {
  from: 'user' | 'bot'
  text: string
  time: string
  options?: Option[]
}

const WHATSAPP_URL = 'https://api.whatsapp.com/send/?phone=447376441603&text=Hi%20YallaGrow%2C%20I%20need%20some%20help&type=phone_number&app_absent=0'

export default function SupportBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [typing, setTyping] = useState(false)
  const [notification, setNotification] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const getTime = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  // Initialize with root menu on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setTimeout(() => {
        const rootMenu = MENUS.root
        setMessages([{
          from: 'bot',
          text: rootMenu.message,
          time: getTime(),
          options: rootMenu.options,
        }])
      }, 400)
    }
  }, [open, messages.length])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, typing])

  useEffect(() => {
    if (open) setNotification(false)
  }, [open])

  const handleOptionClick = (option: Option) => {
    // Add user message
    const userText = `${option.emoji ? option.emoji + ' ' : ''}${option.label}`
    setMessages(prev => {
      // Remove options from the last bot message so buttons disappear
      const updated = prev.map((msg, i) =>
        i === prev.length - 1 && msg.from === 'bot' ? { ...msg, options: undefined } : msg
      )
      return [...updated, { from: 'user', text: userText, time: getTime() }]
    })

    if (option.action === 'external' && option.url) {
      window.open(option.url, '_blank')
      setTimeout(() => {
        setMessages(prev => [...prev, {
          from: 'bot',
          text: "I've opened WhatsApp for you. Karim will get back to you soon! 👋\n\nAnything else I can help with?",
          time: getTime(),
          options: [{ label: 'Back to main menu', emoji: '🏠', action: 'menu', submenu: 'root' }],
        }])
      }, 500)
      return
    }

    setTyping(true)
    setTimeout(() => {
      if (option.action === 'response' && option.response) {
        setMessages(prev => [...prev, {
          from: 'bot',
          text: option.response!,
          time: getTime(),
          options: [
            { label: 'Book a strategy call', emoji: '📅', action: 'response', response: "Book your free 30-minute strategy call:\n\n👉 https://calendar.app.google/3WibM5kWvizhnHJt8" },
            { label: 'Ask something else', emoji: '💬', action: 'menu', submenu: 'root' },
            { label: 'Talk to human', emoji: '👋', action: 'external', url: WHATSAPP_URL },
          ],
        }])
      } else if (option.action === 'menu' && option.submenu && MENUS[option.submenu]) {
        const menu = MENUS[option.submenu]
        setMessages(prev => [...prev, {
          from: 'bot',
          text: menu.message,
          time: getTime(),
          options: menu.options,
        }])
      }
      setTyping(false)
    }, 500 + Math.random() * 400)
  }

  return (
    <>
      {/* FLOATING BUBBLE */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--sky), var(--purple))',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(16,161,219,0.4), 0 0 0 0 rgba(16,161,219,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            color: '#fff',
            transition: 'transform 0.2s',
            animation: 'botPulse 2s ease-in-out infinite',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          aria-label="Open support chat"
        >
          💬
          {notification && (
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#ff4d4d',
              border: '2px solid var(--dark2, #060c14)',
              animation: 'pulseDot 1.5s ease-in-out infinite',
            }} />
          )}
        </button>
      )}

      {/* CHAT WINDOW */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '400px',
          maxWidth: 'calc(100vw - 32px)',
          height: '620px',
          maxHeight: 'calc(100vh - 48px)',
          background: 'rgba(6,12,20,0.97)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(16,161,219,0.25)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'botSlide 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }} className="bot-window">
          {/* HEADER */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, rgba(16,161,219,0.15), rgba(106,70,217,0.1))',
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--sky), var(--purple))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem',
                border: '2px solid rgba(16,161,219,0.25)',
              }}>🤖</div>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--white)' }}>YallaBot</div>
                <div style={{ fontSize: '0.68rem', color: '#16db64', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16db64', display: 'inline-block' }} />
                  Online · Instant reply
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--white)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
              aria-label="Close chat"
            >✕</button>
          </div>

          {/* MESSAGES */}
          <div ref={scrollRef} style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}>
            {messages.map((msg, i) => (
              <div key={i}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.from === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'msgIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                  <div style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.from === 'user'
                      ? 'linear-gradient(135deg, var(--sky), var(--purple))'
                      : 'rgba(249,253,254,0.05)',
                    border: msg.from === 'bot' ? '1px solid var(--glass-border)' : 'none',
                    color: msg.from === 'user' ? '#fff' : 'var(--white)',
                    fontSize: '0.85rem',
                    lineHeight: 1.55,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>{msg.text}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '4px', padding: '0 6px' }}>{msg.time}</div>
                </div>

                {/* Option buttons */}
                {msg.options && msg.options.length > 0 && (
                  <div style={{
                    marginTop: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    animation: 'msgIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
                  }}>
                    {msg.options.map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => handleOptionClick(opt)}
                        style={{
                          background: 'rgba(16,161,219,0.06)',
                          border: '1px solid rgba(16,161,219,0.2)',
                          color: 'var(--white)',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          fontSize: '0.82rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif',
                          transition: 'all 0.15s',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(16,161,219,0.15)'
                          e.currentTarget.style.borderColor = 'rgba(16,161,219,0.4)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(16,161,219,0.06)'
                          e.currentTarget.style.borderColor = 'rgba(16,161,219,0.2)'
                        }}
                      >
                        {opt.emoji && <span>{opt.emoji}</span>}
                        <span style={{ flex: 1 }}>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', padding: '12px 16px', background: 'rgba(249,253,254,0.05)', border: '1px solid var(--glass-border)', borderRadius: '16px 16px 16px 4px', width: 'fit-content' }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: '6px', height: '6px',
                    borderRadius: '50%',
                    background: 'var(--sky)',
                    animation: `botTyping 1.4s infinite ${i * 0.2}s`,
                  }} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '10px 18px 14px',
            borderTop: '1px solid var(--glass-border)',
            background: 'rgba(0,0,0,0.2)',
            fontSize: '0.68rem',
            color: 'var(--text-dim)',
            textAlign: 'center',
          }}>
            Need a real conversation? <a href={WHATSAPP_URL} target="_blank" rel="noopener" style={{ color: 'var(--sky)', fontWeight: 600 }}>Chat on WhatsApp →</a>
          </div>
        </div>
      )}

      <style>{`
        @keyframes botPulse {
          0%, 100% { box-shadow: 0 8px 32px rgba(16,161,219,0.4), 0 0 0 0 rgba(16,161,219,0.5); }
          50% { box-shadow: 0 8px 32px rgba(16,161,219,0.4), 0 0 0 12px rgba(16,161,219,0); }
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
        @keyframes botSlide {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes botTyping {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @media(max-width: 500px) {
          .bot-window {
            bottom: 12px !important;
            right: 12px !important;
            left: 12px !important;
            width: auto !important;
            max-width: none !important;
            height: calc(100vh - 24px) !important;
          }
        }
      `}</style>
    </>
  )
}
