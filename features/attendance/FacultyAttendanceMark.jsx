import React, { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./Attendance.css";

export default function FacultyAttendanceMark() {
  const { userId } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  // ✅ Load only faculty's classes
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await api.get(`/classes/faculty/${userId}`);
        setClasses(res.data || []);
      } catch (err) {
        console.error("Failed to load classes", err);
      }
    };
    loadClasses();
  }, [userId]);

  // ✅ Load students of selected class
  const loadStudents = async (classId) => {
    if (!classId) return;
    try {
      const res = await api.get(`/students/class/${classId}`);
      const list = Array.isArray(res.data) ? res.data : [];
      setStudents(list);

      const init = {};
      list.forEach((s) => (init[s.id] = true)); // default PRESENT
      setAttendance(init);
    } catch (err) {
      console.error("Failed to load students", err);
    }
  };

  useEffect(() => {
    if (selectedClass) loadStudents(selectedClass);
  }, [selectedClass]);

  const handleToggle = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleSave = async () => {
    if (!selectedClass) return toast.warn("Select a class first!");

    const localToday = new Date();
      const offset = localToday.getTimezoneOffset();
      const localDate = new Date(localToday.getTime() - offset * 60 * 1000)
        .toISOString()
        .slice(0, 10);

      if (date !== localDate) {
        toast.error("⚠️ You can only mark attendance for today's date!");
        return;
      }
    const payload = {
      date,
      items: students.map((s) => ({
        studentId: s.id,
        status: attendance[s.id] ? "PRESENT" : "ABSENT",
        remarks: "",
      })),
    };

    try {
      setLoading(true);
      const res = await api.post(`/attendance/mark/class/${selectedClass}`, payload);
      if (res.data?.success) {
        toast.success("✅ Attendance marked successfully!");
      } else {
        toast.warn(res.data?.message || "⚠️ Check date and try again.");
      }
    } catch (err) {
      console.error("Failed to mark attendance:", err);
      toast.error("❌ Failed to mark attendance. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in" style={{
      background: "linear-gradient(135deg, #ede9fe, #f5f3ff)",
      padding: "2rem",
      borderRadius: "12px",
      minHeight: "90vh"
    }}>
      <h2 style={{ textAlign: "center", color: "#6d28d9", fontWeight: "700" }}>
        Faculty Attendance Mark
      </h2>

      <div className="attendance-filters">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.className} - {cls.section} ({cls.department})
            </option>
          ))}
        </select>

        {/* ✅ Date Picker — allows selection, but warns if invalid */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="date-input"
        />
      </div>

      {!selectedClass && (
        <p style={{ textAlign: "center", marginTop: "2rem", color: "#6b7280" }}>
          Select a class to view and mark attendance.
        </p>
      )}

      {selectedClass && students.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "2rem", color: "#ef4444" }}>
          No students found for this class.
        </p>
      )}

      {students.length > 0 && (
        <>
          <table className="data-table glassy-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.rollNumber}</td>
                  <td>{s.fullName}</td>
                  <td style={{ textAlign: "center" }}>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={attendance[s.id] || false}
                        onChange={() => handleToggle(s.id)}
                      />
                      <span className="slider"></span>
                    </label>
                    <span
                      style={{
                        marginLeft: "10px",
                        fontWeight: 600,
                        color: attendance[s.id] ? "#10b981" : "#ef4444",
                      }}
                    >
                      {attendance[s.id] ? "Present" : "Absent"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="save-btn purple-btn" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "💾 Save Attendance"}
          </button>
        </>
      )}
    </div>
  );
}
