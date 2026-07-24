'use client'
import { useState, useRef, useEffect } from 'react'

// Knowledge base - the bot uses pattern matching against this
const KNOWLEDGE = [
  // Services
  {
    keywords: ['service', 'offer', 'do you do', 'what do you', 'help with', 'provide'],
    response: "We offer 9 core services:\n\n🎯 Marketing Strategy\n📱 Social Media Management\n💰 Paid Advertising (Meta & Google)\n🎨 Branding & Identity\n🎬 Content Creation (Reels, Posts)\n✍️ Copywriting\n🌐 Website Development\n📊 Analytics & Reporting\n🧠 Consulting\n\nWhich service interests you most?",
  },
  // Pricing
  {
    keywords: ['price', 'cost', 'how much', 'pricing', 'expensive', 'cheap', 'budget', 'fee', 'rate'],
    response: "We have 3 monthly packages:\n\n💚 **Launch** — $149/mo (starter package)\n⭐ **Grow** — $299/mo (most popular)\n🔥 **Dominate** — $499/mo (full-service)\n\nWe also have a Build Your Own package option and Performance Partnership for select clients. Want me to walk you through any of these?",
  },
  // Packages details
  {
    keywords: ['launch package', 'launch plan', 'starter'],
    response: "**Launch — $149/mo** includes:\n\n✓ 8 static posts/month\n✓ 2 short-form videos\n✓ Caption writing & hashtag research\n✓ Monthly performance report\n\nPerfect for businesses starting their marketing journey. Ready to explore it further?",
  },
  {
    keywords: ['grow package', 'grow plan'],
    response: "**Grow — $299/mo** (our most popular) includes:\n\n✓ 12 static posts/month\n✓ 4 short-form videos\n✓ Meta Ads management\n✓ Monthly strategy call\n\nBalanced content + ads for businesses ready to scale. Want to book a call to discuss?",
  },
  {
    keywords: ['dominate package', 'dominate plan', 'premium', 'full service'],
    response: "**Dominate — $499/mo** includes:\n\n✓ 16 static posts/month\n✓ 8 short-form videos\n✓ Full Meta Ads management\n✓ Performance dashboard\n✓ Priority support\n\nFor serious brands ready to scale aggressively. Let's book a call!",
  },
  // Website
  {
    keywords: ['website', 'web design', 'build a site', 'landing page'],
    response: "We build websites in 3 tiers:\n\n🚀 **Starter** ($150) — Single page\n💼 **Business** ($150-300) — 5 pages, mobile-ready\n⚡ **Advanced** ($300-600) — 10 pages + custom features\n\nFor $600+ budgets, we build fully custom sites. We also offer a **Website Consultancy + Audit** for $139 if you already have a site.",
  },
  // Ads
  {
    keywords: ['ads', 'advertising', 'meta', 'facebook ads', 'instagram ads', 'tiktok ads', 'google ads', 'paid ads'],
    response: "We run Meta (Facebook + Instagram) and TikTok ads with a $30/month management fee + your ad spend. We handle targeting, creatives, optimization, and reporting. Minimum recommended budget is $50-100/month for meaningful results.",
  },
  // Location
  {
    keywords: ['where', 'location', 'based', 'lebanon', 'country', 'from where'],
    response: "We're based in Lebanon 🇱🇧 and work with clients globally. We serve small businesses, startups, and personal brands anywhere in the world remotely.",
  },
  // Contact
  {
    keywords: ['contact', 'reach', 'talk to', 'call', 'phone', 'email', 'whatsapp'],
    response: "You can reach us via:\n\n💬 **WhatsApp:** +44 7376 441603 (fastest)\n📧 **Email:** info@yallagrow.net\n📞 **Book a call:** Free 30-min strategy session\n\nWant me to connect you now?",
  },
  // Booking
  {
    keywords: ['book', 'call', 'consultation', 'meeting', 'appointment', 'schedule'],
    response: "Great! You can book a free 30-minute strategy call using this link:\n\n👉 https://calendar.app.google/3WibM5kWvizhnHJt8\n\nNo commitment, no credit card — just a real conversation about your business.",
  },
  // Affiliate
  {
    keywords: ['affiliate', 'referral', 'commission', 'earn money', 'partner'],
    response: "Yes! We have an affiliate program:\n\n💰 Earn **20% commission** on invoices $179-$999\n💎 Earn **35% commission** on invoices $1,000+\n♾️ No cap on earnings\n\nApply at yallagrow.net/affiliate and start earning by sharing your unique code.",
  },
  // Timeline
  {
    keywords: ['how long', 'timeline', 'how fast', 'when start', 'delivery', 'turnaround'],
    response: "Timelines depend on the project:\n\n📱 Monthly packages: We start delivering content within 1 week of signup\n🌐 Websites: 3 days (Starter) to 3 weeks (Advanced)\n🎨 Branding: 1-2 weeks\n📊 Ad campaigns: Live within 5-7 days\n\nWe move fast without cutting corners.",
  },
  // Guarantee
  {
    keywords: ['guarantee', 'refund', 'money back', 'satisfaction'],
    response: "Every partnership starts with a free strategy call to confirm we're the right fit. We don't do refunds after work has started, but we're transparent and communicative — if you're unhappy, we work with you to fix it. Most clients stay 6+ months.",
  },
  // Performance Partnership
  {
    keywords: ['performance', 'partnership', 'profit share', 'commission based'],
    response: "Our **Performance Partnership** is invite-only:\n\nInstead of a monthly retainer, we combine a strategic upfront deposit with performance-based compensation. We grow together.\n\nWe offer 2 models:\n1️⃣ Net Profit Share\n2️⃣ Per-Sale Commission\n\nLearn more at yallagrow.net/partnership",
  },
  // Quiz / recommendation
  {
    keywords: ['recommend', 'which plan', 'best for me', 'suggest', 'right plan'],
    response: "Take our free 2-minute quiz to find your perfect plan:\n\n👉 yallagrow.net/quiz\n\nIt asks about your goals, current state, and budget — then recommends the best fit. Or I can help you decide here if you tell me about your business!",
  },
  // Team
  {
    keywords: ['team', 'who works', 'staff', 'employees', 'people'],
    response: "We're a lean, specialized team:\n\n🎯 **Founder/CEO** — Strategy & sales\n🎨 **Designer** — Content & brand\n✍️ **Copywriter** — Words that convert\n📈 **Media Buyer** (freelance) — Paid ads\n\nEvery person on the team touches your work directly — no agency middlemen.",
  },
  // Careers
  {
    keywords: ['job', 'hire', 'career', 'work with you', 'position', 'employment', 'apply'],
    response: "We're hiring! Currently open:\n\n🎨 Designer / Content Creator\n✍️ Copywriter / Content Specialist\n📈 Freelance Media Buyer\n\nCheck out yallagrow.net/careers to apply. We're based in Lebanon / Remote.",
  },
  // Greetings
  {
    keywords: ['hi', 'hello', 'hey', 'yo', 'sup', 'good morning', 'good evening'],
    response: "Hey there! 👋 I'm YallaBot, YallaGrow's AI assistant. I can help you with:\n\n• Package pricing & details\n• Our services\n• Booking a strategy call\n• Affiliate program info\n• Anything else about YallaGrow\n\nWhat can I help you with?",
  },
  // Thanks
  {
    keywords: ['thanks', 'thank you', 'appreciate', 'awesome', 'great', 'cool'],
    response: "You're welcome! 🙌 Anything else you'd like to know? If you're ready to talk to a human, I can connect you to Karim directly on WhatsApp.",
  },
]

