// A single, reusable HTML email shell so every automated email (contact
// notification, contact auto-reply, feedback notification, newsletter
// notification) looks consistent and actually matches the site's real
// brand colors (emerald green) instead of each template inventing its own
// look — previously two of these used blue (#2563eb), which doesn't match
// FINAIW's brand anywhere else on the site.
//
// Email clients strip <style> blocks unpredictably, so everything here is
// deliberately inline, table-free-where-possible, and uses only widely
// supported CSS.

const BRAND_GREEN_DARK = "#065f46";
const BRAND_GREEN = "#047857";
const BRAND_GREEN_LIGHT = "#d1fae5";

export function renderEmail({ eyebrow, heading, bodyHtml, footerNote }) {
  return `
    <div style="background-color:#f3f7f5;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e5e7eb;">

        <!-- Header -->
        <div style="background:linear-gradient(135deg, ${BRAND_GREEN} 0%, ${BRAND_GREEN_DARK} 100%);padding:32px 32px 26px;text-align:center;">
          <div style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:0.02em;">FINAIW</div>
          <div style="color:${BRAND_GREEN_LIGHT};font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;margin-top:6px;">
            Financial Intelligence, AI for Wealth
          </div>
          ${eyebrow ? `
          <div style="display:inline-block;margin-top:18px;padding:6px 14px;background:rgba(255,255,255,0.14);border-radius:999px;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">
            ${eyebrow}
          </div>` : ""}
          ${heading ? `
          <div style="color:#ffffff;font-size:20px;font-weight:800;margin-top:14px;">
            ${heading}
          </div>` : ""}
        </div>

        <!-- Body -->
        <div style="padding:32px;">
          ${bodyHtml}
        </div>

        <!-- Footer -->
        <div style="padding:18px 32px;background:#f8fafc;border-top:1px solid #f1f5f9;text-align:center;">
          <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
            ${footerNote || "This is an automated email from FINAIW."}
          </p>
        </div>
      </div>
    </div>
  `;
}

// A single labeled row for the "form data" style tables used in
// notification emails (Name, Email, Rating, etc).
export function dataRow(label, value) {
  return `
    <tr>
      <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#475569;background:#f8fafc;border-bottom:1px solid #f1f5f9;white-space:nowrap;">
        ${label}
      </td>
      <td style="padding:12px 16px;font-size:14px;color:#0f172a;background:#ffffff;border-bottom:1px solid #f1f5f9;word-break:break-word;">
        ${value}
      </td>
    </tr>
  `;
}

export function dataTable(rowsHtml) {
  return `
    <table style="width:100%;border-collapse:collapse;border-radius:12px;overflow:hidden;border:1px solid #f1f5f9;">
      ${rowsHtml}
    </table>
  `;
}

export function messageBlock(label, safeMessageHtml) {
  return `
    <div style="margin-top:24px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#475569;">${label}</p>
      <div style="background:#f8fafc;border:1px solid #f1f5f9;border-radius:12px;padding:16px 18px;font-size:14px;line-height:1.7;color:#334155;">
        ${safeMessageHtml}
      </div>
    </div>
  `;
}
