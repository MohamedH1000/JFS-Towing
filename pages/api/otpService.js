// otpService.js
const otpCache = new Map(); // In-memory cache for OTPs

// Store OTP in cache
export const storeOTP = (email, otp) => {
  otpCache.set(email, otp);
  setTimeout(() => otpCache.delete(email), 5 * 60 * 1000); // Auto-delete OTP after 5 minutes
};

// Retrieve OTP from cache
export const getStoredOTP = (email) => {
  return otpCache.get(email);
};
