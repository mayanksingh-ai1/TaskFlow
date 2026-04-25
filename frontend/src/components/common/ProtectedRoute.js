import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="page-loader">
      <div className="spinner spinner-lg" />
      <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Loading…</p>
    </div>
  );

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return (
    <div className="page-loader">
      <div className="spinner spinner-lg" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/unauthorized" replace />;

  return children;
};

export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="page-loader">
      <div className="spinner spinner-lg" />
    </div>
  );

  if (user) return <Navigate to="/dashboard" replace />;

  return children;
};
