import React, { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./career.css";

export default function CareerRoadmapList() {
  const { role, user } = useContext(AuthContext);
  const [roadmaps, setRoadmaps] = useState([]);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      let res;
      if (role === "ROLE_ADMIN" || role === "ROLE_FACULTY") {
        res = await api.get("/career-roadmap/all");
      } else if (role === "ROLE_STUDENT") {
        res = await api.get(`/career-roadmap/student/${user.id}`);
      }
      setRoadmaps(res.data);
    } catch (err) {
      console.error("Failed to load career roadmaps:", err);
      alert("Unable to load career roadmaps.");
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = () => {
    navigate("/career-roadmap/generate");
  };

  return (
    <div className="page-container">
      <div className="header-row">
        <h2>AI Career Roadmap</h2>
        {role === "ROLE_STUDENT" && (
          <button className="btn" onClick={handleGenerate}>
            Generate My Roadmap
          </button>
        )}
      </div>

      {roadmaps.length === 0 ? (
        <p>No roadmaps found yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              {(role === "ROLE_ADMIN" || role === "ROLE_FACULTY") && <th>Student ID</th>}
              <th>Suggested Role</th>
              <th>Courses</th>
              <th>Certifications</th>
              <th>Future Skills</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {roadmaps.map((r) => (
              <tr key={r.id}>
                {(role === "ROLE_ADMIN" || role === "ROLE_FACULTY") && (
                  <td>{r.studentId}</td>
                )}
                <td>{r.suggestedRole}</td>
                <td>{r.recommendedCourses}</td>
                <td>{r.recommendedCertifications}</td>
                <td>{r.futureSkills}</td>
                <td>{r.generatedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
