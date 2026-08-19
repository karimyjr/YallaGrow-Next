// src/app/api/submissions/package/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = 'YallaGrow <info@yallagrow.net>'
const TO_EMAIL = 'info@yallagrow.net'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name, email, whatsapp,
      staticPosts, carousels, reels,
      marketingType, metaBudget, tiktokBudget,
      websiteTier, websiteBudget, consultancyUrl,
      addons, estimatedMonthly,
    } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 })
    }

    // Save to Supabase
    const { data: saved, error } = await supabase.from('package_submissions').insert({
      name, email, whatsapp: whatsapp || null,
      static_posts: staticPosts || 0,
      carousels: carousels || 0,
      reels: reels || 0,
      marketing_type: marketingType || null,
      meta_budget: metaBudget || 0,
      tiktok_budget: tiktokBudget || 0,
      website_tier: websiteTier || null,
      website_budget: websiteBudget || 0,
      consultancy_url: consultancyUrl || null,
      addons: addons || [],
      estimated_monthly: estimatedMonthly || 0,
    }).select().single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }

    // Send notification email
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
            to: TO_EMAIL,
            reply_to: email,
            subject: `📦 New Package Request from ${name} — $${estimatedMonthly}/mo`,
            html: buildPackageEmail(body, saved.id),
          }),
        })
      } catch (err) {
        console.error('Email failed:', err)
      }
    }

    return NextResponse.json({ success: true, id: saved.id })
  } catch (err) {
    console.error('Route error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

interface PackageEmailData {
  name: string
  email: string
  whatsapp?: string
  staticPosts?: number
  carousels?: number
  reels?: number
  marketingType?: string
  metaBudget?: number
  tiktokBudget?: number
  websiteTier?: string
  websiteBudget?: number
  consultancyUrl?: string
  addons?: string[]
  estimatedMonthly?: number
}

function buildPackageEmail(data: PackageEmailData, id: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#060c14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px;">
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="font-family:'Syne',Georgia,serif;font-weight:800;font-size:1.4rem;color:#ffffff;margin:0;letter-spacing:-0.5px;">
        Yalla<em style="color:#10a1db;font-style:normal;">Grow</em>
      </h1>
      <p style="color:rgba(249,253,254,0.5);font-size:0.75rem;margin:8px 0 0;letter-spacing:1.5px;text-transform:uppercase;">New Package Request</p>
    </div>

    <div style="background:linear-gradient(135deg,rgba(1,32,76,0.4),rgba(16,161,219,0.06));border:1px solid rgba(16,161,219,0.2);border-radius:16px;padding:28px;margin-bottom:16px;">
      <div style="text-align:center;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.08);">
        <div style="color:rgba(249,253,254,0.5);font-size:0.7rem;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">Estimated Monthly</div>
        <div style="font-family:'Syne',Georgia,serif;font-weight:800;font-size:2.4rem;color:#10a1db;letter-spacing:-1px;">$${data.estimatedMonthly}</div>
      </div>

      <div style="color:#ffffff;font-size:0.95rem;font-weight:600;margin-bottom:12px;">Contact Info</div>
      <table style="width:100%;color:rgba(249,253,254,0.75);font-size:0.88rem;margin-bottom:20px;">
        <tr><td style="padding:6px 0;color:rgba(249,253,254,0.5);width:120px;">Name:</td><td><strong style="color:#ffffff;">${data.name}</strong></td></tr>
        <tr><td style="padding:6px 0;color:rgba(249,253,254,0.5);">Email:</td><td><a href="mailto:${data.email}" style="color:#10a1db;text-decoration:none;">${data.email}</a></td></tr>
        ${data.whatsapp ? `<tr><td style="padding:6px 0;color:rgba(249,253,254,0.5);">WhatsApp:</td><td><a href="https://wa.me/${data.whatsapp.replace(/[^\d]/g, '')}" style="color:#10a1db;text-decoration:none;">${data.whatsapp}</a></td></tr>` : ''}
      </table>

      <div style="color:#ffffff;font-size:0.95rem;font-weight:600;margin-bottom:12px;">Package Details</div>
      <table style="width:100%;color:rgba(249,253,254,0.75);font-size:0.85rem;">
        ${data.staticPosts ? `<tr><td style="padding:4px 0;color:rgba(249,253,254,0.5);">Static posts:</td><td>${data.staticPosts}/mo</td></tr>` : ''}
        ${data.carousels ? `<tr><td style="padding:4px 0;color:rgba(249,253,254,0.5);">Carousels:</td><td>${data.carousels}/mo</td></tr>` : ''}
        ${data.reels ? `<tr><td style="padding:4px 0;color:rgba(249,253,254,0.5);">Reels:</td><td>${data.reels}/mo</td></tr>` : ''}
        ${data.marketingType ? `<tr><td style="padding:4px 0;color:rgba(249,253,254,0.5);">Marketing:</td><td>${data.marketingType}</td></tr>` : ''}
        ${data.metaBudget ? `<tr><td style="padding:4px 0;color:rgba(249,253,254,0.5);">Meta budget:</td><td>$${data.metaBudget}/mo</td></tr>` : ''}
        ${data.tiktokBudget ? `<tr><td style="padding:4px 0;color:rgba(249,253,254,0.5);">TikTok budget:</td><td>$${data.tiktokBudget}/mo</td></tr>` : ''}
        ${data.websiteTier && data.websiteTier !== 'none' ? `<tr><td style="padding:4px 0;color:rgba(249,253,254,0.5);">Website:</td><td>${data.websiteTier}${data.websiteBudget ? ` ($${data.websiteBudget})` : ''}</td></tr>` : ''}
        ${data.consultancyUrl ? `<tr><td style="padding:4px 0;color:rgba(249,253,254,0.5);">Site to audit:</td><td><a href="${data.consultancyUrl}" style="color:#10a1db;text-decoration:none;">${data.consultancyUrl}</a></td></tr>` : ''}
        ${data.addons && data.addons.length > 0 ? `<tr><td style="padding:4px 0;color:rgba(249,253,254,0.5);">Add-ons:</td><td>${data.addons.join(', ')}</td></tr>` : ''}
      </table>
    </div>

    <div style="text-align:center;">
      <a href="https://yallagrow.net/admin" style="display:inline-block;background:#10a1db;color:#080f1a;padding:12px 24px;border-radius:10px;font-size:0.85rem;font-weight:700;text-decoration:none;">View in Admin →</a>
    </div>

    <div style="text-align:center;margin-top:20px;color:rgba(249,253,254,0.3);font-size:0.7rem;">
      Submission ID: ${id}
    </div>
  </div>
</body>
</html>`.trim()
}
