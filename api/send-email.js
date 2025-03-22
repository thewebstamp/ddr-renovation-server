const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  // ✅ Fix CORS issue by setting correct headers
  res.setHeader("Access-Control-Allow-Origin", "https://ddr-renovations.netlify.app"); // Only allow your frontend
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight request properly
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, phone, message } = req.body;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ Missing email credentials in environment variables.");
    return res.status(500).json({ message: "Server configuration error: Missing email credentials." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS,  
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: "dourodummerrenovations@gmail.com",
      subject: `New Contact Form Submission from ${name}`,
      text: `You have received a new message:\n\n
             Name: ${name}\n
             Email: ${email}\n
             Phone: ${phone}\n
             Message: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    res.status(200).json({ message: "Email sent successfully!" });

  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
}