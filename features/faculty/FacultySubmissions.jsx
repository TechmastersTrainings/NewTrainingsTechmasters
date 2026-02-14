import React, { useEffect, useState, useContext } from 'react';
import api from '../../api/api';
import { AuthContext } from '../../context/AuthContext';
import './FacultySubmissions.css';

export default function FacultySubmissions() {
  const { role } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const res = await api.get('/assignments/all');
      setAssignments(res.data);
    } catch (err) {
      console.error('Failed to load assignments', err);
    }
  };

  const loadSubmissions = async (assignmentId) => {
    setLoading(true);
    try {
      const res = await api.get(`/submissions/assignment/${assignmentId}`);
      setSubmissions(res.data);
    } catch (err) {
      console.error('Failed to load submissions', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemarkUpdate = async (submissionId) => {
    try {
      await api.put(`/submissions/${submissionId}/remarks`, { remarks });
      alert('Remarks updated successfully');
      loadSubmissions(selectedAssignment);
    } catch (err) {
      console.error('Failed to update remarks', err);
    }
  };

  if (role !== 'ROLE_FACULTY' && role !== 'ROLE_ADMIN') {
    return <p className="unauthorized">Access Denied</p>;
  }

  return (
    <div className="faculty-submissions-container">
      <h1>Faculty Dashboard - Assignment Submissions</h1>

      <div className="assignment-selector">
        <select
          value={selectedAssignment}
          onChange={(e) => {
            setSelectedAssignment(e.target.value);
            loadSubmissions(e.target.value);
          }}
        >
          <option value="">Select Assignment</option>
          {assignments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading submissions...</p>
      ) : (
        <table className="submission-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>File</th>
              <th>Submitted At</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub.id}>
                <td>{sub.studentId}</td>
                <td>
                  <a href={`http://localhost:8080/${sub.filePath}`} target="_blank" rel="noreferrer">
                    Download
                  </a>
                </td>
                <td>{new Date(sub.submittedAt).toLocaleString()}</td>
                <td>{sub.remarks || 'N/A'}</td>
                <td>
                  <input
                    type="text"
                    placeholder="Enter remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                  <button onClick={() => handleRemarkUpdate(sub.id)}>Save</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
