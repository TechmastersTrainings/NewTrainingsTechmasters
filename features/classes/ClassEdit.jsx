import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./Class.css";

export default function ClassEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState([]);
  const [formData, setFormData] = useState({
    className: "",
    section: "",
    department: "",
    facultyId: "",
    strength: "",
    active: true,
  });

  useEffect(() => {
    loadClass();
    loadFaculty();
  }, [id]);

  const loadClass = async () => {
    try {
      const res = await api.get(`/classes/${id}`);
      setFormData(res.data);
    } catch (err) {
      console.error("Failed to load class", err);
    }
  };

  const loadFaculty = async () => {
    try {
      const res = await api.get("/faculty/all");
      setFaculty(res.data);
    } catch (err) {
      console.error("Failed to load faculty", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/classes/${id}`, formData);
      navigate("/classes");
    } catch (err) {
      console.error("Failed to update class", err);
    }
  };

  return (
    <div className="class-form-container">
      <h2>Edit Class</h2>
      <form onSubmit={handleSubmit} className="class-form">
        <input
          type="text"
          name="className"
          placeholder="Class Name"
          value={formData.className}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="section"
          placeholder="Section"
          value={formData.section}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
        />

        <select
          name="facultyId"
          value={formData.facultyId}
          onChange={handleChange}
          required
        >
          <option value="">Select Faculty</option>
          {faculty.map((f) => (
            <option key={f.id} value={f.id}>
              {f.fullName}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="strength"
          placeholder="Strength"
          value={formData.strength}
          onChange={handleChange}
        />

        <label>
          Active:
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Update Class</button>
      </form>
    </div>
  );
}
