import { useState } from "react";
import "../styles/InterviewList.css";

const InterviewList = () => {
  const [interviews] = useState([
    {
      id: 1,
      title: "Frontend Developer Interview",
      description: "Technical interview for frontend developer position",
      duration: 45,
      skills: ["JavaScript", "React", "HTML", "CSS"],
      status: "Active",
      candidates: 5,
    },
    {
      id: 2,
      title: "Backend Developer Interview",
      description: "Technical interview for backend developer position",
      duration: 60,
      skills: ["Python", "Node.js", "SQL", "API Design"],
      status: "Completed",
      candidates: 3,
    },
  ]);

  return (
    <div className="interview-list">
      <h2>Interview List</h2>
      <div className="interviews-grid">
        {interviews.map((interview) => (
          <div key={interview.id} className="interview-card">
            <div className="interview-header">
              <h3>{interview.title}</h3>
              <span className={`status-badge ${interview.status.toLowerCase()}`}>
                {interview.status}
              </span>
            </div>
            <p className="description">{interview.description}</p>
            <div className="interview-details">
              <div className="detail-item">
                <i className="fas fa-clock"></i>
                <span>{interview.duration} minutes</span>
              </div>
              <div className="detail-item">
                <i className="fas fa-users"></i>
                <span>{interview.candidates} candidates</span>
              </div>
            </div>
            <div className="skills-list">
              {interview.skills.map((skill) => (
                <span key={skill} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
            <div className="interview-actions">
              <button className="view-button">View Details</button>
              <button className="edit-button">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewList; 