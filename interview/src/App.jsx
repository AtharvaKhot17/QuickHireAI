// import { useState } from "react";
// import CompanySidebar from "./companyComponents/CompanySidebar";
// import CompanyHome from "./companyComponents/CompanyHome";
// import CreateInterview from "./companyComponents/CreateInterview";
// import UploadCandidates from "./companyComponents/UploadCandidates";
// import CandidateReports from "./companyComponents/CandidateReports";
// import CompanyInterviews from "./companyComponents/CompanyInterviews";
// import "./styles/App.css";

// function App() {
//   const [activeSection, setActiveSection] = useState("home");

//   const renderContent = () => {
//     switch (activeSection) {
//       case "home":
//         return <CompanyHome setActiveSection={setActiveSection} />;
//       case "create-interview":
//         return <CreateInterview />;
//       case "upload-candidates":
//         return <UploadCandidates />;
//       case "candidates":
//         return <CompanyInterviews />;
//       case "reports":
//         return <CandidateReports />;
//       default:
//         return <CompanyHome setActiveSection={setActiveSection} />;
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <CompanySidebar
//         setActiveSection={setActiveSection}
//         activeSection={activeSection}
//       />
//       <main className="main-content">
//         <div className="content-wrapper">
//           {renderContent()}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;

import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import InterviewSession from './pages/InterviewSession';
import InterviewGuidelines from './interviewComponents/InterviewGuidelines';
import SkillsSelection from './interviewComponents/SkillsSelection';
import CompanyDashboard from './companyPages/CompanyDashboard'; 
import InterviewScreen from './interviewComponents/InterviewScreen';
import './styles/App.css'; // Create this file for styles

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
`;

function App() {
  return (
    <AppContainer>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/interview">
          <Route path="guidelines/:interviewCode" element={<InterviewGuidelines />} />
          <Route path="skills/:interviewCode" element={<SkillsSelection />} />
          <Route path="session/:interviewCode" element={<InterviewSession />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
