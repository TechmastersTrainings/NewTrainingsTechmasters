import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Assignment.css";

export default function AssignmentList() {
  const { role, userId } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      await loadClasses();
      await loadFaculty();
      if (role === "ROLE_FACULTY") {
        await loadAssignmentsForFaculty();
      } else {
        await loadAssignments();
      }
      if (role === "ROLE_STUDENT") {
        await loadSubmissions();
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, userId]);

  const loadAssignments = async () => {
    try {
      const res = await api.get("/assignments/all");
      setAssignments(res.data || []);
    } catch (err) {
      console.error("Failed to load assignments", err);
      setAssignments([
        {
          id: 1,
          title: "Mock Assignment",
          classId: 1,
          facultyId: 1,
          description: "Backend offline — mock data",
          dueDate: new Date().toISOString(),
          attachmentUrl: null,
        },
      ]);
    }
  };

  const loadAssignmentsForFaculty = async () => {
    try {
      const res = await api.get(`/assignments/faculty/user/${userId}`);
      setAssignments(res.data || []);
    } catch (err) {
      console.error("Failed to load faculty assignments", err);
      setAssignments([
        {
          id: 1,
          title: "Faculty Mock Assignment",
          classId: 1,
          facultyId: userId,
          description: "Mock assignment (offline mode)",
          dueDate: new Date().toISOString(),
        },
      ]);
    }
  };

  const loadClasses = async () => {
    try {
      const res = await api.get("/classes/all");
      setClasses(res.data || []);
    } catch (err) {
      console.error("Failed to load classes", err);
      setClasses([{ id: 1, className: "Mock Class" }]);
    }
  };

  const loadFaculty = async () => {
    try {
      const res = await api.get("/faculty/all");
      setFaculty(res.data || []);
    } catch (err) {
      console.error("Failed to load faculty", err);
      setFaculty([{ id: 1, fullName: "Mock Faculty" }]);
    }
  };

  const loadSubmissions = async () => {
    try {
      const res = await api.get(`/submissions/student/${userId}`);
      setSubmissions(res.data || []);
    } catch (err) {
      console.error("Failed to load submissions", err);
      setSubmissions([]);
    }
  };

  const getClassName = (id) =>
    classes.find((c) => c.id === id)?.className || `Class ${id}`;
  const getFacultyName = (id) =>
    faculty.find((f) => f.id === id)?.fullName || `Faculty ${id}`;
  const hasSubmitted = (id) =>
    submissions.some((s) => s.assignmentId === id);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this assignment?")) {
      try {
        await api.delete(`/assignments/${id}`);
        role === "ROLE_FACULTY"
          ? await loadAssignmentsForFaculty()
          : await loadAssignments();
      } catch (err) {
        console.error("Failed to delete assignment", err);
      }
    }
  };

  const handleSubmit = async (assignmentId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("assignmentId", assignmentId);
    data.append("studentId", userId);
    data.append("file", file);

    try {
      await api.post("/submissions/submit", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Submission successful");
      await loadSubmissions();
    } catch (err) {
      console.error("Failed to submit", err);
      alert("❌ Error during submission");
    }
  };

  const viewSubmissions = (assignmentId) => {
    navigate(`/assignments/${assignmentId}/submissions`);
  };

  return (
    <div className="assignment-container">
      <h1 className="assignment-title">Assignments</h1>

      {(role === "ROLE_ADMIN" || role === "ROLE_FACULTY") && (
        <button
          onClick={() => navigate("/assignments/create")}
          className="add-btn"
        >
          + Add Assignment
        </button>
      )}

      <div className="table-wrapper">
        <table className="assignment-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Class</th>
              <th>Faculty</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Attachment</th>
              {role === "ROLE_STUDENT" && (
                <>
                  <th>Status</th>
                  <th>Submit</th>
                </>
              )}
              {(role === "ROLE_ADMIN" || role === "ROLE_FACULTY") && (
                <th>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No assignments found
                </td>
              </tr>
            ) : (
              assignments.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{getClassName(a.classId)}</td>
                  <td>{getFacultyName(a.facultyId)}</td>
                  <td>{a.description}</td>
                  <td>{new Date(a.dueDate).toLocaleDateString()}</td>
                  <td>
                    {a.attachmentUrl ? (
                      <a
                        href={`http://localhost:8080/assignments/files/${a.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View File
                      </a>
                    ) : (
                      "No File"
                    )}
                  </td>

                  {role === "ROLE_STUDENT" && (
                    <>
                      <td>
                        {hasSubmitted(a.id) ? (
                          <span className="submitted">✅ Submitted</span>
                        ) : (
                          <span className="pending">❌ Pending</span>
                        )}
                      </td>
                      <td>
                        {!hasSubmitted(a.id) && (
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.png"
                            onChange={(e) => handleSubmit(a.id, e)}
                          />
                        )}
                      </td>
                    </>
                  )}

                  {(role === "ROLE_ADMIN" || role === "ROLE_FACULTY") && (
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/assignments/edit/${a.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(a.id)}
                      >
                        Delete
                      </button>
                      {role === "ROLE_FACULTY" && (
                        <button
                          className="view-btn"
                          onClick={() => viewSubmissions(a.id)}
                        >
                          View Submissions
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
