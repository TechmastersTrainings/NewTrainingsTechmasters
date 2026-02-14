import React, { useState, useEffect, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./Skill.css";

export default function SkillCreate() {
  const { role } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    skillName: "",
    category: "",
    proficiencyLevel: "",
    acquiredDate: "",
    certificationFile: null,
    studentId: "",
  });

  // ✅ Skill options grouped by category
  const skillOptions = {
    Programming: ["Java", "Python", "C++", "C", "JavaScript", "Go", "Rust"],
    "Web Development": ["React", "Angular", "Spring Boot", "Django", "Flask"],
    Database: ["MySQL", "PostgreSQL", "MongoDB", "Oracle", "SQLite"],
    "Cloud & DevOps": ["AWS", "Azure", "Docker", "Kubernetes", "Jenkins"],
    "Data Science": ["Pandas", "NumPy", "TensorFlow", "Scikit-learn", "Tableau"],
    Mobile: ["Flutter", "React Native", "Swift", "Kotlin"],
    Other: ["Git", "GitHub", "Leadership", "Communication", "Problem Solving"],
  };

  useEffect(() => {
    if (role !== "ROLE_STUDENT") {
      loadStudents();
    } else {
      const sid = localStorage.getItem("studentId");
      if (sid) {
        setForm((prev) => ({ ...prev, studentId: sid }));
      }
    }
  }, [role]);

  const loadStudents = async () => {
    try {
      const res = await api.get("/students/all");
      setStudents(res.data);
    } catch {
      toast.error("⚠️ Failed to load students.");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, certificationFile: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Auto-fill studentId for logged-in student
    const sid = localStorage.getItem("studentId");
    const studentIdToUse = form.studentId || sid;

    // ✅ Validation
    if (!form.skillName || !form.category || !form.proficiencyLevel) {
      toast.warn("⚠️ Please select all required dropdowns.");
      return;
    }

    try {
      // ✅ Construct FormData for multipart/form-data
      const formData = new FormData();
      formData.append("skillName", form.skillName);
      formData.append("category", form.category);
      formData.append("proficiencyLevel", form.proficiencyLevel);
      formData.append("acquiredDate", form.acquiredDate || "");
      if (form.certificationFile) {
        formData.append("certificationFile", form.certificationFile);
      }

      let url = "/skills/create";
      if (role !== "ROLE_STUDENT" && studentIdToUse) {
        // Admin/Faculty create skill for student manually
        url = `/skills/create/${studentIdToUse}`;
      }

      await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Skill added successfully!");
      window.location.href = "/skills";
    } catch (err) {
      console.error("Error submitting skill:", err.response || err);
      toast.error("❌ Failed to add skill. Please check backend connection.");
    }
  };

  return (
    <div className="form-container">
      <h2>➕ Add Skill</h2>
      <form onSubmit={handleSubmit}>
        {/* Skill Name */}
        <label>Skill Name*</label>
        <select
          name="skillName"
          value={form.skillName}
          onChange={handleChange}
          required
        >
          <option value="">Select Skill</option>
          {Object.entries(skillOptions).map(([category, skills]) => (
            <optgroup key={category} label={category}>
              {skills.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        {/* Category */}
        <label>Category*</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {Object.keys(skillOptions).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Proficiency */}
        <label>Proficiency Level*</label>
        <select
          name="proficiencyLevel"
          value={form.proficiencyLevel}
          onChange={handleChange}
          required
        >
          <option value="">Select Level</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        {/* Certification File Upload */}
        <label>Certification (Optional)</label>
        <input
          type="file"
          name="certificationFile"
          accept=".pdf,.jpg,.png,.jpeg"
          onChange={handleChange}
        />

        {/* Date */}
        <label>Acquired Date</label>
        <input
          type="date"
          name="acquiredDate"
          value={form.acquiredDate}
          onChange={handleChange}
        />

        {/* Assign to Student (Admin/Faculty Only) */}
        {role !== "ROLE_STUDENT" && (
          <>
            <label>Assign to Student*</label>
            <select
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              required
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName}
                </option>
              ))}
            </select>
          </>
        )}

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => (window.location.href = "/skills")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
