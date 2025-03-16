import { useNavigate } from "react-router-dom";
import '../styles/landing.css';  // If the component is inside a subfolder


const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <header className="fixed w-full z-50">
        <div className="text-3xl font-bold">
          <span className="gradient-text">QuickHire AI</span>
        </div>
        <nav>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#testimonials">Testimonials</a>
          <div className="auth-buttons">
            <button onClick={() => navigate("/login")} className="login-button">Login</button>
            <button onClick={() => navigate("/signup")} className="signup-button">Sign Up</button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Transform Your Hiring Process with AI-Powered Interviews</h1>
          <p>Streamline recruitment, reduce bias, and find the best candidates using advanced AI technology. 
             Conduct automated interviews, analyze responses, and make data-driven decisions.</p>
          <div className="hero-buttons">
            <button onClick={() => navigate("/signup")} className="cta-button">Get Started</button>
          </div>
          {/* <div className="hero-stats">
            <div className="stat-item">
              <h4>10,000+</h4>
              <p>Interviews Conducted</p>
            </div>
            <div className="stat-item">
              <h4>98%</h4>
              <p>Satisfaction Rate</p>
            </div>
            <div className="stat-item">
              <h4>500+</h4>
              <p>Companies Trust Us</p>
            </div>
          </div> */}
        </div>
        <div className="hero-image">
          <img src="src\images\landing1.png" alt="AI Interview Platform" />
        </div>
      </section>

      {/* How It Works Section - Reduced padding */}
      <section id="how-it-works" className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Create Interview</h3>
            <p>Set up your custom interview process with AI-generated questions specific to the role</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Invite Candidates</h3>
            <p>Share unique interview links with candidates to take the AI interview at their convenience</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>AI Analysis</h3>
            <p>Our AI analyzes responses, behavior, and communication skills in real-time</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Get Results</h3>
            <p>Receive detailed reports and rankings to make informed hiring decisions</p>
          </div>
        </div>
      </section>

      {/* Features Section - Reduced padding */}
      <section id="features" className="features">
        <h2>Advanced AI Features</h2>
        <div className="features-grid">
          <div className="feature-box">
            <i className="fas fa-brain"></i>
            <h3>Dynamic Question Generation</h3>
            <p>AI generates role-specific questions and adapts based on candidate responses</p>
          </div>
          <div className="feature-box">
            <i className="fas fa-chart-line"></i>
            <h3>Performance Analytics</h3>
            <p>Comprehensive analysis of communication, confidence, and technical skills</p>
          </div>
          <div className="feature-box">
            <i className="fas fa-face-smile"></i>
            <h3>Behavioral Analysis</h3>
            <p>Advanced facial expression and body language analysis during interviews</p>
          </div>
          <div className="feature-box">
            <i className="fas fa-clock"></i>
            <h3>24/7 Availability</h3>
            <p>Conduct interviews anytime, anywhere with automated scheduling</p>
          </div>
          <div className="feature-box">
            <i className="fas fa-shield-alt"></i>
            <h3>Bias Prevention</h3>
            <p>AI-powered objective evaluation to ensure fair assessment</p>
          </div>
          <div className="feature-box">
            <i className="fas fa-file-alt"></i>
            <h3>Detailed Reports</h3>
            <p>Get comprehensive candidate evaluation reports and rankings</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Reduced padding */}
      <section id="testimonials" className="testimonials">
        <h2>What Our Clients Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <img src="/assets/client1.jpg" alt="HR Manager" className="client-image" />
            <p>"InterviewAI Pro has revolutionized our hiring process. We've reduced time-to-hire by 60% while finding better candidates."</p>
            <h4>Sarah Johnson</h4>
            <p className="client-position">HR Manager, Tech Corp</p>
          </div>
          <div className="testimonial-card">
            <img src="/assets/client2.jpg" alt="CEO" className="client-image" />
            <p>"The AI analysis provides insights we couldn't get from traditional interviews. It's been a game-changer for our recruitment."</p>
            <h4>Michael Chen</h4>
            <p className="client-position">CEO, StartUp Inc</p>
          </div>
        </div>
      </section>

      {/* Integration Partners */}
      <section className="partners">
        <h2>Trusted By Leading Companies</h2>
        <div className="partners-grid">
          {/* Add partner logos here */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Transform Your Hiring Process?</h2>
        <p>Join thousands of companies using AI to make better hiring decisions</p>
        <button onClick={() => navigate("/signup")} className="cta-button">Get Started</button>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>InterviewAI Pro</h3>
            <p>AI-powered interview platform for modern recruitment</p>
            <div className="social-icons">
              <a href="#"><i className="fab fa-linkedin"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="/enterprise">Enterprise</a>
            <a href="/demo">Request Demo</a>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <a href="/blog">Blog</a>
            <a href="/guides">Guides</a>
            <a href="/documentation">Documentation</a>
            <a href="/api">API</a>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <a href="/about">About Us</a>
            <a href="/careers">Careers</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy Policy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 InterviewAI Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
