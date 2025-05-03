import { useNavigate } from "react-router-dom";
import "../styles/CompanySidebar.css";

const CompanySidebar = ({ activeSection }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleNavigation = (section) => {
    switch (section) {
      case "home":
        navigate("/company-dashboard");
        break;
      case "create-interview":
        navigate("/company-dashboard/create-interview");
        break;
      case "candidates":
        navigate("/company-dashboard/candidates");
        break;
      case "reports":
        navigate("/company-dashboard/reports");
        break;
      case "profile":
        navigate("/company-dashboard/profile");
        break;
      case "settings":
        navigate("/company-dashboard/settings");
        break;
      case "team":
        navigate("/company-dashboard/team");
        break;
      default:
        navigate("/company-dashboard");
    }
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
              onClick={() => handleNavigation("home")}
            >
              <div className="menu-item">
                <i className="fas fa-home"></i>
                <span>Dashboard</span>
              </div>
            </li>
            <li
              className={activeSection === "create-interview" ? "active" : ""}
              onClick={() => handleNavigation("create-interview")}
            >
              <div className="menu-item">
                <i className="fas fa-plus-circle"></i>
                <span>Create Interview</span>
              </div>
            </li>
            <li
              className={activeSection === "candidates" ? "active" : ""}
              onClick={() => handleNavigation("candidates")}
            >
              <div className="menu-item">
                <i className="fas fa-users"></i>
                <span>Candidates</span>
              </div>
            </li>
            <li
              className={activeSection === "reports" ? "active" : ""}
              onClick={() => handleNavigation("reports")}
            >
              <div className="menu-item">
                <i className="fas fa-chart-bar"></i>
                <span>Reports</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="menu-section">
          <span className="section-title">ACCOUNT</span>
          <ul>
            <li
              className={activeSection === "profile" ? "active" : ""}
              onClick={() => handleNavigation("profile")}
            >
              <div className="menu-item">
                <i className="fas fa-user"></i>
                <span>Profile</span>
              </div>
            </li>
            <li
              className={activeSection === "settings" ? "active" : ""}
              onClick={() => handleNavigation("settings")}
            >
              <div className="menu-item">
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </div>
            </li>
            <li
              className={activeSection === "team" ? "active" : ""}
              onClick={() => handleNavigation("team")}
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