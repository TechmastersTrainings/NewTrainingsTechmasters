import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
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
    // Format as YYYY-MM-DD for the API payload
    return date.toISOString().split('T')[0];
};

export default function FacultyCreate() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        department: "",
        designation: "",
        subject: "",
        hireDate: "",
        address: "",
        dateOfBirth: "",
        active: true,
    });

    const change = (e) => {
        let value = e.target.value;
        const name = e.target.name;

        // Convert boolean string → boolean
        if (name === "active") {
            value = value === "true";
        }

        setForm({ ...form, [name]: value });
    };
    
    // Handler specifically for DatePicker changes
    const handleDateChange = (date, name) => {
        // Convert Date object received from DatePicker to API string format
        const dateString = dateToDateString(date);
        setForm({ ...form, [name]: dateString });
    };


    const submit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                userId: parseInt(localStorage.getItem("userId")),
                hireDate: form.hireDate || null,
                dateOfBirth: form.dateOfBirth || null 
            };

            await api.post("/faculty/create", payload);
            alert("Faculty added successfully");
            navigate("/faculty");
        } catch (err) {
            console.error(err);
            alert("Failed to add faculty");
        }
    };

    return (
        <div className="page-container">
            <h2>Add Faculty</h2>

            <form className="form-container" onSubmit={submit}>

                <label>Full Name</label>
                <input name="fullName" value={form.fullName} onChange={change} required />

                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={change} required />

                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={change} />
                
                <label>Subject</label>
                <input name="subject" value={form.subject} onChange={change} required />

                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={change}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                </select>

                <label>Department</label>
                <input name="department" value={form.department} onChange={change} />

                <label>Designation</label>
                <input name="designation" value={form.designation} onChange={change} />

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
                <input name="address" value={form.address} onChange={change} />

                <label>Status</label>
                {/* Use optional chaining or nullish coalescing to safely convert boolean to string */}
                <select name="active" value={(form.active ?? true).toString()} onChange={change}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>

                <button type="submit" className="btn">Save Faculty</button>
            </form>
        </div>
    );
}