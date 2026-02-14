import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./Subject.css";

export default function SubjectCreate() {
  const [subject, setSubject] = useState({ name: "", code: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/subject/create", subject);
      alert("Subject added successfully!");
      navigate("/subjects");
    } catch (err) {
      console.error("Error creating subject:", err);
      alert("Failed to add subject.");
    }
  };

  return (
    <div className="page-container">
      <h2>➕ Add Subject</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Subject Name (e.g., Physics)"
          value={subject.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="code"
          placeholder="Subject Code (optional, e.g., PHY101)"
          value={subject.code}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
}
