// src/app/api/newsletter/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = 'YallaGrow <info@yallagrow.net>'
const SITE_URL = 'https://yallagrow.net'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  try {
    const { email, source = 'unknown' } = await req.json()

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, confirmed')
      .eq('email', normalizedEmail)
      .single()

    if (existing?.confirmed) {
      return NextResponse.json({
        success: true,
        message: "You're already subscribed! 🎉",
        alreadySubscribed: true,
      })
    }

    // Generate confirmation token
    const token = crypto.randomBytes(32).toString('hex')

    if (existing) {
      // Update existing unconfirmed record with new token
      await supabase
        .from('newsletter_subscribers')
        .update({ confirmation_token: token, source })
        .eq('id', existing.id)
    } else {
      // Create new subscriber
      const { error } = await supabase.from('newsletter_subscribers').insert({
        email: normalizedEmail,
        source,
        confirmation_token: token,
        confirmed: false,
      })

      if (error) {
        console.error('Supabase error:', error)
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
      }
    }

    // Send confirmation email via Resend
    if (RESEND_API_KEY) {
      const confirmUrl = `${SITE_URL}/api/newsletter/confirm?token=${token}`

      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: normalizedEmail,
            subject: 'Confirm your subscription to YallaGrow',
            html: getConfirmationEmailHtml(confirmUrl),
          }),
        })

        if (!response.ok) {
          const err = await response.text()
          console.error('Resend error:', err)
        }
      } catch (err) {
        console.error('Failed to send email:', err)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Check your inbox! We sent you a confirmation email.",
    })
  } catch (err) {
    console.error('Route error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

function getConfirmationEmailHtml(confirmUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Confirm your subscription</title>
</head>
<body style="margin:0;padding:0;background:#060c14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:520px;margin:0 auto;padding:40px 20px;">
    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-family:'Syne',Georgia,serif;font-weight:800;font-size:1.6rem;color:#ffffff;margin:0;letter-spacing:-0.5px;">
        Yalla<em style="color:#10a1db;font-style:normal;">Grow</em>
      </h1>
    </div>

    <!-- Card -->
    <div style="background:linear-gradient(135deg,rgba(1,32,76,0.4),rgba(16,161,219,0.06));border:1px solid rgba(16,161,219,0.2);border-radius:20px;padding:36px 32px;">
      <div style="text-align:center;font-size:2.5rem;margin-bottom:16px;">📬</div>
      <h2 style="font-family:'Syne',Georgia,serif;font-weight:800;font-size:1.4rem;color:#ffffff;margin:0 0 16px;letter-spacing:-0.3px;text-align:center;line-height:1.2;">
        Confirm your subscription
      </h2>
      <p style="color:rgba(249,253,254,0.7);font-size:0.95rem;line-height:1.65;margin:0 0 28px;text-align:center;font-weight:300;">
        Click the button below to confirm your email and start receiving monthly marketing insights, real case studies, and strategies from YallaGrow.
      </p>

      <!-- CTA Button -->
      <div style="text-align:center;margin-bottom:24px;">
        <a href="${confirmUrl}" style="display:inline-block;background:#10a1db;color:#080f1a;padding:14px 32px;border-radius:10px;font-size:0.95rem;font-weight:700;text-decoration:none;">
          Confirm Subscription →
        </a>
      </div>

      <p style="color:rgba(249,253,254,0.4);font-size:0.75rem;line-height:1.5;text-align:center;margin:0;">
        Or copy this link:<br>
        <a href="${confirmUrl}" style="color:#10a1db;word-break:break-all;">${confirmUrl}</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:32px;color:rgba(249,253,254,0.35);font-size:0.75rem;line-height:1.6;">
      <p style="margin:0 0 6px;">
        If you didn't request this, you can safely ignore this email.
      </p>
      <p style="margin:0;">
        © 2025 YallaGrow · <a href="https://yallagrow.net" style="color:rgba(249,253,254,0.5);text-decoration:none;">yallagrow.net</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
