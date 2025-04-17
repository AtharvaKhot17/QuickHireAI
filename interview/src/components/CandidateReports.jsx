import { useState } from "react";
import "../styles/CandidateReports.css";

const CandidateReports = () => {
  const [reports] = useState([
    {
      id: 1,
      candidateName: "John Doe",
      interviewTitle: "Frontend Developer Interview",
      date: "2024-03-15",
      score: 85,
      status: "Completed",
      skills: {
        "JavaScript": 90,
        "React": 85,
        "HTML": 80,
        "CSS": 75,
      },
    },
    {
      id: 2,
      candidateName: "Jane Smith",
      interviewTitle: "Backend Developer Interview",
      date: "2024-03-16",
      score: 78,
      status: "Completed",
      skills: {
        "Python": 85,
        "Node.js": 75,
        "SQL": 80,
        "API Design": 70,
      },
    },
  ]);

  return (
    <div className="candidate-reports">
      <h2>Candidate Reports</h2>
      <div className="reports-grid">
        {reports.map((report) => (
          <div key={report.id} className="report-card">
            <div className="report-header">
              <h3>{report.candidateName}</h3>
              <span className={`status-badge ${report.status.toLowerCase()}`}>
                {report.status}
              </span>
            </div>
            <div className="report-details">
              <div className="detail-item">
                <i className="fas fa-file-alt"></i>
                <span>{report.interviewTitle}</span>
              </div>
              <div className="detail-item">
                <i className="fas fa-calendar"></i>
                <span>{report.date}</span>
              </div>
              <div className="detail-item">
                <i className="fas fa-star"></i>
                <span>Overall Score: {report.score}%</span>
              </div>
            </div>
            <div className="skills-progress">
              <h4>Skills Assessment</h4>
              {Object.entries(report.skills).map(([skill, score]) => (
                <div key={skill} className="skill-progress">
                  <span className="skill-name">{skill}</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  <span className="skill-score">{score}%</span>
                </div>
              ))}
            </div>
            <div className="report-actions">
              <button className="view-button">View Full Report</button>
              <button className="download-button">Download Report</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateReports; 