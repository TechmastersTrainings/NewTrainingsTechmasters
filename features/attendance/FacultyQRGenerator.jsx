import React, { useState } from "react";
import api from "../../api/api";
import { QRCodeCanvas } from "qrcode.react";
import "./Attendance.css";

export default function FacultyQRGenerator() {
  const [qrData, setQrData] = useState("");
  const [expiry, setExpiry] = useState("");
  const [error, setError] = useState("");
  const facultyId = localStorage.getItem("userId");

  const generateQR = async () => {
    try {
      // Clear previous data while generating new
      setQrData("");
      setExpiry("");
      setError("");

      const res = await api.post("/attendance/generate-qr", {
        facultyId: facultyId,
        classId: 1, // You should make this dynamic (e.g., based on the faculty's current class)
      });
      setQrData(res.data.qrData);
      setExpiry(res.data.expiry);
    } catch (err) {
      console.error(err);
      setError("Error generating QR code. Check server connection or class ID.");
    }
  };

  return (
    <div className="page-container">
      <h2>🎓 Real-time Attendance QR Code Generator</h2>
      
      {/* --- Component Description --- */}
      <div className="info-block">
        <h3>Purpose and Function</h3>
        <p>
          This utility allows faculty members to **generate a unique, time-sensitive QR code** for instant attendance capture. This QR code contains encrypted data linked to the current class and the faculty member.
        </p>
        <p>
          Students will use the **Smart Campus mobile app scanner** (or the web scanner) to quickly scan this code, automatically marking their attendance for the current session.
        </p>
        
        <h3>Instructions</h3>
        <p>
          1. Click the **"Generate QR"** button below.
          2. The QR code will appear and display its **expiration time**.
          3. Project this QR code onto the screen for students to scan immediately.
          4. The code will become invalid after the specified time to prevent proxy attendance.
        </p>
      </div>
      {/* ----------------------------- */}

      <button onClick={generateQR} className="btn generate-btn">
        Generate New QR Code
      </button>

      {error && <p className="error-text">{error}</p>}

      {qrData && (
        <div className="qr-display">
          <QRCodeCanvas value={qrData} size={256} level="H" />
          <p className="qr-expiry">
            Code is **ACTIVE**. Valid Until: **{new Date(expiry).toLocaleTimeString()}**
          </p>
        </div>
      )}
    </div>
  );
}