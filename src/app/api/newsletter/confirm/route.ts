// src/app/api/newsletter/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = 'YallaGrow <info@yallagrow.net>'
const SITE_URL = 'https://yallagrow.net'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(`${SITE_URL}/newsletter/confirmed?status=error`)
  }

  // Find subscriber with this token
  const { data: subscriber, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .eq('confirmation_token', token)
    .single()

  if (error || !subscriber) {
    return NextResponse.redirect(`${SITE_URL}/newsletter/confirmed?status=invalid`)
  }

  if (subscriber.confirmed) {
    return NextResponse.redirect(`${SITE_URL}/newsletter/confirmed?status=already`)
  }

  // Confirm the subscription
  await supabase
    .from('newsletter_subscribers')
    .update({
      confirmed: true,
      confirmed_at: new Date().toISOString(),
      confirmation_token: null, // Invalidate token
    })
    .eq('id', subscriber.id)

  // Send welcome email
  if (RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: subscriber.email,
          subject: 'Welcome to YallaGrow 🎉',
          html: getWelcomeEmailHtml(),
        }),
      })
    } catch (err) {
      console.error('Failed to send welcome email:', err)
    }
  }

  return NextResponse.redirect(`${SITE_URL}/newsletter/confirmed?status=success`)
}

function getWelcomeEmailHtml(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Welcome to YallaGrow</title>
</head>
<body style="margin:0;padding:0;background:#060c14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:520px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-family:'Syne',Georgia,serif;font-weight:800;font-size:1.6rem;color:#ffffff;margin:0;letter-spacing:-0.5px;">
        Yalla<em style="color:#10a1db;font-style:normal;">Grow</em>
      </h1>
    </div>

    <div style="background:linear-gradient(135deg,rgba(1,32,76,0.4),rgba(16,161,219,0.06));border:1px solid rgba(16,161,219,0.2);border-radius:20px;padding:36px 32px;">
      <div style="text-align:center;font-size:3rem;margin-bottom:16px;">🎉</div>
      <h2 style="font-family:'Syne',Georgia,serif;font-weight:800;font-size:1.5rem;color:#ffffff;margin:0 0 16px;letter-spacing:-0.3px;text-align:center;line-height:1.2;">
        Welcome to YallaGrow!
      </h2>
      <p style="color:rgba(249,253,254,0.75);font-size:0.95rem;line-height:1.7;margin:0 0 20px;font-weight:300;">
        Hey there,
      </p>
      <p style="color:rgba(249,253,254,0.7);font-size:0.92rem;line-height:1.7;margin:0 0 20px;font-weight:300;">
        You're officially in! You'll now receive our monthly marketing playbook — actionable insights, real case studies, and strategies you can apply to your business immediately.
      </p>
      <p style="color:rgba(249,253,254,0.7);font-size:0.92rem;line-height:1.7;margin:0 0 24px;font-weight:300;">
        Here's what you can expect:
      </p>

      <div style="background:rgba(16,161,219,0.05);border:1px solid rgba(16,161,219,0.15);border-radius:12px;padding:16px 20px;margin-bottom:28px;">
        <div style="color:rgba(249,253,254,0.8);font-size:0.88rem;line-height:1.9;">
          <div>✓ Monthly marketing insights tailored for growing businesses</div>
          <div>✓ Real client case studies (with real numbers)</div>
          <div>✓ Free templates & resources</div>
          <div>✓ No spam — unsubscribe anytime</div>
        </div>
      </div>

      <p style="color:rgba(249,253,254,0.7);font-size:0.92rem;line-height:1.7;margin:0 0 28px;font-weight:300;">
        In the meantime, if you want to chat about your business or need help with anything, we're just a click away.
      </p>

      <div style="text-align:center;margin-bottom:20px;">
        <a href="${SITE_URL}/quiz" style="display:inline-block;background:#10a1db;color:#080f1a;padding:14px 32px;border-radius:10px;font-size:0.92rem;font-weight:700;text-decoration:none;">
          Book a Free Strategy Call →
        </a>
      </div>

      <p style="color:rgba(249,253,254,0.6);font-size:0.85rem;line-height:1.7;margin:20px 0 0;font-weight:300;text-align:center;">
        Cheers,<br>
        <strong style="color:#ffffff;">Karim & the YallaGrow team</strong>
      </p>
    </div>

    <div style="text-align:center;margin-top:32px;color:rgba(249,253,254,0.35);font-size:0.75rem;line-height:1.6;">
      <p style="margin:0;">
        © 2025 YallaGrow · <a href="${SITE_URL}" style="color:rgba(249,253,254,0.5);text-decoration:none;">yallagrow.net</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
