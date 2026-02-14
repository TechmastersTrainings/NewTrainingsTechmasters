// src/App.jsx
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import { AuthContext } from "./context/AuthContext";
import Footer from "./components/Footer/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import ForgotPassword from "./features/auth/ForgotPassword";
import ResetPassword from "./features/auth/ResetPassword";

// Dashboard
import HomePage from "./features/dashboard/HomePage";

// Admin
import PendingApprovals from "./features/admin/PendingApprovals";

// Students
import StudentsList from "./features/students/StudentsList";
import CreateStudent from "./features/students/StudentCreate";
import UpdateStudent from "./features/students/UpdateStudent";

// Faculty
import FacultyList from "./features/faculty/FacultyList";
import FacultyCreate from "./features/faculty/FacultyCreate";
import FacultyEdit from "./features/faculty/FacultyEdit";

// Parents
import ParentList from "./features/parents/ParentList";
import ParentCreate from "./features/parents/ParentCreate";
import ParentEdit from "./features/parents/ParentEdit";

// Classes
import ClassList from "./features/classes/ClassList";
import ClassCreate from "./features/classes/ClassCreate";
import ClassEdit from "./features/classes/ClassEdit";
import ClassDashboard from "./features/classes/ClassDashboard";

// Attendance
import AttendanceList from "./features/attendance/AttendanceList";
import AttendanceCreate from "./features/attendance/AttendanceCreate";
import AttendanceEdit from "./features/attendance/AttendanceEdit";
import FacultyQRGenerator from "./features/attendance/FacultyQRGenerator";
import StudentQRScanner from "./features/attendance/StudentQRScanner";
import FacultyAttendanceMark from "./features/attendance/FacultyAttendanceMark.jsx";
import StudentAttendanceView from "./features/attendance/StudentAttendanceView.jsx";

// Grades
import GradeList from "./features/grades/GradeList";
import GradeCreate from "./features/grades/GradeCreate";
import GradeView from "./features/grades/GradeView";
import MyGrades from "./features/grades/MyGrades";

// Notifications
import NotificationList from "./features/notifications/NotificationList";
import NotificationCreate from "./features/notifications/NotificationCreate";
import NotificationEdit from "./features/notifications/NotificationEdit";
import NotificationView from "./features/notifications/NotificationView";

// Exams
import ExamList from "./features/exams/ExamList";
import ExamCreate from "./features/exams/ExamCreate";
import ExamEdit from "./features/exams/ExamEdit";

// Fees
import FeeList from "./features/fees/FeeList";
import FeeCreate from "./features/fees/FeeCreate";
import FeeEdit from "./features/fees/FeeEdit";

// Timetable
import TimetableList from "./features/timetable/TimetableList";
import TimetableCreate from "./features/timetable/TimetableCreate";
import TimetableEdit from "./features/timetable/TimetableEdit";
import TimetableView from "./features/timetable/TimetableView";

// Assignments
import AssignmentList from "./features/assignments/AssignmentList";
import AssignmentCreate from "./features/assignments/AssignmentCreate";
import AssignmentEdit from "./features/assignments/AssignmentEdit";

// Assignment Submissions
import AssignmentSubmissionsList from "./features/submissions/AssignmentSubmissionsList";
import AssignmentSubmissionView from "./features/submissions/AssignmentSubmissionView";

// Reports
import ReportsDashboard from "./features/reports/ReportsDashboard";

// Skills & Career
import SkillList from "./features/skill/SkillList";
import SkillCreate from "./features/skill/SkillCreate";
import SkillEdit from "./features/skill/SkillEdit";
import CareerRoadmapList from "./features/career/CareerRoadmapList";
import CareerRoadmapGenerate from "./features/career/CareerRoadmapGenerate";

// Discussion & AI Grading
import DiscussionBoard from "./features/discussion/DiscussionBoard";
import GradingDashboard from "./features/grading/GradingDashboard";

// Student Profile
import MyProfile from "./features/profile/MyProfile";
import EditProfile from "./features/profile/EditProfile.jsx";
import CreateProfile from "./features/profile/CreateProfile";

// Notes
import NoteList from "./features/notes/NoteList";
import NoteUpload from "./features/notes/NoteUpload";

// Subjects
import SubjectList from "./features/subjects/SubjectList";
import SubjectCreate from "./features/subjects/SubjectCreate";
import SubjectEdit from "./features/subjects/SubjectEdit";
import WeeklyTimetable from "./features/timetable/WeeklyTimetable.jsx";

