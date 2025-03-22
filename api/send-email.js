const nodemailer = require("nodemailer");

// CORS Middleware (Fixes Network Error)
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any frontend
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Handle preflight request
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, phone, message } = req.body;

  // Check if email credentials exist
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Missing email credentials in environment variables.");
    return res.status(500).json({ message: "Server configuration error." });
  }

  try {
    // Create a transporter object for sending emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,  // Use your own email to prevent rejection
      to: "dourodummerrenovations@gmail.com",  // Business email
      subject: `New Contact Form Submission from ${name}`,
      text: `You have received a new message from:\n\n
             Name: ${name}\n
             Email: ${email}\n
             Phone: ${phone}\n
             Message: ${message}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    res.status(200).json({ message: "Email sent successfully!" });

  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
}