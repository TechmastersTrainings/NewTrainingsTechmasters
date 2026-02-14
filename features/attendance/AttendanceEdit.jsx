import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/api";
import "./Attendance.css";

export default function AttendanceEdit() {
  const { role } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    studentId: "",
    date: "",
    present: true,
    remarks: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role !== "ROLE_FACULTY" && role !== "ROLE_ADMIN") {
      navigate("/");
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/attendance/${id}`);
        const a = res.data || {};
        setForm({
          studentId: a.studentId || "",
          date: a.date || "",
          present: a.present,
          remarks: a.remarks || "",
        });
      } catch (err) {
        console.error("Failed to load attendance:", err);
        alert("Failed to load attendance.");
        navigate("/attendance");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, role, navigate]);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/attendance/update/${id}`, {
      present: form.present === true || form.present === "true",
      remarks: form.remarks || "",
    });
      alert("✅ Attendance updated successfully!");
      navigate("/attendance");
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Failed to update attendance.");
    }
  };

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <div className="attendance-container">
      <h2>Edit Attendance</h2>
      <form className="attendance-form" onSubmit={submit}>
        <label>Student ID</label>
        <input name="studentId" value={form.studentId} onChange={change} required readOnly />

        <label>Date</label>
        <input type="date" name="date" value={form.date} onChange={change} required />

        <label>Status</label>
        <select name="present" value={form.present} onChange={change}>
          <option value={true}>Present</option>
          <option value={false}>Absent</option>
        </select>

        <label>Remarks</label>
        <input name="remarks" value={form.remarks} onChange={change} />

        <button type="submit" className="btn-save">
          Save
        </button>
      </form>
    </div>
  );
}
