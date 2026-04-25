import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute, PublicRoute } from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

import Login       from './pages/Login';
import Register    from './pages/Register';
import Dashboard   from './pages/Dashboard';
import Tasks       from './pages/Tasks';
import AdminUsers  from './pages/AdminUsers';
import AdminTasks  from './pages/AdminTasks';
import Unauthorized from './pages/Unauthorized';
import NotFound    from './pages/NotFound';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1e1e28',
              color: '#f0f0f5',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            },
            success: {
              iconTheme: { primary: '#3ecf8e', secondary: '#1e1e28' },
            },
            error: {
              iconTheme: { primary: '#f25f5c', secondary: '#1e1e28' },
            },
          }}
        />

        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Public auth routes */}
          <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Unauthorized — accessible to any authenticated user */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes — require login */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/tasks" element={
            <ProtectedRoute>
              <Layout><Tasks /></Layout>
            </ProtectedRoute>
          } />

          {/* Admin-only routes */}
          <Route path="/admin/users" element={
            <AdminRoute>
              <Layout><AdminUsers /></Layout>
            </AdminRoute>
          } />

          <Route path="/admin/tasks" element={
            <AdminRoute>
              <Layout><AdminTasks /></Layout>
            </AdminRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
