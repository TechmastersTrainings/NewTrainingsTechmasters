import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Attendance.css";

export default function AttendanceList() {
  const { role, user } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [classMap, setClassMap] = useState({}); // ✅ classId -> className map
  const [loading, setLoading] = useState(true);

  // ------------------ Load Classes ------------------
  const loadClasses = async () => {
    try {
      const res = await api.get("/classes/all");
      const map = {};
      (res.data || []).forEach((cls) => {
        map[cls.id] = cls.className;
      });
      setClassMap(map);
    } catch (err) {
      console.error("⚠️ Failed to load classes", err);
    }
  };

  // ------------------ Load Attendance ------------------
  const loadAttendance = async () => {
    try {
      setLoading(true);
      let res;

      if (role === "ROLE_ADMIN") {
        res = await api.get("/attendance/class/1"); // demo or filtered later
      } 
      else if (role === "ROLE_FACULTY") {
        const facultyId = user?.id || user?.userId || localStorage.getItem("userId");
        if (!facultyId) {
          console.warn("⚠️ Faculty ID not found");
          setLoading(false);
          return;
        }

        const facultyRes = await api.get(`/classes/faculty/${facultyId}`);
        const classes = facultyRes.data || [];
        if (classes.length === 0) {
          setRecords([]);
          setLoading(false);
          return;
        }

        res = await api.get(`/attendance/class/${classes[0].id}`);
      } 
      else if (role === "ROLE_STUDENT") {
        const studentId = user?.id || user?.userId || localStorage.getItem("userId");
        res = await api.get(`/attendance/student/${studentId}`);
      }

      setRecords(res?.data || []);
    } catch (error) {
      console.error("❌ Failed to load attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses(); // ✅ load once
    loadAttendance();
  }, [role]);

  // ------------------ RENDER ------------------
  return (
    <div className="page-container">
      <h2>Attendance Records</h2>

      {(role === "ROLE_FACULTY" || role === "ROLE_ADMIN") && (
        <Link to="/attendance/create" className="btn">
          + Add Attendance
        </Link>
      )}

      {loading ? (
        <p>Loading attendance records...</p>
      ) : records.length === 0 ? (
        <div className="no-data">No attendance records found.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              {role !== "ROLE_STUDENT" && <th>Student ID</th>}
              <th>Class</th>
              <th>Date</th>
              <th>Status</th>
              <th>Remarks</th>
              {(role === "ROLE_ADMIN" || role === "ROLE_FACULTY") && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {records.map((a, i) => (
              <tr key={a.id}>
                <td>{i + 1}</td>
                {role !== "ROLE_STUDENT" && <td>{a.studentId}</td>}
                <td>
                  {classMap[a.classId]
                    ? classMap[a.classId]
                    : `Class ${a.classId}`}
                </td>
                <td>{a.date}</td>
                <td
                  style={{
                    color: a.present ? "#16a34a" : "#ef4444",
                    fontWeight: "600",
                  }}
                >
                  {a.present ? "PRESENT" : "ABSENT"}
                </td>
                <td>{a.remarks || "—"}</td>
                {(role === "ROLE_ADMIN" || role === "ROLE_FACULTY") && (
                  <td>
                    <Link to={`/attendance/edit/${a.id}`} className="link">
                      Edit
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
