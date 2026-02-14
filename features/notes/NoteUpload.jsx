import React, { useState, useEffect, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import "./Notes.css";

export default function NoteUpload() {
  const { role } = useContext(AuthContext); // Get role from context
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    classId: "",
    subjectId: "",
    file: null,
  });

  // 🔄 Load Classes & Subjects on Mount
  useEffect(() => {
    // Only load data if the user is authorized to upload
    if (role === "ROLE_FACULTY" || role === "ROLE_STUDENT") {
        loadClasses();
        loadSubjects();
    }
  }, [role]); // Dependency on role ensures check runs

  const loadClasses = async () => {
    try {
      const res = await api.get("/classes/all"); 
      setClasses(res.data);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
      // NOTE: Using alert here is temporary, consider better UI feedback
      alert("Unable to load class list. Ensure backend is running.");
    }
  };

  const loadSubjects = async () => {
    try {
      const res = await api.get("/subject/all"); 
      setSubjects(res.data);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
      alert("Unable to load subjects list.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      alert("Please select a file to upload.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("title", formData.title);
    uploadData.append("description", formData.description);
    uploadData.append("classId", formData.classId);
    uploadData.append("subjectId", formData.subjectId);
    uploadData.append("file", formData.file);

    try {
      await api.post("/notes/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Note uploaded successfully!");
      setFormData({ title: "", description: "", classId: "", subjectId: "", file: null });
      document.querySelector('input[type="file"]').value = ''; 
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload note. Check console for details.");
    }
  };
  
  // --- ROLE CHECK ---
  const isAuthorized = role === "ROLE_FACULTY" || role === "ROLE_STUDENT";

  if (!isAuthorized) {
    return (
      <div className="unauthorized-access-container">
        <h2>🔒 Access Denied</h2>
        <p>You must be logged in as a Faculty or Student to upload notes.</p>
      </div>
    );
  }

  // --- RENDERS FORM IF AUTHORIZED ---
  return (
    <div className="note-upload-container">
      <h2>📚 Upload Study Note</h2>
      <form onSubmit={handleSubmit} className="note-upload-form">

        <input
          type="text"
          name="title"
          placeholder="Title (e.g. Algebra Basics)"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Short description..."
          value={formData.description}
          onChange={handleChange}
          rows="3"
        ></textarea>

        <select
          name="classId"
          value={formData.classId}
          onChange={handleChange}
          required
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.className} {cls.facultyName ? `– ${cls.facultyName}` : ""}
            </option>
          ))}
        </select>

        <select
          name="subjectId"
          value={formData.subjectId}
          onChange={handleChange}
          required
        >
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>

        <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={handleFileChange} required />

        <button type="submit" className="upload-btn">Upload Note</button>
      </form>
    </div>
  );
}