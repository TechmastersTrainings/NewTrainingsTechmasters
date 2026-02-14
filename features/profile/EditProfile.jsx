import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './StudentProfile.css';

export default function EnhancedEditProfile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    about: '',
    skills: [],
    projects: [],
    internHistory: [],
    certifications: [],
    hobbies: [],
    interests: [],
    achievements: [],
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
  });

  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get(`/profile/${userId}`);
      if (res.data) {
        const p = res.data;
        setForm({
          about: p.about || '',
          skills: p.skills || [],
          projects: p.projects || [],
          internHistory: p.internHistory || [],
          certifications: p.certifications || [],
          hobbies: p.hobbies || [],
          interests: p.interests || [],
          achievements: p.achievements || [],
          githubUrl: p.githubUrl || '',
          linkedinUrl: p.linkedinUrl || '',
          portfolioUrl: p.portfolioUrl || '',
        });
        setProfilePicUrl(p.profilePicUrl || '');
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
        setLoading(false);
    }
  };

  const handleUpload = async (type) => {
    const file = type === 'photo' ? profilePicFile : resumeFile;
    if (!file) return alert('Please select a file first.');
    const data = new FormData();
    data.append('file', file);
    try {
      await api.post(`/profile/upload/${type}/${userId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(`${type === 'photo' ? 'Photo' : 'Resume'} uploaded!`);
      if (type === 'photo') loadProfile(); // Refresh for photo
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Helper for List inputs
  const addToList = (field, inputId) => {
    const input = document.getElementById(inputId);
    const value = input.value.trim();
    if (!value) return;
    setForm((prev) => ({ ...prev, [field]: [...prev[field], value] }));
    input.value = '';
  };

  const removeFromList = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/profile/${userId}`, form);
      navigate('/profile');
    } catch (err) {
      console.error('Save failed', err);
      alert("Failed to save profile.");
    }
  };

  if(loading) return <div className="loading-spinner">Loading...</div>

  return (
    <div className="profile-container">
      <div className="card profile-header-card">
        <div className="banner"></div>
        
        {/* Avatar with Edit Overlay */}
        <div className="edit-avatar-container">
          <img
            src={profilePicUrl ? `http://localhost:8080${profilePicUrl}` : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
            alt="Profile"
            className="avatar"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }}
          />
          <div className="overlay-actions">
             <label htmlFor="photo-upload" className="icon-btn">Change Photo</label>
             <input 
                id="photo-upload" 
                type="file" 
                hidden 
                onChange={(e) => {
                    setProfilePicFile(e.target.files[0]);
                    // Auto upload trigger or show a 'Save' button logic here
                }} 
             />
             {profilePicFile && <button className="icon-btn" onClick={() => handleUpload('photo')}>Confirm Upload</button>}
          </div>
        </div>

        <h2>Edit Profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="form-section">
        
        {/* Basic Info */}
        <div className="card card-padding">
          <div className="form-group">
            <label>About Me</label>
            <textarea name="about" value={form.about} onChange={handleChange} placeholder="Tell us about yourself..." />
          </div>
        </div>

        {/* Dynamic List Fields */}
        {['skills', 'projects', 'internHistory', 'certifications', 'achievements'].map((field) => (
          <div className="card card-padding" key={field}>
             <div className="form-group">
                <label style={{textTransform:'capitalize'}}>{field.replace(/([A-Z])/g, ' $1')}</label>
                <div className="input-group">
                  <input type="text" id={`input-${field}`} placeholder={`Add ${field}...`} />
                  <button type="button" className="btn btn-primary btn-add" onClick={() => addToList(field, `input-${field}`)}>Add</button>
                </div>
                <ul className="tags-list" style={{marginTop:'10px'}}>
                  {form[field].map((item, i) => (
                    <li key={i} className="tag">
                      {item}
                      <span className="remove-icon" onClick={() => removeFromList(field, i)}>×</span>
                    </li>
                  ))}
                </ul>
             </div>
          </div>
        ))}

        {/* URLs */}
        <div className="card card-padding">
          <h3>Links</h3>
          <div className="form-group">
            <label>LinkedIn URL</label>
            <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
          </div>
          <div className="form-group">
             <label>GitHub URL</label>
             <input name="githubUrl" value={form.githubUrl} onChange={handleChange} placeholder="https://github.com/..." />
          </div>
        </div>

        {/* Resume */}
        <div className="card card-padding">
            <h3>Resume</h3>
            <div className="input-group">
                <input type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files[0])} />
                <button type="button" className="btn btn-primary btn-add" onClick={() => handleUpload('resume')}>Upload PDF</button>
            </div>
        </div>

        {/* Actions */}
        <div className="profile-actions" style={{ marginBottom: '3rem' }}>
          <button type="submit" className="btn btn-primary">Save Changes</button>
          <button type="button" className="btn btn-danger" onClick={() => navigate('/profile')}>Cancel</button>
        </div>

      </form>
    </div>
  );
}