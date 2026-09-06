import { Resend } from "resend";
import { rateLimit } from "./lib/rateLimit.js";
import { escapeHtml, isValidEmail, cleanText } from "./lib/sanitize.js";
import { renderEmail } from "./lib/emailTemplate.js";

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

    const email = cleanText(req.body?.email, 254);

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const safeEmail = escapeHtml(email);

    // Contacts are global in Resend's current API — no audience_id needed
    // (Resend removed that requirement; see resend.com/blog/new-contacts-experience).
    //
    // The Resend Node SDK does NOT throw on API errors — it resolves with
    // { data, error } — so `error` is checked explicitly below. A failure
    // here (e.g. the email is already a contact from a previous signup)
    // still lets the visitor see "you're subscribed" rather than an error,
    // but it's now actually logged instead of silently swallowed.
    const { error: contactError } = await resend.contacts.create({
      email,
      unsubscribed: false,
    });
    if (contactError) {
      console.warn("Resend contact create failed:", contactError.message || contactError);
    }

    // Always try to notify the site owner so signups are visible even before
    // an audience/campaign workflow is fully set up. A notification failure
    // still shouldn't make a successful signup look failed to the visitor,
    // but it's logged so it's visible in Vercel's function logs.
    const { error: notifyError } = await resend.emails.send({
      from: "FINAIW <hello@finaiw.com>",
      to: process.env.CONTACT_INBOX_EMAIL || "finaiw.organisation@gmail.com",
      subject: "📬 New FINAIW Newsletter Signup",
      html: renderEmail({
        eyebrow: "Newsletter",
        heading: "New Subscriber",
        bodyHtml: `
          <p style="margin:0;font-size:15px;font-weight:600;color:#0f172a;">
            ${safeEmail}
          </p>
        `,
        footerNote: "This email was automatically generated from the FINAIW newsletter signup form.",
      }),
    });
    if (notifyError) {
      console.warn("Owner notification email failed:", notifyError.message || notifyError);
    }

    return res.status(200).json({
      success: true,
      message: "🎉 You're subscribed!",
    });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not subscribe right now. Please try again later.",
    });
  }
}
