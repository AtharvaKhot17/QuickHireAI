import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import WebcamFeed from '../interviewComponents/WebcamFeed';
import speechRecognitionService from '../services/speechRecognitionService';
import { api } from '../services/api';
import "../styles/InterviewManager.css";

const InterviewManager = () => {
  const { interviewCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

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

      console.log('Interview initialization response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to initialize interview');
      }

      if (response.data.interview && response.data.interview.questions && response.data.interview.questions.length > 0) {
        setCurrentQuestion(response.data.interview.questions[0]);
      } else {
        throw new Error('No questions received');
      }

    } catch (error) {
      console.error('Interview initialization error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = () => {
    try {
      speechRecognitionService.startRecording(
        (interim) => setTranscript(interim),
        (final) => setTranscript(final)
      );
      setIsRecording(true);
    } catch (error) {
      setError('Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      const finalTranscript = await speechRecognitionService.stopRecording();
      setIsRecording(false);
      // Process the answer here
    } catch (error) {
      setError('Failed to stop recording');
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
    <div className="interview-manager">
      <div className="main-content">
        <div className="question-section">
          <h2>Current Question</h2>
          {currentQuestion && (
            <div className="question-card">
              <h3>{currentQuestion.question}</h3>
              <p>Topic: {currentQuestion.topic}</p>
            </div>
          )}

          <div className="controls">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`record-button ${isRecording ? 'recording' : ''}`}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
          </div>

          <div className="transcript">
            {transcript && <p>{transcript}</p>}
          </div>
        </div>
      </div>

      <div className="webcam-section">
        <WebcamFeed />
      </div>

      <style jsx>{`
        .interview-manager {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 2rem;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .loading-screen,
        .error-screen {
          text-align: center;
          padding: 2rem;
        }

        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3182ce;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        .question-card {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin: 1rem 0;
        }

        .record-button {
          padding: 1rem 2rem;
          border-radius: 8px;
          border: none;
          background: ${isRecording ? '#dc3545' : '#28a745'};
          color: white;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .transcript {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          min-height: 100px;
          margin-top: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default InterviewManager; 