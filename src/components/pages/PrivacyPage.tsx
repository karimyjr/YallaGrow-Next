export default function PrivacyPage() {
  return (
    <div style={{paddingTop:'80px',padding:'120px 6% 80px',maxWidth:'800px',margin:'0 auto'}}>
      <h1 style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'2.5rem',color:'var(--white)',marginBottom:'8px'}}>Privacy Policy</h1>
      <p style={{fontSize:'0.75rem',color:'var(--text-dim)',marginBottom:'48px'}}>Last updated: June 2025</p>
      {[
        {title:'Information We Collect',body:'We collect information you provide directly to us through our contact forms, application forms, and newsletter subscriptions. This includes your name, email address, phone number, and any other information you choose to provide.'},
        {title:'How We Use Your Information',body:'We use the information we collect to respond to your inquiries, provide our services, send marketing communications (with your consent), improve our website, and comply with legal obligations.'},
        {title:'Information Sharing',body:'We do not sell, trade, or rent your personal information to third parties. We may share your information with service providers who assist us in operating our website and conducting our business.'},
        {title:'Cookies',body:'We use cookies to enhance your experience on our website, analyze traffic patterns, and personalize content. You can control cookie settings through your browser preferences.'},
        {title:'Data Security',body:'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'},
        {title:'Your Rights',body:'You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time by contacting us.'},
        {title:'Contact Us',body:'If you have questions about this Privacy Policy, please contact us at info@yallagrow.net'},
      ].map(s=>(
        <div key={s.title} style={{marginBottom:'40px'}}>
          <h2 style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'1.1rem',color:'var(--white)',marginBottom:'12px'}}>{s.title}</h2>
          <p style={{fontSize:'0.85rem',lineHeight:1.8,color:'var(--text-muted)',fontWeight:300}}>{s.body}</p>
        </div>
      ))}
    </div>
  )
}
