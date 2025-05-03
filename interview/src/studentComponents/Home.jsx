import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

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
    </div>
  );
};

export default Home;
