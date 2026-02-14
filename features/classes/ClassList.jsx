import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Class.css";

export default function ClassList() {
  const { role, userId } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      let res;

      // ✅ Faculty sees only their own classes
      if (role === "ROLE_FACULTY") {
        res = await api.get(`/classes/faculty/${userId}`);
      }
      // ✅ Admin sees all classes
      else if (role === "ROLE_ADMIN") {
        res = await api.get(`/classes/all`);
      }
      // 🚫 Students shouldn't access class management
      else {
        setClasses([]);
        return;
      }

      setClasses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load classes", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await api.delete(`/classes/delete/${id}`);
        loadClasses();
      } catch (err) {
        console.error("Delete failed", err);
        alert("Could not delete class. Check console.");
      }
    }
  };

  return (
    <div className="class-container">
      <div
        className="header-flex"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Class Management</h1>

        {(role === "ROLE_FACULTY" || role === "ROLE_ADMIN") && (
          <button
            onClick={() => navigate("/classes/create")}
            className="add-btn"
          >
            + Create New Class
          </button>
        )}
      </div>

      <div className="class-grid">
        {classes.length > 0 ? (
          classes.map((cls) => (
            <div key={cls.id} className="class-card">
              <h3>{cls.className || "Unnamed Class"}</h3>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                  color: "#4b5563",
                }}
              >
                <span>
                  <strong>📍 Room:</strong> {cls.roomNumber || "N/A"}
                </span>
                <span>
                  <strong>👥 Cap:</strong> {cls.capacity || "0"}
                </span>
              </div>

              <p
                style={{
                  backgroundColor: "#f3f4f6",
                  padding: "8px",
                  borderRadius: "6px",
                  color: "#1f2937",
                  marginBottom: "20px",
                }}
              >
                <strong>Faculty:</strong>{" "}
                {cls.facultyName || cls.facultyId || "Not Assigned"}
              </p>

              <div className="card-actions">
                <button
                  onClick={() => navigate(`/classes/dashboard/${cls.id}`)}
                  className="view-btn"
                >
                  Enter Classroom
                </button>

                {(role === "ROLE_FACULTY" || role === "ROLE_ADMIN") && (
                  <>
                    <button
                      onClick={() => navigate(`/classes/edit/${cls.id}`)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cls.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-posts" style={{ gridColumn: "1 / -1" }}>
            <p>No classes found. Please create one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
