import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../styles/InterviewGuidelines.css";

const InterviewGuidelines = () => {
  const navigate = useNavigate();
  const { interviewCode } = useParams();

  const handleContinue = () => {
    navigate(`/interview/skills/${interviewCode}`);
  };

  return (
    <div className="guidelines-container">
      <div className="guidelines-content">
        <h1>Interview Guidelines</h1>
        <div className="guidelines-card">
          <h2>Before You Begin</h2>
          <ul className="guidelines-list">
            <li>
              <i className="fas fa-microphone"></i>
              <div>
                <h3>Check Your Audio</h3>
                <p>Ensure your microphone is working and properly connected.</p>
              </div>
            </li>
            <li>
              <i className="fas fa-video"></i>
              <div>
                <h3>Test Your Camera</h3>
                <p>Make sure your webcam is functioning and well-positioned.</p>
              </div>
            </li>
            <li>
              <i className="fas fa-wifi"></i>
              <div>
                <h3>Internet Connection</h3>
                <p>Verify you have a stable internet connection.</p>
              </div>
            </li>
            <li>
              <i className="fas fa-clock"></i>
              <div>
                <h3>Time Management</h3>
                <p>The interview will last approximately 30 minutes.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="guidelines-card">
          <h2>Interview Format</h2>
          <ul className="format-list">
            <li>Technical questions related to your field</li>
            <li>Problem-solving scenarios</li>
            <li>Code implementation challenges</li>
            <li>Real-time feedback and evaluation</li>
          </ul>
        </div>

        <div className="guidelines-card">
          <h2>Tips for Success</h2>
          <ul className="tips-list">
            <li>Speak clearly and maintain good posture</li>
            <li>Take time to understand questions before answering</li>
            <li>Show your problem-solving process</li>
            <li>Ask for clarification if needed</li>
          </ul>
        </div>

        <div className="action-buttons">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          <button className="continue-btn" onClick={handleContinue}>
            Continue to Skills Selection <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <style jsx>{`
        .guidelines-container {
          min-height: 100vh;
          background: #f8f9fa;
          padding: 2rem;
        }

        .guidelines-content {
          max-width: 900px;
          margin: 0 auto;
        }

        h1 {
          text-align: center;
          color: #2d3748;
          font-size: 2.5rem;
          margin-bottom: 2rem;
        }

        .guidelines-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        h2 {
          color: #2d3748;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .guidelines-list {
          list-style: none;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .guidelines-list li {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: #f7fafc;
          border-radius: 8px;
        }

        .guidelines-list i {
          font-size: 1.5rem;
          color: #3182ce;
          padding-top: 0.25rem;
        }

        .guidelines-list h3 {
          color: #2d3748;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .guidelines-list p {
          color: #718096;
          font-size: 0.95rem;
          margin: 0;
        }

        .format-list, .tips-list {
          list-style: none;
          padding: 0;
        }

        .format-list li, .tips-list li {
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: #f7fafc;
          border-radius: 8px;
          color: #4a5568;
          position: relative;
          padding-left: 2rem;
        }

        .format-list li:before, .tips-list li:before {
          content: "•";
          color: #3182ce;
          font-weight: bold;
          position: absolute;
          left: 0.75rem;
        }

        .action-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 3rem;
        }

        .back-btn, .continue-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-btn {
          background: white;
          color: #718096;
          border: 1px solid #e2e8f0;
        }

        .continue-btn {
          background: #3182ce;
          color: white;
          border: none;
        }

        .back-btn:hover {
          background: #f7fafc;
        }

        .continue-btn:hover {
          background: #2c5282;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .guidelines-container {
            padding: 1rem;
          }

          .action-buttons {
            flex-direction: column;
            gap: 1rem;
          }

          .back-btn, .continue-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default InterviewGuidelines;
