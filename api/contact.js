import { Resend } from "resend";
import { rateLimit } from "./lib/rateLimit.js";
import { escapeHtml, isValidEmail, cleanText } from "./lib/sanitize.js";
import { renderEmail, dataTable, dataRow, messageBlock } from "./lib/emailTemplate.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Everything is inside this outer try/catch, including request parsing
  // and the rate limiter — so no matter what throws, the response is
  // always valid JSON, never a raw platform crash page.
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Method Not Allowed",
      });
    }

    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "unknown";

    if (!rateLimit(ip, 5, 60000)) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please wait one minute before trying again.",
      });
    }

    const name = cleanText(req.body?.name, 100);
    const email = cleanText(req.body?.email, 254);
    const message = cleanText(req.body?.message, 2000);

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    // Email to the site owner. The Resend Node SDK does NOT throw on API
    // errors — it resolves with { data, error } — so `error` must be
    // checked explicitly, or a failed send would silently look identical
    // to a successful one.
    const { error: ownerError } = await resend.emails.send({
      from: "FINAIW <hello@finaiw.com>",
      to: process.env.CONTACT_INBOX_EMAIL || "finaiw.organisation@gmail.com",
      subject: `📩 New Contact Form Submission from ${safeName}`,
      html: renderEmail({
        eyebrow: "Contact Form",
        heading: "New Submission",
        bodyHtml:
          dataTable(dataRow("Name", safeName) + dataRow("Email", safeEmail)) +
          messageBlock("Message", safeMessage),
        footerNote: "This email was automatically generated from the FINAIW Contact Form.",
      }),
    });

    if (ownerError) {
      console.error("Resend owner-notification error:", ownerError);
      return res.status(502).json({
        success: false,
        message: "Unable to send your message right now. Please try again later.",
      });
    }

    // Auto-reply to the visitor. Now that finaiw.com is a verified Resend
    // domain, sending to any real recipient (not just the account owner)
    // works — this failure is isolated from the owner-notification result
    // above so a hiccup here doesn't make an already-delivered message look
    // failed to the visitor.
    const { error: replyError } = await resend.emails.send({
      from: "FINAIW <hello@finaiw.com>",
      to: email,
      subject: "✅ We received your message",
      html: renderEmail({
        eyebrow: "Thank you",
        heading: `Hello ${safeName} 👋`,
        bodyHtml: `
          <p style="margin:0 0 12px;font-size:14px;line-height:1.7;color:#334155;">
            Thank you for contacting <strong>FINAIW</strong>. We've successfully received
            your message and will review it as soon as possible.
          </p>
          ${messageBlock("Your message", safeMessage)}
          <p style="margin:20px 0 0;font-size:14px;line-height:1.7;color:#334155;">
            We usually respond within <strong>24–48 hours</strong>. Thank you for your patience.
          </p>
          <p style="margin:20px 0 0;font-size:14px;line-height:1.7;color:#0f172a;">
            <strong>FINAIW Team</strong><br>
            <span style="color:#64748b;">Personal Finance Tools &amp; Calculators</span>
          </p>
        `,
      }),
    });

    if (replyError) {
      console.warn("Auto-reply email failed:", replyError.message || replyError);
    }

    return res.status(200).json({
      success: true,
      message: "🎉 Your message has been sent successfully! We'll get back to you soon.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to send your message right now. Please try again later.",
    });
  }
}
