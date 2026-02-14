import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "./Grading.css";

export default function GradingDashboard() {
  const [assignmentId, setAssignmentId] = useState("");
  const [grades, setGrades] = useState([]);
  const [selected, setSelected] = useState(null);

  const loadGrades = async () => {
    if (!assignmentId) return;
    try {
      const res = await api.get(`/grading/assignment/${assignmentId}`);
      setGrades(res.data);
    } catch (err) {
      console.error("Failed to load grades", err);
    }
  };

  const handleUpdate = async () => {
    if (!selected) return;
    try {
      await api.put(
        `/grading/update/${selected.id}?finalScore=${selected.finalScore}&feedback=${selected.feedback}`
      );
      alert("Grade updated successfully");
      loadGrades();
    } catch (err) {
      console.error("Failed to update grade", err);
    }
  };

  return (
    <div className="grading-container">
      <h1>🧾 Assignment Grading</h1>

      <div className="grading-controls">
        <input
          type="text"
          placeholder="Enter Assignment ID"
          value={assignmentId}
          onChange={(e) => setAssignmentId(e.target.value)}
        />
        <button onClick={loadGrades}>Load Grades</button>
      </div>

      <table className="grading-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>AI Score</th>
            <th>Final Score</th>
            <th>Feedback</th>
            <th>Reviewed</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((g) => (
            <tr key={g.id}>
              <td>{g.studentId}</td>
              <td>{g.aiScore?.toFixed(1)}</td>
              <td>{g.finalScore?.toFixed(1)}</td>
              <td>{g.feedback}</td>
              <td>{g.reviewedByFaculty ? "✅" : "❌"}</td>
              <td>
                <button onClick={() => setSelected(g)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="grade-edit-modal">
          <h3>Edit Grade</h3>
          <input
            type="number"
            value={selected.finalScore}
            onChange={(e) =>
              setSelected({ ...selected, finalScore: e.target.value })
            }
          />
          <textarea
            value={selected.feedback}
            onChange={(e) =>
              setSelected({ ...selected, feedback: e.target.value })
            }
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setSelected(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
