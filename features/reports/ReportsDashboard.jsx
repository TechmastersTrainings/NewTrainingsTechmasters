import React, { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Reports.css";

export default function ReportsDashboard() {
  const { role } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReportSummary = async () => {
      try {
        const res = await api.get("/reports/summary");
        setSummary(res.data);
      } catch (err) {
        console.error("Failed to fetch reports summary:", err);
      } finally {
        setLoading(false);
      }
    };
    loadReportSummary();
  }, []);

  if (loading) return <div className="reports-loading">Loading reports...</div>;

  return (
    <div className="reports-dashboard">
      <h1 className="reports-title">
        {role === "ROLE_ADMIN"
          ? "Institution Reports Dashboard"
          : "My Academic Report"}
      </h1>

      <div className="reports-grid">
        {/* --- Total Students --- */}
        {role === "ROLE_ADMIN" && (
          <div className="report-card blue-gradient">
            <h3>Total Students</h3>
            <p className="report-value">{summary?.totalStudents || 0}</p>
            <span className="report-label">Active Enrollments</span>
          </div>
        )}

        {/* --- Average Grade --- */}
        <div className="report-card purple-gradient">
          <h3>Average Grade</h3>
          <p className="report-value">
            {summary?.averageGrade
              ? summary.averageGrade.toFixed(2) + "%"
              : "N/A"}
          </p>
          <span className="report-label">Across all students</span>
        </div>

        {/* --- Attendance Percentage --- */}
        <div className="report-card green-gradient">
          <h3>Average Attendance</h3>
          <p className="report-value">
            {summary?.attendancePercent
              ? summary.attendancePercent.toFixed(2) + "%"
              : "N/A"}
          </p>
          <span className="report-label">Overall attendance rate</span>
        </div>

        {/* --- Total Fees --- */}
        {role === "ROLE_ADMIN" && (
          <div className="report-card orange-gradient">
            <h3>Fees Collected</h3>
            <p className="report-value">
              ₹{summary?.totalFeesCollected?.toLocaleString() || 0}
            </p>
            <span className="report-label">Total collected revenue</span>
          </div>
        )}
      </div>

      <div className="reports-footer">
        <p>
          {role === "ROLE_ADMIN"
            ? "Data updated daily from student, attendance, and finance systems."
            : "View your latest performance insights below."}
        </p>
      </div>
    </div>
  );
}
