import { useState } from "react";
import CompanySidebar from "../companyComponents/CompanySidebar";
import CompanyHome from "../companyComponents/CompanyHome";
import CreateInterview from "../companyComponents/CreateInterview";
import UploadCandidates from "../companyComponents/UploadCandidates";
import CandidateReports from "../companyComponents/CandidateReports";
import CompanyInterviews from "../companyComponents/CompanyInterviews";
import "../styles/App.css";

function CompanyDashboard() {
  const [activeSection, setActiveSection] = useState("home");

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <CompanyHome setActiveSection={setActiveSection} />;
      case "create-interview":
        return <CreateInterview />;
      case "upload-candidates":
        return <UploadCandidates />;
      case "candidates":
        return <CompanyInterviews />;
      case "reports":
        return <CandidateReports />;
      default:
        return <CompanyHome setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="dashboard-container">
      <CompanySidebar
        setActiveSection={setActiveSection}
        activeSection={activeSection}
      />
      <main className="main-content">
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default CompanyDashboard;