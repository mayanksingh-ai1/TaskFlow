import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import './Dashboard.css';

const StatCard = ({ label, value, color, icon, delay }) => (
  <div className="stat-card fade-up" style={{ animationDelay: delay }}>
    <div className="stat-icon" style={{ background: color }}>{icon}</div>
    <div className="stat-body">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [tasks,   setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await taskAPI.getAll({ limit: 100 });
        setTasks(data.tasks);
      } catch {}
      finally { setLoading(false); }
    };
    fetchTasks();
  }, []);

  const counts = {
    total:      tasks.length,
    pending:    tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed:  tasks.filter(t => t.status === 'Completed').length,
  };

  const recent = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const completionRate = counts.total
    ? Math.round((counts.completed / counts.total) * 100) : 0;

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="page-header fade-up">
        <h1 className="page-title">
          Good {getGreeting()},{' '}
          <span style={{ color: 'var(--accent-2)' }}>{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="page-subtitle">
          {isAdmin ? "Here's an overview of all tasks." : "Here's what's on your plate today."}
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="stats-grid">
          {[...Array(4)].map((_, i) => <div key={i} className="stat-card skeleton" />)}
        </div>
      ) : (
        <div className="stats-grid">
          <StatCard label="Total Tasks"   value={counts.total}      color="rgba(124,106,247,0.15)" icon="◈" delay="0s"    />
          <StatCard label="Pending"       value={counts.pending}    color="rgba(245,166,35,0.15)"  icon="⏳" delay="0.05s" />
          <StatCard label="In Progress"   value={counts.inProgress} color="rgba(79,172,254,0.15)"  icon="⚡" delay="0.1s"  />
          <StatCard label="Completed"     value={counts.completed}  color="rgba(62,207,142,0.15)"  icon="✓" delay="0.15s" />
        </div>
      )}

      {/* Progress bar */}
      {!loading && counts.total > 0 && (
        <div className="progress-card card fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="progress-header">
            <span className="progress-label">Overall Completion</span>
            <span className="progress-percent">{completionRate}%</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="progress-meta">
            <span>{counts.completed} of {counts.total} tasks completed</span>
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div className="section fade-up" style={{ animationDelay: '0.25s' }}>
        <div className="section-header">
          <h2 className="section-title">Recent Tasks</h2>
          <Link to="/tasks" className="btn btn-ghost btn-sm">View all →</Link>
        </div>

        {loading ? (
          <div className="card"><div className="spinner" /></div>
        ) : recent.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No tasks yet</h3>
            <p>Create your first task to get started</p>
            <Link to="/tasks" className="btn btn-primary" style={{ marginTop: 8 }}>
              + Create Task
            </Link>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    {isAdmin && <th>Assigned To</th>}
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map(task => (
                    <tr key={task._id}>
                      <td>
                        <span className="task-title-cell">{task.title}</span>
                      </td>
                      <td><StatusBadge status={task.status} /></td>
                      <td><PriorityBadge priority={task.priority} /></td>
                      {isAdmin && (
                        <td style={{ color: 'var(--text-2)', fontSize: 13 }}>
                          {task.assignedTo?.name || '—'}
                        </td>
                      )}
                      <td style={{ color: 'var(--text-2)', fontSize: 13 }}>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
};

export default Dashboard;
