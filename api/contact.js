import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

   // Email to you
await resend.emails.send({
  from: "FINAIW <onboarding@resend.dev>",
  to: "fashanime009@gmail.com",

  subject: `📩 New Contact Form Submission from ${name}`,

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
            <td style="padding:12px;font-weight:bold;width:140px;background:#f8fafc;">Name</td>
            <td style="padding:12px;">${name}</td>
          </tr>

          <tr>
            <td style="padding:12px;font-weight:bold;background:#f8fafc;">Email</td>
            <td style="padding:12px;">${email}</td>
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
await resend.emails.send({
  from: "FINAIW <onboarding@resend.dev>",
  to: email,

  subject: "✅ We received your message",

  html: `
    <div style="max-width:650px;margin:auto;font-family:Arial,sans-serif;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">

      <div style="background:#2563eb;padding:24px;text-align:center;">
        <h1 style="color:white;margin:0;">
          FINAIW
        </h1>
      </div>

      <div style="padding:30px;">

        <h2>Hello ${name}, 👋</h2>

        <p>
          Thank you for contacting <strong>FINAIW</strong>.
        </p>

        <p>
          We have successfully received your message and will review it as soon as possible.
        </p>

        <div style="margin:25px 0;padding:18px;background:#f8fafc;border-left:4px solid #2563eb;border-radius:8px;">
          ${message.replace(/\n/g, "<br>")}
        </div>

        <p>
          We usually respond within <strong>24–48 hours</strong>.
        </p>

        <p>
          Thank you for your patience.
        </p>

        <br>

        <strong>FINAIW Team</strong><br>
        AI-Powered Financial Intelligence

      </div>

    </div>
  `,
});

return res.status(200).json({
  success: true,
  message: "🎉 Your message has been sent successfully! We'll get back to you soon.",
});

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });

  } catch (error) {
    console.error("Resend Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send your message right now. Please try again later.",
    });
  }
}