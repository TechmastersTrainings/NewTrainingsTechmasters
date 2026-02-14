import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock } from "lucide-react"; 
import "./Auth.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [emailOrUsn, setEmailOrUsn] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const success = await login(emailOrUsn, password);
    if (success) {
      const storedRole = localStorage.getItem("role");
      if (storedRole === "ROLE_ADMIN") navigate("/students");
      else if (storedRole === "ROLE_FACULTY") navigate("/classes");
      else if (storedRole === "ROLE_STUDENT") navigate("/my-profile");
      else if (storedRole === "ROLE_PARENT") navigate("/child/profile");
      else navigate("/");
    }
  };

  return (
    <div className="auth-container">
      <div className="split-card-wrapper">
        
        <div className="left-panel">
            <h2>Smart Campus Management</h2>
            <p>
                Empowering education through seamless digital integration. 
                Access attendance, academic records, schedules, and 
                administrative tools in one unified, intelligent platform.
            </p>
            <div className="abstract-shape shape-1"></div>
            <div className="abstract-shape shape-2"></div>
            <div className="abstract-shape shape-3"></div>
        </div>

        <div className="right-panel">
            <form className="form-content-wrapper" onSubmit={submit}>
                <h2 className="auth-form-title">Portal Login</h2>

                {/* Email / USN Group */}
                <div className="input-icon-group">
                    <User size={20} className="inner-icon-left" />
                    <input
                      type="text"
                      placeholder="Email or USN"
                      required
                      className="auth-input-split"
                      value={emailOrUsn}
                      onChange={(e) => setEmailOrUsn(e.target.value)}
                    />
                </div>

                {/* Password Group */}
                <div className="input-icon-group">
                    <Lock size={20} className="inner-icon-left" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      required
                      className="auth-input-split"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="inner-toggle-right"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className="form-meta">
                    <label className="remember-me">
                        <input type="checkbox" id="remember" />
                        <span>Remember me</span>
                    </label>
                    <a href="/forgot-password">Forgot password?</a>
                </div>

                <button type="submit" className="btn-gradient-primary">LOGIN</button>

                <p className="auth-links-split">
                  Don't have an account? <a href="/register">Register</a>
                </p>
            </form>
        </div>
      </div>
    </div>
  );
}