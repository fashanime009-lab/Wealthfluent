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

    await resend.emails.send({
      from: "FINAIW <onboarding@resend.dev>", // Change after adding your own domain
      to: "fashanime009@gmail.com",

      subject: `📩 New Contact Form Submission from ${name}`,

      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #ddd;border-radius:10px">

          <h2 style="color:#2563eb;margin-bottom:20px;">
            New Contact Form Submission
          </h2>

          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;"><strong>Name</strong></td>
              <td>${name}</td>
            </tr>

            <tr>
              <td style="padding:8px 0;"><strong>Email</strong></td>
              <td>${email}</td>
            </tr>
          </table>

          <hr style="margin:20px 0;">

          <h3>Message</h3>

          <p style="white-space:pre-line;">
            ${message}
          </p>

        </div>
      `,
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