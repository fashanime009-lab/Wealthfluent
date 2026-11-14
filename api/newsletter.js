import { getResend } from "./lib/resendClient.js";
import { rateLimit } from "./lib/rateLimit.js";
import { escapeHtml, isValidEmail, cleanText } from "./lib/sanitize.js";
import { renderEmail, dataTable, dataRow, linkList, siteLink } from "./lib/emailTemplate.js";

const INBOX = process.env.CONTACT_INBOX_EMAIL || "finaiw.organisation@gmail.com";
// The address subscribers see and reply to (forwarded to INBOX by Cloudflare
// Email Routing).
const PUBLIC_EMAIL = "hello@finaiw.com";


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
    const { error: contactError } = await getResend().contacts.create({
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
    const { error: notifyError } = await getResend().emails.send({
      from: "FINAIW <hello@finaiw.com>",
      to: INBOX,
      subject: `New newsletter subscriber: ${email}`,
      html: renderEmail({
        preheader: `${email} just subscribed to the FINAIW newsletter.`,
        eyebrow: "Newsletter",
        heading: "New subscriber",
        intro: "Someone just joined the FINAIW newsletter from the signup form on finaiw.com. They've been added to your Resend contacts.",
        bodyHtml: dataTable(dataRow("Email", `<a href="mailto:${safeEmail}" style="color:#047857;">${safeEmail}</a>`)),
        footerNote: "Sent automatically by the newsletter signup form on finaiw.com.",
      }),
      text: `New newsletter subscriber: ${email}\n\nThey've been added to your Resend contacts.`,
    });
    if (notifyError) {
      console.warn("Owner notification email failed:", notifyError.message || notifyError);
    }

    // Welcome email, only when the contact was newly created: if creating it
    // failed (usually because they're already subscribed), someone signing up
    // twice doesn't get welcomed twice. Like the notification above, a
    // failure here never turns a successful signup into an error.
    if (!contactError) {
      const { error: welcomeError } = await getResend().emails.send({
        from: "FINAIW <hello@finaiw.com>",
        to: email,
        // Replies (including "unsubscribe") reach the team inbox via
        // hello@finaiw.com's forwarding.
        replyTo: PUBLIC_EMAIL,
        headers: { "List-Unsubscribe": `<mailto:${PUBLIC_EMAIL}?subject=Unsubscribe%20${encodeURIComponent(email)}>` },
        subject: "You're in: sharper money decisions from FINAIW",
        html: renderEmail({
          preheader: "Welcome to the FINAIW newsletter. Here's where to start.",
          eyebrow: "Welcome",
          heading: "You're in. Welcome to FINAIW.",
          intro: "We'll email you when we publish something worth your time: new guides, articles and calculators. No spam, and you can leave any time.",
          bodyHtml: `
            <p style="margin:0;">While you wait for your first one, here are the places most readers start:</p>
            ${linkList("Start here", [
              { href: siteLink("/sip-calculator", "newsletter_welcome"), label: "SIP Calculator", note: "Our most-used tool: what a monthly investment grows to." },
              { href: siteLink("/net-worth-percentile", "newsletter_welcome"), label: "Global net worth percentile", note: "See where your net worth ranks against the world's adults." },
              { href: siteLink("/verdict", "newsletter_welcome"), label: "Get a verdict on a money decision", note: "Rent vs buy, debt vs invest, term vs endowment and more." },
              { href: siteLink("/blog", "newsletter_welcome"), label: "Read the FINAIW blog", note: "Number-first guides on investing, saving and planning." },
            ])}
            <p style="margin:28px 0 0;">
              Have a question or an idea for a calculator? Just reply to this email.<br><br>
              Thanks for joining,<br>
              <strong style="color:#111814;">The FINAIW team</strong>
            </p>
          `,
          footerNote: 'You\'re getting this because you subscribed on finaiw.com. To unsubscribe, reply to this email with "unsubscribe".',
        }),
        text: `You're in. Welcome to FINAIW.\n\nWe'll email you when we publish something worth your time: new guides, articles and calculators. No spam, and you can leave any time.\n\nStart here:\n- SIP Calculator: https://www.finaiw.com/sip-calculator\n- Global net worth percentile: https://www.finaiw.com/net-worth-percentile\n- Get a verdict on a money decision: https://www.finaiw.com/verdict\n- FINAIW blog: https://www.finaiw.com/blog\n\nHave a question or an idea for a calculator? Just reply to this email.\n\nThanks for joining,\nThe FINAIW team\n\nYou're getting this because you subscribed on finaiw.com. To unsubscribe, reply with "unsubscribe".`,
      });
      if (welcomeError) {
        console.warn("Welcome email failed:", welcomeError.message || welcomeError);
      }
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
