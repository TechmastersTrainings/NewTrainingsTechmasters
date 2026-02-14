import React, { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./AssignmentSubmissions.css";

export default function AssignmentSubmissionView() {
  const { userId } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    loadMySubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadMySubmissions = async () => {
    try {
      const res = await api.get(`/submissions/student/${userId}`);
      setSubmissions(res.data);
    } catch (err) {
      console.error("Failed to load student submissions", err);
    }
  };

  const viewFile = (id) => {
    window.open(`http://localhost:8080/submissions/file/${id}`, "_blank");
  };

  return (
    <div className="submission-container">
      <h2>My Assignment Submissions</h2>

      {submissions.length === 0 ? (
        <p className="no-data">You have not submitted any assignments yet.</p>
      ) : (
        <table className="submission-table">
          <thead>
            <tr>
              <th>Assignment ID</th>
              <th>File</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id}>
                <td>{s.assignmentId}</td>
                <td>
                  <button className="view-btn" onClick={() => viewFile(s.id)}>
                    View File
                  </button>
                </td>
                <td>{new Date(s.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
