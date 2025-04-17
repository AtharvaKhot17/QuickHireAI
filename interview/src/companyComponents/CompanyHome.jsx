import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CompanyHome.css";

const CompanyHome = ({ setActiveSection }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const stats = {
    interviews: {
      total: 156,
      active: 24,
      completed: 89,
      scheduled: 12
    },
    candidates: {
      total: 245,
      shortlisted: 45,
      rejected: 32,
      pending: 168
    }
  };

  const recentActivity = [
    {
      id: 1,
      type: "new-candidate",
      title: "New Candidate Application",
      description: "John Doe applied for Senior Frontend Developer",
      time: "2 hours ago",
      icon: "fa-user-plus"
    },
    {
      id: 2,
      type: "interview-completed",
      title: "Interview Completed",
      description: "Sarah Wilson completed UI/UX Designer interview",
      time: "5 hours ago",
      icon: "fa-check"
    },
    {
      id: 3,
      type: "interview-scheduled",
      title: "Interview Scheduled",
      description: "Backend Developer position - 3 candidates",
      time: "1 day ago",
      icon: "fa-calendar"
    }
  ];

  const quickActions = [
    {
      id: 1,
      title: "Create New Interview",
      description: "Set up a custom AI-powered interview",
      icon: "fa-plus-circle",
      action: () => setActiveSection("create-interview")
    },
    {
      id: 2,
      title: "Upload Candidates",
      description: "Add candidates via Excel sheet",
      icon: "fa-file-upload",
      action: () => setActiveSection("upload-candidates")
    },
    {
      id: 3,
      title: "View Reports",
      description: "Check candidate performance",
      icon: "fa-chart-bar",
      action: () => setActiveSection("reports")
    }
  ];

  return (
    <div className="dashboard-home">
      <div className="welcome-section">
        <h1>Welcome back, Company!</h1>
        <p className="welcome-text">Manage your AI-powered interviews efficiently.</p>
      </div>

      <div className="quick-actions">
        {quickActions.map(action => (
          <div
            key={action.id}
            className="action-card"
            onClick={action.action}
          >
            <div className="action-icon">
              <i className={`fas ${action.icon}`}></i>
            </div>
            <div className="action-content">
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "interviews" ? "active" : ""}
          onClick={() => setActiveTab("interviews")}
        >
          Interviews
        </button>
        <button
          className={activeTab === "candidates" ? "active" : ""}
          onClick={() => setActiveTab("candidates")}
        >
          Candidates
        </button>
      </div>

      <div className="stats-section">
        {activeTab === "overview" && (
          <>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Active</span>
                <div className="stat-value">{stats.interviews.active}</div>
                <span className="stat-description">Open Positions</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Total</span>
                <div className="stat-value">{stats.candidates.total}</div>
                <span className="stat-description">Candidates</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Completed</span>
                <div className="stat-value">{stats.interviews.completed}</div>
                <span className="stat-description">Interviews</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Scheduled</span>
                <div className="stat-value">{stats.interviews.scheduled}</div>
                <span className="stat-description">This Week</span>
              </div>
            </div>
          </>
        )}

        {activeTab === "interviews" && (
          <>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Total</span>
                <div className="stat-value">{stats.interviews.total}</div>
                <span className="stat-description">Interviews</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-hourglass-half"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Active</span>
                <div className="stat-value">{stats.interviews.active}</div>
                <span className="stat-description">In Progress</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-check-double"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Completed</span>
                <div className="stat-value">{stats.interviews.completed}</div>
                <span className="stat-description">This Month</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Scheduled</span>
                <div className="stat-value">{stats.interviews.scheduled}</div>
                <span className="stat-description">Upcoming</span>
              </div>
            </div>
          </>
        )}

        {activeTab === "candidates" && (
          <>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Total</span>
                <div className="stat-value">{stats.candidates.total}</div>
                <span className="stat-description">Candidates</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-star"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Shortlisted</span>
                <div className="stat-value">{stats.candidates.shortlisted}</div>
                <span className="stat-description">Top Candidates</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-times-circle"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Rejected</span>
                <div className="stat-value">{stats.candidates.rejected}</div>
                <span className="stat-description">Not Selected</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-hourglass-half"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Pending</span>
                <div className="stat-value">{stats.candidates.pending}</div>
                <span className="stat-description">In Process</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                <i className={`fas ${activity.icon}`}></i>
              </div>
              <div className="activity-content">
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyHome; 