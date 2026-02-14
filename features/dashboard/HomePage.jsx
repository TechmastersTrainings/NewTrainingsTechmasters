import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; 

export default function HomePage() {
    return (
        <div className="homepage-container fade-in">
            
            {/* --- HERO SECTION: Dark Gradient Background --- */}
            <section className="hero-section">
                <div className="hero-content slide-up">
                    <h1 className="hero-title">
                        Smart Campus <br />
                        <span className="highlight">Management System</span>
                    </h1>
                    <p className="hero-tagline">
                        Streamline administration, empower education, and manage your entire campus workflow from one single, beautiful dashboard.
                    </p>
                    
                    {/* --- REMOVED Role-Based CTAs --- */}
                </div>
            </section>

            {/* --- BENTO GRID FEATURES: Light Layered Background --- */}
            <section className="features-container">
                <div className="section-header">
                    <h2>Everything you need</h2>
                    <p>Powerful features wrapped in a simple design.</p>
                </div>

                <div className="bento-grid"> 
                    
                    {/* ROW 1 & 2: Large Feature Card (Student Records) - Spans 2 Rows */}
                    <div className="bento-card large blue-gradient">
                        <div className="card-icon">📂</div>
                        <h3>Student Records</h3>
                        {/* 🚀 Updated to use an unordered list (<ul>) */}
                        <ul className="record-list">
                            <li>Maintain **complete and longitudinal student profiles**, from admissions to detailed academic performance across all semesters.</li>
                            <li>Centralized, secure database tracks **behavioral logs, disciplinary history, and crucial communication records**.</li>
                            <li>Easy management of immunization records and student medical information for safety compliance.</li>
                            <li>Generate in-depth, customizable reports for internal analysis, parental review, and mandatory regulatory compliance instantly.</li>
                        </ul>
                    </div>

                    {/* ROW 1: Medium Feature Card (Admin) */}
                    <div className="bento-card medium">
                        <div className="card-icon">💻</div>
                        <h3>Admin Module</h3>
                        <p>Manage courses, admissions, user roles, and system settings efficiently from the central admin dashboard.</p>
                    </div>

                    {/* ROW 1: Medium Feature Card (Attendance) */}
                    <div className="bento-card medium">
                        <div className="card-icon">✅</div>
                        <h3>Attendance Tracking</h3>
                        <p>Seamlessly record class attendance with one click. Generate reports and notify parents automatically.</p>
                    </div>

                    {/* ROW 2: Medium Feature Card (Finance) */}
                    <div className="bento-card medium">
                        <div className="card-icon">💰</div>
                        <h3>Finance & Billing</h3>
                        <p>Automate fee collection, generate digital invoices, track payments, and manage institutional expenses securely.</p>
                    </div>

                    {/* ROW 2: Medium Feature Card (Library) */}
                    <div className="bento-card medium">
                        <div className="card-icon">📚</div>
                        <h3>Library Management</h3>
                        <p>Digital cataloging, easy check-in/out, overdue alerts, and management of both physical and digital resource libraries.</p>
                    </div>
                    
                    {/* ROW 3: Feature Card (Data Security) */}
                    <div className="bento-card medium">
                        <div className="card-icon">🔒</div>
                        <h3>Data Security</h3>
                        <p>Bank-grade security ensures custom access permissions for students, faculty, admins, and staff, protecting sensitive data.</p>
                    </div>
                    
                    {/* ROW 3: Feature Card (Messaging) */}
                    <div className="bento-card medium">
                        <div className="card-icon">💬</div>
                        <h3>Messaging & Alerts</h3>
                        <p>Real-time chat and communication portal connecting students, parents, and faculty with urgent, personalized notifications.</p>
                    </div>

                    {/* ROW 3: Feature Card (Career) */}
                    <div className="bento-card medium">
                        <div className="card-icon">💼</div>
                        <h3>Career & Profiles</h3>
                        <p>Connect students with alumni, internship opportunities, career guidance resources, and post-graduation profile management.</p>
                    </div>
                </div>
            </section>
            
            {/* --- NEW SECTION: Campus Highlights --- */}
            <section className="campus-highlights-container">
                <div className="section-header">
                    <h2>Campus Life & Highlights</h2>
                    <p>See the achievements, announcements, and life on campus in real-time.</p>
                </div>
                
                <div className="highlights-grid">
                    <div className="highlight-card announcement-card">
                        <h3>📣 Latest Announcements</h3>
                        <p>Annual General Body Meeting scheduled for Friday at 10 AM in the Main Auditorium.</p>
                        <Link to="/announcements" className="link-text">View All Updates →</Link>
                    </div>
                    <div className="highlight-card gallery-card">
                        <h3>📸 Photo Gallery</h3>
                        <p>Relive moments from Sports Day 2025. Over 200 high-resolution photos now available for download.</p>
                        <Link to="/gallery" className="link-text">Browse Photos →</Link>
                    </div>
                    <div className="highlight-card achievements-card">
                        <h3>🏆 Top Achievements</h3>
                        <p>Congratulations to the Robotics Team for winning the National Science Fair! Details on the upcoming celebration event.</p>
                        <Link to="/achievements" className="link-text">Explore Honors →</Link>
                    </div>
                </div>
            </section>


            <footer className="homepage-footer">
                <p>© 2025 Smart Campus Management System. Built for the future of education.</p>
            </footer>
        </div>
    );
}