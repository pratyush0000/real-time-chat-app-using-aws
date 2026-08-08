import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './Landing.css';

const GITHUB_URL = 'https://github.com/pratyush0000';
const CONTACT_EMAIL = 'pratyushkamal88@gmail.com';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <nav className="landing__nav">
        <div className="landing__brand">
          <span className="landing__mark">
            <svg viewBox="0 0 32 32" width="20" height="20" fill="none">
              <circle cx="8" cy="16" r="3.5" stroke="currentColor" strokeWidth="2" />
              <circle cx="24" cy="16" r="3.5" stroke="currentColor" strokeWidth="2" />
              <line x1="11.5" y1="16" x2="20.5" y2="16" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
          Openline
        </div>
        <ThemeToggle />
      </nav>

      <main className="landing__hero">
        <span className="landing__eyebrow">Real-time messaging</span>
        <h1 className="landing__title">
          One line,
          <br />
          always open.
        </h1>
        <p className="landing__subtitle">
          Openline is a real-time chat app built entirely on AWS: AppSync for
          live messaging, Cognito for auth, and Lambda for message filtering.
          No refreshing, no polling. The line stays open, so the conversation
          keeps moving.
        </p>

        <div className="landing__actions">
          <button className="landing__cta" onClick={() => navigate('/chat')}>
            Start Chatting
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="landing__meta">
          <div className="landing__meta-item">
            <span className="landing__meta-label">Infrastructure</span>
            <span className="landing__meta-value">AWS Amplify</span>
          </div>
          <div className="landing__meta-divider" />
          <div className="landing__meta-item">
            <span className="landing__meta-label">Messaging</span>
            <span className="landing__meta-value">AppSync GraphQL</span>
          </div>
          <div className="landing__meta-divider" />
          <div className="landing__meta-item">
            <span className="landing__meta-label">Uptime</span>
            <span className="landing__meta-value">Always open</span>
          </div>
        </div>
      </main>

      <footer className="landing__footer">
        <span>Fully hosted on AWS</span>
        <div className="landing__footer-links">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
        </div>
      </footer>
    </div>
  );
}
