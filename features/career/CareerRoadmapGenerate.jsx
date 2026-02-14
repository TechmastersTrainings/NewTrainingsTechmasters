import React, { useContext, useState } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./career.css";

export default function CareerRoadmapGenerate() {
  const { user } = useContext(AuthContext);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await api.post(`/career-roadmap/generate/${user.id}`);
      setRoadmap(res.data);
      alert("Career roadmap generated successfully!");
    } catch (err) {
      console.error("Failed to generate roadmap:", err);
      alert("Failed to generate roadmap. Please ensure you have skills added.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Generate AI Career Roadmap</h2>

      {!roadmap ? (
        <div className="center-box">
          <p>
            Click below to generate a personalized roadmap based on your current skills.
          </p>
          <button onClick={handleGenerate} className="btn" disabled={loading}>
            {loading ? "Generating..." : "Generate Roadmap"}
          </button>
        </div>
      ) : (
        <div className="roadmap-card">
          <h3>🎯 Suggested Role: {roadmap.suggestedRole}</h3>

          <p><strong>Recommended Courses:</strong> {roadmap.recommendedCourses}</p>
          <p><strong>Certifications:</strong> {roadmap.recommendedCertifications}</p>
          <p><strong>Future Skills to Learn:</strong> {roadmap.futureSkills}</p>
          <p><strong>Generated on:</strong> {roadmap.generatedDate}</p>

          <button className="btn" onClick={() => navigate("/career-roadmap")}>
            Back to Roadmaps
          </button>
        </div>
      )}
    </div>
  );
}
