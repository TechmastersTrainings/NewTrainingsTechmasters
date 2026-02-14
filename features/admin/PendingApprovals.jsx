import React, { useEffect, useState } from "react";
import api from "../../api/api";
import Layout from "../../components/Layout/Layout";
import "./PendingApprovals.css";

export default function PendingApprovals() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPendingUsers = async () => {
    try {
      const res = await api.get("/admin/pending-approvals");
      setPendingUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch pending approvals:", err);
      setError("Failed to fetch pending approvals.");
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id) => {
    if (!id) {
      alert("User ID missing — cannot approve.");
      return;
    }

    try {
      const res = await api.put(`/admin/approve/${id}`);
      alert(res.data || "User approved successfully!");
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Failed to approve user:", err);
      alert("Failed to approve user. Please check server logs.");
    }
  };

  useEffect(() => {
    loadPendingUsers();
  }, []);

  if (loading) return <div className="loading">Loading pending approvals...</div>;

  return (
    <Layout>
      <div className="pending-approvals-page fade-in">
        <h1>Pending User Approvals</h1>

        {error && <p className="error">{error}</p>}

        {pendingUsers.length === 0 ? (
          <div className="no-pending">🎉 All users are approved!</div>
        ) : (
          <table className="pending-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.fullName || "N/A"}</td>
                  <td>{user.email || "N/A"}</td>
                  <td>{user.role?.name?.replace("ROLE_", "") || "N/A"}</td>
                  <td>
                    <button
                      className="approve-btn"
                      onClick={() => approveUser(user.id || user.userId)}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
