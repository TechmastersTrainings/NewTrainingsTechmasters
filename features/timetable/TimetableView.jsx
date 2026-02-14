import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Timetable.css";

export default function TimetableView() {
  const { id } = useParams();
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [timetable, setTimetable] = useState(null);
  const [className, setClassName] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [loading, setLoading] = useState(true);

  // ---------------- Load Timetable ----------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get(`/timetable/${id}`);
        const data = res.data;
        setTimetable(data);

        // fetch related class and faculty names
        const [classRes, facultyRes] = await Promise.all([
          api.get(`/classes/${data.classId}`),
          api.get(`/faculty/${data.facultyId}`),
        ]);

        setClassName(classRes.data.className || classRes.data.name);
        setFacultyName(facultyRes.data.fullName);
      } catch (err) {
        console.error("❌ Failed to load timetable", err);
        alert("Failed to load timetable. Please try again.");
        navigate("/timetable");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="page-container fade-in">
        <h3>Loading timetable...</h3>
      </div>
    );
  }

  if (!timetable) {
    return (
      <div className="page-container fade-in">
        <h3>Timetable not found.</h3>
      </div>
    );
  }

  // ---------------- Helpers ----------------
  const today = new Date().toISOString().split("T")[0];
  const isToday = timetable.date === today;
  const isPast = new Date(timetable.date) < new Date(today);

  const dateStatusColor = isToday
    ? "#00bcd4"
    : isPast
    ? "#ff9800"
    : "#22c55e"; // teal / orange / green

  const dateStatusLabel = isToday
    ? "Today"
    : isPast
    ? "Past"
    : "Upcoming";

  // ---------------- Render ----------------
  return (
    <div className="page-container fade-in">
      <div className="attendance-header">
        <h2>📘 Timetable Details</h2>
      </div>

      <div className="timetable-detail-card">
        <div className="detail-row">
          <span className="label">Subject:</span>
          <span className="value highlight">{timetable.subject}</span>
        </div>

        <div className="detail-row">
          <span className="label">Class:</span>
          <span className="value">{className}</span>
        </div>

        {(role === "ROLE_ADMIN" || role === "ROLE_FACULTY") && (
          <div className="detail-row">
            <span className="label">Faculty:</span>
            <span className="value">{facultyName}</span>
          </div>
        )}

        <div className="detail-row">
          <span className="label">Date:</span>
          <span className="value">
            {timetable.date}{" "}
            <span
              style={{
                backgroundColor: dateStatusColor,
                color: "#1e3640",
                padding: "4px 8px",
                borderRadius: "6px",
                fontWeight: "600",
                marginLeft: "10px",
                fontSize: "0.85rem",
              }}
            >
              {dateStatusLabel}
            </span>
          </span>
        </div>

        <div className="detail-row">
          <span className="label">Start Time:</span>
          <span className="value">{timetable.startTime}</span>
        </div>

        <div className="detail-row">
          <span className="label">End Time:</span>
          <span className="value">{timetable.endTime}</span>
        </div>

        <div className="detail-row">
          <span className="label">Status:</span>
          <span
            className="value"
            style={{
              color: timetable.active ? "#00bcd4" : "#ef4444",
              fontWeight: "600",
            }}
          >
            {timetable.active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="form-actions">
        {(role === "ROLE_ADMIN" || role === "ROLE_FACULTY") && (
          <button
            className="primary-btn"
            onClick={() => navigate(`/timetable/edit/${timetable.id}`)}
          >
            ✏️ Edit
          </button>
        )}
        <button className="btn-secondary" onClick={() => navigate("/timetable")}>
          🔙 Back
        </button>
      </div>
    </div>
  );
}
