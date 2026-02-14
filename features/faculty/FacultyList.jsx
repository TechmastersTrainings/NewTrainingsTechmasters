// src/features/faculty/FacultyList.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../api/api";
import "./student.css";

export default function FacultyList() {
    const [faculty, setFaculty] = useState([]);
    const location = useLocation();

    const loadFaculty = async () => {
        try {
            const res = await api.get("/faculty/all");
            setFaculty(res.data);
        } catch (err) {
            console.error("Failed to load faculty data:", err);
        }
    };

    const deleteFaculty = async (id) => {
        if (!window.confirm("Are you sure you want to delete this faculty member?")) return;
        try {
            await api.delete(`/faculty/${id}`);
            loadFaculty();
        } catch (err) {
            console.error("Failed to delete faculty:", err);
            alert("Delete failed!");
        }
    };

    useEffect(() => {
        loadFaculty();
    }, [location.pathname]); 

    // Helper function to format date string to locale
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US'); 
    };

    return (
        <div className="page-container">
            <h2>Faculty List</h2>

            <Link to="/faculty/create" className="btn">+ Add Faculty</Link>

            {/* 🟢 Table Wrapper for Responsiveness */}
            <div className="table-responsive"> 
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Department</th> 
                            <th>Phone</th>     
                            <th>Address</th>   
                            <th>Hire Date</th> 
                            <th>Status</th>    
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {faculty.map((f) => (
                            <tr key={f.id}>
                                <td>{f.id}</td>
                                <td>{f.fullName}</td>
                                <td>{f.email}</td>
                                <td>{f.subject || 'N/A'}</td>
                                <td>{f.department || 'N/A'}</td>
                                <td>{f.phone || 'N/A'}</td>
                                <td>{f.address || 'N/A'}</td>
                                <td>{formatDate(f.hireDate)}</td>
                                <td>{f.active ? 'Active' : 'Inactive'}</td>
                                
                                <td>
                                    <Link to={`/faculty/edit/${f.id}`} className="edit-btn">Edit</Link>
                                    <button onClick={() => deleteFaculty(f.id)} className="delete-btn">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* -------------------------------------- */}
        </div>
    );
}