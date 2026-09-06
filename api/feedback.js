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
    const safeFeedbackType = escapeHtml(feedbackType);

    // The Resend Node SDK does NOT throw on API errors — it resolves with
    // { data, error } — so `error` must be checked explicitly, or a failed
    // send would silently look identical to a successful one.
    const { error: sendError } = await resend.emails.send({
      from: "FINAIW <hello@finaiw.com>",
      to: process.env.CONTACT_INBOX_EMAIL || "finaiw.organisation@gmail.com",
      subject: `⭐ New FINAIW Feedback (${safeFeedbackType})`,
      html: renderEmail({
        eyebrow: "Feedback Form",
        heading: "New Submission",
        bodyHtml:
          dataTable(
            dataRow("Name", safeName) +
              dataRow("Email", safeEmail || "Not provided") +
              dataRow("Rating", `${escapeHtml(rating)} ⭐`) +
              dataRow("Feedback Type", safeFeedbackType) +
              dataRow("Newsletter", subscribe ? "Yes" : "No")
          ) + messageBlock("Message", safeMessage),
        footerNote: "This email was automatically generated from the FINAIW Feedback Form.",
      }),
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
