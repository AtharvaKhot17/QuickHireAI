import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import InterviewSession from './pages/InterviewSession';
import InterviewGuidelines from './interviewComponents/InterviewGuidelines';
import SkillsSelection from './interviewComponents/SkillsSelection';
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
