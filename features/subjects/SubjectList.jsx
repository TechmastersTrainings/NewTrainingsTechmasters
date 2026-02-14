import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import "./Subject.css";

export default function SubjectList() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const res = await api.get("/subject/all");
      setSubjects(res.data);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
      alert("Unable to load subjects. Check backend connection.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await api.delete(`/subject/${id}`);
      loadSubjects();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete subject.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>📚 Subjects</h2>
        <Link to="/subjects/create" className="btn btn-primary">
          ➕ Add Subject
        </Link>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Subject Name</th>
            <th>Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.length > 0 ? (
            subjects.map((sub) => (
              <tr key={sub.id}>
                <td>{sub.id}</td>
                <td>{sub.name}</td>
                <td>{sub.code || "-"}</td>
                <td>
                  <Link to={`/subjects/edit/${sub.id}`} className="btn btn-sm btn-info">
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(sub.id)}
                    className="btn btn-sm btn-danger"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No subjects found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
