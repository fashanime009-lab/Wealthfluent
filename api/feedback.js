import { Resend } from "resend";
import { rateLimit } from "./lib/rateLimit.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
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
    message:
      "Too many requests. Please wait one minute before trying again.",
  });
}
  try {
    
    const {
  name,
  email,
  rating,
  feedbackType,
  message,
  subscribe,
} = req.body;

    // Basic validation
    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

   // Email to you
await resend.emails.send({
  from: "FINAIW <onboarding@resend.dev>",
  to: "fashanime009@gmail.com",

  subject: `⭐ New FINAIW Feedback (${feedbackType})`,

  html: `
    <div style="max-width:650px;margin:auto;font-family:Arial,sans-serif;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">

      <div style="background:#2563eb;padding:24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:28px;">
          FINAIW
        </h1>

        <p style="color:#dbeafe;margin-top:8px;">
          New Contact Form Submission
        </p>
      </div>

      <div style="padding:30px;">

        <table style="width:100%;border-collapse:collapse;">

<tr>
<td style="padding:12px;font-weight:bold;background:#f8fafc;">
Name
</td>

<td style="padding:12px;">
${name}
</td>
</tr>

<tr>
<td style="padding:12px;font-weight:bold;background:#f8fafc;">
Email
</td>

<td style="padding:12px;">
${email || "Not provided"}
</td>
</tr>

<tr>
<td style="padding:12px;font-weight:bold;background:#f8fafc;">
Rating
</td>

<td style="padding:12px;">
${rating} ⭐
</td>
</tr>

<tr>
<td style="padding:12px;font-weight:bold;background:#f8fafc;">
Feedback Type
</td>

<td style="padding:12px;">
${feedbackType}
</td>
</tr>

<tr>
<td style="padding:12px;font-weight:bold;background:#f8fafc;">
Newsletter
</td>

<td style="padding:12px;">
${subscribe ? "Yes" : "No"}
</td>
</tr>

</table>

        <div style="margin-top:30px;">

          <h3 style="margin-bottom:10px;">Message</h3>

          <div style="background:#f8fafc;padding:20px;border-radius:10px;line-height:1.7;">
            ${message.replace(/\n/g, "<br>")}
          </div>

        </div>

      </div>

      <div style="padding:20px;text-align:center;background:#f8fafc;color:#64748b;font-size:13px;">
        This email was automatically generated from the FINAIW Contact Form.
      </div>

    </div>
  `,
});


// Auto reply to the user


return res.status(200).json({
  success: true,
  message: "🎉 Thank you! Your feedback has been received.",
});

    

  } catch (error) {
    console.error("Resend Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send your message right now. Please try again later.",
    });
  }
}