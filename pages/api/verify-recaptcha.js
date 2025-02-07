import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { recaptcha } = req.body;

  if (!recaptcha) {
    return res
      .status(400)
      .json({ success: false, message: "reCAPTCHA token is missing" });
  }

  const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

  try {
    // Verify reCAPTCHA with Google
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptcha}`;
    const response = await axios.post(verificationUrl);

    const { success, score } = response.data;

    if (success) {
      // reCAPTCHA verification passed
      res
        .status(200)
        .json({
          success: true,
          score,
          message: "reCAPTCHA verification successful",
        });
    } else {
      // reCAPTCHA verification failed
      res
        .status(400)
        .json({ success: false, message: "reCAPTCHA verification failed" });
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
