// 


import { useState, useEffect, useRef } from "react";
import WebcamFeed from "./WebcamFeed";
import { api } from "../services/api";
import "../styles/InterviewScreen.css";
import SimpleCodeEditor from "./SimpleCodeEditor";
import RealTimeFeedback from './RealTimeFeedback';
import FinalEvaluation from './FinalEvaluation';
import speechRecognitionService from '../services/speechRecognitionService';
import CodeEditor from '../components/CodeEditor';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const InterviewScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { interviewCode } = useParams();

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [currentTopic, setCurrentTopic] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [code, setCode] = useState("");
  const [allAnswers, setAllAnswers] = useState([]);
  const [finalEvaluation, setFinalEvaluation] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [answers, setAnswers] = useState([]);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [recordingStatus, setRecordingStatus] = useState('idle'); // 'idle', 'recording', 'processing'
  const [recordingError, setRecordingError] = useState(null);

  useEffect(() => {
    const initializeInterview = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get skills from location state or session storage
        const skills = location.state?.skills || JSON.parse(sessionStorage.getItem('selectedSkills'));
        
        if (!interviewCode || !skills) {
          console.error('Missing required data:', { interviewCode, skills });
          navigate(`/interview/guidelines/${interviewCode}`);
          return;
        }

        // Store skills in session storage if coming from location state
        if (location.state?.skills) {
          sessionStorage.setItem('selectedSkills', JSON.stringify(location.state.skills));
          sessionStorage.setItem('interviewData', JSON.stringify({ interviewCode }));
        }

        const response = await api.post('/interviews/start', {
          interviewCode,
          skills
        });

        if (response.data.success) {
          const { interview } = response.data;
          setQuestions(interview.questions);
          setCurrentQuestion(interview.questions[0]);
          setTotalQuestions(interview.totalQuestions);
        } else {
          throw new Error(response.data.error || 'Failed to initialize interview');
        }
      } catch (error) {
        console.error('Error initializing interview:', error);
        setError('Failed to initialize interview. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeInterview();

    // Cleanup function
    return () => {
      if (isRecording) {
        speechRecognitionService.stopRecording();
      }
    };
  }, [interviewCode, location.state, navigate]);

  // Remove the session checking interval as it's causing the redirect issue
  // Instead, check session validity only when needed
  const checkSession = () => {
    const storedData = sessionStorage.getItem('interviewData');
    const storedSkills = sessionStorage.getItem('selectedSkills');
    return storedData && storedSkills;
  };

  const startRecording = () => {
    try {
      setRecordingStatus('recording');
      setRecordingError(null);
      
      speechRecognitionService.startRecording(
        (interim) => setInterimTranscript(interim),
        (final) => setTranscript(final),
        (error) => {
          setRecordingError(error);
          setRecordingStatus('idle');
        }
      );
      setIsRecording(true);
    } catch (error) {
      setRecordingError('Failed to start recording');
      setRecordingStatus('idle');
    }
  };

  const stopRecording = async () => {
    try {
      setRecordingStatus('processing');
      const finalTranscript = await speechRecognitionService.stopRecording();
      setIsRecording(false);
      
      console.log('Recording stopped, final transcript:', finalTranscript);
      
      if (!finalTranscript || !finalTranscript.trim()) {
        console.log('No transcript detected');
        setRecordingError('No speech detected. Please try again.');
        return;
      }

      // Set the transcript in state and submit
      setTranscript(finalTranscript.trim());
      console.log('Submitting transcript:', finalTranscript.trim());
      await submitAnswer(finalTranscript.trim());

    } catch (error) {
      console.error('Error in stopRecording:', error);
      setRecordingError('Failed to process recording');
    } finally {
      setRecordingStatus('idle');
      setInterimTranscript('');
    }
  };

  const submitAnswer = async (answer) => {
    try {
      console.log('Starting answer submission:', answer);
      
      if (!answer || !answer.trim()) {
        throw new Error('No answer to submit');
      }

      setIsProcessing(true);
      setError(null);

      // Log the request payload
      const payload = {
        answer: answer.trim(),
        question: currentQuestion,
        interviewCode,
        questionNumber: questionIndex,
        code: code || ''
      };
      console.log('Submitting answer with payload:', payload);

      const response = await api.post('/interviews/evaluate-answer', payload);

      console.log('Evaluation response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to evaluate answer');
      }

      const { evaluation, nextQuestion } = response.data;
      
      // Store the answer
      const newAnswer = {
        question: currentQuestion,
        answer: answer.trim(),
        code,
        evaluation,
        questionNumber: questionIndex + 1
      };
      
      console.log('Storing new answer:', newAnswer);
      setAnswers(prev => [...prev, newAnswer]);
      setFeedback(evaluation);

      // Handle next question or completion
      if (nextQuestion) {
        console.log('Moving to next question:', nextQuestion);
        setQuestionIndex(prev => prev + 1);
        setCurrentQuestion(nextQuestion);
        setTranscript('');
        setInterimTranscript('');
        setCode('');
      } else {
        console.log('No more questions, completing interview');
        await handleInterviewCompletion();
      }

    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Failed to evaluate answer. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInterviewCompletion = async () => {
    try {
      setIsProcessing(true);
      const finalEval = await api.post('/interviews/final-evaluation', {
        answers,
        skills: location.state.skills || JSON.parse(sessionStorage.getItem('selectedSkills'))
      });
      
      setFinalEvaluation(finalEval.data);
      setIsComplete(true);
      
      // Clear session data on completion
      sessionStorage.removeItem('interviewData');
      sessionStorage.removeItem('selectedSkills');
    } catch (error) {
      console.error('Error generating final evaluation:', error);
      setError('Failed to generate final evaluation');
    } finally {
      setIsProcessing(false);
    }
  };

  const skipQuestion = async () => {
    try {
      setIsProcessing(true);
      console.log('Skipping question:', questionIndex);

      // Submit a skipped answer to maintain the flow
      const response = await api.post('/interviews/evaluate-answer', {
        answer: "Question skipped by user",
        question: currentQuestion,
        interviewCode,
        questionNumber: questionIndex,
        skipped: true // Add flag to indicate skipped question
      });

      console.log('Skip response:', response.data);

      if (response.data.success) {
        const { nextQuestion } = response.data;
        
        // Store the skipped question
        const skippedAnswer = {
          question: currentQuestion,
          answer: "Question skipped",
          evaluation: {
            score: 0,
            feedback: "Question was skipped",
            technicalAccuracy: 0,
            communication: 0
          },
          questionNumber: questionIndex + 1
        };
        
        setAnswers(prev => [...prev, skippedAnswer]);
        setSkippedQuestions(prev => [...prev, currentQuestion]);

        // Move to next question or complete interview
        if (nextQuestion) {
          console.log('Moving to next question after skip:', nextQuestion);
          setQuestionIndex(prev => prev + 1);
          setCurrentQuestion(nextQuestion);
          setTranscript('');
          setInterimTranscript('');
          setCode('');
        } else {
          console.log('No more questions, completing interview');
          await handleInterviewCompletion();
        }
      } else {
        throw new Error('Failed to skip question');
      }
    } catch (error) {
      console.error('Error skipping question:', error);
      setError('Failed to skip question. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Loading Interview</h2>
          <p>Preparing your technical interview session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-content">
          <h3>Error During Interview</h3>
          <p>{error}</p>
          <button 
            onClick={() => navigate(`/interview/guidelines/${interviewCode}`)}
            className="retry-button"
          >
            Return to Guidelines
          </button>
        </div>
      </div>
    );
  }

  if (isComplete && finalEvaluation) {
    return <FinalEvaluation evaluation={finalEvaluation} answers={answers} />;
  }

  return (
    <div className="interview-screen">
      <div className="interview-layout">
        <div className="left-panel">
          <div className="question-section">
            <div className="progress-header">
              <div className="progress-dots">
                {Array(5).fill(0).map((_, index) => (
                  <div 
                    key={index}
                    className={`progress-dot ${
                      index < questionIndex ? 'completed' :
                      index === questionIndex ? 'current' : ''
                    }`}
                  />
                ))}
              </div>
              <span className="question-counter">Question {questionIndex + 1} of 5</span>
            </div>

            <div className="question-card">
              <div className="question-meta">
                <span className="topic-badge">{currentQuestion?.topic}</span>
                <span className="difficulty-badge">{currentQuestion?.difficulty}</span>
              </div>
              <h3 className="question-text">{currentQuestion?.question}</h3>
              <p className="duration-text">Expected Answer Time: {currentQuestion?.expectedDuration}</p>
            </div>

            <div className="control-buttons">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`record-button ${isRecording ? 'recording' : 'ready'}`}
                disabled={isProcessing}
              >
                <span className={`record-icon ${isRecording ? 'pulse' : ''}`} />
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>

              <button
                onClick={skipQuestion}
                className="skip-button"
                disabled={isProcessing || isRecording}
              >
                Skip Question
              </button>
            </div>
          </div>

          <div className="answer-section">
            <div className="transcript-container">
              <h4>Your Answer:</h4>
              <div className="transcript-content">
                {transcript && (
                  <div className="final-transcript">
                    {transcript}
                  </div>
                )}
                {interimTranscript && (
                  <div className="interim-transcript">
                    {interimTranscript}
                  </div>
                )}
                {!transcript && !interimTranscript && (
                  <p className="placeholder-text">
                    Click "Start Recording" and begin speaking...
                  </p>
                )}
              </div>
            </div>

            <div className="code-editor-container">
              <h4>Code Solution (Optional):</h4>
              <SimpleCodeEditor
                value={code}
                onChange={setCode}
                language="javascript"
                placeholder="Write your code here if needed..."
              />
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="webcam-section">
            <h4>Video Feed</h4>
            <WebcamFeed />
          </div>
          
          <div className="interview-progress">
            <h4>Interview Progress</h4>
            <div className="progress-stats">
              <div className="stat-item">
                <span>Completed</span>
                <strong>{questionIndex}</strong>
              </div>
              <div className="stat-item">
                <span>Remaining</span>
                <strong>{5 - questionIndex - 1}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className="processing-overlay">
          <div className="processing-content">
            <div className="spinner"></div>
            <p>Processing your answer...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewScreen;
