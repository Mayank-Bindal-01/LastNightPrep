import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Aapka banaya hua axios instance (jo baseURL set karta hai)
import api from "../api/axios";

function ResetPassword() {
  const { token } = useParams(); // URL se token nikalne ke liye
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Nayi state

  // UI par message dikhane ke liye states
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMessage(""); // Purana message clear karein

    // 1. Password Match Validation
    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match!");
      return;
    }

    try {
      // 2. Backend API call
      await api.post(`/auth/reset-password/${token}`, {
        password: password
      });

      // 3. Success Handle Karna
      setIsError(false);
      setMessage("Password reset successfully! Redirecting to login...");

      // User ko success message padhne ke liye 2 seconds ka time dena
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      // 4. Error Handle Karna (Token expire ho gaya ya galat hai)
      setIsError(true);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || "Invalid or expired token.");
      } else {
        setMessage("Reset failed. Please try again.");
      }
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create New Password</h1>
        <p>Enter your new secure password below</p>

        {/* Message Box (Red agar error hai, Green agar success hai) */}
        {message && (
          <div style={{ color: isError ? 'red' : 'green', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>
            {message}
          </div>
        )}

        <form onSubmit={submit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="8"
            required
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength="8"
            required
          />

          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