interface Message {
  from: 'user' | 'bot'
  text: string
  time: string
}

function findResponse(input: string): string | null {
  const lower = input.toLowerCase()
  for (const entry of KNOWLEDGE) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.response
    }
  }
  return null
}

const WHATSAPP_URL = 'https://api.whatsapp.com/send/?phone=447376441603&text=Hi%20YallaGrow%2C%20I%20need%20some%20help&type=phone_number&app_absent=0'

export default function SupportBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [notification, setNotification] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const getTime = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  // Welcome message on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setTimeout(() => {
        setMessages([{
          from: 'bot',
          text: "Hey there! 👋 I'm YallaBot — YallaGrow's AI assistant.\n\nI can help you with:\n• Package pricing & details\n• Our services\n• Booking a strategy call\n• Anything else about YallaGrow\n\nWhat can I help you with?",
          time: getTime(),
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

  // Clear notification when opened
  useEffect(() => {
    if (open) setNotification(false)
  }, [open])

  const send = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { from: 'user', text: userMsg, time: getTime() }])
    setInput('')
    setTyping(true)

    // Simulate thinking delay
    setTimeout(() => {
      const response = findResponse(userMsg)
      if (response) {
        setMessages(prev => [...prev, { from: 'bot', text: response, time: getTime() }])
      } else {
        setMessages(prev => [...prev, {
          from: 'bot',
          text: "I'm not sure I have the answer to that one 🤔\n\nWould you like to chat with a real human? I can connect you to our founder Karim directly.",
          time: getTime(),
        }])
      }
      setTyping(false)
    }, 800 + Math.random() * 600)
  }

  const quickReplies = ['💰 Pricing', '🎯 Services', '📅 Book a call', '💬 Talk to human']

  const handleQuickReply = (reply: string) => {
    if (reply.includes('Talk to human')) {
      window.open(WHATSAPP_URL, '_blank')
      return
    }
    const text = reply.replace(/[💰🎯📅💬]\s*/g, '').trim()
    setInput(text)
    setTimeout(() => {
      const btn = document.querySelector<HTMLButtonElement>('#bot-send-btn')
      btn?.click()
    }, 50)
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
              animation: 'pulse 1.5s ease-in-out infinite',
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
          width: '380px',
          maxWidth: 'calc(100vw - 32px)',
          height: '580px',
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
            padding: '18px 20px',
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
              <div key={i} style={{
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
            ))}

            {typing && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', padding: '12px 16px', background: 'rgba(249,253,254,0.05)', border: '1px solid var(--glass-border)', borderRadius: '16px 16px 16px 4px', width: 'fit-content' }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: '6px', height: '6px',
                    borderRadius: '50%',
                    background: 'var(--sky)',
                    animation: `typing 1.4s infinite ${i * 0.2}s`,
                  }} />
                ))}
              </div>
            )}
          </div>

          {/* QUICK REPLIES (only if no user message yet) */}
          {messages.filter(m => m.from === 'user').length === 0 && messages.length > 0 && !typing && (
            <div style={{
              padding: '0 20px 12px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
            }}>
              {quickReplies.map(reply => (
                <button
                  key={reply}
                  onClick={() => handleQuickReply(reply)}
                  style={{
                    background: 'rgba(16,161,219,0.08)',
                    border: '1px solid rgba(16,161,219,0.2)',
                    color: 'var(--sky)',
                    padding: '6px 12px',
                    borderRadius: '100px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,161,219,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(16,161,219,0.08)'}
                >{reply}</button>
              ))}
            </div>
          )}

          {/* INPUT */}
          <div style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--glass-border)',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type your message..."
              style={{
                flex: 1,
                background: 'rgba(249,253,254,0.04)',
                border: '1px solid var(--glass-border)',
                borderRadius: '100px',
                padding: '10px 16px',
                color: 'var(--white)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.85rem',
                outline: 'none',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(16,161,219,0.4)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            />
            <button
              id="bot-send-btn"
              onClick={send}
              disabled={!input.trim()}
              style={{
                background: 'linear-gradient(135deg, var(--sky), var(--purple))',
                border: 'none',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                opacity: input.trim() ? 1 : 0.4,
                color: '#fff',
                fontSize: '0.9rem',
                transition: 'all 0.2s',
              }}
              aria-label="Send message"
            >→</button>
          </div>

          {/* WhatsApp fallback footer */}
          <div style={{
            padding: '8px 18px 12px',
            fontSize: '0.68rem',
            color: 'var(--text-dim)',
            textAlign: 'center',
          }}>
            Need a human? <a href={WHATSAPP_URL} target="_blank" rel="noopener" style={{ color: 'var(--sky)', fontWeight: 600 }}>Chat on WhatsApp →</a>
          </div>
        </div>
      )}

      <style>{`
        @keyframes botPulse {
          0%, 100% { box-shadow: 0 8px 32px rgba(16,161,219,0.4), 0 0 0 0 rgba(16,161,219,0.5); }
          50% { box-shadow: 0 8px 32px rgba(16,161,219,0.4), 0 0 0 12px rgba(16,161,219,0); }
        }
        @keyframes pulse {
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
        @keyframes typing {
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
          }
        }
      `}</style>
    </>
  )
}
