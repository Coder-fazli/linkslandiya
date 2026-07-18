// Simple branded HTML shell for all outgoing emails. Email clients need
// inline styles — no external stylesheets. Custom @font-face fonts are
// stripped by every major client (Gmail, Outlook, Apple Mail all ignore
// embedded fonts for security/reliability reasons — this is universal,
// not something we can work around), so we use a web-safe stack that
// renders as true Helvetica on Mac/iOS Mail and Arial (metric-identical)
// everywhere else, including Gmail on Windows/Android.
const EMAIL_FONT_STACK = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const DEFAULT_BRAND_COLOR = "#00b4d8"

export function wrapEmailHtml(bodyHtml: string, logoUrl?: string, cta?: { text: string; url: string; color?: string }): string {
    const brandColor = cta?.color || DEFAULT_BRAND_COLOR

    // White header (not a cyan block) — the logo mascot is itself cyan/teal,
    // so a colored background always fights it for contrast regardless of size
    const headerContent = logoUrl
        ? `<img src="${logoUrl}" alt="Linkslandia" height="56" style="display:block;height:56px;width:auto;margin:0 auto;" />`
        : `<span style="color:#1a365d;font-size:24px;font-weight:700;font-family:${EMAIL_FONT_STACK};">Linkslandia</span>`

    const ctaHtml = cta?.text && cta?.url
        ? `<p style="text-align:center;margin:28px 0 4px;">
             <a href="${cta.url}" style="display:inline-block;padding:12px 28px;background:${brandColor};color:#ffffff;text-decoration:none;border-radius:9999px;font-weight:700;font-size:13px;letter-spacing:0.02em;">${cta.text}</a>
           </p>`
        : ""

    return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0f9fb;font-family:${EMAIL_FONT_STACK};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9fb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,180,216,0.08);">
          <tr>
            <td align="center" style="background:#ffffff;border-bottom:1px solid #eef2f7;padding:28px 32px;">
              ${headerContent}
            </td>
          </tr>
          <tr>
            <td style="padding:32px;color:#1a365d;font-size:15px;line-height:1.6;font-family:${EMAIL_FONT_STACK};">
              ${bodyHtml}
              ${ctaHtml}
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
