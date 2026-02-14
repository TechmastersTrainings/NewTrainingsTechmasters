import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./StudentProfile.css";

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get(`/profile/${userId}`);
        if (!res.data) return navigate("/profile/create");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
        // Optional: Redirect to create if 404
        // navigate("/profile/create");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [userId, navigate]);

  const normalizeList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return val.split(",").map((v) => v.trim()).filter(Boolean);
  };

  const downloadResume = () => {
    window.open(`http://localhost:8080/profile/resume/${userId}`, "_blank");
  };

  if (loading) return <div className="loading-spinner">Loading Profile...</div>;
  if (!profile) return <div className="profile-container"><p>Profile not found.</p></div>;

  // Helper to render section cards
  const SectionCard = ({ title, items, emptyMsg }) => (
    <div className="card card-padding">
      <h2>{title}</h2>
      {items.length > 0 ? (
        <ul className="tags-list">
          {items.map((item, i) => (
            <li key={i} className="tag">{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">{emptyMsg}</p>
      )}
    </div>
  );

  return (
    <div className="profile-container">
      {/* Header Card */}
      <div className="card profile-header-card">
        <div className="banner"></div>
        <div className="avatar-wrapper">
          <img
            src={`http://localhost:8080/profile/photo/${userId}`}
            alt="Profile"
            className="avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
            }}
          />
        </div>

        <h1 className="profile-name">{profile.user?.fullName || "Student Name"}</h1>
        <p className="profile-email-contact">{profile.user?.email}</p>
        
        {/* URLs / Portfolio Links could go here */}
        <div style={{ margin: '10px 0' }}>
            {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" style={{margin:'0 5px'}}>LinkedIn</a>}
            {profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noreferrer" style={{margin:'0 5px'}}>GitHub</a>}
        </div>

        <div className="profile-actions">
          <button onClick={() => navigate("/profile/edit")} className="btn btn-primary">
            Edit Profile
          </button>
          <button onClick={downloadResume} className="btn btn-secondary">
            Download Resume
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="card card-padding">
        <h2>About</h2>
        <p style={{ whiteSpace: "pre-wrap" }}>
          {profile.about || "Write a brief description about yourself to showcase your personality."}
        </p>
      </div>

      {/* Dynamic Sections */}
      <SectionCard 
        title="Skills" 
        items={normalizeList(profile.skills)} 
        emptyMsg="Add skills to show what you know." 
      />
      <SectionCard 
        title="Projects" 
        items={normalizeList(profile.projects)} 
        emptyMsg="Showcase your best work here." 
      />
      <SectionCard 
        title="Internships" 
        items={normalizeList(profile.internHistory)} 
        emptyMsg="No internship history added." 
      />
      <SectionCard 
        title="Certifications" 
        items={normalizeList(profile.certifications)} 
        emptyMsg="List your certifications here." 
      />
      
      {/* Combined Hobbies & Interests */}
      <div className="card card-padding">
        <h2>Hobbies & Interests</h2>
        <ul className="tags-list">
          {[...normalizeList(profile.hobbies), ...normalizeList(profile.interests)].length > 0 ? (
            [...normalizeList(profile.hobbies), ...normalizeList(profile.interests)].map((item, i) => (
              <li key={i} className="tag">{item}</li>
            ))
          ) : (
            <p>No hobbies added.</p>
          )}
        </ul>
      </div>
    </div>
  );
}