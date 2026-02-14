import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './Grade.css';

export default function GradeView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grade, setGrade] = useState(null);

  useEffect(() => {
    const loadGrade = async () => {
      try {
        const res = await api.get(`/grades/${id}`);
        setGrade(res.data);
      } catch (err) {
        console.error('Failed to load grade', err);
      }
    };
    loadGrade();
  }, [id]);

  if (!grade) return <p>Loading grade details...</p>;

  return (
    <div className="grade-view-container">
      <h2>Grade Details</h2>
      <div className="grade-card detailed">
        <p><strong>Student ID:</strong> {grade.studentId}</p>
        <p><strong>Subject:</strong> {grade.subject}</p>
        <p><strong>Marks Obtained:</strong> {grade.marksObtained}</p>
        <p><strong>Max Marks:</strong> {grade.maxMarks}</p>
        <p><strong>Grade:</strong> {grade.grade}</p>
        <p><strong>Remarks:</strong> {grade.remarks}</p>
      </div>
      <button onClick={() => navigate('/grades')} className="back-btn">Back</button>
    </div>
  );
}
