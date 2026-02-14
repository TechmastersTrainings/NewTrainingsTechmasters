import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Fee.css";

export default function FeeEdit() {
  const { id } = useParams();
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

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

  const isAdmin = String(role).toUpperCase() === "ROLE_ADMIN";

  useEffect(() => {
    if (isAdmin && id) loadFee();
    if (isAdmin) loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAdmin]);

  // Auto-calculate logic (Same as Create)
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
  }, [formData.tuitionFee, formData.developmentFee, formData.universityFee, formData.otherFee, formData.amountPaid]);

  const loadFee = async () => {
    try {
      const res = await api.get(`/fees/${id}`);
      setFormData(res.data);
    } catch (err) {
      console.error("Error loading fee", err);
    }
  };

  const loadStudents = async () => {
    try {
      // Use the corrected backend endpoint /students/all
      const res = await api.get("/students/all");
      setStudents(res.data);
    } catch (err) {
      console.error("Error loading students", err);
    }
  };

  // 🛑 Restrict Access: Only Admin can update
  if (!isAdmin) return <p className="unauthorized">Access Denied: Only Admins can update fee records.</p>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Payload conversion for Update
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
      await api.put(`/fees/update/${id}`, payload);
      navigate("/fees");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="fee-form-container">
      <h2>Edit Fee Record</h2>
      <form onSubmit={handleSubmit} className="fee-form">
        
        <div className="form-group full-width">
           <label>Student (Cannot be changed)</label>
           <select name="studentId" value={formData.studentId} onChange={handleChange} disabled>
             <option value="">Select Student</option>
             {students.map((s) => (
               <option key={s.id} value={s.id}>
                 {s.fullName} ({s.rollNumber})
               </option>
             ))}
           </select>
        </div>

        <div className="form-row">
            <div className="form-group"><label>Tuition Fee</label><input type="number" name="tuitionFee" value={formData.tuitionFee} onChange={handleChange} /></div>
            <div className="form-group"><label>University Fee</label><input type="number" name="universityFee" value={formData.universityFee} onChange={handleChange} /></div>
        </div>
        <div className="form-row">
            <div className="form-group"><label>Building Fee</label><input type="number" name="developmentFee" value={formData.developmentFee} onChange={handleChange} /></div>
            <div className="form-group"><label>Other Fee</label><input type="number" name="otherFee" value={formData.otherFee} onChange={handleChange} /></div>
        </div>
        
        <hr/>
        
        <div className="form-row">
            <div className="form-group"><label>Total</label><input value={formData.totalAmount} readOnly /></div>
            <div className="form-group"><label>Amount Paid</label><input type="number" name="amountPaid" value={formData.amountPaid} onChange={handleChange} /></div>
        </div>
        <div className="form-row">
            <div className="form-group"><label>Pending</label><input value={formData.pendingAmount} readOnly style={{color: "red"}} /></div>
            <div className="form-group"><label>Deadline</label><input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} /></div>
        </div>

        <button type="submit" className="save-btn">Update Record</button>
      </form>
    </div>
  );
}