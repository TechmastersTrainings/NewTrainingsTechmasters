import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("ROLE_STUDENT");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    gender: "",
    dateOfBirth: "",
    rollNumber: "",
    usn: "",
    className: "",
    semester: "",
    parentContact: "",
    admissionDate: "",
    department: "",
    designation: "",
    hireDate: "",
    relationship: "",
    studentId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => setRole(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ensure no undefined values are sent
    const payload = {
      ...formData,
      roleName: role,
      // backend expects null, not empty string for optional fields
      studentId: formData.studentId ? Number(formData.studentId) : null,
      semester:
        formData.semester !== "" && formData.semester !== null
          ? Number(formData.semester)
          : null,
    };

    try {
      const res = await api.post("/auth/public/register", payload);

      if (res.status === 201) {
        alert("Registration successful! You can now log in.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      alert(
        err.response?.data?.message ||
          "Failed to register. Please check your details."
      );
    }
  };

  return (
    <div className="register-container">
      <div className="split-card-wrapper" style={{ maxWidth: "1400px" }}>
        {/* LEFT PANEL */}
        <div className="left-panel">
          <h2>Start Your Journey Here</h2>
          <p>
            Join our community by registering for your specific role and access
            academic features seamlessly.
          </p>
          <div className="abstract-shape shape-1"></div>
          <div className="abstract-shape shape-2"></div>
          <div className="abstract-shape shape-3"></div>
          <div className="abstract-shape shape-4"></div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <form className="form-content-wrapper" onSubmit={handleSubmit}>
            <h2 className="auth-form-title">Create Account</h2>

            {/* Role Selection */}
            <div className="form-group">
              <label>I am a:</label>
              <select
                value={role}
                onChange={handleRoleChange}
                className="auth-input-split"
                style={{ paddingLeft: "15px" }}
              >
                <option value="ROLE_STUDENT">Student</option>
                <option value="ROLE_FACULTY">Faculty Member</option>
                <option value="ROLE_PARENT">Parent</option>
              </select>
            </div>

            <hr
              className="divider"
              style={{ margin: "20px 0", borderColor: "#e0e0e0" }}
            />

            {/* Common Fields */}
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="auth-input-split"
                  style={{ paddingLeft: "15px" }}
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="auth-input-split"
                  style={{ paddingLeft: "15px" }}
                />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="auth-input-split"
                  style={{ paddingLeft: "15px" }}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="auth-input-split"
                  style={{ paddingLeft: "15px" }}
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="auth-input-split"
                  style={{ paddingLeft: "15px" }}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="auth-input-split"
                  style={{ paddingLeft: "15px" }}
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Address</label>
              <textarea
                name="address"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                className="auth-input-split"
                style={{ paddingLeft: "15px", height: "auto" }}
              />
            </div>

            {/* Role-specific Fields */}
            {role === "ROLE_STUDENT" && (
              <div
                className="role-section fade-in full-width"
                style={{ marginTop: "20px" }}
              >
                <h4
                  style={{
                    color: "#6A5ACD",
                    borderBottom: "2px solid #6A5ACD",
                    paddingBottom: "5px",
                  }}
                >
                  Student Details
                </h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>USN *</label>
                    <input
                      type="text"
                      name="usn"
                      value={formData.usn}
                      onChange={handleChange}
                      required
                      className="auth-input-split"
                      style={{ paddingLeft: "15px" }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Roll Number</label>
                    <input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      className="auth-input-split"
                      style={{ paddingLeft: "15px" }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Class Name</label>
                    <input
                      type="text"
                      name="className"
                      value={formData.className}
                      onChange={handleChange}
                      className="auth-input-split"
                      style={{ paddingLeft: "15px" }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Semester *</label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      required
                      className="auth-input-split"
                      style={{ paddingLeft: "15px" }}
                    >
                      <option value="">Select</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Parent Contact</label>
                    <input
                      type="tel"
                      name="parentContact"
                      value={formData.parentContact}
                      onChange={handleChange}
                      className="auth-input-split"
                      style={{ paddingLeft: "15px" }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Admission Date</label>
                    <input
                      type="date"
                      name="admissionDate"
                      value={formData.admissionDate}
                      onChange={handleChange}
                      className="auth-input-split"
                      style={{ paddingLeft: "15px" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {role === "ROLE_FACULTY" && (
              <div
                className="role-section fade-in full-width"
                style={{ marginTop: "20px" }}
              >
                <h4
                  style={{
                    color: "#6A5ACD",
                    borderBottom: "2px solid #6A5ACD",
                    paddingBottom: "5px",
                  }}
                >
                  Faculty Details
                </h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Department *</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="auth-input-split"
                      style={{ paddingLeft: "15px" }}
                    >
                      <option value="">Select Department</option>
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Designation *</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      required
                      className="auth-input-split"
                      style={{ paddingLeft: "15px" }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Hire Date</label>
                    <input
                      type="date"
                      name="hireDate"
                      value={formData.hireDate}
                      onChange={handleChange}
                      className="auth-input-split"
                      style={{ paddingLeft: "15px" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {role === "ROLE_PARENT" && (
              <div
                className="role-section fade-in full-width"
                style={{ marginTop: "20px" }}
              >
                <h4
                  style={{
                    color: "#6A5ACD",
                    borderBottom: "2px solid #6A5ACD",
                    paddingBottom: "5px",
                  }}
                >
                  Parent Details
                </h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Relationship *</label>
                    <select
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleChange}
                      required
                      className="auth-input-split"
                      style={{ paddingLeft: "15px" }}
                    >
                      <option value="">Select</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Guardian</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Student ID *</label>
                    <input
                      type="number"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      required
                      className="auth-input-split"
                      style={{ paddingLeft: "15px" }}
                    />
                    <small className="hint">Enter Child’s System ID</small>
                  </div>
                </div>
              </div>
            )}

            <hr
              className="divider"
              style={{ margin: "20px 0", borderColor: "#e0e0e0" }}
            />

            <button type="submit" className="btn-gradient-primary">
              REGISTER
            </button>
            <p className="auth-links-split">
              Already have an account? <a href="/login">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
