import "../styles/Sidebar.css";
import { useState } from "react";

const Sidebar = ({ setActiveSection, activeSection, navigate }) => {
  const handleLogout = () => {
    // Add any logout logic here
    navigate("/"); // Navigate to landing page on logout
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-graduation-cap"></i>
          <h2>QuickHire AI</h2>
        </div>
      </div>

      <div className="nav-menu">
        <div className="menu-section">
          <span className="section-title">MENU</span>
          <ul>
            <li
              className={activeSection === "home" ? "active" : ""}
              onClick={() => setActiveSection("home")}
            >
              <div className="menu-item">
                <i className="fas fa-home"></i>
                <span>Dashboard</span>
              </div>
            </li>
            <li
              className={activeSection === "interviews" ? "active" : ""}
              onClick={() => setActiveSection("interviews")}
            >
              <div className="menu-item">
                <i className="fas fa-video"></i>
                <span>Interviews</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="menu-section">
          <span className="section-title">ACCOUNT</span>
          <ul>
            <li
              className={activeSection === "profile" ? "active" : ""}
              onClick={() => setActiveSection("profile")}
            >
              <div className="menu-item">
                <i className="fas fa-user"></i>
                <span>Profile</span>
              </div>
            </li>
            <li
              className={activeSection === "settings" ? "active" : ""}
              onClick={() => setActiveSection("settings")}
            >
              <div className="menu-item">
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <button onClick={handleLogout} className="logout-btn">
        <i className="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </button>

      <style jsx>{`
        .sidebar {
          width: 260px;
          background: white;
          min-height: 100vh;
          padding: 1.5rem;
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
        }

        .sidebar-header {
          padding: 0 1.5rem 1.5rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid #edf2f7;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .logo i {
          font-size: 1.5rem;
          color: #3182ce;
        }

        .logo h2 {
          margin: 0;
          color: #2d3748;
          font-size: 1.25rem;
        }

        .nav-menu {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .menu-section {
          margin-bottom: 2rem;
        }

        .section-title {
          color: #718096;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
        }

        li {
          cursor: pointer;
          margin-bottom: 0.5rem;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: #4a5568;
          border-radius: 8px;
          transition: all 0.2s;
        }

        li:hover .menu-item {
          background: rgba(49, 130, 206, 0.1);
          color: #3182ce;
        }

        li.active .menu-item {
          background: #3182ce;
          color: white;
        }

        .logout-btn {
          margin: 1.5rem;
          padding: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #e53e3e;
          background: none;
          border: 1px solid #e53e3e;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }

        .logout-btn:hover {
          background: #e53e3e;
          color: white;
        }

        .logout-btn i,
        .logout-btn span {
          color: inherit;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            min-height: auto;
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
