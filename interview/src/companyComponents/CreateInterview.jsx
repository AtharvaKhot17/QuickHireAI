import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateInterview.css";
import { api } from '../services/api';

const CreateInterview = () => {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    const role = e.target.value;
    if (!formData.roles.includes(role)) {
      setFormData(prev => ({
        ...prev,
        roles: [...prev.roles, role],
        skills: {
          ...prev.skills,
          [role]: []
        }
      }));
    }
  };

  const handleSkillChange = (role, skill) => {
    setFormData(prev => {
      const roleSkills = prev.skills[role] || [];
      const updatedSkills = roleSkills.includes(skill)
        ? roleSkills.filter(s => s !== skill)
        : [...roleSkills, skill];

      return {
        ...prev,
        skills: {
          ...prev.skills,
          [role]: updatedSkills
        }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Transform form data to match backend expectations
      const interviewData = {
        name: formData.interviewName,
        roles: formData.roles,
        skills: formData.skills,
        difficulty: formData.difficulty,
        numQuestions: formData.numQuestions,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        description: formData.description
      };

      const response = await api.post('/interviews/create', interviewData);

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to create interview");
      }

      // Navigate to candidate upload page with the interview ID
      navigate(`/company-dashboard/upload-candidates/${response.data.interview._id}`);
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      <div className={`step ${step >= 1 ? "active" : ""}`}>
        <span>1</span>
        <p>Basic Info</p>
      </div>
      <div className={`step ${step >= 2 ? "active" : ""}`}>
        <span>2</span>
        <p>Roles & Skills</p>
      </div>
      <div className={`step ${step >= 3 ? "active" : ""}`}>
        <span>3</span>
        <p>Schedule</p>
      </div>
    </div>
  );

  return (
    <div className="create-interview">
      <h1>Create New Interview</h1>
      {renderStepIndicator()}

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="form-step">
            <div className="form-group">
              <label>Interview Name</label>
              <input
                type="text"
                name="interviewName"
                value={formData.interviewName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
              />
            </div>
            <div className="form-group">
              <label>Difficulty Level</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
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
                min="1"
                max="20"
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <div className="form-group">
              <label>Select Roles</label>
              <select onChange={handleRoleChange}>
                <option value="">Select a role</option>
                {availableRoles.map(role => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {formData.roles.length > 0 && (
              <div className="selected-roles">
                <h3>Selected Roles</h3>
                {formData.roles.map(role => (
                  <div key={role} className="role-section">
                    <h4>{role}</h4>
                    <div className="skills-grid">
                      {availableSkills[role].map(skill => (
                        <label key={skill} className="skill-checkbox">
                          <input
                            type="checkbox"
                            checked={formData.skills[role]?.includes(skill)}
                            onChange={() => handleSkillChange(role, skill)}
                          />
                          {skill}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <div className="form-group">
              <label>Interview Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Interview Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
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
                min="15"
                max="180"
                required
              />
            </div>
          </div>
        )}

        <div className="form-actions">
          {step > 1 && (
            <button type="button" onClick={prevStep} disabled={loading}>
              Previous
            </button>
          )}
          {step < 3 ? (
            <button type="button" onClick={nextStep} disabled={loading}>
              Next
            </button>
          ) : (
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Interview"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateInterview; 