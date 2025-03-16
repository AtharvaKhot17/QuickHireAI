import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../studentComponents/Sidebar";
import Home from "../studentComponents/Home";
import Interview from "../studentComponents/Interview";
// import Practice from "../components/Practice";
// import Results from "../components/Results";
// import Profile from "../components/Profile";
import "../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <Home />;
      case "interviews":
        return <Interview />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        setActiveSection={setActiveSection} 
        activeSection={activeSection}
        navigate={navigate}
      />
      <main className="main-content">
        {renderContent()}
      </main>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background-color: #f8fafc;
        }

        .main-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          background-color: #f8fafc;
        }

        @media (max-width: 768px) {
          .dashboard-container {
            flex-direction: column;
          }

          .main-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;

