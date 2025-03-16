import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/SkillsSelection.css';

const SKILL_CATEGORIES = {
  languages: [
    { id: 'javascript', name: 'JavaScript', icon: '⚡' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'cpp', name: 'C++', icon: '⚙️' }
  ],
  web: [
    { id: 'react', name: 'React', icon: '⚛️' },
    { id: 'node', name: 'Node.js', icon: '🟢' },
    { id: 'html_css', name: 'HTML/CSS', icon: '🎨' },
    { id: 'angular', name: 'Angular', icon: '🅰️' }
  ],
  databases: [
    { id: 'sql', name: 'SQL', icon: '📊' },
    { id: 'mongodb', name: 'MongoDB', icon: '🍃' },
    { id: 'postgresql', name: 'PostgreSQL', icon: '🐘' },
    { id: 'redis', name: 'Redis', icon: '🔴' }
  ],
  cs_fundamentals: [
    { id: 'dsa', name: 'DSA', icon: '📈' },
    { id: 'os', name: 'Operating Systems', icon: '💻' },
    { id: 'networks', name: 'Computer Networks', icon: '🌐' },
    { id: 'dbms', name: 'DBMS', icon: '🗄️' }
  ]
};

const SkillsSelection = () => {
  const navigate = useNavigate();
  const { interviewCode } = useParams();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSkillSelection = (skillId) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  const startInterview = async () => {
    if (selectedSkills.length < 2) {
      setError('Please select at least 2 skills');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/interview/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewCode,
          skills: selectedSkills
        })
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to start interview');
      }

      navigate(`/interview/session/${interviewCode}`, {
        state: {
          skills: selectedSkills,
          interviewCode,
          interviewData: data.interview
        },
        replace: true
      });

    } catch (error) {
      console.error('Error starting interview:', error);
      setError(error.message || 'Failed to start interview. Please try again.');
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
          <h2>Select Skills for Your Interview (Minimum 2)</h2>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <p className="selection-info">
            Selected Skills: {selectedSkills.length} (Minimum 2 required)
          </p>

          {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
            <div key={category} className="skill-category">
              <h3>{category.replace('_', ' ').toUpperCase()}</h3>
              <div className="skills-grid">
                {skills.map((skill) => (
                  <button
                    key={skill.id}
                    className={`skill-button ${selectedSkills.includes(skill.id) ? 'selected' : ''}`}
                    onClick={() => handleSkillSelection(skill.id)}
                    disabled={isLoading}
                  >
                    <span className="skill-icon">{skill.icon}</span>
                    <span className="skill-name">{skill.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button 
            className="start-button"
            onClick={startInterview}
            disabled={selectedSkills.length < 2 || isLoading}
          >
            {isLoading ? 'Starting Interview...' : 'Start Interview'}
          </button>
        </>
      )}

      <style jsx>{`
        .skills-selection {
          padding: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .error-message {
          background: #fed7d7;
          color: #c53030;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
        }

        .selection-info {
          text-align: center;
          color: #4a5568;
          margin-bottom: 2rem;
        }

        .skill-category {
          margin-bottom: 2rem;
        }

        .skill-category h3 {
          color: #2d3748;
          margin-bottom: 1rem;
          font-size: 1.2rem;
          text-transform: capitalize;
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

        .skill-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .skill-button.selected {
          background: #3182ce;
          color: white;
          border-color: #3182ce;
        }

        .skill-icon {
          font-size: 1.5rem;
        }

        .skill-name {
          font-size: 1rem;
        }

        .start-button {
          width: 100%;
          padding: 1rem;
          background: #3182ce;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          font-size: 1.1rem;
          margin-top: 2rem;
        }

        .start-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .start-button:hover:not(:disabled) {
          background: #2c5282;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default SkillsSelection; 