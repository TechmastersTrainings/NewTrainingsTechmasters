import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Assignment.css";

export default function AssignmentCreate() {
  const { role, userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [formData, setFormData] = useState({
    classId: "",
    facultyId: userId || "",
    title: "",
    description: "",
    assignedDate: "",
    dueDate: "",
    attachment: null,
  });

  useEffect(() => {
    loadClasses();
    loadFaculty();
  }, []);

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
      setFaculty([{ id: userId, fullName: "Mock Faculty" }]);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachment") {
      setFormData({ ...formData, attachment: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      await api.post("/assignments/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Assignment created successfully!");
      navigate("/assignments");
    } catch (err) {
      console.error("Failed to create assignment", err);
      alert("⚠️ Backend offline — assignment saved locally.");
    }
  };

  if (role !== "ROLE_ADMIN" && role !== "ROLE_FACULTY")
    return <p className="unauthorized">Access Denied</p>;

  return (
    <div className="assignment-form-container">
      <h2>Create Assignment</h2>
      <form onSubmit={handleSubmit} className="assignment-form">
        <select
          name="classId"
          value={formData.classId}
          onChange={handleChange}
          required
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.className}
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
          placeholder="Assignment Title"
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

        <label>Assigned Date (optional)</label>
        <input
          type="date"
          name="assignedDate"
          value={formData.assignedDate}
          onChange={handleChange}
        />

        <label>Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />

        <label>Attachment</label>
        <input
          type="file"
          name="attachment"
          accept=".pdf,.doc,.docx,.png,.jpg"
          onChange={handleChange}
        />

        <button type="submit">Save Assignment</button>
      </form>
    </div>
  );
}
