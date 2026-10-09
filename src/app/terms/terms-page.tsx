// src/app/terms/page.tsx
import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions governing your use of YallaGrow services.',
}

export default function TermsPage() {
  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <article style={{ maxWidth: '820px', margin: '0 auto', padding: '60px 20px 100px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--sky)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, marginBottom: '24px' }}>
          ← Back to Home
        </Link>

        <span className="eyebrow" style={{ marginBottom: '12px' }}>Legal</span>

        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--white)', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '14px', marginTop: '12px' }}>
          Terms of Service
        </h1>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '40px' }}>
          Last updated: October 9, 2026
        </p>

        <div className="legal-content">
          <p>
            Welcome to YallaGrow. These Terms of Service (&ldquo;Terms&rdquo;) govern your use of our website (yallagrow.net) and services. By using our site or hiring us, you agree to these Terms.
          </p>

          <h2>1. Who We Are</h2>
          <p>
            YallaGrow is a growth marketing agency based in Baabda, Beirut, Lebanon. We help startups, small businesses, and personal brands grow through strategy, social media management, paid advertising, branding, content creation, copywriting, website development, analytics, and consulting services.
          </p>

          <h2>2. Services We Offer</h2>
          <p>Our core services include:</p>
          <ul>
            <li>Marketing strategy and consulting</li>
            <li>Social media management (Instagram, Facebook, TikTok, LinkedIn)</li>
            <li>Paid advertising on Meta (Facebook/Instagram) and TikTok</li>
            <li>Branding and visual identity design</li>
            <li>Content creation (static posts, reels, short-form video)</li>
            <li>Copywriting and ad copy</li>
            <li>Website design and development</li>
            <li>Analytics and performance reporting</li>
          </ul>
          <p>
            Specific deliverables depend on the package or custom scope agreed upon during your onboarding call.
          </p>

          <h2>3. Pricing &amp; Payment</h2>
          <p>
            Our package prices are shown on our website in USD. Prices are subject to change, but existing clients&apos; rates are locked in for the duration of their active engagement.
          </p>
          <p><strong>Payment terms:</strong></p>
          <ul>
            <li><strong>Monthly packages:</strong> Billed in advance at the start of each month</li>
            <li><strong>First payment:</strong> Due before work begins</li>
            <li><strong>Payment methods:</strong> Bank transfer, Wise, OMT, Western Union, or other arranged methods</li>
            <li><strong>Ad spend:</strong> If your package includes paid advertising, the ad spend budget is paid separately and directly to the ad platform (Meta, TikTok) — this is not included in our management fee</li>
            <li><strong>One-off projects:</strong> 50% deposit required to start, 50% due upon delivery</li>
            <li><strong>Late payments:</strong> Services may be paused after 7 days overdue</li>
          </ul>

          <h2>4. Cancellation &amp; Refunds</h2>
          <p><strong>Monthly packages:</strong></p>
          <ul>
            <li>You may cancel at any time by giving us <strong>7 days&apos; written notice</strong> before your next billing cycle</li>
            <li>Already-paid months are non-refundable, but we&apos;ll continue to deliver all remaining work for the paid period</li>
            <li>No long-term contracts — you&apos;re never locked in</li>
          </ul>
          <p><strong>One-off projects:</strong></p>
          <ul>
            <li>Deposits are non-refundable once work has started</li>
            <li>If we haven&apos;t started yet, you&apos;re entitled to a full refund within 7 days of payment</li>
            <li>If we deliver the final product and you&apos;re unsatisfied, we offer up to two rounds of revisions at no extra charge</li>
          </ul>

          <h2>5. The YallaGrow Promise</h2>
          <p>
            If after your first month you genuinely believe we delivered less value than you paid for, we will continue working with you for an additional two weeks at no extra cost — no questions asked. This is not a money-back guarantee; it&apos;s a commitment to make things right.
          </p>

          <h2>6. Client Responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>Provide timely feedback, approvals, and content/assets we need to do our work</li>
            <li>Pay invoices on time</li>
            <li>Respect our team members and treat them professionally</li>
            <li>Not ask us to engage in deceptive, misleading, or illegal practices</li>
            <li>Give us administrative access to accounts we need to manage (social media, ad platforms)</li>
          </ul>
          <p>
            Delays caused by missing input from your side may push back deadlines without penalty to us.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            Once you&apos;ve paid in full for a deliverable, you own the final work (logos, designs, copy, websites, etc.). Until payment is received, we retain all rights.
          </p>
          <p>
            We reserve the right to showcase our work in our portfolio, case studies, and marketing materials unless you specifically request confidentiality in writing.
          </p>
          <p>
            Tools, systems, methodologies, templates, and know-how we develop remain our property. We grant you a license to use the final deliverables, but not our underlying frameworks.
          </p>

          <h2>8. Confidentiality</h2>
          <p>
            We treat all information you share with us (business plans, financials, strategies) as confidential. We will not share it with third parties except as needed to deliver services (e.g. subcontractors, hosting providers) or as required by law.
          </p>

          <h2>9. Results &amp; Guarantees</h2>
          <p>
            Marketing is complex and results depend on many factors outside our control (market conditions, product-market fit, your pricing, competition). <strong>We do not guarantee specific results</strong> like follower growth, revenue increases, or conversion rates.
          </p>
          <p>
            What we do guarantee is professional execution, honest communication, and genuine effort to help your business grow.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, YallaGrow&apos;s total liability for any claim arising from our services is limited to the amount you paid us in the three months prior to the claim.
          </p>
          <p>
            We are not responsible for:
          </p>
          <ul>
            <li>Loss of profits or revenue</li>
            <li>Platform penalties or account bans (if caused by actions outside our control)</li>
            <li>Third-party service outages (Meta, Google, TikTok, etc.)</li>
            <li>Decisions you make based on our recommendations</li>
          </ul>

          <h2>11. Termination by Us</h2>
          <p>
            We reserve the right to end our engagement with you if:
          </p>
          <ul>
            <li>You violate these Terms</li>
            <li>You engage in abusive, harassing, or unethical behavior toward our team</li>
            <li>You ask us to engage in illegal or deceptive practices</li>
            <li>You fail to pay invoices on time repeatedly</li>
          </ul>
          <p>
            In case of termination by us for cause, you forfeit any prepaid balance.
          </p>

          <h2>12. Website Use</h2>
          <p>By using yallagrow.net, you agree:</p>
          <ul>
            <li>Not to attempt to hack, scrape, or disrupt our site</li>
            <li>Not to use our content without permission</li>
            <li>Not to impersonate YallaGrow or our team</li>
          </ul>

          <h2>13. Changes to These Terms</h2>
          <p>
            We may update these Terms. We&apos;ll notify active clients of material changes by email. The &ldquo;Last updated&rdquo; date at the top reflects the latest revision.
          </p>

          <h2>14. Governing Law</h2>
          <p>
            These Terms are governed by the laws of Lebanon. Any disputes will be handled in Beirut courts, unless we both agree otherwise in writing.
          </p>

          <h2>15. Contact</h2>
          <p>Questions about these Terms?</p>
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
