import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 
import "./student.css";

// Utility to convert ISO date string to Date object for DatePicker
const dateStringToDate = (dateString) => {
    return dateString ? new Date(dateString) : null;
};

// Utility to convert Date object from DatePicker back to YYYY-MM-DD string
const dateToDateString = (date) => {
    if (!date) return "";
    return date.toISOString().split('T')[0];
};

export default function FacultyEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        gender: "",        // Added
        department: "",    // Added
        designation: "",   // Added
        subject: "",
        hireDate: "",      // Added
        address: "",       // Added
        dateOfBirth: "",   // Added
        active: true,
    });

    const loadFaculty = async () => {
        try {
            const res = await api.get(`/faculty/${id}`);
            // The API returns the correct data, which is set here
            setForm(res.data);
        } catch (err) {
            console.error("Failed to load faculty", err);
        }
    };

    useEffect(() => {
        loadFaculty();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleChange = (e) => {
        let value = e.target.value;
        const name = e.target.name;

        if (name === "active") {
            value = value === "true";
        }

        setForm(prev => ({ ...prev, [name]: value }));
    };
    
    // Handler specifically for DatePicker changes
    const handleDateChange = (date, name) => {
        const dateString = dateToDateString(date);
        setForm(prev => ({ ...prev, [name]: dateString }));
    };


    const saveFaculty = async (e) => {
        e.preventDefault();
        try {
             const payload = {
                ...form,
                hireDate: form.hireDate || null,
                dateOfBirth: form.dateOfBirth || null 
            };
            await api.put(`/faculty/${id}`, payload);
            alert("Faculty updated successfully!");
            navigate("/faculty");
        } catch (err) {
            console.error("Update failed", err);
            alert("Update failed!");
        }
    };

    return (
        <div className="page-container">
            <h2>Edit Faculty</h2>

            <form onSubmit={saveFaculty} className="form-container">

                <label>Full Name</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} required />

                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required />

                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} />

                <label>Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} required />

                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                </select>
                
                <label>Department</label>
                <input name="department" value={form.department} onChange={handleChange} />

                <label>Designation</label>
                <input name="designation" value={form.designation} onChange={handleChange} />

                {/* --- DATE OF BIRTH (USING REACT DATEPICKER) --- */}
                <label>Date of Birth</label>
                <DatePicker
                    selected={dateStringToDate(form.dateOfBirth)}
                    onChange={(date) => handleDateChange(date, "dateOfBirth")}
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    placeholderText="DD/MM/YYYY"
                    className="form-input-datepicker"
                />

                {/* --- HIRE DATE (USING REACT DATEPICKER) --- */}
                <label>Hire Date</label>
                <DatePicker
                    selected={dateStringToDate(form.hireDate)}
                    onChange={(date) => handleDateChange(date, "hireDate")}
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    scrollableYearDropdown
                    placeholderText="DD/MM/YYYY"
                    className="form-input-datepicker"
                />

                <label>Address</label>
                <input name="address" value={form.address} onChange={handleChange} />

                <label>Status</label>
                <select name="active" value={form.active.toString()} onChange={handleChange}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>

                <button type="submit" className="btn btn-save">Update Faculty</button>
                <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => navigate("/faculty")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}