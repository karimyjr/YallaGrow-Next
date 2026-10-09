// src/app/privacy/page.tsx
import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy',
  description: 'How YallaGrow collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <article style={{ maxWidth: '820px', margin: '0 auto', padding: '60px 20px 100px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--sky)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, marginBottom: '24px' }}>
          ← Back to Home
        </Link>

        <span className="eyebrow" style={{ marginBottom: '12px' }}>Legal</span>

        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--white)', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '14px', marginTop: '12px' }}>
          Privacy Policy
        </h1>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '40px' }}>
          Last updated: October 9, 2026
        </p>

        <div className="legal-content">
          <p>
            YallaGrow (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) respects your privacy. This Privacy Policy explains how we collect, use, store, and protect your information when you visit yallagrow.net or use our services.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We collect information in two ways:</p>

          <h3>Information you provide directly:</h3>
          <ul>
            <li>Contact details (name, email, phone, WhatsApp number)</li>
            <li>Business information you share in forms (company name, website, industry, goals)</li>
            <li>Package preferences and budget details from our Package Builder</li>
            <li>Job application details and portfolio links (for careers submissions)</li>
            <li>Messages you send us via contact forms or email</li>
            <li>Newsletter signup email addresses</li>
          </ul>

          <h3>Information collected automatically:</h3>
          <ul>
            <li>Browser type, device information, and operating system</li>
            <li>IP address and approximate location</li>
            <li>Pages visited, time spent on pages, and referral sources</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Respond to inquiries and provide the services you request</li>
            <li>Send booking confirmations, service updates, and account notifications</li>
            <li>Send marketing emails and newsletters (only if you&apos;ve opted in)</li>
            <li>Improve our website, services, and user experience</li>
            <li>Prevent fraud and ensure the security of our platform</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>3. Cookies &amp; Analytics</h2>
          <p>
            We use cookies to enhance your browsing experience. Cookies are small files stored on your device that help us remember your preferences and understand how you use our site.
          </p>
          <p>
            We use <strong>Google Analytics 4</strong> to track anonymized usage data (page views, session duration, geographic region). IP addresses are anonymized. You can opt out via browser settings or Google&apos;s opt-out tool.
          </p>
          <p>
            You can disable cookies in your browser settings, but some features of the site may not work properly.
          </p>

          <h2>4. Third-Party Services</h2>
          <p>We use trusted third-party services to run our business:</p>
          <ul>
            <li><strong>Supabase</strong> — database and authentication (hosted in secure data centers)</li>
            <li><strong>Vercel</strong> — website hosting and infrastructure</li>
            <li><strong>Resend</strong> — transactional email delivery</li>
            <li><strong>Google Analytics</strong> — anonymized usage analytics</li>
            <li><strong>Google Calendar</strong> — booking strategy calls</li>
          </ul>
          <p>
            Each service has its own privacy policy. We only share the minimum information needed for them to function.
          </p>

          <h2>5. Data Protection &amp; Security</h2>
          <p>
            We take reasonable technical and organizational measures to protect your data from unauthorized access, loss, or misuse. All data transmitted to our servers is encrypted via HTTPS/TLS. Database access is restricted and logged.
          </p>
          <p>
            However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
          </p>

          <h2>6. Data Retention</h2>
          <p>We keep your information only as long as needed:</p>
          <ul>
            <li>Contact form submissions: 2 years</li>
            <li>Package Builder submissions: 2 years</li>
            <li>Job applications: 1 year</li>
            <li>Newsletter subscribers: Until you unsubscribe</li>
            <li>Active client data: For the duration of our engagement + 7 years for legal/tax records</li>
          </ul>

          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access</strong> the personal data we hold about you</li>
            <li><strong>Correct</strong> inaccurate or incomplete data</li>
            <li><strong>Delete</strong> your data (&ldquo;right to be forgotten&rdquo;)</li>
            <li><strong>Restrict</strong> how we process your data</li>
            <li><strong>Export</strong> your data in a portable format</li>
            <li><strong>Opt out</strong> of marketing communications at any time</li>
            <li><strong>Withdraw consent</strong> where we rely on consent to process data</li>
          </ul>
          <p>
            To exercise any of these rights, email us at <a href="mailto:info@yallagrow.net">info@yallagrow.net</a>. We&apos;ll respond within 30 days.
          </p>

          <h2>8. Children&apos;s Privacy</h2>
          <p>
            Our services are not intended for individuals under 16. We do not knowingly collect data from children. If you believe we have collected data from a child, please contact us immediately.
          </p>

          <h2>9. International Data Transfers</h2>
          <p>
            YallaGrow is based in Lebanon, and we work with clients globally. Your data may be transferred to and processed in countries outside your region, including the United States (via our hosting providers). We ensure appropriate safeguards are in place.
          </p>

          <h2>10. Policy Updates</h2>
          <p>
            We may update this Privacy Policy from time to time. Material changes will be announced via a notice on our website or by email. The &ldquo;Last updated&rdquo; date at the top reflects the latest revision.
          </p>

          <h2>11. Contact Us</h2>
          <p>Questions about this policy? Reach out:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:info@yallagrow.net">info@yallagrow.net</a></li>
            <li><strong>WhatsApp:</strong> <a href="https://wa.me/447376441603" target="_blank" rel="noopener">+44 7376 441603</a></li>
            <li><strong>Address:</strong> Baabda, Beirut, Lebanon</li>
          </ul>
        </div>
      </article>

      <style>{`
        .legal-content {
          font-size: 0.95rem;
          line-height: 1.8;
          color: rgba(249,253,254,0.75);
          font-weight: 300;
        }
        .legal-content h2 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.4rem;
          color: var(--white);
          letter-spacing: -0.5px;
          margin: 40px 0 16px;
          line-height: 1.2;
        }
        .legal-content h3 {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--white);
          margin: 24px 0 10px;
          line-height: 1.3;
        }
        .legal-content p { margin-bottom: 16px; }
        .legal-content ul {
          margin: 10px 0 20px;
          padding-left: 24px;
        }
        .legal-content li { margin-bottom: 8px; }
        .legal-content a {
          color: var(--sky);
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 2px;
        }
        .legal-content a:hover { color: var(--white); }
        .legal-content strong { color: var(--white); font-weight: 600; }
      `}</style>
    </div>
  )
}
