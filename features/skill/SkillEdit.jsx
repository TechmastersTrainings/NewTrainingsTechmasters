import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./Skill.css";

export default function SkillEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    skillName: "",
    proficiencyLevel: "",
    category: "",
    certification: "",
    acquiredDate: "",
  });

  useEffect(() => {
    loadSkill();
  }, []);

  const loadSkill = async () => {
    try {
      const res = await api.get(`/skills/${id}`);
      setForm(res.data);
    } catch (err) {
      console.error("Failed to load skill", err);
      alert("Error loading skill.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/skills/${id}`, form);
      alert("Skill updated successfully!");
      navigate("/skills");
    } catch (err) {
      console.error("Failed to update skill", err);
      alert("Error updating skill.");
    }
  };

  return (
    <div className="page-container">
      <h2>✏️ Edit Skill</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="skillName"
          placeholder="Skill Name"
          value={form.skillName}
          onChange={handleChange}
          required
        />
        <select
          name="proficiencyLevel"
          value={form.proficiencyLevel}
          onChange={handleChange}
        >
          <option value="">Select Proficiency</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />
        <input
          type="text"
          name="certification"
          placeholder="Certification"
          value={form.certification}
          onChange={handleChange}
        />
        <input
          type="date"
          name="acquiredDate"
          value={form.acquiredDate || ""}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-primary">
          Update Skill
        </button>
      </form>
    </div>
  );
}
