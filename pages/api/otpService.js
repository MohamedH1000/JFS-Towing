// otpService.js
const otpCache = new Map(); // In-memory cache for OTPs

// Store OTP in cache
export const storeOTP = (phone, otp) => {
  otpCache.set(phone, otp);
  setTimeout(() => otpCache.delete(phone), 5 * 60 * 1000); // Auto-delete OTP after 5 minutes
};

// Retrieve OTP from cache
export const getStoredOTP = (phone) => {
  return otpCache.get(phone);
};
