import { useState } from "react";
import "../styles/CandidateReports.css";

const CandidateReports = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for demonstration
  const candidates = [
    {
      id: 1,
      name: "John Doe",
      role: "SDE",
      score: 85,
      status: "completed",
      date: "2024-03-15",
      report: {
        technical: 90,
        communication: 80,
        problemSolving: 85,
        confidence: 75,
        overall: 85,
        strengths: ["Strong DSA knowledge", "Good problem-solving approach"],
        weaknesses: ["Could improve communication", "Needs more confidence"],
        feedback: "Excellent technical skills with room for improvement in soft skills."
      }
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Frontend",
      score: 92,
      status: "completed",
      date: "2024-03-16",
      report: {
        technical: 95,
        communication: 90,
        problemSolving: 90,
        confidence: 85,
        overall: 92,
        strengths: ["Excellent UI/UX knowledge", "Great communication"],
        weaknesses: ["Limited backend experience"],
        feedback: "Outstanding frontend developer with strong communication skills."
      }
    }
  ];

  const filteredCandidates = candidates.filter(candidate => {
    if (filter !== "all" && candidate.status !== filter) return false;
    return candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           candidate.role.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleViewReport = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleCloseReport = () => {
    setSelectedCandidate(null);
  };

  const handleShortlist = (candidateId) => {
    // TODO: Implement shortlist functionality
    console.log("Shortlisting candidate:", candidateId);
  };

  const handleReject = (candidateId) => {
    // TODO: Implement reject functionality
    console.log("Rejecting candidate:", candidateId);
  };

  return (
    <div className="candidate-reports-container">
      <div className="reports-header">
        <h1>Candidate Reports</h1>
        <p>Review and manage candidate interview reports</p>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={filter === "completed" ? "active" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            className={filter === "in-progress" ? "active" : ""}
            onClick={() => setFilter("in-progress")}
          >
            In Progress
          </button>
        </div>
      </div>

      <div className="candidates-list">
        {filteredCandidates.map(candidate => (
          <div key={candidate.id} className="candidate-card">
            <div className="candidate-info">
              <div className="avatar">{candidate.name.charAt(0)}</div>
              <div className="details">
                <h3>{candidate.name}</h3>
                <p>{candidate.role}</p>
                <span className="date">
                  <i className="far fa-calendar"></i>
                  {candidate.date}
                </span>
              </div>
            </div>

            <div className="score-section">
              <div className="score-circle">
                <span>{candidate.score}%</span>
              </div>
              <span className="status-badge completed">Completed</span>
            </div>

            <div className="actions">
              <button
                className="view-button"
                onClick={() => handleViewReport(candidate)}
              >
                <i className="fas fa-eye"></i>
                View Report
              </button>
              <button
                className="shortlist-button"
                onClick={() => handleShortlist(candidate.id)}
              >
                <i className="fas fa-check"></i>
                Shortlist
              </button>
              <button
                className="reject-button"
                onClick={() => handleReject(candidate.id)}
              >
                <i className="fas fa-times"></i>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCandidate && (
        <div className="report-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedCandidate.name}'s Interview Report</h2>
              <button className="close-button" onClick={handleCloseReport}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="report-details">
              <div className="score-breakdown">
                <h3>Score Breakdown</h3>
                <div className="score-grid">
                  <div className="score-item">
                    <span className="label">Technical</span>
                    <span className="value">{selectedCandidate.report.technical}%</span>
                  </div>
                  <div className="score-item">
                    <span className="label">Communication</span>
                    <span className="value">{selectedCandidate.report.communication}%</span>
                  </div>
                  <div className="score-item">
                    <span className="label">Problem Solving</span>
                    <span className="value">{selectedCandidate.report.problemSolving}%</span>
                  </div>
                  <div className="score-item">
                    <span className="label">Confidence</span>
                    <span className="value">{selectedCandidate.report.confidence}%</span>
                  </div>
                </div>
              </div>

              <div className="strengths-weaknesses">
                <div className="strengths">
                  <h3>Strengths</h3>
                  <ul>
                    {selectedCandidate.report.strengths.map((strength, index) => (
                      <li key={index}>
                        <i className="fas fa-check-circle"></i>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="weaknesses">
                  <h3>Areas for Improvement</h3>
                  <ul>
                    {selectedCandidate.report.weaknesses.map((weakness, index) => (
                      <li key={index}>
                        <i className="fas fa-exclamation-circle"></i>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="feedback">
                <h3>Overall Feedback</h3>
                <p>{selectedCandidate.report.feedback}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateReports; 