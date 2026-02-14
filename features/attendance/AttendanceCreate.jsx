import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "./Attendance.css";

export default function AttendanceCreate() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    studentId: "",
    date: new Date().toISOString().slice(0, 10),
    present: true,
    remarks: "",
  });

  const [loadingStudents, setLoadingStudents] = useState(false);

  const loadStudents = async () => {
    setLoadingStudents(true);
    try {
      const res = await api.get("/students/all");
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error loading students:", error);
      alert("❌ Failed to load students.");
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "studentId" ? parseInt(value) : value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.studentId) return alert("Please select a student.");

    // ✅ Prevent marking attendance for future or past dates
    const today = new Date().toISOString().slice(0, 10);
    if (form.date !== today) {
      alert("Attendance can only be marked for today's date.");
      return;
    }

    try {
      await api.post("/attendance/mark", [
        {
          studentId: form.studentId,
          classId: students.find((s) => s.id === form.studentId)?.classId,
          date: form.date,
          present: form.present === true || form.present === "true",
          remarks: form.remarks,
        },
      ]);
      alert("✅ Attendance added successfully!");
      window.location.href = "/attendance";
    } catch (error) {
      console.error("Failed to save attendance:", error);
      alert("❌ Error saving attendance.");
    }
  };

  return (
    <div className="page-container">
      <h2>Add Attendance</h2>

      <form className="form-container" onSubmit={submit}>
        <label>Select Student</label>
        <select
          name="studentId"
          value={form.studentId}
          onChange={change}
          required
          disabled={loadingStudents}
        >
          <option value="">
            {loadingStudents ? "Loading Students..." : "Select Student"}
          </option>
          {!loadingStudents &&
            students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} — {s.rollNumber || "N/A"}
              </option>
            ))}
        </select>

        <label>Date</label>
        <input type="date" name="date" value={form.date} onChange={change} required />

        <label>Status</label>
        <select name="present" value={form.present} onChange={change}>
          <option value={true}>Present</option>
          <option value={false}>Absent</option>
        </select>

        <label>Remarks</label>
        <input
          type="text"
          name="remarks"
          value={form.remarks}
          onChange={change}
          placeholder="Reason (optional)"
        />

        <button type="submit" className="btn">
          Save Attendance
        </button>
      </form>
    </div>
  );
}
