import React, { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Notification.css";

export default function NotificationList() {
  const { roleName: contextRole, userId } = useContext(AuthContext);
  const [currentRole, setCurrentRole] = useState(contextRole || "");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // --- 1. ROBUST ROLE CHECK ---
  useEffect(() => {
    let role = contextRole;
    if (!role) {
      role = localStorage.getItem("role");
    }
    if (!role) {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          role = user.role?.name || user.role || ""; 
        } catch (e) {
          console.error("Error parsing user from storage", e);
        }
      }
    }
    
    setCurrentRole(role);
  }, [contextRole]);

  const isAdminOrFaculty = currentRole === "ROLE_ADMIN" || currentRole === "ROLE_FACULTY";

  // --- 2. DATA LOADING ---
  const loadNotifications = useCallback(async () => {
    // Fallback for ID too
    const uid = userId || localStorage.getItem("userId"); 
    if (!uid) {
        console.warn("User ID not found, cannot load notifications.");
        return;
    }

    try {
      const res = await api.get(`/notifications/user/${uid}`);
      
      // 72-Hour Expiration Filter
      const threeDaysAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);
      const activeNotifications = res.data.filter((n) => {
        const notificationDate = new Date(n.createdAt);
        return notificationDate > threeDaysAgo;
      });

      setNotifications(activeNotifications);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  }, [userId]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // --- 3. HANDLERS ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await api.delete(`/notifications/${id}`);
        loadNotifications(); // Reload the list
      } catch (err) {
        console.error("Error deleting notification", err);
        alert("Failed to delete notification.");
      }
    }
  };

  const markAllAsRead = async () => {
    const uid = userId || localStorage.getItem("userId");
    if (!uid) return;
    try {
      await api.put(`/notifications/read-all/${uid}`);
      loadNotifications(); // Reload the list
    } catch (err) {
      console.error("Failed to mark all as read", err);
      alert("Failed to mark all as read.");
    }
  };

  // --- 4. RENDER ---
  const unreadCount = notifications.filter(n => !n.readStatus).length;

  return (
    <div className="notification-container">
      <div className="header-section">
        <h1>Notifications ({unreadCount} Unread)</h1>
        <div className="top-actions">
          {/* ONLY Visible if Role Logic is TRUE */}
          {isAdminOrFaculty && (
            <button
              onClick={() => navigate("/notifications/create")}
              className="send-btn"
            >
              + Send Notification
            </button>
          )}
          <button onClick={markAllAsRead} className="mark-all-btn" disabled={unreadCount === 0}>
            Mark All as Read
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <p>No active notifications (Items expire after 72 hours).</p>
        </div>
      ) : (
        <div className="notification-grid">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notification-card ${n.readStatus ? "read" : "unread"}`}
            >
              <div className="card-header">
                <h3>{n.title}</h3>
                <span className={`badge ${n.type?.toLowerCase() || "info"}`}>
                  {n.type || "INFO"}
                </span>
              </div>
              
              <p className="message-body">{n.message}</p>
              
              <p className="timestamp">
                📅 {new Date(n.createdAt).toLocaleString()}
              </p>

              <div className="card-actions">
                <button
                  className="view-btn"
                  onClick={() => navigate(`/notifications/view/${n.id}`)}
                >
                  View
                </button>

                {/* ONLY Visible if Role Logic is TRUE */}
                {isAdminOrFaculty && (
                  <>
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/notifications/edit/${n.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(n.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}