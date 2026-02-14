import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./Grade.css";

export default function GradeCreate() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    subject: "",
    marksObtained: "",
    maxMarks: "",
    remarks: "",
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await api.get("/students/all");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to load students", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/grades/create", formData);
      navigate("/grades");
    } catch (err) {
      console.error("Error creating grade", err);
    }
  };

  return (
    <div className="grade-form-container">
      <h2>Create Grade</h2>
      <form onSubmit={handleSubmit} className="grade-form">
        <select
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          required
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.fullName} ({s.usn || s.rollNumber})
            </option>
          ))}
        </select>

        <input
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="marksObtained"
          placeholder="Marks Obtained"
          value={formData.marksObtained}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="maxMarks"
          placeholder="Max Marks"
          value={formData.maxMarks}
          onChange={handleChange}
          required
        />
        <input
          name="remarks"
          placeholder="Remarks"
          value={formData.remarks}
          onChange={handleChange}
        />

        <button type="submit">Save Grade</button>
      </form>
    </div>
  );
}
