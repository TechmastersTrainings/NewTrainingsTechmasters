// ✅ FINAL VERSION — src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [studentId, setStudentId] = useState(localStorage.getItem("studentId") || null);
  const [fullName, setFullName] = useState(localStorage.getItem("fullName") || "");

  // ✅ Automatically attach/remove token in axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // ✅ Restore AuthContext from localStorage on page reload
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("userId");
    const storedStudentId = localStorage.getItem("studentId");
    const storedFullName = localStorage.getItem("fullName");

    if (storedToken && storedRole && storedUserId) {
      setToken(storedToken);
      setRole(storedRole);
      setUserId(storedUserId);
      setStudentId(storedStudentId);
      setFullName(storedFullName || "");
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  // ✅ Login Function (email or USN-based)
  const login = async (emailOrUsn, password) => {
    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        emailOrUsn, // matches backend `LoginRequest.java`
        password,
      });

      const data = res.data || {};
      const { token, role, userId, fullName, studentId: sid } = data;

      if (!token || !role || !userId) {
        throw new Error("Invalid login response: missing key fields");
      }

      // 🧠 Set base auth info
      setToken(token);
      setRole(role);
      setUserId(userId);
      setFullName(fullName || emailOrUsn);

      // 🧠 Persist for reload
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);
      localStorage.setItem("fullName", fullName || emailOrUsn);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // ✅ Handle student-specific case
      if (role === "ROLE_STUDENT") {
        if (sid) {
          setStudentId(sid);
          localStorage.setItem("studentId", sid);
        } else {
          // fetch manually if not provided
          try {
            const stuRes = await axios.get(
              `http://localhost:8080/students/by-user/${userId}`
            );
            const stu = stuRes.data;
            if (stu?.id) {
              setStudentId(stu.id);
              localStorage.setItem("studentId", stu.id);
            } else {
              console.warn("⚠️ Student record not found for this user.");
            }
          } catch (fetchErr) {
            console.error("❌ Failed to fetch student record:", fetchErr);
          }
        }
      }

      return true;
    } catch (err) {
      console.error("❌ Login failed:", err);
      alert("Login failed — invalid credentials or backend error.");
      return false;
    }
  };

  // ✅ Logout Function
  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
    setStudentId(null);
    setFullName(null);
    localStorage.clear();
    delete axios.defaults.headers.common["Authorization"];
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        userId,
        studentId,
        fullName,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
