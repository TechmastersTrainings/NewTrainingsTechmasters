import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./AssignmentSubmissions.css";

export default function AssignmentSubmissionsList() {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      await loadStudents();
      await loadSubmissions();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentId]);

  const loadStudents = async () => {
    try {
      const res = await api.get("/students/all");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to load students", err);
    }
  };

  const loadSubmissions = async () => {
    try {
      const res = await api.get(`/submissions/assignment/${assignmentId}`);
      setSubmissions(res.data);
    } catch (err) {
      console.error("Failed to load submissions", err);
    }
  };

  const getStudentDetails = (studentId) => {
    const s = students.find((stu) => stu.id === studentId);
    if (!s) return { name: "Unknown", usn: "N/A" };
    return {
      name: s.fullName || "Unnamed Student",
      usn: s.usn || s.rollNumber || "N/A",
    };
  };

  return (
    <div className="submission-container">
      <h2>📘 Assignment Submissions</h2>

      <button onClick={() => navigate("/assignments")} className="back-btn">
        ← Back to Assignments
      </button>

      <div className="table-wrapper">
        <table className="submission-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>USN / Roll No</th>
              <th>Submitted File</th>
              <th>Submitted On</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  No submissions found for this assignment
                </td>
              </tr>
            ) : (
              submissions.map((sub) => {
                const { name, usn } = getStudentDetails(sub.studentId);
                return (
                  <tr key={sub.id}>
                    <td>{name}</td>
                    <td>{usn}</td>
                    <td>
                      {sub.fileUrl ? (
                        <a
                          href={`http://localhost:8080/submissions/file/${sub.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="view-btn"
                        >
                          View File
                        </a>
                      ) : (
                        "No File"
                      )}
                    </td>
                    <td>
                      {sub.submittedAt
                        ? new Date(sub.submittedAt).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>{sub.remarks || "-"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
