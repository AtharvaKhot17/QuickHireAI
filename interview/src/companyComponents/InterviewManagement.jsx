import { useState, useEffect } from 'react';
import '../styles/InterviewManagement.css';

const InterviewManagement = () => {
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'schedule', 'candidates', 'reports'
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockInterviews = [
      {
        id: 1,
        name: "SDE Internship 2024",
        role: "Software Development Engineer",
        skills: ["DSA", "System Design", "OOP"],
        date: "2024-04-25",
        time: "10:00 AM",
        duration: 60,
        status: "scheduled",
        candidates: [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            code: "ABC123",
            status: "pending",
            technicalScore: null,
            confidenceScore: null,
            communicationScore: null
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            code: "DEF456",
            status: "completed",
            technicalScore: 85,
            confidenceScore: 78,
            communicationScore: 82
          }
        ]
      }
    ];
    setInterviews(mockInterviews);
    setLoading(false);
  }, []);

  const handleScheduleInterview = (interviewData) => {
    // TODO: Implement API call to schedule interview
    console.log('Scheduling interview:', interviewData);
  };

  const handleGenerateCodes = (interviewId) => {
    // TODO: Implement API call to generate unique codes
    console.log('Generating codes for interview:', interviewId);
  };

  const handleViewReport = (candidate) => {
    // TODO: Implement report viewing
    console.log('Viewing report for:', candidate);
  };

  const handleShortlist = (candidateId, status) => {
    // TODO: Implement shortlisting
    console.log('Shortlisting candidate:', candidateId, status);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin"></i>
        <span>Loading interviews...</span>
      </div>
    );
  }

  return (
    <div className="interview-management">
      <div className="header">
        <h1>Interview Management</h1>
        <div className="view-toggles">
          <button 
            className={view === 'list' ? 'active' : ''}
            onClick={() => setView('list')}
          >
            <i className="fas fa-list"></i> All Interviews
          </button>
          <button 
            className={view === 'schedule' ? 'active' : ''}
            onClick={() => setView('schedule')}
          >
            <i className="fas fa-calendar-plus"></i> Schedule New
          </button>
          <button 
            className={view === 'candidates' ? 'active' : ''}
            onClick={() => setView('candidates')}
          >
            <i className="fas fa-users"></i> Candidates
          </button>
          <button 
            className={view === 'reports' ? 'active' : ''}
            onClick={() => setView('reports')}
          >
            <i className="fas fa-chart-bar"></i> Reports
          </button>
        </div>
      </div>

      {view === 'list' && (
        <div className="interviews-list">
          {interviews.map(interview => (
            <div key={interview.id} className="interview-card">
              <div className="interview-header">
                <h2>{interview.name}</h2>
                <span className={`status ${interview.status}`}>
                  {interview.status}
                </span>
              </div>
              <div className="interview-details">
                <p><i className="fas fa-briefcase"></i> {interview.role}</p>
                <p><i className="fas fa-calendar"></i> {interview.date} at {interview.time}</p>
                <p><i className="fas fa-clock"></i> {interview.duration} minutes</p>
                <div className="skills">
                  {interview.skills.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="interview-actions">
                <button onClick={() => handleGenerateCodes(interview.id)}>
                  <i className="fas fa-qrcode"></i> Generate Codes
                </button>
                <button onClick={() => setSelectedInterview(interview)}>
                  <i className="fas fa-eye"></i> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'candidates' && selectedInterview && (
        <div className="candidates-list">
          <h2>Candidates for {selectedInterview.name}</h2>
          <div className="candidates-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Code</th>
                  <th>Status</th>
                  <th>Technical Score</th>
                  <th>Confidence Score</th>
                  <th>Communication Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedInterview.candidates.map(candidate => (
                  <tr key={candidate.id}>
                    <td>{candidate.name}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.code}</td>
                    <td>
                      <span className={`status ${candidate.status}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td>{candidate.technicalScore || '-'}</td>
                    <td>{candidate.confidenceScore || '-'}</td>
                    <td>{candidate.communicationScore || '-'}</td>
                    <td>
                      <button 
                        onClick={() => handleViewReport(candidate)}
                        disabled={candidate.status !== 'completed'}
                      >
                        <i className="fas fa-file-alt"></i> Report
                      </button>
                      <button 
                        onClick={() => handleShortlist(candidate.id, 'shortlisted')}
                        disabled={candidate.status !== 'completed'}
                      >
                        <i className="fas fa-check"></i> Shortlist
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'reports' && selectedInterview && (
        <div className="reports-section">
          <h2>Interview Reports</h2>
          <div className="reports-filters">
            <select>
              <option value="all">All Candidates</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
            <select>
              <option value="score">Sort by Score</option>
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
          <div className="reports-grid">
            {selectedInterview.candidates
              .filter(c => c.status === 'completed')
              .map(candidate => (
                <div key={candidate.id} className="report-card">
                  <div className="report-header">
                    <h3>{candidate.name}</h3>
                    <span className="score">
                      {(candidate.technicalScore + candidate.confidenceScore + candidate.communicationScore) / 3}%
                    </span>
                  </div>
                  <div className="score-breakdown">
                    <div className="score-item">
                      <span>Technical</span>
                      <div className="progress-bar">
                        <div 
                          className="progress" 
                          style={{ width: `${candidate.technicalScore}%` }}
                        ></div>
                      </div>
                      <span>{candidate.technicalScore}%</span>
                    </div>
                    <div className="score-item">
                      <span>Confidence</span>
                      <div className="progress-bar">
                        <div 
                          className="progress" 
                          style={{ width: `${candidate.confidenceScore}%` }}
                        ></div>
                      </div>
                      <span>{candidate.confidenceScore}%</span>
                    </div>
                    <div className="score-item">
                      <span>Communication</span>
                      <div className="progress-bar">
                        <div 
                          className="progress" 
                          style={{ width: `${candidate.communicationScore}%` }}
                        ></div>
                      </div>
                      <span>{candidate.communicationScore}%</span>
                    </div>
                  </div>
                  <button 
                    className="view-report-btn"
                    onClick={() => handleViewReport(candidate)}
                  >
                    <i className="fas fa-file-pdf"></i> View Detailed Report
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewManagement; 