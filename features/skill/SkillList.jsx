// src/features/skill/SkillList.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Skill.css";

export default function SkillList() {
  const { role, studentId } = useContext(AuthContext);
  const [skills, setSkills] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (role === "ROLE_ADMIN" || role === "ROLE_FACULTY") await loadStudents();
      await loadSkills();
    };
    init();
  }, [role, studentId]);

  const loadStudents = async () => {
    try {
      const res = await api.get("/students/all");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

const loadSkills = async () => {
  try {
    let res;
    if (role === "ROLE_STUDENT" && studentId) {
      res = await api.get(`/skills/student/${studentId}`);
    } else {
      res = await api.get("/skills/all");
    }

    const data = Array.isArray(res.data) ? res.data : [];
    setSkills(data);
  } catch (err) {
    console.error("Failed to fetch skills:", err.response?.data || err.message);
    setSkills([]); // prevent crash
  }
};

  const getStudentName = (studentId) => {
    const s = students.find((stu) => stu.id === studentId);
    return s ? s.fullName || `Student ${s.id}` : "Unknown Student";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    try {
      await api.delete(`/skills/${id}`);
      await loadSkills();
    } catch (err) {
      console.error("Failed to delete skill", err);
      alert("Error deleting skill.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>💡 Skills</h2>
        {(role === "ROLE_ADMIN" || role === "ROLE_STUDENT") && (
          <Link to="/skills/create" className="btn btn-primary">➕ Add Skill</Link>
        )}
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Skill Name</th>
            <th>Category</th>
            <th>Proficiency</th>
            <th>Certification</th>
            <th>Acquired On</th>
            {role !== "ROLE_STUDENT" && <th>Student Name</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {skills.length > 0 ? (
            skills.map((skill) => (
              <tr key={skill.id}>
                <td>{skill.skillName}</td>
                <td>{skill.category || "-"}</td>
                <td>{skill.proficiencyLevel || "-"}</td>
                <td>{skill.certification || "-"}</td>
                <td>{skill.acquiredDate || "-"}</td>
                {role !== "ROLE_STUDENT" && (
                  <td>{getStudentName(skill.student?.id)}</td>
                )}
                <td>
                  {(role === "ROLE_ADMIN" ||
                    role === "ROLE_STUDENT" ||
                    role === "ROLE_FACULTY") && (
                    <Link
                      to={`/skills/edit/${skill.id}`}
                      className="btn btn-sm btn-info"
                    >
                      ✏️ Edit
                    </Link>
                  )}
                  {(role === "ROLE_ADMIN" || role === "ROLE_STUDENT") && (
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="btn btn-sm btn-danger"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={role === "ROLE_STUDENT" ? 6 : 7} style={{ textAlign: "center" }}>
                No skills found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
