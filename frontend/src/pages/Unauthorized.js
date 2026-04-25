import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="error-page">
      <div className="error-bg">
        <div className="error-glow" />
      </div>
      <div className="error-card fade-up">
        <div className="error-code" style={{ color: 'var(--yellow)' }}>403</div>
        <h1 className="error-title">Access Denied</h1>
        <p className="error-subtitle">
          You don't have permission to view this page.<br />
          Contact an admin if you think this is a mistake.
        </p>
        <div className="error-actions">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Go Back</button>
          <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
