import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Parent.css';

export default function ParentEdit() {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();

  const [parentData, setParentData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    relationship: '',
    studentId: '',
    active: true,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const API_URL = 'http://localhost:8080/parent';

  // Fetch parent data on component mount
  useEffect(() => {
    const fetchParent = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        setParentData(response.data);
      } catch (err) {
        setIsError(true);
        setMessage(`Error loading parent data: ${err.response?.data || err.message}`);
        console.error("Error fetching parent:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchParent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'studentId' ? Number(value) : value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      await axios.put(`${API_URL}/${id}`, parentData);
      
      setMessage('Parent updated successfully!');
      setTimeout(() => {
        navigate('/parents'); // Redirect to list after success
      }, 1500);

    } catch (err) {
      setIsError(true);
      const errorMessage = err.response?.data || err.message || 'Failed to update parent.';
      setMessage(`Error: ${errorMessage}`);
      console.error("Error updating parent:", err);
    }
  };

  if (loading) return <div className="loading-state">Loading parent data...</div>;

  return (
    <div className="parent-form-container component-container">
      <h2>Edit Parent Record (ID: {id})</h2>
      
      <form onSubmit={handleSubmit} className="parent-form">
        
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={parentData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email - Note: Changing a unique email might require backend logic to check existence */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={parentData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={parentData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Relationship */}
        <div className="form-group">
          <label htmlFor="relationship">Relationship:</label>
          <select
            id="relationship"
            name="relationship"
            value={parentData.relationship}
            onChange={handleChange}
            required
          >
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Guardian">Guardian</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Linked Student ID */}
        <div className="form-group">
          <label htmlFor="studentId">Linked Student ID:</label>
          <input
            type="number"
            id="studentId"
            name="studentId"
            value={parentData.studentId}
            onChange={handleChange}
            required
            min="1"
          />
        </div>
        
        {/* Active Status */}
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="active"
            name="active"
            checked={parentData.active}
            onChange={handleChange}
          />
          <label htmlFor="active">Is Active?</label>
        </div>

        {/* Address */}
        <div className="form-group full-width">
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={parentData.address}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        {message && (
          <div className={`form-message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
          <button type="button" onClick={() => navigate('/parents')} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}