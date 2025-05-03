import { Routes, Route, useLocation } from "react-router-dom";
import CompanySidebar from "../companyComponents/CompanySidebar";
import CompanyHome from "../companyComponents/CompanyHome";
import CreateInterview from "../companyComponents/CreateInterview";
import UploadCandidates from "../companyComponents/UploadCandidates";
import CandidateReports from "../companyComponents/CandidateReports";
import CompanyInterviews from "../companyComponents/CompanyInterviews";
import CompanyProfile from "../companyComponents/CompanyProfile";
import "../styles/App.css";

function CompanyDashboard() {
  const location = useLocation();
  
  // Determine active section from current path
  const getActiveSection = () => {
    const path = location.pathname.split('/').pop();
    if (path === 'company-dashboard') return 'home';
    return path;
  };

  return (
    <div className="dashboard-container">
      <CompanySidebar activeSection={getActiveSection()} />
      <main className="main-content">
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<CompanyHome />} />
            <Route path="/create-interview" element={<CreateInterview />} />
            <Route path="/upload-candidates/:interviewId" element={<UploadCandidates />} />
            <Route path="/candidates" element={<CompanyInterviews />} />
            <Route path="/reports" element={<CandidateReports />} />
            <Route path="/profile" element={<CompanyProfile />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default CompanyDashboard;