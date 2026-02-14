import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import "./Exam.css";

export default function ExamEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    classId: "",
    subject: "",
    examDate: "",
    examType: "",
    active: true,
  });

  const load = useCallback(async () => {
    const res = await api.get(`/exams/${id}`);
    setForm(res.data);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const change = (e) => {
    let v = e.target.value;
    if (e.target.name === "active") v = v === "true";
    setForm({ ...form, [e.target.name]: v });
  };

  const submit = async (e) => {
    e.preventDefault();
    await api.put(`/exams/${id}`, form);
    alert("Exam updated!");
    navigate("/exams");
  };

  return (
    <div className="page-container">
      <h2>Edit Exam</h2>
      <form className="form-container" onSubmit={submit}>
        <label>Class ID</label>
        <input name="classId" value={form.classId} onChange={change} required />

        <label>Subject</label>
        <input name="subject" value={form.subject} onChange={change} required />

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
          Update Exam
        </button>
      </form>
    </div>
  );
}
