import React, { useState, useEffect, useContext } from "react";
import api from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Notification.css";

export default function NotificationEdit() {
  const { id } = useParams();
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [existingTitles, setExistingTitles] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "INFO",
  });

  useEffect(() => {
    loadNotification();
    loadTitlesForDropdown();
  }, [id]);

  // 1. Load the specific notification data to Edit
  const loadNotification = async () => {
    try {
      const res = await api.get(`/notifications/${id}`);
      // The backend returns a full Notification object, but we only update editable fields
      setFormData(res.data); 
    } catch (err) {
      console.error("Failed to load notification", err);
      alert("Failed to load notification details.");
    }
  };

  // 2. Load ALL user notifications to extract Titles for the Dropdown
  const loadTitlesForDropdown = async () => {
    const currentUserId = userId || localStorage.getItem("userId");

    if (!currentUserId) {
      console.warn("No User ID found. Cannot load title history.");
      return;
    }

    try {
      // Using the endpoint to get the user's past notifications (as a sender/creator)
      const res = await api.get(`/notifications/user/${currentUserId}`);
      
      if (res.data && Array.isArray(res.data)) {
        // Extract titles and remove duplicates
        const titles = res.data.map((n) => n.title);
        const uniqueTitles = [...new Set(titles)];
        
        setExistingTitles(uniqueTitles);
      }
    } catch (err) {
      console.error("Failed to load title history", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send only the editable fields (title, message, type)
      const payload = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
      }
      await api.put(`/notifications/${id}`, payload);
      navigate("/notifications");
    } catch (err) {
      console.error("Error updating notification", err);
      alert("Failed to update. Please check console.");
    }
  };

  return (
    <div className="notification-container">
      <div className="notification-form-card">
        <div className="form-header">
          <h2>Edit Notification (ID: {id})</h2>
        </div>

        <form onSubmit={handleSubmit} className="notification-form">
          
          {/* REWIRED TITLE FIELD WITH DATALIST */}
          <div className="form-group">
            <label>Title</label>
            <input
              list="title-options" // Must match datalist ID below
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              placeholder="Select from history or type new..."
              autoComplete="off" 
              required
            />
            
            {/* THE DROPDOWN DATA */}
            <datalist id="title-options">
              {existingTitles.length > 0 ? (
                existingTitles.map((title, index) => (
                  <option key={index} value={title} />
                ))
              ) : (
                <option value="No previous titles found" disabled />
              )}
            </datalist>
          </div>

          <div className="form-group">
            <label>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-control"
            >
              <option value="INFO">Info</option>
              <option value="ALERT">Alert</option>
              <option value="WARNING">Warning</option>
              <option value="SUCCESS">Success</option>
            </select>
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={() => navigate("/notifications")}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Update Notification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}