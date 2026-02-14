import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Timetable.css";

export default function TimetableCreate() {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [formData, setFormData] = useState({
    classId: "",
    facultyId: "",
    subject: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const [loading, setLoading] = useState(false);

  // -------------------- Load Initial Data --------------------
  useEffect(() => {
    loadClasses();
    loadFaculty();
  }, []);

  const loadClasses = async () => {
    try {
      const res = await api.get("/classes/all"); // ✅ Corrected endpoint
      setClasses(res.data);
    } catch (err) {
      console.error("❌ Failed to load classes", err);
    }
  };

  const loadFaculty = async () => {
    try {
      const res = await api.get("/faculty/all");
      setFaculty(res.data);
    } catch (err) {
      console.error("❌ Failed to load faculty", err);
    }
  };

  // -------------------- Form Handling --------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 Basic validation
    if (!formData.classId || !formData.facultyId || !formData.subject) {
      alert("⚠️ Please fill all required fields.");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      alert("⚠️ End time must be after start time.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/timetable/create", formData);
      alert("✅ Timetable created successfully!");
      navigate("/timetable");
    } catch (err) {
      console.error("❌ Failed to create timetable", err);
      if (
        err.response?.data?.message?.includes("Schedule conflict") ||
        err.message?.includes("conflict")
      ) {
        alert("⚠️ Scheduling conflict detected. Please adjust timings.");
      } else {
        alert("❌ Failed to create timetable. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Restrict access
  if (role !== "ROLE_ADMIN" && role !== "ROLE_FACULTY") {
    return (
      <div className="page-container unauthorized">
        <h3>🚫 Access Denied</h3>
        <p>You do not have permission to create timetables.</p>
      </div>
    );
  }

  // -------------------- Render --------------------
  return (
    <div className="page-container timetable-form-container fade-in">
      <div className="attendance-header">
        <h2>🕒 Create Timetable</h2>
      </div>

      <form onSubmit={handleSubmit} className="timetable-form">
        <div className="form-row">
          <label>Class *</label>
          <select
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            required
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.className || cls.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Faculty *</label>
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
        </div>

        <div className="form-row">
          <label>Subject *</label>
          <input
            type="text"
            name="subject"
            placeholder="Enter subject name"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Start Time *</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>End Time *</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Saving..." : "💾 Save Timetable"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/timetable")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
