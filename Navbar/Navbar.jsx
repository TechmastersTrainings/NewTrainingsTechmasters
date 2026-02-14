// src/components/Navbar/Navbar.jsx
import React, { useContext } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { token, role, fullName, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar fade-in">
      {/* Brand */}
      <div className="navbar-brand">
        <Link to="/" className="logo">Smart Campus</Link>
      </div>

      {/* ================= MAIN NAV LINKS ================= */}
      <div className="nav-links-main">
        <NavLink to="/">Home</NavLink>

        {/* ========== ADMIN ========== */}
        {role === "ROLE_ADMIN" && (
          <>
            <div className="nav-dropdown">
              <span className="nav-link-title">Users ▾</span>
              <ul className="dropdown-menu">
                <li><NavLink to="/students">Students</NavLink></li>
                <li><NavLink to="/faculty">Faculty</NavLink></li>
                <li><NavLink to="/parents">Parents</NavLink></li>
              </ul>
            </div>

            <div className="nav-dropdown">
              <span className="nav-link-title">Management ▾</span>
              <ul className="dropdown-menu">
                <li><NavLink to="/classes">Classes</NavLink></li>
                <li><NavLink to="/subjects">Subjects</NavLink></li>
                <li><NavLink to="/timetable">Timetable</NavLink></li>
                <li><NavLink to="/timetable/weekly">Weekly View</NavLink></li>
                <li><NavLink to="/exams">Exams</NavLink></li>
                <li><NavLink to="/assignments">Assignments</NavLink></li>
                <li><NavLink to="/grades">Grades</NavLink></li>
                <li><NavLink to="/fees">Fees</NavLink></li>
              </ul>
            </div>

            <div className="nav-dropdown">
              <span className="nav-link-title">Utilities ▾</span>
              <ul className="dropdown-menu">
                <li><NavLink to="/attendance/mark/1">Mark Attendance</NavLink></li>
                <li><NavLink to="/attendance/list">View Attendance</NavLink></li>
                <li><NavLink to="/notifications">Notifications</NavLink></li>
                <li><NavLink to="/notes">Notes</NavLink></li>
                <li><NavLink to="/skills">Skills</NavLink></li>
                <li><NavLink to="/reports">Reports</NavLink></li>
              </ul>
            </div>
          </>
        )}

        {/* ========== FACULTY ========== */}
        {role === "ROLE_FACULTY" && (
          <>
            <div className="nav-dropdown">
              <span className="nav-link-title">Faculty Panel ▾</span>
              <ul className="dropdown-menu">
                <li><NavLink to="/students">Students</NavLink></li>
                <li><NavLink to="/classes">Classes</NavLink></li>
                <li><NavLink to="/attendance/mark/1">Mark Attendance</NavLink></li>
                <li><NavLink to="/attendance/list">View Attendance</NavLink></li>
                <li><NavLink to="/grades">Grades</NavLink></li>
                <li><NavLink to="/assignments">Assignments</NavLink></li>
              </ul>
            </div>

            <div className="nav-dropdown">
              <span className="nav-link-title">Faculty Tools ▾</span>
              <ul className="dropdown-menu">
                <li><NavLink to="/notes">Notes</NavLink></li>
                <li><NavLink to="/subjects">Subjects</NavLink></li>
                <li><NavLink to="/exams">Exams</NavLink></li>
                <li><NavLink to="/timetable">Timetable</NavLink></li>
                <li><NavLink to="/timetable/weekly">Weekly View</NavLink></li>
                <li><NavLink to="/notifications">Notifications</NavLink></li>
              </ul>
            </div>
          </>
        )}

        {/* ========== STUDENT ========== */}
        {role === "ROLE_STUDENT" && (
          <>
            <div className="nav-dropdown">
              <span className="nav-link-title">Student Account ▾</span>
              <ul className="dropdown-menu">
                <li><NavLink to="/profile">Profile</NavLink></li>
                <li><NavLink to="/skills">My Skills</NavLink></li>
                <li><NavLink to="/student/attendance">My Attendance</NavLink></li>
                <li><NavLink to="/grades">My Grades</NavLink></li>
                <li><NavLink to="/notifications">Notifications</NavLink></li>
              </ul>
            </div>

            <div className="nav-dropdown">
              <span className="nav-link-title">Academy ▾</span>
              <ul className="dropdown-menu">
                <li><NavLink to="/classes">Courses</NavLink></li>
                <li><NavLink to="/notes">Notes</NavLink></li>
                <li><NavLink to="/subjects">Subjects</NavLink></li>
                <li><NavLink to="/timetable">Timetable</NavLink></li>
                <li><NavLink to="/timetable/weekly">Weekly View</NavLink></li>
                <li><NavLink to="/exams">Exams</NavLink></li>
                <li><NavLink to="/assignments">Assignments</NavLink></li>
                <li><NavLink to="/my-submissions">Submissions</NavLink></li>
                <li><NavLink to="/fees">Fees</NavLink></li>
              </ul>
            </div>
          </>
        )}
      </div>

      {/* ================= AUTH / USER AREA ================= */}
      <div className="nav-auth">
        {token ? (
          <>
            <span className="user-welcome">
              Welcome, {fullName?.split(" ")[0] || "User"}{" "}
              <span className="user-role-display">
                ({role?.replace("ROLE_", "")})
              </span>
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          !isAuthPage && (
            <>
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/register" className="register-btn">Register</Link>
            </>
          )
        )}
      </div>
    </nav>
  );
}
