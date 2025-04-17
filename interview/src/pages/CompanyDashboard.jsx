import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanySidebar from "../companyComponents/CompanySidebar";
import CompanyHome from "../companyComponents/CompanyHome";
import CompanyInterviews from "../companyComponents/CompanyInterviews";
import CreateInterview from "../companyComponents/CreateInterview";
import UploadCandidates from "../companyComponents/UploadCandidates";
import CandidateReports from "../companyComponents/CandidateReports";
import "../styles/CompanyDashboard.css";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <CompanyHome setActiveSection={setActiveSection} />;
      case "create-interview":
        return <CreateInterview />;
      case "upload-candidates":
        return <UploadCandidates />;
      case "reports":
        return <CandidateReports />;
      case "interviews":
        return <CompanyInterviews />;
      default:
        return <CompanyHome setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="dashboard-container">
      <CompanySidebar 
        setActiveSection={setActiveSection} 
        activeSection={activeSection}
        navigate={navigate}
      />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default CompanyDashboard; 