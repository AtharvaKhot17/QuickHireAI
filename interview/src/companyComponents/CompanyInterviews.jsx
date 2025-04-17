import { useState } from "react";
import "../styles/CompanyInterviews.css";

const CompanyInterviews = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const candidates = [
    {
      id: 1,
      name: "John Doe",
      position: "Senior Frontend Developer",
      status: "completed",
      score: 85,
      date: "2024-03-15",
      avatar: "JD"
    },
    {
      id: 2,
      name: "Sarah Wilson",
      position: "UI/UX Designer",
      status: "scheduled",
      date: "2024-03-18",
      avatar: "SW"
    },
    {
      id: 3,
      name: "Mike Johnson",
      position: "Backend Developer",
      status: "in-progress",
      date: "2024-03-16",
      avatar: "MJ"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "success";
      case "scheduled": return "warning";
      case "in-progress": return "info";
      default: return "default";
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    if (filter !== "all" && candidate.status !== filter) return false;
    return candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="interviews-container">
      <div className="page-header">
        <div>
          <h1>Candidates</h1>
          <p>Manage and track candidate interviews</p>
        </div>
        <button className="new-interview-btn">
          <i className="fas fa-plus"></i>
          New Interview
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search candidates or positions..."
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
            className={filter === "scheduled" ? "active" : ""}
            onClick={() => setFilter("scheduled")}
          >
            Scheduled
          </button>
          <button
            className={filter === "in-progress" ? "active" : ""}
            onClick={() => setFilter("in-progress")}
          >
            In Progress
          </button>
          <button
            className={filter === "completed" ? "active" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="candidates-list">
        {filteredCandidates.map(candidate => (
          <div key={candidate.id} className="candidate-card">
            <div className="candidate-info">
              <div className="avatar">{candidate.avatar}</div>
              <div className="details">
                <h3>{candidate.name}</h3>
                <p>{candidate.position}</p>
              </div>
            </div>

            <div className="interview-info">
              <span className={`status ${getStatusColor(candidate.status)}`}>
                {candidate.status.replace("-", " ")}
              </span>
              <span className="date">
                <i className="far fa-calendar"></i>
                {candidate.date}
              </span>
              {candidate.score && (
                <span className="score">
                  <i className="fas fa-star"></i>
                  {candidate.score}%
                </span>
              )}
            </div>

            <div className="actions">
              <button className="action-btn">
                <i className="fas fa-eye"></i>
                View
              </button>
              <button className="action-btn">
                <i className="fas fa-download"></i>
                Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyInterviews; 