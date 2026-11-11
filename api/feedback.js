import { getResend } from "./lib/resendClient.js";
import { rateLimit } from "./lib/rateLimit.js";
import { escapeHtml, isValidEmail, cleanText } from "./lib/sanitize.js";
import { renderEmail, dataTable, dataRow, messageBlock, stars } from "./lib/emailTemplate.js";


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
    const emailRaw = cleanText(req.body?.email, 254);
    const message = cleanText(req.body?.message, 2000);
    const rating = ["1", "2", "3", "4", "5"].includes(String(req.body?.rating)) ? req.body.rating : "5";
    const feedbackType = ["suggestion", "bug", "feature", "other"].includes(req.body?.feedbackType)
      ? req.body.feedbackType
      : "other";
    const subscribe = Boolean(req.body?.subscribe);

    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    if (emailRaw && !isValidEmail(emailRaw)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(emailRaw);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
    const typeLabel = { suggestion: "Suggestion", bug: "Bug report", feature: "Feature request", other: "Feedback" }[feedbackType];

    // The Resend Node SDK does NOT throw on API errors — it resolves with
    // { data, error } — so `error` must be checked explicitly, or a failed
    // send would silently look identical to a successful one.
    const { error: sendError } = await getResend().emails.send({
      from: "FINAIW <hello@finaiw.com>",
      to: process.env.CONTACT_INBOX_EMAIL || "finaiw.organisation@gmail.com",
      // Reply goes straight to the person when they left an email.
      ...(emailRaw ? { replyTo: emailRaw } : {}),
      subject: `New feedback (${typeLabel}, ${rating}/5) from ${name.replace(/[\r\n]+/g, " ")}`,
      html: renderEmail({
        preheader: `${typeLabel} feedback rated ${rating}/5.`,
        eyebrow: "Feedback form",
        heading: `${typeLabel} from ${safeName}`,
        intro: emailRaw
          ? "New feedback on finaiw.com. Reply to this email to answer them directly."
          : "New feedback on finaiw.com. They didn't leave an email address.",
        bodyHtml:
          dataTable(
            dataRow("Rating", stars(rating)) +
              dataRow("Type", typeLabel) +
              dataRow("Name", safeName) +
              dataRow("Email", safeEmail ? `<a href="mailto:${safeEmail}" style="color:#047857;">${safeEmail}</a>` : "Not provided") +
              dataRow("Newsletter", subscribe ? "Wants to subscribe" : "No")
          ) + messageBlock("Message", safeMessage),
        footerNote: "Sent automatically by the feedback form on finaiw.com.",
      }),
      text: `${typeLabel} from ${name} (${rating}/5)\nEmail: ${emailRaw || "not provided"}\nNewsletter: ${subscribe ? "yes" : "no"}\n\n${message}`,
    });

    if (sendError) {
      console.error("Resend feedback-notification error:", sendError);
      return res.status(502).json({
        success: false,
        message: "Unable to send your feedback right now. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "🎉 Thank you! Your feedback has been received.",
    });
  } catch (error) {
    console.error("Feedback form error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to send your message right now. Please try again later.",
    });
  }
}
