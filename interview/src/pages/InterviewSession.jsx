import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import InterviewScreen from '../interviewComponents/InterviewScreen';
import FinalEvaluation from '../interviewComponents/FinalEvaluation';
import { api } from '../services/api';
import "../styles/InterviewSession.css";
import ErrorBoundary from '../components/ErrorBoundary';

const InterviewSession = () => {
  const { interviewCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateSession = () => {
      try {
        if (!location.state?.skills || !location.state?.interviewData) {
          const storedData = sessionStorage.getItem('interviewData');
          const storedSkills = sessionStorage.getItem('selectedSkills');

          if (!storedData || !storedSkills) {
            console.error('Missing required interview data');
            navigate(`/interview/guidelines/${interviewCode}`);
            return;
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error validating session:', error);
        setError('Failed to initialize interview session');
        setIsLoading(false);
      }
    };

    validateSession();
  }, [location.state, interviewCode, navigate]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Initializing Interview</h2>
          <p>Please wait while we set up your session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <ErrorBoundary>
      <div className="interview-session">
        <InterviewScreen />
      </div>
    </ErrorBoundary>
  );
};

export default InterviewSession;
