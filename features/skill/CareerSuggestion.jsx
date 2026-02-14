import React, { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./skill.css";

export default function CareerSuggestion() {
  const { userId } = useContext(AuthContext);
  const [careerData, setCareerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSuggestions = async () => {
    try {
      const res = await api.get(`/career/suggest/${userId}`);
      setCareerData(res.data);
    } catch (err) {
      console.error("Failed to load career suggestions", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!careerData) return <p>No data found.</p>;

  return (
    <div className="career-container fade-in">
      <h1>🎯 Career Suggestions</h1>
      <p>Based on your skills, here’s what we suggest for you!</p>

      <div className="career-box">
        <h3>Recommended Careers</h3>
        <ul>
          {careerData.suggestedCareers?.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      <div className="career-box">
        <h3>Recommended Certifications</h3>
        <ul>
          {careerData.recommendedCertifications?.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      <p className="analyzed-info">
        Analyzed {careerData.totalSkillsAnalyzed} of your skills.
      </p>
    </div>
  );
}
