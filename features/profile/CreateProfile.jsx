import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import "./StudentProfile.css";

export default function CreateProfile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [form, setForm] = useState({
    about: "",
    skills: [],
    projects: [],
    internHistory: [],
    certifications: [],
    hobbies: [],
    interests: [],
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
  });

  // Simple comma-separated handler for rapid creation
  const handleArrayChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val.split(",").map(v => v.trim()) }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/profile/${userId}`, form);
      navigate("/profile");
    } catch (err) {
      console.error("Failed to create", err);
      alert("Error creating profile");
    }
  };

  return (
    <div className="profile-container">
      <div className="card card-padding">
        <h1>Create Your Profile</h1>
        <p className="text-muted">Let's get you set up. You can edit these details later.</p>
        
        <form onSubmit={submit} className="form-section" style={{marginTop:'2rem'}}>
            <div className="form-group">
                <label>About</label>
                <textarea name="about" onChange={handleChange} placeholder="Write a short bio..." />
            </div>

            <div className="form-group">
                <label>Skills (Comma separated)</label>
                <input onChange={(e) => handleArrayChange("skills", e.target.value)} placeholder="Java, React, SQL..." />
            </div>

            <div className="form-group">
                <label>Projects (Comma separated)</label>
                <input onChange={(e) => handleArrayChange("projects", e.target.value)} placeholder="E-commerce App, Portfolio..." />
            </div>

            <div className="form-group">
                <label>Internships (Comma separated)</label>
                <input onChange={(e) => handleArrayChange("internHistory", e.target.value)} placeholder="Company A, Company B..." />
            </div>

            <div className="form-group">
                <label>LinkedIn URL</label>
                <input name="linkedinUrl" onChange={handleChange} />
            </div>

            <button type="submit" className="btn btn-primary">Create Profile</button>
        </form>
      </div>
    </div>
  );
}