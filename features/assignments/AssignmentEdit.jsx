import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Assignment.css";

export default function AssignmentEdit() {
  const { id } = useParams();
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [formData, setFormData] = useState({
    classId: "",
    facultyId: "",
    title: "",
    description: "",
    dueDate: "",
  });

  useEffect(() => {
    loadClasses();
    loadFaculty();
    loadAssignment();
  }, [id]);

  const loadClasses = async () => {
    try {
      const res = await api.get("/classes/all");
      setClasses(res.data || []);
    } catch (err) {
      console.error("Failed to load classes", err);
      setClasses([{ id: 1, className: "Mock Class" }]);
    }
  };

  const loadFaculty = async () => {
    try {
      const res = await api.get("/faculty/all");
      setFaculty(res.data || []);
    } catch (err) {
      console.error("Failed to load faculty", err);
      setFaculty([{ id: 1, fullName: "Mock Faculty" }]);
    }
  };

  const loadAssignment = async () => {
    try {
      const res = await api.get(`/assignments/${id}`);
      setFormData(res.data);
    } catch (err) {
      console.error("Failed to load assignment", err);
      setFormData({
        classId: 1,
        facultyId: 1,
        title: "Mock Assignment",
        description: "Backend offline",
        dueDate: new Date().toISOString().slice(0, 10),
      });
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/assignments/${id}`, formData);
      alert("✅ Assignment updated!");
      navigate("/assignments");
    } catch (err) {
      console.error("Failed to update assignment", err);
      alert("⚠️ Backend offline — changes not saved.");
    }
  };

  if (role !== "ROLE_ADMIN" && role !== "ROLE_FACULTY")
    return <p className="unauthorized">Access Denied</p>;

  return (
    <div className="assignment-form-container">
      <h2>Edit Assignment</h2>
      <form onSubmit={handleSubmit} className="assignment-form">
        <select
          name="classId"
          value={formData.classId}
          onChange={handleChange}
          required
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.className}
            </option>
          ))}
        </select>

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
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Assignment</button>
      </form>
    </div>
  );
}