function App() {
  const { token } = useContext(AuthContext);
  const isAuthPath = ["/login", "/register", "/forgot-password", "/reset-password"].includes(window.location.pathname);

  return (
    <Router>
      {(token || !isAuthPath) && <Navbar />}

      <Routes>
        {/* ===== Public Routes ===== */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ===== Protected Routes ===== */}
        {token ? (
          <>
            {/* Admin */}
            <Route path="/admin/pending-approvals" element={<PendingApprovals />} />

            {/* Students */}
            <Route path="/students" element={<StudentsList />} />
            <Route path="/students/create" element={<CreateStudent />} />
            <Route path="/students/edit/:id" element={<UpdateStudent />} />

            {/* Faculty */}
            <Route path="/faculty" element={<FacultyList />} />
            <Route path="/faculty/create" element={<FacultyCreate />} />
            <Route path="/faculty/edit/:id" element={<FacultyEdit />} />

            {/* Parents */}
            <Route path="/parents" element={<ParentList />} />
            <Route path="/parents/create" element={<ParentCreate />} />
            <Route path="/parents/edit/:id" element={<ParentEdit />} />

            {/* Classes */}
            <Route path="/classes" element={<ClassList />} />
            <Route path="/classes/create" element={<ClassCreate />} />
            <Route path="/classes/edit/:id" element={<ClassEdit />} />
            <Route path="/classes/dashboard/:id" element={<ClassDashboard />} />

            {/* Attendance */}
            <Route path="/attendance" element={<AttendanceList />} />
            <Route path="/attendance/create" element={<AttendanceCreate />} />
            <Route path="/attendance/edit/:id" element={<AttendanceEdit />} />
            <Route path="/attendance/scan" element={<StudentQRScanner />} />
            <Route path="/attendance/faculty/qr" element={<FacultyQRGenerator />} />
            <Route path="/attendance/edit/:attendanceId" element={<AttendanceEdit />}
/>

            {/* ✅ Correct Routes */}
            <Route path="/attendance/mark/:classId" element={<FacultyAttendanceMark />} />
            <Route path="/attendance/student/view" element={<StudentAttendanceView />} />

            {/* Grades */}
            <Route path="/grades" element={<GradeList />} />
            <Route path="/grades/create" element={<GradeCreate />} />
            <Route path="/my-grades" element={<MyGrades />} />
            <Route path="/grades/view/:id" element={<GradeView />} />

            {/* Notifications */}
            <Route path="/notifications" element={<NotificationList />} />
            <Route path="/notifications/create" element={<NotificationCreate />} />
            <Route path="/notifications/edit/:id" element={<NotificationEdit />} />
            <Route path="/notifications/view/:id" element={<NotificationView />} />

            {/* Exams */}
            <Route path="/exams" element={<ExamList />} />
            <Route path="/exams/create" element={<ExamCreate />} />
            <Route path="/exams/edit/:id" element={<ExamEdit />} />

            {/* Fees */}
            <Route path="/fees" element={<FeeList />} />
            <Route path="/fees/create" element={<FeeCreate />} />
            <Route path="/fees/edit/:id" element={<FeeEdit />} />

            {/* Timetable */}
            <Route path="/timetable" element={<TimetableList />} />
            <Route path="/timetable/create" element={<TimetableCreate />} />
            <Route path="/timetable/edit/:id" element={<TimetableEdit />} />
            <Route path="/timetable/view/:id" element={<TimetableView />} />
            <Route path="/timetable/weekly" element={<WeeklyTimetable />} />

            {/* Assignments */}
            <Route path="/assignments" element={<AssignmentList />} />
            <Route path="/assignments/create" element={<AssignmentCreate />} />
            <Route path="/assignments/edit/:id" element={<AssignmentEdit />} />
            <Route path="/assignments/:assignmentId/submissions" element={<AssignmentSubmissionsList />} />

            {/* Submissions */}
            <Route path="/my-submissions" element={<AssignmentSubmissionView />} />

            {/* Reports */}
            <Route path="/reports" element={<ReportsDashboard />} />

            {/* Skills & Career */}
            <Route path="/skills" element={<SkillList />} />
            <Route path="/skills/create" element={<SkillCreate />} />
            <Route path="/skills/edit/:id" element={<SkillEdit />} />
            <Route path="/career-roadmap" element={<CareerRoadmapList />} />
            <Route path="/career-roadmap/generate" element={<CareerRoadmapGenerate />} />

            {/* Discussion & AI Grading */}
            <Route path="/class-discussion/:classId" element={<DiscussionBoard />} />
            <Route path="/grading" element={<GradingDashboard />} />

            {/* Profile */}
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/create" element={<CreateProfile />} />

            {/* Notes */}
            <Route path="/notes" element={<NoteList />} />
            <Route path="/notes/upload" element={<NoteUpload />} />

            {/* Subjects */}
            <Route path="/subjects" element={<SubjectList />} />
            <Route path="/subjects/create" element={<SubjectCreate />} />
            <Route path="/subjects/edit/:id" element={<SubjectEdit />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </Router>
  );
}

export default App;
