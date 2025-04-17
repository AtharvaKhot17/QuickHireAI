import "../styles/CompanySidebar.css";

const CompanySidebar = ({ setActiveSection, activeSection, navigate }) => {
  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-building"></i>
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
              className={activeSection === "create-interview" ? "active" : ""}
              onClick={() => setActiveSection("create-interview")}
            >
              <div className="menu-item">
                <i className="fas fa-plus-circle"></i>
                <span>Create Interview</span>
              </div>
            </li>
            <li
              className={activeSection === "upload-candidates" ? "active" : ""}
              onClick={() => setActiveSection("upload-candidates")}
            >
              <div className="menu-item">
                <i className="fas fa-file-upload"></i>
                <span>Upload Candidates</span>
              </div>
            </li>
            <li
              className={activeSection === "candidates" ? "active" : ""}
              onClick={() => setActiveSection("candidates")}
            >
              <div className="menu-item">
                <i className="fas fa-users"></i>
                <span>Candidates</span>
              </div>
            </li>
            <li
              className={activeSection === "reports" ? "active" : ""}
              onClick={() => setActiveSection("reports")}
            >
              <div className="menu-item">
                <i className="fas fa-chart-bar"></i>
                <span>Reports</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="menu-section">
          <span className="section-title">MANAGEMENT</span>
          <ul>
            <li
              className={activeSection === "positions" ? "active" : ""}
              onClick={() => setActiveSection("positions")}
            >
              <div className="menu-item">
                <i className="fas fa-briefcase"></i>
                <span>Positions</span>
              </div>
            </li>
            <li
              className={activeSection === "templates" ? "active" : ""}
              onClick={() => setActiveSection("templates")}
            >
              <div className="menu-item">
                <i className="fas fa-file-alt"></i>
                <span>Templates</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="menu-section">
          <span className="section-title">ACCOUNT</span>
          <ul>
            <li
              className={activeSection === "settings" ? "active" : ""}
              onClick={() => setActiveSection("settings")}
            >
              <div className="menu-item">
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </div>
            </li>
            <li
              className={activeSection === "team" ? "active" : ""}
              onClick={() => setActiveSection("team")}
            >
              <div className="menu-item">
                <i className="fas fa-users-cog"></i>
                <span>Team</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <button onClick={handleLogout} className="logout-btn">
        <i className="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default CompanySidebar; 