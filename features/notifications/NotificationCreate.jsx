import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // Assumed to be your configured Axios instance
import { AuthContext } from "../../context/AuthContext"; // Assumed to exist
import "./Notification.css"; // Assumed styles

export default function NotificationCreate() {
  const { roleName: contextRole, userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "INFO",
  });

  // Role check: Only Admin or Faculty can access this form
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const activeRole = contextRole || storedRole;

    if (activeRole !== "ROLE_ADMIN" && activeRole !== "ROLE_FACULTY") {
      alert("Access Denied");
      navigate("/notifications");
    }
  }, [contextRole, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get the ID of the currently logged-in user
    const currentUserId = userId || localStorage.getItem("userId");

    if (!currentUserId) {
      alert("Error: User ID not found. Please log in again.");
      return;
    }

    // Construct Payload
    const payload = {
      ...formData,
      userId: currentUserId, // Backend expects 'userId' for the recipient
    };

    try {
      await api.post("/notifications/create", payload);
      navigate("/notifications");
    } catch (err) {
      console.error("Error sending notification", err);
      alert("Failed to send notification. Check console for details.");
    }
  };

  return (
    <div className="notification-container">
      <div className="notification-form-card">
        
        <div className="form-header">
           <h2>Create Notification</h2>
           <p>Send an update to students and faculty.</p>
        </div>

        <form onSubmit={handleSubmit} className="notification-form">
          <div className="form-group">
            <label>Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Exam Schedule Released"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
             <label>Message</label>
             <textarea
               name="message"
               value={formData.message}
               onChange={handleChange}
               placeholder="Enter notification details..."
               rows="5"
               className="form-control"
               required
             />
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
              {/* Note: The Notification model's comment mentioned 'EVENT' */}
            </select>
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
              Send Notification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}