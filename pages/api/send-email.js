import nodemailer from "nodemailer";
import { storeOTP } from "./otpService";

// SMTP configuration
const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: SMTP_SERVER_HOST,
  port: 587,
  secure: false,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: true, // Skip certificate validation if needed
  },
});

// Verify the SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is ready to send messages:", success);
  }
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Send the OTP email
    const info = await transporter.sendMail({
      from: SMTP_SERVER_USERNAME,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
      html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
    });

    // console.log("Message Sent", info.messageId);
    // console.log("Mail sent to", email);
    storeOTP(email, otp);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send OTP email" });
  }
}
