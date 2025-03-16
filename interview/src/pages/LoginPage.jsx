import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css"; // Import the CSS file

const LoginPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("student"); // Default: Student
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (userType === "student") {
      navigate("/dashboard");
    } else {
      navigate("/company-dashboard");
    }
  };

  return (
    <div className="page-container">
      <div className="login-wrapper">
        <div className="left-section">
          <div className="ai-animation">
            <div className="pulse-circle"></div>
            <i className="fas fa-robot"></i>
          </div>
          <h1>Welcome to QuickHire AI</h1>
          <p>Experience the future of interviewing with AI-powered assessments</p>
        </div>

        <div className="right-section">
          <div className="login-form-container">
            <h2>
              <i className="fas fa-user-circle"></i>
              Login to Your Account
            </h2>

            <div className="toggle-buttons">
              <button
                className={userType === "student" ? "active" : ""}
                onClick={() => setUserType("student")}
              >
                <i className="fas fa-user-graduate"></i>
                Student
              </button>
              <button
                className={userType === "company" ? "active" : ""}
                onClick={() => setUserType("company")}
              >
                <i className="fas fa-building"></i>
                Company
              </button>
            </div>

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">
                Login <i className="fas fa-arrow-right"></i>
              </button>
            </form>

            <p className="signup-text">
              Don't have an account?{" "}
              <span onClick={() => navigate("/signup")}>Sign Up</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
