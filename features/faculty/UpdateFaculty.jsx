import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar/Navbar";
import "./student.css";

const UpdateFaculty = () => {
    const { id } = useParams();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        department: "",
        active: true
    });

    const loadData = async () => {
        try {
            const res = await api.get(`/faculty/${id}`);
            setForm(res.data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submitForm = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/faculty/${id}`, form);
            window.location.href = "/faculty";
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    return (
        <>
            <Navbar />

            <div className="form-container">
                <h2>Update Faculty</h2>

                <form onSubmit={submitForm}>
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                    />

                    <label>Department</label>
                    <input
                        type="text"
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                    />

                    <label>Status</label>
                    <select
                        name="active"
                        value={form.active}
                        onChange={handleChange}
                    >
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                    </select>

                    <button className="btn-primary" type="submit">
                        Update
                    </button>
                </form>
            </div>
        </>
    );
};

export default UpdateFaculty;
