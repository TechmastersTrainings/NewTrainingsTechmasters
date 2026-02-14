//src/features/exams/ExamList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import "./Exam.css";

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const res = await api.get("/exams/all");
      setExams(res.data);
    } catch (err) {
      console.error("Failed to fetch exams:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    try {
      await api.delete(`/exams/${id}`);
      loadExams();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete exam.");
    }
  };

  if (loading) return <div className="loading">Loading exams...</div>;

  return (
    <div className="page-container">
      <h2>📝 Exam List</h2>
      <Link to="/exams/create" className="btn">
        + Schedule New Exam
      </Link>

      <div className="table-responsive-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Class ID</th>
              <th>Date</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.length > 0 ? (
              exams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.id}</td>
                  <td>{exam.subject}</td>
                  <td>{exam.classId}</td>
                  <td>{exam.examDate}</td>
                  <td>{exam.examType}</td>
                  <td>{exam.active ? "Active" : "Inactive"}</td>
                  <td>
                    <Link to={`/exams/edit/${exam.id}`} className="link">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(exam.id)}
                      className="del-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No exams scheduled.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
