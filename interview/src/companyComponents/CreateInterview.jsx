import { useState } from "react";
import "../styles/CreateInterview.css";

const CreateInterview = () => {
  const [formData, setFormData] = useState({
    interviewName: "",
    roles: [],
    skills: {},
    difficulty: "medium",
    numQuestions: 5,
    date: "",
    time: "",
    duration: 60,
    description: ""
  });

  const [step, setStep] = useState(1);

  const availableRoles = [
    "Software Development Engineer (SDE)",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "QA Engineer",
    "Product Manager",
    "UI/UX Designer",
    "Mobile Developer",
    "Cloud Engineer"
  ];

  const availableSkills = {
    "Software Development Engineer (SDE)": [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "System Design",
      "Database Management",
      "Operating Systems",
      "Computer Networks",
      "Software Architecture",
      "Problem Solving",
      "Code Optimization",
      "Version Control"
    ],
    "Frontend Developer": [
      "React",
      "JavaScript",
      "TypeScript",
      "HTML/CSS",
      "Redux",
      "Next.js",
      "Vue.js",
      "Angular",
      "Responsive Design",
      "Web Performance",
      "State Management",
      "UI/UX Principles"
    ],
    "Backend Developer": [
      "Node.js",
      "Python",
      "Java",
      "Spring Boot",
      "REST APIs",
      "GraphQL",
      "Microservices",
      "Database Design",
      "API Security",
      "Caching",
      "Message Queues",
      "Serverless Architecture"
    ],
    "Full Stack Developer": [
      "MERN Stack",
      "MEAN Stack",
      "LAMP Stack",
      "Django",
      "Flask",
      "Full Stack Architecture",
      "API Integration",
      "Authentication",
      "Deployment",
      "CI/CD",
      "Cloud Services",
      "Web Security"
    ],
    "DevOps Engineer": [
      "Docker",
      "Kubernetes",
      "AWS",
      "Azure",
      "CI/CD",
      "Infrastructure as Code",
      "Monitoring",
      "Logging",
      "Security",
      "Automation",
      "Cloud Architecture",
      "System Administration"
    ],
    "Data Scientist": [
      "Python",
      "R",
      "Machine Learning",
      "Data Analysis",
      "Statistics",
      "Data Visualization",
      "SQL",
      "Big Data",
      "Deep Learning",
      "Natural Language Processing",
      "Data Mining",
      "Predictive Modeling"
    ],
    "Machine Learning Engineer": [
      "Python",
      "TensorFlow",
      "PyTorch",
      "Deep Learning",
      "Computer Vision",
      "NLP",
      "Model Deployment",
      "MLOps",
      "Feature Engineering",
      "Model Evaluation",
      "Transfer Learning",
      "Reinforcement Learning"
    ],
    "QA Engineer": [
      "Manual Testing",
      "Automation Testing",
      "Selenium",
      "JIRA",
      "Test Cases",
      "Performance Testing",
      "Security Testing",
      "API Testing",
      "Mobile Testing",
      "Test Automation",
      "Quality Assurance",
      "Bug Tracking"
    ],
    "Product Manager": [
      "Product Strategy",
      "Market Research",
      "User Stories",
      "Agile Methodologies",
      "Product Roadmap",
      "Stakeholder Management",
      "Data Analysis",
      "User Experience",
      "Product Metrics",
      "Competitive Analysis",
      "Product Launch",
      "Customer Feedback"
    ],
    "UI/UX Designer": [
      "Figma",
      "Adobe XD",
      "User Research",
      "Wireframing",
      "Prototyping",
      "User Testing",
      "Design Systems",
      "Accessibility",
      "Interaction Design",
      "Visual Design",
      "Information Architecture",
      "Design Thinking"
    ],
    "Mobile Developer": [
      "React Native",
      "Flutter",
      "iOS Development",
      "Android Development",
      "Mobile UI/UX",
      "Mobile Security",
      "Performance Optimization",
      "Push Notifications",
      "Mobile Testing",
      "App Store Guidelines",
      "Cross-Platform Development",
      "Mobile Architecture"
    ],
    "Cloud Engineer": [
      "AWS",
      "Azure",
      "Google Cloud",
      "Cloud Architecture",
      "Serverless Computing",
      "Containerization",
      "Cloud Security",
      "Infrastructure as Code",
      "Cloud Migration",
      "Cost Optimization",
      "Cloud Monitoring",
      "DevOps Integration"
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (e) => {
    const selectedRoles = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      roles: selectedRoles,
      skills: selectedRoles.reduce((acc, role) => ({
        ...acc,
        [role]: []
      }), {})
    }));
  };

  const handleSkillChange = (role, skill) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [role]: prev.skills[role].includes(skill)
          ? prev.skills[role].filter(s => s !== skill)
          : [...prev.skills[role], skill]
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to save interview
    console.log("Interview Data:", formData);
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      <div className={`step ${step >= 1 ? 'active' : ''}`}>
        <div className="step-number">1</div>
        <span>Basic Info</span>
      </div>
      <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
      <div className={`step ${step >= 2 ? 'active' : ''}`}>
        <div className="step-number">2</div>
        <span>Skills</span>
      </div>
      <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
      <div className={`step ${step >= 3 ? 'active' : ''}`}>
        <div className="step-number">3</div>
        <span>Settings</span>
      </div>
    </div>
  );

  return (
    <div className="create-interview-container">
      <div className="create-interview-header">
        <h1>Create New Interview</h1>
        <p>Set up a custom AI-powered interview for your candidates</p>
      </div>

      {renderStepIndicator()}

      <form onSubmit={handleSubmit} className="create-interview-form">
        {step === 1 && (
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label>Interview Name</label>
              <input
                type="text"
                name="interviewName"
                value={formData.interviewName}
                onChange={handleInputChange}
                placeholder="e.g., QuickHire - SDE Round 1"
                required
              />
            </div>

            <div className="form-group">
              <label>Interview Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the interview process and expectations"
                rows="3"
              />
            </div>

            <div className="form-group roles-group">
              <label>Select Roles</label>
              <div className="roles-grid">
                {availableRoles.map(role => (
                  <label key={role} className="role-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.roles.includes(role)}
                      onChange={(e) => {
                        const newRoles = e.target.checked
                          ? [...formData.roles, role]
                          : formData.roles.filter(r => r !== role);
                        setFormData(prev => ({
                          ...prev,
                          roles: newRoles,
                          skills: newRoles.reduce((acc, r) => ({
                            ...acc,
                            [r]: prev.skills[r] || []
                          }), {})
                        }));
                      }}
                    />
                    <span className="role-label">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="next-button" onClick={nextStep}>
                Next Step
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-section">
            <h2>Skills Configuration</h2>
            <div className="skills-container">
              {formData.roles.map(role => (
                <div key={role} className="skills-group">
                  <h3>{role}</h3>
                  <div className="skills-grid">
                    {availableSkills[role].map(skill => (
                      <label key={skill} className="skill-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.skills[role]?.includes(skill)}
                          onChange={() => handleSkillChange(role, skill)}
                        />
                        <span className="skill-label">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button type="button" className="prev-button" onClick={prevStep}>
                <i className="fas fa-arrow-left"></i>
                Previous
              </button>
              <button type="button" className="next-button" onClick={nextStep}>
                Next Step
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-section">
            <h2>Interview Settings</h2>
            <div className="settings-grid">
              <div className="form-group">
                <label>Difficulty Level</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label>Number of Questions</label>
                <input
                  type="number"
                  name="numQuestions"
                  value={formData.numQuestions}
                  onChange={handleInputChange}
                  min="3"
                  max="10"
                  required
                />
              </div>

              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="30"
                  max="180"
                  required
                />
              </div>

              <div className="form-group">
                <label>Interview Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Interview Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="prev-button" onClick={prevStep}>
                <i className="fas fa-arrow-left"></i>
                Previous
              </button>
              <button type="submit" className="create-button">
                <i className="fas fa-plus-circle"></i>
                Create Interview
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateInterview; 