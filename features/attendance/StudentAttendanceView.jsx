import React, { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./Attendance.css";

export default function StudentAttendanceView() {
  const { userId } = useContext(AuthContext);
  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/attendance/student/${userId}`);
      const records = Array.isArray(res.data) ? res.data : [];
      setAttendanceData(records);

      const total = records.length;
      const present = records.filter((r) => r.present === true).length;
      const absent = total - present;
      const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

      setSummary({ total, present, absent, percentage });
    } catch (err) {
      console.error("Failed to load attendance", err);
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Pie Chart Data
  const pieData = [
    { name: "Present", value: summary.present },
    { name: "Absent", value: summary.absent },
  ];

  const COLORS = ["#00bcd4", "#ff9800"]; // Teal + Amber

  // 🔹 Group attendance by classId
  const groupByClass = (data) => {
    return data.reduce((acc, curr) => {
      const classId = curr.classId || "Unknown";
      if (!acc[classId]) acc[classId] = [];
      acc[classId].push(curr);
      return acc;
    }, {});
  };

  const groupedAttendance = groupByClass(attendanceData);

  // =============== UI ===============
  if (loading)
    return (
      <div className="page-container">
        <h2>My Attendance</h2>
        <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>
      </div>
    );

  return (
    <div className="page-container fade-in">
      <h2>My Attendance</h2>

      {/* ✅ Attendance Summary Cards */}
      <div className="attendance-summary">
        <div className="stat-card">
          <h4>Total Classes</h4>
          <p>{summary.total}</p>
        </div>
        <div className="stat-card">
          <h4>Present</h4>
          <p className="status-present">{summary.present}</p>
        </div>
        <div className="stat-card">
          <h4>Absent</h4>
          <p className="status-absent">{summary.absent}</p>
        </div>
        <div className="stat-card">
          <h4>Percentage</h4>
          <p
            style={{
              color:
                summary.percentage >= 75
                  ? "#10b981"
                  : summary.percentage >= 50
                  ? "#f59e0b"
                  : "#ef4444",
            }}
          >
            {summary.percentage}%
          </p>
        </div>
      </div>

      {/* ✅ Pie Chart - conditional render */}
      {summary.total > 0 ? (
        <div className="chart-section" style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e3640",
                  border: "1px solid #00bcd4",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p
          style={{
            textAlign: "center",
            color: "#9fb3b6",
            margin: "2rem 0 1rem 0",
            fontStyle: "italic",
          }}
        >
          📊 No attendance data yet.
        </p>
      )}

      {/* ✅ Attendance Records Table */}
      {attendanceData.length === 0 ? (
        <p style={{ textAlign: "center", color: "#9fb3b6", marginTop: "2rem" }}>
          No attendance records found.
        </p>
      ) : (
        Object.keys(groupedAttendance).map((classId) => (
          <div key={classId} className="attendance-group">
            <h3
              style={{
                marginTop: "2rem",
                color: "#00bcd4",
                borderBottom: "1px solid #2e4a52",
                paddingBottom: "0.3rem",
              }}
            >
              📘 Class ID: {classId}
            </h3>
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {groupedAttendance[classId]
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((a) => (
                    <tr key={a.id}>
                      <td>{a.date}</td>
                      <td
                        className={
                          a.present ? "status-present" : "status-absent"
                        }
                      >
                        {a.present ? "PRESENT" : "ABSENT"}
                      </td>
                      <td>{a.remarks || "—"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
