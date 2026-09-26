import React, { useState } from 'react';
import {
  Clock,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  User,
  Mail,
  CheckCircle2,
  BookOpen,
  Code2
} from 'lucide-react';
import { TEST_DURATION_MINUTES } from '../config';

export default function WelcomeScreen({ onStart, totalQuestions }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);

  const isValidEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
  const isValidName = name.trim().length >= 2;
  const isFormValid = isValidName && isValidEmail(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (isFormValid) {
      onStart({ name: name.trim(), email: email.trim().toLowerCase() });
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="welcome-header">
          <div className="brand-badge" style={{ alignSelf: 'flex-start' }}>
            Technical Evaluation
          </div>
          <h1 className="welcome-title">Junior Developer Assessment Test</h1>
          <p className="welcome-subtitle">
            Welcome to the skills assessment. This test evaluates core concepts and practical problem-solving in front-end and back-end web development.
          </p>
        </div>

        {/* Overview Pills */}
        <div className="welcome-overview-grid">
          <div className="overview-item">
            <BookOpen size={18} className="overview-icon" />
            <div>
              <div className="overview-label">Topics Covered</div>
              <div className="overview-value">HTML, CSS, JavaScript, PHP</div>
            </div>
          </div>

          <div className="overview-item">
            <HelpCircle size={18} className="overview-icon" />
            <div>
              <div className="overview-label">Total Questions</div>
              <div className="overview-value">{totalQuestions} Questions (MCQ + Code)</div>
            </div>
          </div>

          <div className="overview-item">
            <Clock size={18} className="overview-icon" />
            <div>
              <div className="overview-label">Time Limit</div>
              <div className="overview-value">{TEST_DURATION_MINUTES} Minutes (Auto-submits)</div>
            </div>
          </div>

          <div className="overview-item">
            <Code2 size={18} className="overview-icon" />
            <div>
              <div className="overview-label">Question Types</div>
              <div className="overview-value">Multiple Choice & Live Coding</div>
            </div>
          </div>
        </div>

        {/* Instructions Block */}
        <div className="instructions-box">
          <h2 className="instructions-title">Important Instructions & Guidelines</h2>
          <ul className="instructions-list">
            <li>
              <strong>Revisiting Questions:</strong> You can navigate freely between questions using the <em>Previous</em> and <em>Next</em> buttons or by clicking any question number in the question navigator. Your answers and code are automatically preserved.
            </li>
            <li>
              <strong>Code Auto-Grading:</strong> Code snippet answers are auto-evaluated against automated test suites and structural criteria. You can test your logic and edit your code freely.
            </li>
            <li>
              <strong>Timer & Submission:</strong> The {TEST_DURATION_MINUTES}-minute countdown begins as soon as you click <em>Start Test</em>. The test will automatically submit if time expires.
            </li>
            <li>
              <strong>Anti-Copy Security:</strong> Copying or cutting text from the test page is disabled during the assessment. You can type and edit freely in all code and input areas.
            </li>
          </ul>
        </div>

        {/* Candidate Registration Form */}
        <form className="candidate-form" onSubmit={handleSubmit}>
          <h3 className="form-heading">Candidate Information</h3>
          <p className="form-subheading">Please provide your details before beginning the assessment.</p>

          <div className="form-fields-grid">
            <div className="form-group">
              <label htmlFor="candidate-name" className="form-label">
                Full Name <span className="required-star">*</span>
              </label>
              <div className="input-wrap">
                <User size={16} className="input-icon" />
                <input
                  id="candidate-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Subhash Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
              {touched && !isValidName && (
                <span className="input-error-msg">Please enter your full name.</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="candidate-email" className="form-label">
                Email Address <span className="required-star">*</span>
              </label>
              <div className="input-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  id="candidate-email"
                  type="email"
                  className="form-input"
                  placeholder="e.g. candidate@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              {touched && email.length > 0 && !isValidEmail(email) && (
                <span className="input-error-msg">Please enter a valid email address.</span>
              )}
            </div>
          </div>

          <div className="welcome-action-bar">
            <div className="ready-note">
              {isFormValid ? (
                <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 size={16} /> All fields complete - ready to begin.
                </span>
              ) : (
                <span>* Enter your name and valid email to enable the start button.</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={!isFormValid}
            >
              <span>Start Test</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
