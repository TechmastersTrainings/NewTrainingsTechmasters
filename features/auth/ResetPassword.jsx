import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-toastify";
import "./Auth.css";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");

  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!token || !email) {
      toast.error("Invalid or expired password reset link.");
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      return toast.warn("Please fill in all fields.");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      const res = await api.post(
        `/auth/reset-password?token=${token}&newPassword=${encodeURIComponent(newPassword)}`
      );
      toast.success(res.data || "Password reset successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "Failed to reset password.");
    }
  };

  return (
    <div className="auth-container">
      <div className="split-card-wrapper">
        <div className="left-panel">
          <h2>Reset Your Password</h2>
          <p>If you have a valid reset link, enter a new password to continue.</p>
          <div className="abstract-shape shape-3"></div>
          <div className="abstract-shape shape-4"></div>
        </div>

        <div className="right-panel">
          <form className="form-content-wrapper" onSubmit={handleSubmit}>
            <h2 className="auth-form-title">🔑 Reset Password</h2>

            <div className="form-group">
              <input
                type="password"
                aria-label="New password"
                value={newPassword}
                required
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="auth-input-split"
                style={{ paddingLeft: '15px' }}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                aria-label="Confirm password"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="auth-input-split"
                style={{ paddingLeft: '15px' }}
              />
            </div>

            <button type="submit" className="btn-gradient-primary">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
