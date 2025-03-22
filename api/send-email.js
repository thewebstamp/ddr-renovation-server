// // Import required modules
// const express = require('express');
// const nodemailer = require('nodemailer');
// const cors = require('cors');

// // Initialize the Express app
// const app = express();
// const port = process.env.PORT || 5000;

// // Middleware
// app.use(cors()); // Allow cross-origin requests (from React frontend)
// app.use(express.json()); // Automatically parse JSON request bodies

// // API endpoint to handle contact form submissions
// app.post('/send-email', async (req, res) => {
//   const { name, email, phone, message } = req.body;

//   // Transporter object using the default SMTP transport (Gmail in this case)
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'thewebstamp@gmail.com', // Gmail email
//       pass: 'vpvllkpfnxyfkspr',    // App password
//     },
//   });

//   // Email options
//   const mailOptions = {
//     from: email, // Sender's email address (from the contact form)
//     to: 'dourodummerrenovation@gmail.com', // Recipient email address (business email)
//     subject: `New Contact Form Submission: ${name}`,
//     text: `
//       You have received a new message from ${name} (${email}, ${phone}):
//       \n\n${message}
//     `,
//   };

//   // Send the email
//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent: ' + info.response);
//     res.status(200).json({ message: 'Email sent successfully!' });
//   } catch (error) {
//     console.error('Error sending email: ', error);
//     res.status(500).json({ message: 'Failed to send email', error: error.message });
//   }
// });

// // Start the Express server
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });


const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, phone, message } = req.body;

  // Create a transporter object for sending emails
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,  // Securely use environment variables
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

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email: ", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
}