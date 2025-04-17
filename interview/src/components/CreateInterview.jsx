import { useState } from "react";
import "../styles/CreateInterview.css";

const CreateInterview = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 30,
    skills: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement interview creation logic
    console.log("Creating interview:", formData);
  };

  return (
    <div className="create-interview">
      <h2>Create New Interview</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Interview Title</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration (minutes)</label>
          <input
            type="number"
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            min="15"
            max="120"
            required
          />
        </div>

        <div className="form-group">
          <label>Required Skills</label>
          <div className="skills-grid">
            {["JavaScript", "Python", "Java", "React", "Node.js", "SQL"].map((skill) => (
              <label key={skill} className="skill-checkbox">
                <input
                  type="checkbox"
                  checked={formData.skills.includes(skill)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        skills: [...formData.skills, skill],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        skills: formData.skills.filter((s) => s !== skill),
                      });
                    }
                  }}
                />
                {skill}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="create-button">
          Create Interview
        </button>
      </form>
    </div>
  );
};

export default CreateInterview; 