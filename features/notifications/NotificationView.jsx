import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./Notification.css";

export default function NotificationView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const loadNotification = async () => {
      try {
        const res = await api.get(`/notifications/${id}`);
        setNotification(res.data);
        
        // Auto-mark as read on successful view
        if (!res.data.readStatus) {
            markAsRead(id);
        }

      } catch (err) {
        console.error("Failed to fetch notification", err);
      }
    };
    loadNotification();
  }, [id]);

  // Handler to mark as read, used in useEffect and button click
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/read/${notificationId}`);
      // Optimistically update the state for the current view
      setNotification(prev => prev ? ({ ...prev, readStatus: true }) : null);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  if (!notification) return <div className="loading-state">Loading details...</div>;

  return (
    <div className="notification-container">
      <div className="notification-view-card">
        <div className="view-header">
          <span className={`badge ${notification.type?.toLowerCase() || "info"}`}>
            {notification.type || "INFO"}
          </span>
          <span className="view-date">
            {new Date(notification.createdAt).toLocaleString()}
          </span>
        </div>

        <h1 className="view-title">{notification.title}</h1>

        <div className="view-body">
          <p>{notification.message}</p>
        </div>

        <div className="view-meta">
          <div className="meta-row">
             <span className="meta-label">Status:</span>
             <span className={`status-pill ${notification.readStatus ? "status-read" : "status-unread"}`}>
               {notification.readStatus ? "Read" : "Unread"}
             </span>
          </div>
        </div>

        <div className="form-actions">
          <button onClick={() => navigate("/notifications")} className="cancel-btn">
            Back to List
          </button>
          
          {/* Keep the button for manual marking if desired, though auto-mark is in useEffect */}
          {!notification.readStatus && (
            <button onClick={() => markAsRead(id)} className="mark-read-btn">
              Mark as Read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}