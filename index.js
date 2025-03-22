// Import required modules
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

// Initialize the Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://ddr-renovations.netlify.app/", // Replace with your actual Netlify URL
  methods: "POST",
  allowedHeaders: "Content-Type",
}));
app.use(express.json()); // Automatically parse JSON request bodies

// API endpoint to handle contact form submissions
app.post('/send-email', async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Transporter object using the default SMTP transport (Gmail in this case)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thewebstamp@gmail.com', // Your Gmail email
      pass: 'vpvllkpfnxyfkspr',    // Your app password
    },
  });

  // Email options
  const mailOptions = {
    from: email, // Sender's email address (from the contact form)
    to: 'dourodummerrenovation@gmail.com', // Recipient email address (business email)
    subject: `New Contact Form Submission: ${name}`,
    text: `
      You have received a new message from ${name} (${email}, ${phone}):
      \n\n${message}
    `,
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email: ', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});