import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Grade.css";

export default function GradeList() {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  
  // Access role from Context, fallback to localStorage to prevent sync issues
  const { role: contextRole } = useContext(AuthContext);
  const role = contextRole || localStorage.getItem("role");

  const isAdminOrFaculty = role === "ROLE_ADMIN" || role === "ROLE_FACULTY";

  useEffect(() => {
    // Debugging log to confirm correct component and role are loaded
    console.log("GradeList Loaded. Current Role:", role);
    loadGrades();
    loadStudents();
  }, [role]);

  const loadGrades = async () => {
    try {
      const res = await api.get("/grades/all");
      setGrades(res.data);
    } catch (err) {
      console.error("Failed to load grades", err);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await api.get("/students/all");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to load students", err);
    }
  };

  const getStudentDetails = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student
      ? {
          name: student.fullName || "N/A",
          usn: student.usn || student.rollNumber || "N/A",
        }
      : { name: "N/A", usn: "N/A" };
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this grade?")) return;
    try {
      await api.delete(`/grades/${id}`);
      loadGrades();
    } catch (err) {
      console.error("Error deleting grade", err);
    }
  };

  return (
    <div className="grade-list-container">
      <div className="header-flex">
        <h2>Grades Management</h2>

        {isAdminOrFaculty && (
          <button className="add-btn" onClick={() => navigate("/grades/create")}>
            + Add Grade
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="grade-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>USN</th>
              <th>Subject</th>
              <th>Marks Obtained</th>
              <th>Max Marks</th>
              <th>Remarks</th>
              {isAdminOrFaculty && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {grades.length > 0 ? (
              grades.map((g) => {
                const student = getStudentDetails(g.studentId);
                return (
                  <tr key={g.id}>
                    <td>{student.name}</td>
                    <td>{student.usn}</td>
                    <td>{g.subject}</td>
                    <td>{g.marksObtained}</td>
                    <td>{g.maxMarks}</td>
                    <td>{g.remarks || "-"}</td>
                    {isAdminOrFaculty && (
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => navigate(`/grades/edit/${g.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(g.id)}
                          style={{ marginLeft: "10px" }}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={isAdminOrFaculty ? 7 : 6} style={{ textAlign: "center" }}>
                  No grades found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}