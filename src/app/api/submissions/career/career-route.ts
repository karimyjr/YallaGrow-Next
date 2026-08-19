// src/app/api/submissions/career/route.ts
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
    const { name, email, phone, role, portfolio, linkedin, message } = await req.json()

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Name, email, and role required' }, { status: 400 })
    }

    const { data: saved, error } = await supabase.from('job_applications').insert({
      name, email,
      phone: phone || null,
      role,
      portfolio: portfolio || null,
      linkedin: linkedin || null,
      message: message || null,
    }).select().single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }

    if (RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: TO_EMAIL,
            reply_to: email,
            subject: `💼 New Job Application: ${role} — ${name}`,
            html: buildJobEmail({ name, email, phone, role, portfolio, linkedin, message }, saved.id),
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

interface JobEmailData {
  name: string
  email: string
  phone?: string
  role: string
  portfolio?: string
  linkedin?: string
  message?: string
}

function buildJobEmail(data: JobEmailData, id: string): string {
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
      <p style="color:rgba(249,253,254,0.5);font-size:0.75rem;margin:8px 0 0;letter-spacing:1.5px;text-transform:uppercase;">New Job Application</p>
    </div>

    <div style="background:linear-gradient(135deg,rgba(1,32,76,0.4),rgba(106,70,217,0.08));border:1px solid rgba(16,161,219,0.2);border-radius:16px;padding:28px;margin-bottom:16px;">
      <div style="text-align:center;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.08);">
        <div style="color:rgba(249,253,254,0.5);font-size:0.7rem;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">Applying For</div>
        <div style="font-family:'Syne',Georgia,serif;font-weight:800;font-size:1.5rem;color:#10a1db;letter-spacing:-0.5px;">${data.role}</div>
      </div>

      <div style="color:#ffffff;font-size:0.95rem;font-weight:600;margin-bottom:12px;">Applicant</div>
      <table style="width:100%;color:rgba(249,253,254,0.75);font-size:0.88rem;margin-bottom:20px;">
        <tr><td style="padding:6px 0;color:rgba(249,253,254,0.5);width:120px;">Name:</td><td><strong style="color:#ffffff;">${data.name}</strong></td></tr>
        <tr><td style="padding:6px 0;color:rgba(249,253,254,0.5);">Email:</td><td><a href="mailto:${data.email}" style="color:#10a1db;text-decoration:none;">${data.email}</a></td></tr>
        ${data.phone ? `<tr><td style="padding:6px 0;color:rgba(249,253,254,0.5);">WhatsApp:</td><td><a href="https://wa.me/${data.phone.replace(/[^\d]/g, '')}" style="color:#10a1db;text-decoration:none;">${data.phone}</a></td></tr>` : ''}
        ${data.portfolio ? `<tr><td style="padding:6px 0;color:rgba(249,253,254,0.5);">Portfolio:</td><td><a href="${data.portfolio}" style="color:#10a1db;text-decoration:none;word-break:break-all;">${data.portfolio}</a></td></tr>` : ''}
        ${data.linkedin ? `<tr><td style="padding:6px 0;color:rgba(249,253,254,0.5);">LinkedIn:</td><td><a href="${data.linkedin}" style="color:#10a1db;text-decoration:none;word-break:break-all;">${data.linkedin}</a></td></tr>` : ''}
      </table>

      ${data.message ? `
      <div style="color:#ffffff;font-size:0.95rem;font-weight:600;margin-bottom:12px;">Message</div>
      <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:14px 16px;color:rgba(249,253,254,0.8);font-size:0.85rem;line-height:1.7;white-space:pre-wrap;">${data.message}</div>
      ` : ''}
    </div>

    <div style="text-align:center;">
      <a href="https://yallagrow.net/admin" style="display:inline-block;background:#10a1db;color:#080f1a;padding:12px 24px;border-radius:10px;font-size:0.85rem;font-weight:700;text-decoration:none;">View in Admin →</a>
    </div>

    <div style="text-align:center;margin-top:20px;color:rgba(249,253,254,0.3);font-size:0.7rem;">Submission ID: ${id}</div>
  </div>
</body>
</html>`.trim()
}
