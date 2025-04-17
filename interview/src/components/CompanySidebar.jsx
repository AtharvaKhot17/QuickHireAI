import "../styles/CompanySidebar.css";

const CompanySidebar = ({ activeSection, setActiveSection, onLogout }) => {
  return (
    <aside className="company-sidebar">
      <div className="sidebar-header">
        <h2>QuickHire AI</h2>
        <p>Company Portal</p>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3>Main Menu</h3>
          <ul>
            <li>
              <button
                className={activeSection === "create-interview" ? "active" : ""}
                onClick={() => setActiveSection("create-interview")}
              >
                Create Interview
              </button>
            </li>
            <li>
              <button
                className={activeSection === "interview-list" ? "active" : ""}
                onClick={() => setActiveSection("interview-list")}
              >
                Interview List
              </button>
            </li>
            <li>
              <button
                className={activeSection === "candidate-reports" ? "active" : ""}
                onClick={() => setActiveSection("candidate-reports")}
              >
                Candidate Reports
              </button>
            </li>
          </ul>
        </div>

        <div className="nav-section">
          <h3>Account</h3>
          <ul>
            <li>
              <button
                className={activeSection === "settings" ? "active" : ""}
                onClick={() => setActiveSection("settings")}
              >
                Settings
              </button>
            </li>
            <li>
              <button onClick={onLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default CompanySidebar; 