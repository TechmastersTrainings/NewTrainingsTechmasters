// src/pages/Timetable/WeeklyTimetable.jsx
import React, { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./WeeklyTimetable.css";

export default function WeeklyTimetable() {
  const { role, userId, studentId } = useContext(AuthContext);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    if (role === "ROLE_STUDENT" && !studentId) {
      // 🧭 Wait for AuthContext to load
      return;
    }
    loadTimetable();
  }, [role, userId, studentId]);

  const loadTimetable = async () => {
    try {
      setLoading(true);
      let res;

      if (role === "ROLE_FACULTY") {
        res = await api.get(`/timetable/faculty/${userId}`);
      } 
      else if (role === "ROLE_STUDENT") {
        if (!studentId) return;

        const studentRes = await api.get(`/students/${studentId}`);
        const classId = studentRes.data?.classId;
        if (!classId) throw new Error("Class ID missing for student.");

        res = await api.get(`/timetable/class/${classId}`);
      } 
      else {
        res = await api.get("/timetable/all");
      }

      setTimetable(res.data || []);
      setError("");
    } catch (err) {
      console.error("❌ Failed to load timetable:", err);
      setError(err.message || "Failed to load timetable.");
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (dateStr) => {
    const dayIndex = new Date(dateStr).getDay();
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex];
  };

  const grouped = days.reduce((acc, day) => {
    acc[day] = timetable.filter((t) => getDayName(t.date) === day);
    return acc;
  }, {});

  if (role === "ROLE_STUDENT" && !studentId) {
    return (
      <div className="weekly-container fade-in">
        <p>⏳ Loading your timetable, please wait...</p>
      </div>
    );
  }

  if (loading) return <div className="weekly-container">Loading timetable...</div>;
  if (error) return <div className="weekly-container error">{error}</div>;

  return (
    <div className="weekly-container fade-in">
      <h2 className="weekly-title">📅 Weekly Timetable</h2>
      <div className="weekly-grid">
        {days.map((day) => (
          <div key={day} className="day-column">
            <h3 className="day-header">{day}</h3>
            <div className="day-schedule">
              {grouped[day].length === 0 ? (
                <p className="no-class">No classes</p>
              ) : (
                grouped[day]
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((t) => (
                    <div key={t.id} className="class-card">
                      <div className="subject-name">{t.subject}</div>
                      <div className="time-range">
                        {t.startTime} - {t.endTime}
                      </div>
                      <div className="faculty-info">
                        👨‍🏫 {t.facultyName || `Faculty ID: ${t.facultyId}`}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
