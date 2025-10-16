import nodemailer from "nodemailer";

// This file becomes a Vercel serverless function.
// It will be available at https://yourdomain.vercel.app/api/send

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, phone, message } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  try {
    // Configure the transporter (using environment variables set in Vercel)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nMessage:\n${message}`,
    });

    return res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
