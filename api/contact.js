import { getResend } from "./lib/resendClient.js";
import { rateLimit } from "./lib/rateLimit.js";
import { escapeHtml, isValidEmail, cleanText } from "./lib/sanitize.js";
import { renderEmail, dataTable, dataRow, messageBlock, button, linkList, siteLink } from "./lib/emailTemplate.js";


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
    // Subjects are plain text, not HTML, so they use the cleaned name
    // rather than the HTML-escaped one (which would show "&amp;").
    const subjectName = name.replace(/[\r\n]+/g, " ");

    // Email to the site owner. The Resend Node SDK does NOT throw on API
    // errors — it resolves with { data, error } — so `error` must be
    // checked explicitly, or a failed send would silently look identical
    // to a successful one.
    const { error: ownerError } = await getResend().emails.send({
      from: "FINAIW <hello@finaiw.com>",
      to: process.env.CONTACT_INBOX_EMAIL || "finaiw.organisation@gmail.com",
      // Hitting Reply answers the visitor, not hello@finaiw.com.
      replyTo: email,
      subject: `New message from ${subjectName} via finaiw.com`,
      html: renderEmail({
        preheader: `${subjectName} wrote to FINAIW through the contact form.`,
        eyebrow: "Contact form",
        heading: `New message from ${safeName}`,
        intro: "Someone just wrote to FINAIW through the contact form. Reply to this email to answer them directly.",
        bodyHtml:
          dataTable(
            dataRow("Name", safeName) +
              dataRow("Email", `<a href="mailto:${safeEmail}" style="color:#047857;">${safeEmail}</a>`)
          ) +
          messageBlock("Message", safeMessage) +
          button(`mailto:${safeEmail}`, `Reply to ${safeName}`),
        footerNote: "Sent automatically by the contact form on finaiw.com.",
      }),
      text: `New message from ${subjectName} via finaiw.com\n\nName: ${name}\nEmail: ${email}\n\n${message}\n\nReply to this email to answer them directly.`,
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
    const { error: replyError } = await getResend().emails.send({
      from: "FINAIW <hello@finaiw.com>",
      to: email,
      subject: "We got your message, thanks for writing to FINAIW",
      html: renderEmail({
        preheader: "We've received your message and usually reply within 24–48 hours.",
        eyebrow: "Message received",
        heading: `Thanks, ${safeName}. We've got your message.`,
        intro: "A real person on the FINAIW team will read it and reply to this email address, usually within <strong>24–48 hours</strong>.",
        bodyHtml: `
          ${messageBlock("What you sent us", safeMessage)}
          <p style="margin:24px 0 0;">
            Talk soon,<br>
            <strong style="color:#111814;">The FINAIW team</strong>
          </p>
          ${linkList("While you wait", [
            { href: siteLink("/calculators", "contact_autoreply"), label: "30 free financial calculators", note: "SIP, EMI, FD, PPF, retirement and FIRE, in any currency." },
            { href: siteLink("/verdict", "contact_autoreply"), label: "Get a verdict on a money decision", note: "Rent vs buy, debt vs invest, term vs endowment and more." },
            { href: siteLink("/blog", "contact_autoreply"), label: "Read the FINAIW blog", note: "Number-first guides on investing, saving and planning." },
          ])}
        `,
        footerNote: "You're getting this because you contacted us on finaiw.com. We don't add you to any mailing list.",
      }),
      text: `Thanks, ${name}. We've got your message.\n\nA real person on the FINAIW team will read it and reply to this email address, usually within 24-48 hours.\n\nWhat you sent us:\n${message}\n\nTalk soon,\nThe FINAIW team\nhttps://www.finaiw.com\n\nYou're getting this because you contacted us on finaiw.com. We don't add you to any mailing list.`,
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
