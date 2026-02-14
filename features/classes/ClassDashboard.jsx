import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import './ClassDashboard.css'; 

export default function ClassDashboard() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user, role } = useContext(AuthContext);

  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    fullName: "",
    email: "",
    rollNumber: "",
    usn: "",
    semester: "",
    active: true,
  });

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [postType, setPostType] = useState("DISCUSSION");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClassInfo();
    loadStudents();
    loadPosts();
    const interval = setInterval(loadPosts, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const loadClassInfo = async () => {
    try {
      const res = await api.get(`/classes/${id}`);
      setClassInfo(res.data);
    } catch (err) {
      console.error("❌ Failed to load class info", err);
      navigate("/classes");
    }
  };

  const loadStudents = async () => {
    try {
      const res = await api.get(`/students/class/${id}`);
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Failed to load students", err);
      setStudents([]);
    }
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ FIXED: Properly attach classEntity for backend mapping
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.fullName || !newStudent.email) {
      alert("Please fill all mandatory fields.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        fullName: newStudent.fullName,
        email: newStudent.email,
        rollNumber: newStudent.rollNumber,
        usn: newStudent.usn,
        semester: newStudent.semester,
        active: true,
        classEntity: { id: parseInt(id) }, // ✅ correct payload structure
      };

      await api.post("/students/create", payload);
      alert("✅ Student added successfully!");

      setNewStudent({
        fullName: "",
        email: "",
        rollNumber: "",
        usn: "",
        semester: "",
        active: true,
      });

      loadStudents();
    } catch (err) {
      console.error("❌ Failed to add student", err);
      alert(err.response?.data?.message || "Failed to add student. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to remove this student?")) return;
    try {
      await api.delete(`/students/${studentId}`);
      loadStudents();
    } catch (err) {
      console.error("❌ Failed to delete student", err);
      alert("Failed to remove student. Check console.");
    }
  };

  const loadPosts = async () => {
    try {
      const res = await api.get(`/class-posts/by-class/${id}`);
      setPosts(res.data || []);
    } catch (err) {
      console.error("❌ Failed to load posts", err);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    const postData = {
      classId: id,
      content: newPost,
      authorName: user?.fullName || "Unknown User",
      authorRole: role === "ROLE_FACULTY" ? "TEACHER" : "STUDENT",
      type: postType,
    };
    try {
      await api.post("/class-posts/create", postData);
      setNewPost("");
      loadPosts();
    } catch (err) {
      console.error("❌ Failed to post", err);
      alert("Failed to create post. Check console.");
    }
  };

  if (!classInfo) return <div className="loading-screen">Loading Classroom...</div>;

  return (
    <div className="dashboard-container fade-in">
      {/* ===== HEADER ===== */}
      <div className="class-header-banner">
        <div>
          <h1>{classInfo.className}</h1>
          <p>{classInfo.department} — Section {classInfo.section}</p>
          <p className="room-badge">📍 Room {classInfo.roomNumber || "N/A"}</p>
        </div>
        <div className="class-stats">
          <span>👥 Students: {students.length} / {classInfo.capacity || 0}</span>
          <button className="back-btn" onClick={() => navigate("/classes")}>← Back to List</button>
        </div>
      </div>

      {/* ===== DISCUSSION SECTION ===== */}
      <div className="discussion-container">
        <h2>💬 Class Discussions & Q&A</h2>

        <div className="post-creator-card">
          <div className="post-tabs">
            <button className={postType === "DISCUSSION" ? "active" : ""} onClick={() => setPostType("DISCUSSION")}>Discussion</button>
            <button className={postType === "QnA" ? "active" : ""} onClick={() => setPostType("QnA")}>Ask Q&A</button>
            {(role === "ROLE_FACULTY" || role === "ROLE_ADMIN") && (
              <button className={postType === "ANNOUNCEMENT" ? "active" : ""} onClick={() => setPostType("ANNOUNCEMENT")}>Announcement</button>
            )}
          </div>
          <form onSubmit={handlePostSubmit}>
            <textarea
              placeholder={postType === "QnA" ? "Ask a question..." : "Share something with the class..."}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="post-actions">
              <button type="submit" className="post-btn">Post</button>
            </div>
          </form>
        </div>

        <div className="stream-feed">
          {posts.length === 0 ? (
            <div className="no-posts">
              <p>No discussions yet. Be the first to post!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className={`post-card type-${post.type.toLowerCase()}`}>
                <div className="post-header">
                  <div className="author-avatar">{post.authorName.charAt(0)}</div>
                  <div className="post-meta">
                    <span className="author-name">
                      {post.authorName}
                      {post.authorRole === "TEACHER" && <span className="badge-teacher">Teacher</span>}
                    </span>
                    <span className="post-date">
                      {new Date(post.createdAt).toLocaleDateString()} • {post.type}
                    </span>
                  </div>
                </div>
                <div className="post-body">{post.content}</div>
                <div className="post-footer">
                  <button className="action-link">👍 Like</button>
                  <button className="action-link">💬 Reply</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== STUDENT MANAGEMENT SECTION ===== */}
      {(role === "ROLE_FACULTY" || role === "ROLE_ADMIN") && (
        <div className="student-management-container">
          <h2>🎓 Manage Students ({students.length} / {classInfo.capacity || '—'})</h2>

          <div className="management-flex-container">
            {/* Add Student Form */}
            <div className="add-student-card">
              <h4>Enroll New Student</h4>
              <form className="add-student-form" onSubmit={handleAddStudent}>
                <input name="fullName" placeholder="Full Name *" value={newStudent.fullName} onChange={handleStudentChange} required />
                <input name="email" type="email" placeholder="Email *" value={newStudent.email} onChange={handleStudentChange} required />
                <input name="rollNumber" placeholder="Roll No" value={newStudent.rollNumber} onChange={handleStudentChange} />
                <input name="usn" placeholder="USN" value={newStudent.usn} onChange={handleStudentChange} />
                <input name="semester" type="number" placeholder="Semester" value={newStudent.semester} onChange={handleStudentChange} />
                <button type="submit" className="add-student-btn" disabled={loading}>
                  {loading ? "Adding..." : "+ Enroll Student"}
                </button>
              </form>

              {students.length > 0 && (
                <button className="btn-attendance" onClick={() => navigate(`/attendance/mark/${id}`)}>
                  🎯 Go to Attendance
                </button>
              )}
            </div>

            {/* Students Table */}
            <div className="students-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Roll</th>
                    <th>USN</th>
                    <th>Sem</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center", color: "#9e9e9e" }}>
                        No students currently enrolled.
                      </td>
                    </tr>
                  ) : (
                    students.map((s, i) => (
                      <tr key={s.id}>
                        <td>{i + 1}</td>
                        <td>{s.fullName}</td>
                        <td>{s.email}</td>
                        <td>{s.rollNumber || "—"}</td>
                        <td>{s.usn || "—"}</td>
                        <td>{s.semester || "—"}</td>
                        <td>
                          <span className={s.active ? "status-active" : "status-inactive"}>
                            {s.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <button className="delete-student-btn" onClick={() => handleDeleteStudent(s.id)}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
