import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/SkillsSelection.css';
import { api } from '../services/api';

const SKILL_CATEGORIES = {
  sde: {
    title: 'Software Development Engineer',
    skills: [
      { id: 'javascript', name: 'JavaScript', icon: '⚡' },
      { id: 'python', name: 'Python', icon: '🐍' },
      { id: 'java', name: 'Java', icon: '☕' },
      { id: 'cpp', name: 'C++', icon: '⚙️' },
      { id: 'typescript', name: 'TypeScript', icon: '📘' },
      { id: 'go', name: 'Go', icon: '🦫' },
      { id: 'ruby', name: 'Ruby', icon: '💎' }
    ]
  },
  frontend: {
    title: 'Frontend Development',
    skills: [
      { id: 'react', name: 'React', icon: '⚛️' },
      { id: 'angular', name: 'Angular', icon: '🅰️' },
      { id: 'vue', name: 'Vue.js', icon: '🟢' },
      { id: 'html_css', name: 'HTML/CSS', icon: '🎨' },
      { id: 'sass', name: 'SASS/SCSS', icon: '🎯' },
      { id: 'redux', name: 'Redux', icon: '🔄' },
      { id: 'nextjs', name: 'Next.js', icon: '⏭️' }
    ]
  },
  backend: {
    title: 'Backend Development',
    skills: [
      { id: 'node', name: 'Node.js', icon: '🟢' },
      { id: 'express', name: 'Express.js', icon: '🚂' },
      { id: 'django', name: 'Django', icon: '🐍' },
      { id: 'spring', name: 'Spring Boot', icon: '🌱' },
      { id: 'flask', name: 'Flask', icon: '🍶' },
      { id: 'graphql', name: 'GraphQL', icon: '📊' },
      { id: 'rest', name: 'REST APIs', icon: '🌐' }
    ]
  },
  devops: {
    title: 'DevOps & Cloud',
    skills: [
      { id: 'aws', name: 'AWS', icon: '☁️' },
      { id: 'docker', name: 'Docker', icon: '🐳' },
      { id: 'kubernetes', name: 'Kubernetes', icon: '⚓' },
      { id: 'jenkins', name: 'Jenkins', icon: '🤖' },
      { id: 'terraform', name: 'Terraform', icon: '🏗️' },
      { id: 'git', name: 'Git', icon: '📚' },
      { id: 'ci_cd', name: 'CI/CD', icon: '🔄' }
    ]
  },
  database: {
    title: 'Database & Data',
    skills: [
      { id: 'sql', name: 'SQL', icon: '📊' },
      { id: 'mongodb', name: 'MongoDB', icon: '🍃' },
      { id: 'postgresql', name: 'PostgreSQL', icon: '🐘' },
      { id: 'redis', name: 'Redis', icon: '🔴' },
      { id: 'elasticsearch', name: 'Elasticsearch', icon: '🔍' },
      { id: 'bigdata', name: 'Big Data', icon: '📈' },
      { id: 'data_structures', name: 'Data Structures', icon: '📚' }
    ]
  }
};

const SkillsSelection = () => {
  const navigate = useNavigate();
  const { interviewCode } = useParams();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill);
      } else {
        return [...prev, skill];
      }
    });
  };

  const handleStartInterview = async () => {
    if (selectedSkills.length < 2) {
      setError('Please select at least 2 skills');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post('/interviews/start', {
        interviewCode,
        skills: selectedSkills
      });

      if (response.data.success) {
        navigate(`/interview/session/${interviewCode}`, {
          state: {
            interviewData: response.data.interview,
            interviewCode,
            skills: selectedSkills
          }
        });
      } else {
        throw new Error(response.data.error || 'Failed to start interview');
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      setError(error.response?.data?.details || error.message || 'Failed to start interview. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="skills-selection">
      {isLoading ? (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h2>Preparing Your Interview...</h2>
            <p>Generating personalized questions based on your selected skills</p>
          </div>
        </div>
      ) : (
        <>
          <div className="header-section">
            <h1>Select Your Skills</h1>
            <p className="subtitle">Choose at least 2 skills for your technical interview</p>
            {error && <div className="error-message">{error}</div>}
            <div className="selection-info">
              <span className="selected-count">{selectedSkills.length}</span>
              <span>skills selected</span>
            </div>
          </div>

          <div className="skills-container">
            {Object.entries(SKILL_CATEGORIES).map(([category, { title, skills }]) => (
              <div key={category} className="skill-category">
                <h2 className="category-title">{title}</h2>
                <div className="skills-grid">
                  {skills.map(({ id, name, icon }) => (
                    <button
                      key={id}
                      className={`skill-button ${selectedSkills.includes(name) ? 'selected' : ''}`}
                      onClick={() => toggleSkill(name)}
                    >
                      <span className="skill-icon">{icon}</span>
                      <span className="skill-name">{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <button
              className="start-button"
              onClick={handleStartInterview}
              disabled={selectedSkills.length < 2}
            >
              {isLoading ? 'Starting Interview...' : 'Start Interview'}
            </button>
          </div>
        </>
      )}

      <style jsx>{`
        .skills-selection {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          background: #f8fafc;
          min-height: 100vh;
        }

        .header-section {
          text-align: center;
          margin-bottom: 3rem;
        }

        .header-section h1 {
          font-size: 2.5rem;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #4a5568;
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }

        .selection-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1.2rem;
          color: #4a5568;
        }

        .selected-count {
          font-weight: bold;
          color: #3182ce;
        }

        .skills-container {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .skill-category {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .category-title {
          color: #2d3748;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .skill-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }

        .skill-button:hover {
          border-color: #3182ce;
          transform: translateY(-2px);
        }

        .skill-button.selected {
          background: #ebf8ff;
          border-color: #3182ce;
          color: #3182ce;
        }

        .skill-icon {
          font-size: 1.2rem;
        }

        .skill-name {
          font-weight: 500;
        }

        .error-message {
          background: #fed7d7;
          color: #c53030;
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
          text-align: center;
        }

        .action-buttons {
          margin-top: 3rem;
          text-align: center;
        }

        .start-button {
          background: #3182ce;
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .start-button:hover:not(:disabled) {
          background: #2c5282;
          transform: translateY(-2px);
        }

        .start-button:disabled {
          background: #cbd5e0;
          cursor: not-allowed;
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .loading-content {
          text-align: center;
        }

        .loading-spinner {
          border: 4px solid #e2e8f0;
          border-top: 4px solid #3182ce;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SkillsSelection; 