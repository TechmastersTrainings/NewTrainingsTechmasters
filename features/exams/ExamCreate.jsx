import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./Exam.css";

export default function ExamCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    classId: "",
    subject: "",
    examDate: "",
    examType: "MIDTERM",
    active: true,
  });

  const change = (e) => {
    let v = e.target.value;
    if (e.target.name === "active") v = v === "true";
    setForm({ ...form, [e.target.name]: v });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/exams/create", form);
      alert("Exam scheduled successfully!");
      navigate("/exams");
    } catch (err) {
      console.error("Failed to create exam:", err);
      alert("Error scheduling exam.");
    }
  };

  return (
    <div className="page-container">
      <h2>🗓️ Schedule New Exam</h2>
      <form className="form-container" onSubmit={submit}>
        <label>Class ID</label>
        <input
          name="classId"
          value={form.classId}
          onChange={change}
          required
        />

        <label>Subject</label>
        <input
          name="subject"
          value={form.subject}
          onChange={change}
          required
        />

        <label>Exam Date</label>
        <input
          type="date"
          name="examDate"
          value={form.examDate}
          onChange={change}
          required
        />

        <label>Exam Type</label>
        <select name="examType" value={form.examType} onChange={change}>
          <option value="MIDTERM">Midterm</option>
          <option value="FINAL">Final</option>
          <option value="UNIT TEST">Unit Test</option>
          <option value="ASSESSMENT">Assessment</option>
        </select>

        <label>Status</label>
        <select name="active" value={form.active} onChange={change}>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <button type="submit" className="btn">
          Schedule Exam
        </button>
      </form>
    </div>
  );
}
