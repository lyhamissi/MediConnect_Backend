// services/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',  // or use a different email service
  auth: {
    user: process.env.EMAIL_USER,  // Email from the .env file
    pass: process.env.APP_PASSWORD   // Password from the .env file
  }
});

// Send email function
export const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Use the user email from the .env file
    to,
    subject,
    text
  };

  return transporter.sendMail(mailOptions);
};
