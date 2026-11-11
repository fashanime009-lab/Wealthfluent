// One HTML email shell for every automated email (contact notification,
// contact auto-reply, feedback notification, newsletter notification), in
// the site's own design language: off-white ground, near-black header
// panel with the FIN/AIW wordmark, emerald accents, left-aligned text and
// hairline rules rather than boxed grey tables.
//
// Email clients are far stricter than browsers, so: table-based layout
// (Outlook ignores most div sizing), every style inline (Gmail strips
// <style> in many views), a 600px column that shrinks on phones, and web
// fonts only as a progressive enhancement (Apple Mail loads Archivo;
// Gmail and Outlook fall back to Helvetica/Arial).

const SITE_URL = "https://www.finaiw.com";

const C = {
  ground: "#eef1ec",
  card: "#ffffff",
  ink: "#111814",
  body: "#3a4540",
  muted: "#66736c",
  hairline: "#dfe5df",
  panel: "#0e1512",
  panelMuted: "#9aa8a0",
  accent: "#34d399",
  green: "#047857",
  quote: "#f5f7f3",
};

const FONT = "'Archivo', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "'IBM Plex Mono', 'SFMono-Regular', Menlo, Consolas, monospace";
// Archivo is the site's headline face only; running text uses the system
// sans, as on the site (Archivo here is loaded in bold weights only).
const TEXT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// UTM tags so visits from these emails show up as their own source in
// Google Analytics instead of being lumped into direct traffic.
export function siteLink(path, campaign) {
  return `${SITE_URL}${path}?utm_source=email&utm_medium=transactional&utm_campaign=${campaign}`;
}

export function renderEmail({ preheader = "", eyebrow, heading, intro, bodyHtml, footerNote }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;900&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
<title>FINAIW</title>
</head>
<body style="margin:0;padding:0;background-color:${C.ground};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.ground};font-size:1px;line-height:1px;">${preheader}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.ground};">
  <tr>
    <td align="center" style="padding:32px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:${C.card};border:1px solid ${C.hairline};border-radius:8px;">

        <!-- Header: the site's dark panel and wordmark -->
        <tr>
          <td style="background-color:${C.panel};border-radius:7px 7px 0 0;padding:26px 32px;">
            <a href="${SITE_URL}" style="text-decoration:none;">
              <span style="font-family:${FONT};font-size:24px;font-weight:900;letter-spacing:-1px;color:#ffffff;">FIN</span><span style="font-family:${FONT};font-size:24px;font-weight:900;letter-spacing:-1px;color:${C.accent};">AIW</span>
            </a>
            <div style="font-family:${FONT};font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${C.panelMuted};padding-top:4px;">
              Financial Intelligence, AI for Wealth
            </div>
          </td>
        </tr>

        <!-- Title -->
        <tr>
          <td style="padding:32px 32px 0;">
            ${eyebrow ? `<div style="font-family:${MONO};font-size:11px;font-weight:500;letter-spacing:1.4px;text-transform:uppercase;color:${C.green};">${eyebrow}</div>` : ""}
            ${heading ? `<h1 style="margin:10px 0 0;font-family:${FONT};font-size:26px;line-height:1.2;font-weight:900;letter-spacing:-0.5px;color:${C.ink};">${heading}</h1>` : ""}
            ${intro ? `<p style="margin:12px 0 0;font-family:${TEXT};font-size:15px;line-height:1.65;color:${C.body};">${intro}</p>` : ""}
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:8px 32px 32px;font-family:${TEXT};font-size:15px;line-height:1.65;color:${C.body};">
            ${bodyHtml}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="border-top:1px solid ${C.hairline};padding:20px 32px 24px;font-family:${TEXT};font-size:12px;line-height:1.6;color:${C.muted};">
            ${footerNote || "This is an automated email from FINAIW."}<br>
            <a href="${SITE_URL}" style="color:${C.muted};text-decoration:underline;">finaiw.com</a> &nbsp;·&nbsp; Mumbai, India
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

// A label/value row for the details list in notification emails (Name,
// Email, Rating...), separated by hairlines like the site's tables.
export function dataRow(label, value) {
  return `
    <tr>
      <td valign="top" style="padding:12px 16px 12px 0;border-bottom:1px solid ${C.hairline};font-family:${MONO};font-size:11px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:${C.muted};white-space:nowrap;width:120px;">${label}</td>
      <td valign="top" style="padding:12px 0;border-bottom:1px solid ${C.hairline};font-family:${TEXT};font-size:15px;color:${C.ink};word-break:break-word;">${value}</td>
    </tr>`;
}

export function dataTable(rowsHtml) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;border-top:1px solid ${C.hairline};">${rowsHtml}</table>`;
}

// The visitor's message, set off as a quote with the site's emerald edge.
export function messageBlock(label, safeMessageHtml) {
  return `
    <div style="margin-top:24px;font-family:${MONO};font-size:11px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:${C.muted};">${label}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">
      <tr>
        <td style="background-color:${C.quote};border-left:3px solid ${C.green};padding:14px 18px;font-family:${TEXT};font-size:15px;line-height:1.7;color:${C.ink};">${safeMessageHtml}</td>
      </tr>
    </table>`;
}

// A solid emerald button, bulletproof-table style so Outlook renders it.
export function button(href, label) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
      <tr>
        <td style="background-color:${C.green};border-radius:6px;">
          <a href="${href}" style="display:inline-block;padding:12px 22px;font-family:${FONT};font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">${label}</a>
        </td>
      </tr>
    </table>`;
}

// A short list of links back into the site, for the visitor-facing email.
export function linkList(title, links) {
  return `
    <div style="margin-top:28px;padding-top:20px;border-top:1px solid ${C.hairline};font-family:${MONO};font-size:11px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:${C.muted};">${title}</div>
    ${links
      .map(
        ({ href, label, note }) => `
    <p style="margin:12px 0 0;font-family:${TEXT};font-size:15px;line-height:1.5;">
      <a href="${href}" style="color:${C.green};font-weight:700;text-decoration:none;">${label} &rarr;</a><br>
      <span style="color:${C.muted};font-size:13px;">${note}</span>
    </p>`
      )
      .join("")}`;
}

// "★★★★☆ 4/5" for the feedback rating.
export function stars(rating) {
  const n = Math.max(1, Math.min(5, Number(rating) || 5));
  return `<span style="color:${C.green};letter-spacing:2px;">${"★".repeat(n)}</span><span style="color:${C.hairline};letter-spacing:2px;">${"★".repeat(5 - n)}</span> <span style="font-family:${MONO};font-size:13px;color:${C.muted};">${n}/5</span>`;
}

export const emailColors = C;
