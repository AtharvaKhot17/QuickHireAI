import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-graduation-cap"></i>
          <h2>QuickHire AI</h2>
        </div>
      </div>

      <nav className="nav-menu">
        <div className="menu-section">
          <h3 className="section-title">MAIN MENU</h3>
          <ul>
            <li className={isActive('/student/dashboard') ? 'active' : ''}>
              <Link to="/student/dashboard" className="menu-item">
                <i className="fas fa-home"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={isActive('/student/interviews') ? 'active' : ''}>
              <Link to="/student/interviews" className="menu-item">
                <i className="fas fa-video"></i>
                <span>Interviews</span>
              </Link>
            </li>
            <li className={isActive('/student/profile') ? 'active' : ''}>
              <Link to="/student/profile" className="menu-item">
                <i className="fas fa-user"></i>
                <span>Profile</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="menu-section">
          <h3 className="section-title">RESOURCES</h3>
          <ul>
            <li className={isActive('/student/resources') ? 'active' : ''}>
              <Link to="/student/resources" className="menu-item">
                <i className="fas fa-book"></i>
                <span>Learning Resources</span>
              </Link>
            </li>
            <li className={isActive('/student/support') ? 'active' : ''}>
              <Link to="/student/support" className="menu-item">
                <i className="fas fa-question-circle"></i>
                <span>Support</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <button className="logout-btn">
        <i className="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
