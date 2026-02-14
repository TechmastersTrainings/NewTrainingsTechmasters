import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Fee.css";

export default function FeeCreate() {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  // Detailed Fee Structure State
  const [formData, setFormData] = useState({
    studentId: "",
    tuitionFee: 0,
    developmentFee: 0,
    universityFee: 0,
    otherFee: 0,
    totalAmount: 0,
    amountPaid: 0,
    pendingAmount: 0,
    status: "Pending",
    dueDate: "",
  });

  const userRole = String(role || "").toUpperCase();
  const isAdmin = userRole === "ROLE_ADMIN";

  useEffect(() => {
    // Only fetch students if the user is an admin
    if (isAdmin) {
      loadStudents();
    }
  }, [isAdmin]);

  // Auto-calculate Total and Pending whenever a fee component changes
  useEffect(() => {
    const total =
      Number(formData.tuitionFee || 0) +
      Number(formData.developmentFee || 0) +
      Number(formData.universityFee || 0) +
      Number(formData.otherFee || 0);

    const paid = Number(formData.amountPaid || 0);
    const pending = total - paid;

    let status = "Pending";
    if (pending <= 0 && total > 0) status = "Paid";
    else if (paid > 0 && pending > 0) status = "Partial";

    setFormData((prev) => ({
      ...prev,
      totalAmount: total,
      pendingAmount: pending > 0 ? pending : 0,
      status: status,
    }));
  }, [
    formData.tuitionFee,
    formData.developmentFee,
    formData.universityFee,
    formData.otherFee,
    formData.amountPaid,
  ]);

  const loadStudents = async () => {
    try {
      // Use the corrected backend endpoint /students/all
      const res = await api.get("/students/all"); 
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to load students", err);
    }
  };

  // 🛑 Restrict Access: Only Admin can create
  if (!isAdmin) return <p className="unauthorized">Access Denied: Only Admins can create fee records.</p>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // CRITICAL FIX: Convert Strings to Numbers before sending
    const payload = {
      studentId: Number(formData.studentId),
      tuitionFee: Number(formData.tuitionFee),
      universityFee: Number(formData.universityFee),
      developmentFee: Number(formData.developmentFee),
      otherFee: Number(formData.otherFee),
      totalAmount: Number(formData.totalAmount),
      amountPaid: Number(formData.amountPaid),
      pendingAmount: Number(formData.pendingAmount),
      status: formData.status,
      dueDate: formData.dueDate
    };

    try {
      await api.post("/fees/create", payload);
      navigate("/fees");
    } catch (err) {
      console.error("Failed to create fee record", err);
      alert("Error saving fee. Please check if the Student ID is selected.");
    }
  };

  return (
    <div className="fee-form-container">
      <h2>Generate Fee Structure</h2>
      <form onSubmit={handleSubmit} className="fee-form">
        
        {/* Student Selection */}
        <div className="form-group full-width">
          <label>Select Student</label>
          <select
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Student --</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} ({s.rollNumber || s.usn})
              </option>
            ))}
          </select>
        </div>

        {/* Fee Breakdown */}
        <div className="form-row">
            <div className="form-group">
                <label>Tuition Fee (₹)</label>
                <input type="number" name="tuitionFee" value={formData.tuitionFee} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>University/VTU Charges (₹)</label>
                <input type="number" name="universityFee" value={formData.universityFee} onChange={handleChange} />
            </div>
        </div>

        <div className="form-row">
            <div className="form-group">
                <label>Building/Dev Fee (₹)</label>
                <input type="number" name="developmentFee" value={formData.developmentFee} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Uniform/Other Charges (₹)</label>
                <input type="number" name="otherFee" value={formData.otherFee} onChange={handleChange} />
            </div>
        </div>

        <hr className="divider" />

        {/* Totals and Payment */}
        <div className="form-row highlight-row">
             <div className="form-group">
                <label>Total Amount (Auto)</label>
                <input type="number" value={formData.totalAmount} readOnly className="read-only-input" />
            </div>
             <div className="form-group">
                <label>Amount Paid So Far (₹)</label>
                <input type="number" name="amountPaid" value={formData.amountPaid} onChange={handleChange} required />
            </div>
        </div>

        <div className="form-row">
             <div className="form-group">
                <label>Pending Balance</label>
                <input type="number" value={formData.pendingAmount} readOnly className="pending-input" />
            </div>
             <div className="form-group">
                <label>Payment Status</label>
                <input type="text" value={formData.status} readOnly />
            </div>
        </div>

        <div className="form-group full-width">
            <label>Deadline to Pay</label>
            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
        </div>

        <button type="submit" className="save-btn">Generate Fee Demand</button>
      </form>
    </div>
  );
}