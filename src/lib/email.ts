// Email sending via Resend. Server-only.
// Set RESEND_API_KEY in Vercel env vars. If unset, we log to console
// in dev so the flow still works locally without a real send.

import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = process.env.EMAIL_FROM || 'YallaGrow <info@yallagrow.net>'

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

interface SendResult {
  ok: boolean
  error?: string
}

export async function sendOtpEmail(to: string, code: string): Promise<SendResult> {
  const subject = `${code} — your YallaGrow login code`
  const html = otpEmailHtml(code)
  const text = otpEmailText(code)

  // Dev fallback: log the code so the local flow works without API key
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — would have sent OTP ${code} to ${to}`)
    return { ok: true }
  }

  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html, text })
    if (error) {
      console.error('[email] Resend returned error:', error)
      return { ok: false, error: error.message || 'Email send failed' }
    }
    return { ok: true }
  } catch (err) {
    console.error('[email] Resend threw:', err)
    return { ok: false, error: (err as Error).message || 'Email send failed' }
  }
}

function otpEmailText(code: string): string {
  return [
    `Your YallaGrow login code:`,
    ``,
    `   ${code}`,
    ``,
    `Enter this in the dashboard to sign in.`,
    `This code expires in 10 minutes and can only be used once.`,
    ``,
    `If you didn't request this, you can ignore this email.`,
    ``,
    `— YallaGrow`,
  ].join('\n')
}

function otpEmailHtml(code: string): string {
  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.06);">
          <tr>
            <td style="padding:28px 32px 20px 32px;border-bottom:1px solid #eef1f4;">
              <div style="font-family:'Syne','Helvetica Neue',Arial,sans-serif;font-weight:800;font-size:20px;color:#0b1220;letter-spacing:-0.5px;">
                Yalla<span style="color:#10a1db;font-style:normal;">Grow</span>
              </div>
              <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#10a1db;margin-top:14px;">
                Affiliate login code
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 20px 0;font-size:15px;line-height:1.5;color:#334155;">
                Enter this code in the login screen to sign in to your affiliate dashboard:
              </p>
              <div style="text-align:center;padding:20px 0;">
                <div style="display:inline-block;padding:16px 28px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;font-family:'SF Mono','Menlo',monospace;font-weight:700;font-size:38px;letter-spacing:12px;color:#0b1220;">
                  ${code}
                </div>
              </div>
              <p style="margin:20px 0 0 0;font-size:13px;line-height:1.5;color:#64748b;">
                This code expires in <strong>10 minutes</strong> and can only be used once.<br>
                If you didn't request this login, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 24px 32px;border-top:1px solid #eef1f4;">
              <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.5;">
                YallaGrow · Lebanon · <a href="https://yallagrow.net" style="color:#10a1db;text-decoration:none;">yallagrow.net</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
