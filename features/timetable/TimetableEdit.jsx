import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Timetable.css";

export default function TimetableEdit() {
  const { role } = useContext(AuthContext);
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ---------------- Load Data ----------------
  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [classRes, facultyRes, timetableRes] = await Promise.all([
        api.get("/classes/all"),
        api.get("/faculty/all"),
        api.get(`/timetable/${id}`),
      ]);

      setClasses(classRes.data || []);
      setFaculty(facultyRes.data || []);

      const t = timetableRes.data;
      setFormData({
        classId: t.classId || "",
        facultyId: t.facultyId || "",
        subject: t.subject || "",
        date: t.date || "",
        startTime: t.startTime || "",
        endTime: t.endTime || "",
      });
    } catch (err) {
      console.error("❌ Failed to load timetable data", err);
      alert("Error loading timetable. Please try again.");
      navigate("/timetable");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Handlers ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.classId || !formData.facultyId || !formData.subject) {
      alert("⚠️ Please fill all required fields.");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      alert("⚠️ End time must be after start time.");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/timetable/${id}`, formData);
      alert("✅ Timetable updated successfully!");
      navigate("/timetable");
    } catch (err) {
      console.error("❌ Failed to update timetable", err);
      if (
        err.response?.data?.message?.includes("conflict") ||
        err.message?.includes("conflict")
      ) {
        alert("⚠️ Schedule conflict detected. Please adjust timings.");
      } else {
        alert("❌ Update failed. Please check console for details.");
      }
    } finally {
      setSaving(false);
    }
  };

  // 🔐 Role-based access
  if (role !== "ROLE_ADMIN" && role !== "ROLE_FACULTY") {
    return (
      <div className="page-container unauthorized">
        <h3>🚫 Access Denied</h3>
        <p>You do not have permission to edit timetables.</p>
      </div>
    );
  }

  // ---------------- Render ----------------
  if (loading)
    return (
      <div className="page-container fade-in">
        <h3>Loading timetable...</h3>
      </div>
    );

  return (
    <div className="page-container timetable-form-container fade-in">
      <div className="attendance-header">
        <h2>📝 Edit Timetable</h2>
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
          <button type="submit" className="primary-btn" disabled={saving}>
            {saving ? "Updating..." : "💾 Update Timetable"}
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
