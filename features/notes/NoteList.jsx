import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import api from "../../api/api";
import "./Notes.css";

export default function NoteList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const res = await api.get("/notes/all"); 
      setNotes(res.data);
    } catch (err) {
      console.error("Failed to load notes", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (note) => {
    if (!note.fileUrl) {
      alert("No file found for this note!");
      return;
    }
    window.open(`http://localhost:8080${note.fileUrl}`, "_blank");
  };

  if (loading) return <div className="loading-screen">Loading notes...</div>;

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h1>📚 Digital Library</h1>
        <p>Access uploaded notes and learning materials anytime.</p>
        
        {/* --- UPDATED LINK TEXT --- */}
        <Link to="/notes/upload" className="upload-note-link">
          + Upload New Note
        </Link>
        {/* ------------------------- */}
      </div>

      {notes.length === 0 ? (
        <div className="empty-state">
          <p>No notes uploaded yet.</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <div key={note.id} className="note-card">
              <h3>{note.title}</h3>
              <p className="note-desc">{note.description || "No description provided."}</p>

              <div className="note-meta">
                <p><strong>📘 Subject ID:</strong> {note.subjectId}</p>
                <p><strong>🏫 Class ID:</strong> {note.classId}</p>
                <p><strong>👤 Uploaded By:</strong> {note.uploadedBy}</p>
                <p><strong>🕒 Uploaded:</strong> {new Date(note.uploadedAt).toLocaleString()}</p>
              </div>

              <button className="download-btn" onClick={() => handleDownload(note)}>
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}