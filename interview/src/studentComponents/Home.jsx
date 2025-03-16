import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [interviewCode, setInterviewCode] = useState("");
  const [error, setError] = useState("");

  const handleStartInterview = (e) => {
    e.preventDefault();
    if (interviewCode.trim()) {
      navigate(`/interview/guidelines/${interviewCode.trim()}`);
    } else {
      setError("Please enter an interview code");
    }
  };

  return (
    <div className="dashboard-home">
      <div className="welcome-section">
        <h1>Welcome back, Student!</h1>
        <p>Ready to ace your next interview? Let's get started.</p>
      </div>

      <div className="interview-section">
        <div className="interview-code-section">
          <h2>Start New Interview</h2>
          <p>Enter your interview code to begin your session</p>
          <form onSubmit={handleStartInterview}>
            <div className="code-input-group">
              <input
                type="text"
                placeholder="Enter interview code (e.g., INT-123)"
                value={interviewCode}
                onChange={(e) => setInterviewCode(e.target.value)}
                style={{ color: '#2d3748' }}
              />
              <button 
                type="submit" 
                disabled={!interviewCode.trim()}
              >
                Start Interview <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            {error && (
              <div className="error-message">{error}</div>
            )}
          </form>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>Upcoming</h3>
            <p className="stat-number">2</p>
            <span>Scheduled Interviews</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-number">5</p>
            <span>Past Interviews</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-content">
            <h3>Average Score</h3>
            <p className="stat-number">85%</p>
            <span>Performance</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-home {
          max-width: 1200px;
          margin: 0 auto;
        }

        .welcome-section {
          margin-bottom: 2rem;
        }

        .welcome-section h1 {
          font-size: 2rem;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .welcome-section p {
          color: #718096;
          font-size: 1.1rem;
        }

        .interview-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .interview-code-section h2 {
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .code-input-group {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .code-input-group input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          background: white;
        }

        .code-input-group input:focus {
          border-color: #3182ce;
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
          outline: none;
        }

        .code-input-group button {
          padding: 0.75rem 1.5rem;
          background: #3182ce;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .code-input-group button:hover {
          background: #2c5282;
        }

        .code-input-group button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .error-message {
          color: #e53e3e;
          margin-top: 1rem;
          font-size: 0.875rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: #ebf8ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: #3182ce;
        }

        .stat-content h3 {
          color: #718096;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .stat-content span {
          color: #718096;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .code-input-group {
            flex-direction: column;
          }

          .code-input-group button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
