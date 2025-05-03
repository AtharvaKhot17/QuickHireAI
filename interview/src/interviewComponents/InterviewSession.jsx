import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import '../styles/InterviewSession.css';
import { api } from '../services/api';

const InterviewSession = () => {
  const location = useLocation();
  const { interviewCode } = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateSession = async () => {
      try {
        // First check if we have data from navigation state
        if (location.state?.interviewData) {
          setInterviewData(location.state.interviewData);
          setIsLoading(false);
          return;
        }

        // If no state data, fetch from API
        const response = await api.get(`/interviews/${interviewCode}`);
        if (response.data.success) {
          setInterviewData(response.data.interview);
        } else {
          throw new Error('Failed to fetch interview data');
        }
      } catch (error) {
        console.error('Error validating session:', error);
        setError(error.message || 'Failed to validate interview session');
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [interviewCode, location.state]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>Loading Interview Session...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>Missing required interview data</p>
      </div>
    );
  }

  return (
    <div className="interview-session">
      <h1>Interview Session</h1>
      <div className="session-info">
        <p>Interview Code: {interviewCode}</p>
        <p>Skills: {interviewData.skills.join(', ')}</p>
        <p>Status: {interviewData.status}</p>
      </div>
      {/* Add your interview interface components here */}
    </div>
  );
};

export default InterviewSession; 