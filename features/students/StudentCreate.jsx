import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Student.css";

export default function StudentCreate() {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    fullName: "",
    email: "",
    rollNumber: "",
    usn: "",
    className: "",
    classId: "",
    dateOfBirth: "",
    admissionDate: "",
    gender: "",
    address: "",
    parentContact: "",
    phone: "",
    active: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/students/create", student);
      alert("✅ Student added successfully!");
      navigate("/students");
    } catch (err) {
      console.error("Error creating student:", err);
      alert("Failed to create student.");
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? Unsaved data will be lost.")) {
      navigate("/students");
    }
  };

  return (
    <div className="page-container">
      <h2>{role === "ROLE_FACULTY" ? "Add Student (Faculty)" : "Add Student"}</h2>

      <form onSubmit={handleSubmit} className="form-grid">
        <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
        <input name="rollNumber" placeholder="Roll Number" onChange={handleChange} required />
        <input name="usn" placeholder="USN (University Seat Number)" onChange={handleChange} />
        <input name="className" placeholder="Class Name (e.g., CSE-A)" onChange={handleChange} />
        <input name="classId" placeholder="Class ID" onChange={handleChange} />
        <input name="dateOfBirth" type="date" placeholder="Date of Birth" onChange={handleChange} />
        <input name="admissionDate" type="date" placeholder="Admission Date" onChange={handleChange} />
        <select name="gender" value={student.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input name="address" placeholder="Address" onChange={handleChange} />
        <input name="parentContact" placeholder="Parent Contact Number" onChange={handleChange} />
        <input name="phone" placeholder="Student Phone" onChange={handleChange} />

        <div className="button-row">
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
