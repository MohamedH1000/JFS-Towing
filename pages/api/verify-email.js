// Import necessary modules
import { getStoredOTP } from "./otpService"; // Implement this function

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { email, otp } = req.body;

  try {
    // Retrieve the stored OTP for the given phone number
    const storedOTP = await getStoredOTP(email);

    // Check if the OTP matches
    if (String(storedOTP) === String(otp)) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
