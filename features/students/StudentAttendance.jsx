import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentAttendance({ studentId }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`/attendance/student/${studentId}`);
        setRecords(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [studentId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 16 }}>
      <h3>My Attendance</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Date</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Status</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id}>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>{r.date}</td>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>{r.status}</td>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>{r.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
