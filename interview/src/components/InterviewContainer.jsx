import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import WebcamFeed from '../interviewComponents/WebcamFeed';
import speechRecognitionService from '../services/speechRecognitionService';
import { api } from '../services/api';

const InterviewContainer = () => {
  const { interviewCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location.state?.skills || !location.state?.interviewCode) {
      navigate(`/interview/skills/${interviewCode}`);
      return;
    }
    initializeInterview();
  }, []);

  const initializeInterview = async () => {
    try {
      setIsProcessing(true);
      const response = await api.post('/interview/start', {
        interviewCode,
        skills: location.state.skills
      });

      if (response.data.success && response.data.interview.questions.length > 0) {
        setCurrentQuestion(response.data.interview.questions[0]);
        setTotalQuestions(response.data.interview.questions.length);
      } else {
        throw new Error('No questions received from server');
      }
    } catch (error) {
      console.error('Error initializing interview:', error);
      setError('Failed to start interview. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = () => {
    try {
      speechRecognitionService.startRecording(
        (interim) => setTranscript(interim),
        (final) => setTranscript(final)
      );
      setIsRecording(true);
      setError(null);
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to start recording. Please check your microphone.');
    }
  };

  const stopRecording = async () => {
    try {
      const finalTranscript = await speechRecognitionService.stopRecording();
      setIsRecording(false);
      setIsProcessing(true);

      const response = await api.post('/interview/evaluate-answer', {
        answer: finalTranscript,
        question: currentQuestion,
        interviewCode
      });

      setFeedback(response.data);
      
      if (questionNumber < totalQuestions) {
        setQuestionNumber(prev => prev + 1);
        setCurrentQuestion(response.data.nextQuestion);
      } else {
        // Handle interview completion
        navigate('/interview/complete', {
          state: { feedback: response.data.finalFeedback }
        });
      }
    } catch (error) {
      console.error('Error processing answer:', error);
      setError('Failed to process answer. Please try again.');
    } finally {
      setIsProcessing(false);
      setTranscript('');
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={initializeInterview}>Try Again</button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Preparing your interview...</p>
      </div>
    );
  }

  return (
    <div className="interview-container">
      <div className="main-content">
        <div className="question-section">
          <div className="progress-info">
            <h2>Question {questionNumber} of {totalQuestions}</h2>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="question-card">
            <h3>{currentQuestion.question}</h3>
            <p className="topic">Topic: {currentQuestion.topic}</p>
          </div>

          <div className="controls">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`record-button ${isRecording ? 'recording' : ''}`}
            >
              <i className={`fas fa-${isRecording ? 'stop' : 'microphone'}`}></i>
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
          </div>

          <div className="transcript-area">
            {transcript && <p className="transcript">{transcript}</p>}
            {!transcript && !isRecording && 
              <p className="placeholder">Click 'Start Recording' to begin your answer...</p>
            }
          </div>

          {feedback && (
            <div className="feedback-section">
              <h3>Feedback</h3>
              <p>{feedback.feedback}</p>
              <div className="score">Score: {feedback.score}/10</div>
            </div>
          )}
        </div>
      </div>

      <div className="webcam-section">
        <WebcamFeed />
      </div>

      <style jsx>{`
        .interview-container {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .progress-info {
          margin-bottom: 2rem;
        }

        .progress-bar {
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          margin-top: 1rem;
        }

        .progress-fill {
          height: 100%;
          background: #3182ce;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .question-card {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }

        .topic {
          color: #4a5568;
          margin-top: 0.5rem;
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
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .record-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .transcript-area {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          min-height: 150px;
          margin-top: 1rem;
        }

        .placeholder {
          color: #a0aec0;
          font-style: italic;
        }

        .feedback-section {
          background: #e6f3ff;
          padding: 1.5rem;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .score {
          font-weight: 500;
          color: #2c5282;
          margin-top: 0.5rem;
        }

        .error-container,
        .loading-container {
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

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default InterviewContainer; 