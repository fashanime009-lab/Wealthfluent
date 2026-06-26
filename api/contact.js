import { Resend } from "resend";

export default async function handler(req, res) {
  try {
    console.log("START");

    console.log("API KEY:", process.env.RESEND_API_KEY ? "FOUND" : "MISSING");

    const resend = new Resend(process.env.RESEND_API_KEY);

    console.log("CLIENT CREATED");

    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "fashanime009@gmail.com",
      subject: "Test Email",
      html: "<h1>Hello from Resend</h1>",
    });

    console.log("RESULT:", result);

    return res.status(200).json(result);

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: String(err),
    });
  }
}