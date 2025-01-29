import { getStoredOTP } from "./otpService";

export default async function handler(req, res) {
  const { phone, otp } = req.body;

  // Compare the OTP with the one sent to the user (stored in a database or cache)
  const storedOTP = await getStoredOTP(phone); // Implement this function

  if (storedOTP === otp) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
}
