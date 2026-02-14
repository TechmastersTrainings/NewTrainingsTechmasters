import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./Grade.css";

export default function GradeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    subject: "",
    marksObtained: "",
    maxMarks: "",
    remarks: "",
  });

  // Wrap in useCallback to stabilize the function reference
  const loadStudents = useCallback(async () => {
    try {
      const res = await api.get("/student/all");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to load students", err);
    }
  }, []);

  // Wrap in useCallback and include 'id' in dependency
  const loadGrade = useCallback(async () => {
    try {
      const res = await api.get(`/grades/${id}`);
      setFormData(res.data);
    } catch (err) {
      console.error("Failed to load grade", err);
    }
  }, [id]);

  useEffect(() => {
    loadStudents();
    loadGrade();
  }, [loadStudents, loadGrade]); // Dependencies now included safely

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/grades/${id}`, formData);
      navigate("/grades");
    } catch (err) {
      console.error("Error updating grade", err);
    }
  };

  return (
    <div className="grade-form-container">
      <h2>Edit Grade</h2>
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

        <button type="submit">Update Grade</button>
      </form>
    </div>
  );
}