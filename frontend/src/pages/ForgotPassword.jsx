import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setIsError(false);
      setMessage(data.message);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || "Unable to send the reset link.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Forgot Password</h1>
        <p>Enter your email to receive a reset link.</p>

        {message && <p role="alert" style={{ color: isError ? "red" : "green" }}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email Address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>

        <div className="auth-link">
          Back to <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
