export async function getStoredOTP(fullPhone) {
  // Example implementation: Replace with actual database or cache logic
  const otpStore = {
    "+201006546448": "123456", // Example data
  };

  if (!otpStore[fullPhone]) {
    throw new Error(`OTP not found for phone number: ${fullPhone}`);
  }

  return otpStore[fullPhone];
}
