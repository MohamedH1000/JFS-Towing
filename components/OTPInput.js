import { useState, useRef, useEffect } from "react";

const OTPInput = ({ length = 6, onChange, setIsComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    // Auto-focus on the first input field when the component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Check if all fields are filled
    setIsComplete(otp.every((digit) => digit !== ""));
  }, [otp, setIsComplete]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Only allow single digit numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Move focus to the next input if the user enters a number
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move focus back to the previous input
        inputRefs.current[index - 1]?.focus();
      }
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      onChange(newOtp.join(""));
    }
  };

  return (
    <div className="flex space-x-2 w-auto">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          ref={(el) => (inputRefs.current[index] = el)}
          className="w-8 h-8 md:w-12 md:h-12 text-center text-xl border rounded-md focus:ring-2 focus:ring-orange-500"
        />
      ))}
    </div>
  );
};

export default OTPInput;
