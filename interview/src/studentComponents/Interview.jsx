import { useState } from "react";
import "../styles/Interview.css";

const Interviews = () => {
  const [interviews] = useState([
    { id: 1, company: "Google", role: "Frontend Developer", date: "2024-03-15", status: "Completed", score: "85%" },
    { id: 2, company: "Microsoft", role: "Full Stack Developer", date: "2024-03-20", status: "Pending" }
  ]);

  return (
    <div className="interviews-section">
      <h1>My Interviews</h1>
      <div className="interviews-list">
        {interviews.map((interview) => (
          <div key={interview.id} className="interview-card">
            <div className="company-info">
              <h3>{interview.company}</h3>
              <p>{interview.role}</p>
            </div>
            <div className="interview-details">
              <span className={`status ${interview.status.toLowerCase()}`}>
                {interview.status}
              </span>
              <p>Date: {interview.date}</p>
              {interview.score && <p>Score: {interview.score}</p>}
            </div>
            <div className="interview-actions">
              {interview.status === "Pending" ? (
                <button className="start-btn">
                  Start Interview <i className="fas fa-play"></i>
                </button>
              ) : (
                <button className="view-btn">
                  View Results <i className="fas fa-chart-line"></i>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Interviews;
