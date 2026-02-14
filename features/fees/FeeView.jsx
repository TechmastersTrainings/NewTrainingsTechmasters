import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api";
import "./Fee.css";

export default function FeeView() {
  const { id } = useParams();
  const [fee, setFee] = useState(null);
  const [studentInfo, setStudentInfo] = useState({ fullName: "Loading...", rollNumber: "N/A" });

  useEffect(() => {
    const fetchFee = async () => {
      try {
        // Fetch Fee Record
        const res = await api.get(`/fees/${id}`);
        const feeData = res.data;
        setFee(feeData);

        // Fetch Student Details using the studentId from the fee record
        if (feeData.studentId) {
            // Use the corrected endpoint /students/{id}
            const studentRes = await api.get(`/students/${feeData.studentId}`); 
            setStudentInfo(studentRes.data);
        }
      } catch (err) {
        console.error("Failed to load fee details", err);
      }
    };
    fetchFee();
  }, [id]);

  if (!fee) return <div>Loading Invoice...</div>;

  return (
    <div className="fee-view-container">
      <div className="fee-invoice">
        <div className="invoice-header">
          <h2>Fee Receipt / Challan</h2>
          <span className={`status-badge ${fee.status.toLowerCase()}`}>{fee.status}</span>
        </div>
        
        <div className="student-info">
          <p><strong>Name:</strong> {studentInfo.fullName}</p>
          <p><strong>USN/Roll:</strong> {studentInfo.rollNumber || studentInfo.usn || "N/A"}</p>
          <p><strong>Due Date:</strong> {fee.dueDate || "Immediate"}</p>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th className="text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Tuition Fee</td><td className="text-right">{fee.tuitionFee}</td></tr>
            <tr><td>University / VTU Charges</td><td className="text-right">{fee.universityFee}</td></tr>
            <tr><td>Building / Development Fee</td><td className="text-right">{fee.developmentFee}</td></tr>
            <tr><td>Uniform / Other Charges</td><td className="text-right">{fee.otherFee}</td></tr>
            <tr className="total-row">
              <td><strong>Total Fee Demand</strong></td>
              <td className="text-right"><strong>{fee.totalAmount}</strong></td>
            </tr>
          </tbody>
        </table>

        <div className="payment-summary">
          <div className="summary-item">
            <span>Amount Paid:</span>
            <span className="paid-text">₹ {fee.amountPaid}</span>
          </div>
          <div className="summary-item">
            <span>Pending Balance:</span>
            <span className="pending-text">₹ {fee.pendingAmount}</span>
          </div>
        </div>

        <div className="invoice-actions">
          <Link to="/fees" className="back-btn">Back to List</Link>
          <button onClick={() => window.print()} className="print-btn">Print Invoice</button>
        </div>
      </div>
    </div>
  );
}