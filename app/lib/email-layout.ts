// Simple branded HTML shell for all outgoing emails. Email clients need
// inline styles — no external stylesheets, and custom @font-face fonts are
// stripped by most clients (Gmail, Outlook), so we use a web-safe stack that
// renders as true Helvetica on Mac/iOS Mail and a close system match elsewhere.
const EMAIL_FONT_STACK = "'Helvetica Neue', Helvetica, Arial, sans-serif"

export function wrapEmailHtml(bodyHtml: string, logoUrl?: string): string {
    const headerContent = logoUrl
        ? `<img src="${logoUrl}" alt="Linkslandia" height="32" style="display:block;height:32px;width:auto;" />`
        : `<span style="color:#ffffff;font-size:20px;font-weight:700;font-family:${EMAIL_FONT_STACK};">Linkslandia</span>`

    return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0f9fb;font-family:${EMAIL_FONT_STACK};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9fb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,180,216,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#00b4d8,#0096b7);padding:24px 32px;">
              ${headerContent}
            </td>
          </tr>
          <tr>
            <td style="padding:32px;color:#1a365d;font-size:15px;line-height:1.6;font-family:${EMAIL_FONT_STACK};">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background:#f8fafc;color:#94a3b8;font-size:12px;text-align:center;font-family:${EMAIL_FONT_STACK};">
              &copy; ${new Date().getFullYear()} Linkslandia. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim()
}
