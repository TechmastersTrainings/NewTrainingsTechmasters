import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./Student.css";

export default function StudentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState({});

  useEffect(() => {
    loadStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStudent = async () => {
    try {
      const res = await api.get(`/students/${id}`);
      setStudent(res.data);
    } catch (err) {
      console.error("Failed to fetch student:", err);
      alert("Unable to load student data.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/students/${id}`, student);
      alert("✅ Student updated successfully!");
      navigate("/students");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update student.");
    }
  };

  return (
    <div className="page-container">
      <h2>✏️ Edit Student</h2>

      <form onSubmit={handleSubmit} className="form-grid">
        <input name="fullName" value={student.fullName || ""} onChange={handleChange} placeholder="Full Name" />
        <input name="email" value={student.email || ""} onChange={handleChange} placeholder="Email" />
        <input name="rollNumber" value={student.rollNumber || ""} onChange={handleChange} placeholder="Roll Number" />
        <input name="usn" value={student.usn || ""} onChange={handleChange} placeholder="USN" />
        <input name="className" value={student.className || ""} onChange={handleChange} placeholder="Class Name" />
        <input name="classId" value={student.classId || ""} onChange={handleChange} placeholder="Class ID" />
        <input name="dateOfBirth" value={student.dateOfBirth || ""} onChange={handleChange} type="date" />
        <input name="admissionDate" value={student.admissionDate || ""} onChange={handleChange} type="date" />
        <select name="gender" value={student.gender || ""} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input name="address" value={student.address || ""} onChange={handleChange} placeholder="Address" />
        <input name="parentContact" value={student.parentContact || ""} onChange={handleChange} placeholder="Parent Contact" />
        <input name="phone" value={student.phone || ""} onChange={handleChange} placeholder="Phone" />
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
}
