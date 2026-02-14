import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import api from "../../api/api";
import "./Attendance.css";

export default function StudentQRScanner() {
  const [scanResult, setScanResult] = useState("");
  const [error, setError] = useState("");
  const studentId = localStorage.getItem("userId");

  const handleScan = async (result) => {
    if (!result || scanResult) return; // prevent multiple triggers

    // Extract rawValue safely
    const qrText = typeof result === "string" ? result : result?.rawValue;
    if (!qrText) return;

    setScanResult(qrText);

    try {
      const res = await api.post("/attendance/mark-qr", {
        studentId,
        qrData: qrText,
      });
      alert("✅ " + res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to mark attendance.");
    }
  };

  const handleError = (err) => {
    console.error("QR Error:", err);
    setError(
      "Camera access denied or unavailable. Please allow camera permissions and refresh the page."
    );
  };

  return (
    <div className="page-container">
      <h2>📸 Scan QR to Mark Attendance</h2>

      {/* --- ADDED DESCRIPTION BLOCK --- */}
      <div className="info-block">
        <p>
          Welcome to the **Digital Attendance System**. To mark your presence for the current class or session, please follow these steps:
        </p>
        <ol>
          <li>Ensure your camera access is **allowed** by your browser.</li>
          <li>Point your device's camera at the **QR code** displayed by your instructor.</li>
          <li>The attendance will be marked automatically once the code is successfully scanned.</li>
        </ol>
        <p className="warning-note">
          **Note:** Attendance can only be marked during the designated class time.
        </p>
      </div>
      {/* ------------------------------- */}

      {error && <p className="error-text">{error}</p>}

      {!scanResult ? (
        <div className="qr-scanner-container">
          <Scanner
            onScan={handleScan}
            onError={handleError}
            constraints={{ facingMode: "environment" }}
            styles={{
              container: {
                width: "320px",
                height: "320px",
                margin: "auto",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 0 15px rgba(0,0,0,0.2)",
              },
              video: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
              },
            }}
          />
        </div>
      ) : (
        <div className="success-msg">
          Attendance recorded successfully!
          <p>Scanned Data: {scanResult}</p>
        </div>
      )}
    </div>
  );
}