import React from "react";

const OtpModal = ({ isOpen, onClose, onVerify }) => {
  const [otp, setOtp] = React.useState("");

  const handleVerify = () => {
    onVerify(otp);
    onClose();
  };

  const handleOverlayClick = (e) => {
    // Close the modal only if the overlay itself is clicked
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal}>
        <h2 style={styles.title}>OTP Verification</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={styles.input}
        />
        <div style={styles.buttonContainer}>
          <button onClick={handleVerify} style={styles.button}>
            Verify
          </button>
          <button onClick={onClose} style={styles.button}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(5px)", // Blur effect
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // Ensure it's on top of other content
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "300px",
  },
  title: {
    marginBottom: "20px",
    fontSize: "1.5rem",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
    flex: 1,
  },
};

export default OtpModal;
