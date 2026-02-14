import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Parent.css';

const initialParentState = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  relationship: 'Father', // Default relationship
  studentId: '',
  active: true,
};

export default function ParentCreate() {
  const [parentData, setParentData] = useState(initialParentState);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:8080/parent';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParentData(prev => ({
      ...prev,
      [name]: name === 'studentId' ? (value ? Number(value) : '') : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      await axios.post(`${API_URL}/create`, parentData);
      
      setMessage('Parent created successfully!');
      setTimeout(() => {
        navigate('/parents'); // Redirect to list after success
      }, 1500);

    } catch (err) {
      setIsError(true);
      const errorMessage = err.response?.data || err.message || 'Failed to create parent.';
      setMessage(`Error: ${errorMessage}`);
      console.error("Error creating parent:", err);
    }
  };

  return (
    <div className="parent-form-container component-container">
      <h2>Create New Parent Record</h2>
      
      <form onSubmit={handleSubmit} className="parent-form">
        
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

        <div className="form-group">
          <label htmlFor="studentId">Linked Student ID (Required):</label>
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
            Create Parent
          </button>
          <button type="button" onClick={() => navigate('/parents')} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}