import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Parent.css'; // Import the dedicated CSS

export default function ParentList() {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:8080/parent'; // Adjust if your port/host is different

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/all`);
      // Filter for active parents by default, matching your soft delete logic
      setParents(response.data.filter(p => p.active)); 
    } catch (err) {
      setError("Failed to fetch parents. Please check the backend connection.");
      console.error("Error fetching parents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to deactivate Parent with ID ${id}?`)) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        // Update the list immediately after soft deletion
        setParents(prevParents => prevParents.filter(p => p.id !== id));
      } catch (err) {
        setError(`Failed to deactivate Parent ${id}.`);
        console.error("Error deleting parent:", err);
      }
    }
  };

  if (loading) return <div className="loading-state">Loading parents...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="parent-list-container component-container">
      <header className="list-header">
        <h2>Parent Management</h2>
        <Link to="/parents/create" className="btn btn-primary">
          + Add New Parent
        </Link>
      </header>

      {parents.length === 0 ? (
        <p className="no-data">No active parent records found.</p>
      ) : (
        <div className="table-responsive">
          <table className="parent-table data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Relationship</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Student ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parents.map((parent) => (
                <tr key={parent.id}>
                  <td>{parent.id}</td>
                  <td>{parent.fullName}</td>
                  <td>{parent.relationship}</td>
                  <td>{parent.email}</td>
                  <td>{parent.phone}</td>
                  <td>{parent.studentId}</td>
                  <td className="actions-cell">
                    <Link to={`/parents/edit/${parent.id}`} className="btn btn-sm btn-secondary">
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(parent.id)} 
                      className="btn btn-sm btn-danger"
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}