import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import "./Subject.css";

export default function SubjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState({ name: "", code: "" });

  useEffect(() => {
    loadSubject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSubject = async () => {
    try {
      const res = await api.get(`/subject/${id}`);
      setSubject(res.data);
    } catch (err) {
      console.error("Failed to fetch subject:", err);
      alert("Unable to load subject details.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/subject/${id}`, subject);
      alert("✅ Subject updated successfully!");
      navigate("/subjects");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update subject.");
    }
  };

  return (
    <div className="page-container">
      <h2>✏️ Edit Subject</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Subject Name"
          value={subject.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="code"
          placeholder="Subject Code"
          value={subject.code}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
}
