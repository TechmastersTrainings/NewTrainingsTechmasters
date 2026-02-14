import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./Attendance.css";

export default function AttendanceEditFaculty() {
  const { attendanceId } = useParams(); // expects route: /attendance/edit/:attendanceId
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🧠 Load attendance record
  const loadAttendance = async () => {
    try {
      const res = await api.get(`/attendance/${attendanceId}`);
      setAttendance(res.data);
    } catch (err) {
      console.error("Failed to load attendance", err);
      alert("Failed to load attendance. Check console.");
      navigate("/attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
    // eslint-disable-next-line
  }, [attendanceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttendance((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!attendance) return;
    setSaving(true);

    try {
      await api.put(`/attendance/update/${attendance.id}`, {
        present:
          attendance.status === "PRESENT" ||
          attendance.status === true ||
          attendance.present === true,
        remarks: attendance.remarks || "",
      });
      alert("Attendance updated successfully!");
      navigate(`/attendance/mark/${attendance.classId}`);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update attendance. Check console.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-container">Loading...</div>;
  if (!attendance) return <div className="page-container">Attendance not found.</div>;

  return (
    <div className="page-container">
      <h2>Edit Attendance</h2>
      <form className="form-container" onSubmit={handleSave}>
        <label>Student</label>
        <input
          type="text"
          value={attendance.studentName || ""}
          disabled
        />

        <label>Class</label>
        <input
          type="text"
          value={attendance.className || ""}
          disabled
        />

        <label>Date</label>
        <input
          type="date"
          name="date"
          value={attendance.date?.slice(0, 10) || ""}
          onChange={handleChange}
          required
        />

        <label>Status</label>
        <select name="status" value={attendance.status} onChange={handleChange}>
          <option value="PRESENT">PRESENT</option>
          <option value="ABSENT">ABSENT</option>
          <option value="LATE">LATE</option>
          <option value="LEAVE">LEAVE</option>
        </select>

        <label>Remarks</label>
        <input
          type="text"
          name="remarks"
          value={attendance.remarks || ""}
          onChange={handleChange}
          placeholder="Reason / notes"
        />

        <button type="submit" className="btn-save" disabled={saving}>
          {saving ? "Saving..." : "Update Attendance"}
        </button>
      </form>
    </div>
  );
}
