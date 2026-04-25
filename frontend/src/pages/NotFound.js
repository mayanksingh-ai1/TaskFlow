import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="error-page">
      <div className="error-bg">
        <div className="error-glow" style={{ background: 'var(--accent)' }} />
      </div>
      <div className="error-card fade-up">
        <div className="error-code">404</div>
        <h1 className="error-title">Page Not Found</h1>
        <p className="error-subtitle">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="error-actions">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Go Back</button>
          <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
