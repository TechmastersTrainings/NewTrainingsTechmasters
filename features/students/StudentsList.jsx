import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Student.css";

export default function StudentList() {
  const { role } = useContext(AuthContext);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await api.get("/students/all");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      alert("Error loading student data.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await api.delete(`/students/${id}`);
      loadStudents();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete student.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>🎓 Student Directory</h2>
        {(role === "ROLE_ADMIN" || role === "ROLE_FACULTY") && (
          <Link to="/students/create" className="btn btn-primary">
            ➕ Add Student
          </Link>
        )}
      </div>

      <div className="table-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Roll No</th>
              <th>USN</th>
              <th>Class</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Parent Contact</th>
              <th>Admission Date</th>
              <th>Status</th>
              {(role === "ROLE_ADMIN" || role === "ROLE_FACULTY") && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((s, index) => (
                <tr key={s.id}>
                  <td>{index + 1}</td>
                  <td>{s.fullName}</td>
                  <td>{s.rollNumber}</td>
                  <td>{s.usn || "-"}</td>
                  <td>{s.className}</td>
                  <td>{s.email}</td>
                  <td>{s.gender}</td>
                  <td>{s.phone}</td>
                  <td>{s.parentContact}</td>
                  <td>{s.admissionDate || "-"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        s.active ? "active" : "inactive"
                      }`}
                    >
                      {s.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  {(role === "ROLE_ADMIN" || role === "ROLE_FACULTY") && (
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/students/edit/${s.id}`}
                          className="btn btn-sm btn-info"
                        >
                          ✏️ Edit
                        </Link>
                        {role === "ROLE_ADMIN" && (
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="btn btn-sm btn-danger"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" style={{ textAlign: "center" }}>
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
