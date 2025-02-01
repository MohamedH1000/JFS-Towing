import { storeOTP } from "./otpService";

const twilio = require("twilio");

export default async function handler(req, res) {
  const { phone, countryCode } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  await client.messages.create({
    body: `Your OTP Number is ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `${countryCode}${phone}`, // Combines country code and phone
  });
  storeOTP(phone, otp);

  res.status(200).json({ success: true });
}
