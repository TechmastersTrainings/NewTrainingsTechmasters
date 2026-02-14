// src/features/grades/MyGrades.jsx
import React, { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext"; // Import your AuthContext
import "./Grade.css"; 

export default function MyGrades() {
  // Assuming AuthContext provides the logged-in user's ID
  const { userId, role } = useContext(AuthContext); 
  const [grades, setGrades] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "ROLE_STUDENT" || !userId) {
      setLoading(false);
      return;
    }
    
    // Fetch all necessary data
    const loadStudentData = async () => {
        try {
            // 1. Fetch Student Details
            const studentRes = await api.get(`/students/${userId}`);
            setStudent(studentRes.data);
            
            // 2. Fetch Grades (Assuming backend filters by student ID)
            // ⚠️ If your backend DOES NOT have `/grades/student/{id}`, 
            // you must change this to: api.get("/grades/all") and filter below.
            const gradesRes = await api.get(`/grades/student/${userId}`); 
            setGrades(gradesRes.data);
            
        } catch (err) {
            console.error("Failed to load student data", err);
        } finally {
            setLoading(false);
        }
    };
    
    loadStudentData();
  }, [userId, role]);

  if (loading) return <div className="loading-message">Loading your grades...</div>;
  if (role !== "ROLE_STUDENT") return <div className="unauthorized">Access Denied: Only students can view this page.</div>;

  return (
    <div className="grade-list-container">
      <h2>My Academic Performance</h2>
      
      {student && (
          <div className="student-info-card">
              <p><strong>Student Name:</strong> {student.fullName}</p>
              <p><strong>ID/USN:</strong> {student.usn || student.rollNumber}</p>
          </div>
      )}

      <div className="table-wrapper">
        <table className="grade-table student-view">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks Obtained</th>
              <th>Max Marks</th>
              <th>Percentage</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {grades.length > 0 ? (
              grades.map((g) => {
                const percentage = g.maxMarks > 0 
                  ? ((g.marksObtained / g.maxMarks) * 100).toFixed(2) + '%'
                  : 'N/A';
                  
                return (
                  <tr key={g.id}>
                    <td>{g.subject}</td>
                    <td>{g.marksObtained}</td>
                    <td>{g.maxMarks}</td>
                    <td><span className={percentage >= '75' ? 'grade-high' : percentage >= '50' ? 'grade-mid' : 'grade-low'}>{percentage}</span></td>
                    <td>{g.remarks || "-"}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No grades recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}