import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import InterviewManager from './InterviewManager';
import "../styles/InterviewContainer.css";

const InterviewContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeInterview();
  }, []);

  const initializeInterview = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!location.state?.skills || !location.state?.interviewCode) {
        throw new Error('Missing interview data');
      }

      const response = await api.post('/interviews/start', {
        interviewCode: location.state.interviewCode,
        skills: location.state.skills
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to initialize interview');
      }

    } catch (error) {
      console.error('Interview initialization error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const stopRecording = async (transcript) => {
    try {
      const response = await api.post('/interviews/evaluate-answer', {
        interviewCode: location.state.interviewCode,
        answer: transcript
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to evaluate answer');
      }

      return response.data;
    } catch (error) {
      console.error('Error evaluating answer:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Preparing your interview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h3>Error Starting Interview</h3>
        <p>{error}</p>
        <button onClick={initializeInterview}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="interview-container">
      <InterviewManager
        onStopRecording={stopRecording}
        interviewCode={location.state?.interviewCode}
        skills={location.state?.skills}
      />
    </div>
  );
};

export default InterviewContainer; 