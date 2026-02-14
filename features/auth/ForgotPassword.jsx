import React, { useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import "./Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.warn("Please enter your email address.");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("✅ Reset link sent successfully. Check your inbox!");
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "❌ Unable to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="split-card-wrapper">
        <div className="left-panel">
          <h2>Forgot Password</h2>
          <p>
            Enter the email associated with your account and we'll send a
            link to reset your password.
          </p>
          <div className="abstract-shape shape-1"></div>
          <div className="abstract-shape shape-2"></div>
        </div>

        <div className="right-panel">
          <form className="form-content-wrapper" onSubmit={handleSubmit}>
            <h2 className="auth-form-title">🔒 Forgot Password</h2>

            <div className="form-group">
              <input
                type="email"
                aria-label="Email address"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="auth-input-split"
                style={{ paddingLeft: '15px' }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-gradient-primary">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
