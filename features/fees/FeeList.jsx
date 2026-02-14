import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Fee.css";

export default function FeeList() {
  // Assuming AuthContext provides 'role' and 'userId' (student's ID)
  const { role, userId } = useContext(AuthContext); 
  const [fees, setFees] = useState([]);
  const [studentsMap, setStudentsMap] = useState({});

  const userRole = String(role || "").toUpperCase();
  const isAdmin = userRole === "ROLE_ADMIN";

  // Helper to fetch all students (only for Admin view to display names)
  const loadStudentsMap = async () => {
    try {
        const res = await api.get("/students/all"); 
        const map = res.data.reduce((acc, student) => {
            acc[student.id] = student;
            return acc;
        }, {});
        setStudentsMap(map);
    } catch (err) {
        console.error("Failed to load students for map", err);
    }
  };

  const loadFees = async () => {
    try {
      let endpoint;
      if (isAdmin) {
        // ADMIN: Fetches ALL fee records (for CRUD)
        endpoint = "/fees/all";
        await loadStudentsMap(); 
      } else if (userId) {
        // STUDENT: Fetches records for their OWN ID (Read-only)
        endpoint = `/fees/student/${userId}`; 
      } else {
          return; 
      }
      
      const res = await api.get(endpoint);
      setFees(res.data);

    } catch (err) {
      console.error("Failed to load fees", err);
    }
  };

  useEffect(() => {
    if (isAdmin || userId) {
        loadFees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, userId]); 

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this fee record?")) return;
    try {
      // 🛑 Only Admin is allowed to call this action
      await api.delete(`/fees/${id}`); 
      loadFees();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // Helper to retrieve student name/roll number for Admin List view
  const getStudentDisplay = (fee) => {
    if (!isAdmin) {
        // Student view doesn't need student lookup, assumes backend is showing their data
        return "My Fee Statement"; 
    }
    const student = studentsMap[fee.studentId];
    return student ? (
        <>
            {student.fullName} <br/>
            <small className="text-muted">{student.rollNumber || student.usn}</small>
        </>
    ) : (
        "Student ID: " + fee.studentId
    );
  };

  return (
    <div className="fee-list-container">
      <div className="header-flex">
        <h2>{isAdmin ? "All Fee Records (Admin View)" : "My Fee Statements"}</h2>
        {/* Admin Create Link */}
        {isAdmin && <Link to="/fees/create" className="add-btn">+ Generate Fee</Link>}
      </div>

      <div className="table-wrapper">
        <table className="fee-table">
          <thead>
            <tr>
              <th>{isAdmin ? "Student" : "Statement Period"}</th>
              <th>Total (₹)</th>
              <th>Paid (₹)</th>
              <th>Pending (₹)</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((f) => (
              <tr key={f.id}>
                <td>{getStudentDisplay(f)}</td>
                <td>{f.totalAmount}</td>
                <td style={{color:"green"}}>{f.amountPaid}</td>
                <td style={{color:"red", fontWeight:"bold"}}>{f.pendingAmount}</td>
                <td>{f.dueDate}</td>
                <td>
                    <span className={`status-dot ${f.status.toLowerCase()}`}></span> 
                    {f.status}
                </td>
                <td>
                  {/* Both Admin and Student can view (Read) */}
                  <Link to={`/fees/view/${f.id}`} className="view-btn icon-btn">View</Link> 
                  
                  {/* Only Admin gets Update and Delete buttons (CRUD) */}
                  {isAdmin && (
                    <>
                      <Link to={`/fees/edit/${f.id}`} className="edit-btn icon-btn">Update</Link>
                      <button onClick={() => handleDelete(f.id)} className="delete-btn icon-btn">Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}