import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Class.css";

export default function ClassCreate() {
  const { role, userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    className: "",
    section: "",
    department: "",
    facultyId: role === "ROLE_FACULTY" ? userId : "",
    roomNumber: "",
    capacity: "",
    strength: "",
    description: "",
    active: true,
  });

  useEffect(() => {
    if (role === "ROLE_ADMIN") loadFaculty();
  }, [role]);

  const loadFaculty = async () => {
    try {
      const res = await api.get("/faculty/all");
      setFaculty(res.data || []);
    } catch (err) {
      console.error("❌ Failed to load faculty", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.className || !formData.section) {
      alert("Class name and section are required.");
      return;
    }

    if (role === "ROLE_ADMIN" && !formData.facultyId) {
      alert("Please select a faculty for this class.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        facultyId: role === "ROLE_FACULTY" ? userId : formData.facultyId,
        capacity: parseInt(formData.capacity || 0),
        strength: parseInt(formData.strength || 0),
      };

      // ✅ Wait for backend to respond with created class
      const res = await api.post("/classes/create", payload);
      const createdClass = res.data;

      alert("✅ Class created successfully!");

      // ✅ Auto-redirect to dashboard
      if (createdClass && createdClass.id) {
        navigate(`/classes/dashboard/${createdClass.id}`);
      } else {
        navigate("/classes");
      }

    } catch (err) {
      console.error("❌ Failed to create class:", err);
      alert("Failed to create class. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="class-form-container fade-in">
      <div className="form-header">
        <h2>Create New Class</h2>
        <p>Fill in the details below to create a new class session.</p>
      </div>

      <form onSubmit={handleSubmit} className="class-form-grid">

        {/* Class Basic Details */}
        <div className="form-group">
          <label>Class Name *</label>
          <input
            type="text"
            name="className"
            placeholder="e.g. CSE - A"
            value={formData.className}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Section *</label>
          <input
            type="text"
            name="section"
            placeholder="e.g. A"
            value={formData.section}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <input
            type="text"
            name="department"
            placeholder="e.g. Computer Science"
            value={formData.department}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Room Number</label>
          <input
            type="text"
            name="roomNumber"
            placeholder="e.g. Block B - 204"
            value={formData.roomNumber}
            onChange={handleChange}
          />
        </div>

        {/* Faculty Assignment */}
        {(role === "ROLE_ADMIN" || role === "ROLE_FACULTY") && (
          <div className="form-group">
            <label>Faculty</label>
            {role === "ROLE_FACULTY" ? (
              <input
                type="text"
                value="(Auto-assigned to you)"
                readOnly
                style={{ background: "#f3f4f6" }}
              />
            ) : (
              <select
                name="facultyId"
                value={formData.facultyId}
                onChange={handleChange}
                required
              >
                <option value="">Select Faculty</option>
                {faculty.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.fullName}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Capacity and Strength */}
        <div className="form-group">
          <label>Capacity</label>
          <input
            type="number"
            name="capacity"
            placeholder="Max seats (e.g. 60)"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Current Strength</label>
          <input
            type="number"
            name="strength"
            placeholder="Current students"
            value={formData.strength}
            onChange={handleChange}
            min="0"
          />
        </div>

        {/* Description */}
        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            name="description"
            rows="3"
            placeholder="Add any remarks or description about this class..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Active Status */}
        <div className="form-group">
          <label>Active</label>
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
          <span style={{ marginLeft: "8px" }}>
            {formData.active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Submit Button */}
        <div className="form-actions full-width">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save & Go to Dashboard"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/classes")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
