import React, { useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/common/TaskForm';
import ConfirmModal from '../components/common/ConfirmModal';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import toast from 'react-hot-toast';
import './Tasks.css';

const Tasks = () => {
  const { isAdmin } = useAuth();
  const [tasks,   setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const limit = 10;

  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [showForm,    setShowForm]    = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit, ...filters };
      if (!params.status)   delete params.status;
      if (!params.priority) delete params.priority;
      const { data } = await taskAPI.getAll(params);
      setTasks(data.tasks);
      setTotal(data.total);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleFilterChange = (e) => {
    setFilters(p => ({ ...p, [e.target.name]: e.target.value }));
    setPage(1);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setStatusLoading(taskId);
    try {
      await taskAPI.updateStatus(taskId, newStatus);
      toast.success('Status updated');
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusLoading('');
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await taskAPI.remove(deleteTarget._id);
      toast.success('Task deleted');
      setDeleteTarget(null);
      fetchTasks();
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="tasks-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title fade-up">{isAdmin ? 'All Tasks' : 'My Tasks'}</h1>
          <p className="page-subtitle fade-up">{total} task{total !== 1 ? 's' : ''} found</p>
        </div>
        <button className="btn btn-primary fade-up" onClick={() => { setEditingTask(null); setShowForm(true); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5"  y1="12" x2="19" y2="12"/>
          </svg>
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="tasks-filters fade-up">
        <select name="status" value={filters.status} onChange={handleFilterChange}
          className="form-input form-select filter-select">
          <option value="">All Statuses</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <select name="priority" value={filters.priority} onChange={handleFilterChange}
          className="form-input form-select filter-select">
          <option value="">All Priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        {(filters.status || filters.priority) && (
          <button className="btn btn-ghost btn-sm"
            onClick={() => { setFilters({ status: '', priority: '' }); setPage(1); }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Tasks Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div className="spinner spinner-lg" style={{ margin: '0 auto' }} />
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No tasks found</h3>
            <p>Try adjusting the filters or create a new task</p>
            <button className="btn btn-primary" style={{ marginTop: 8 }}
              onClick={() => { setEditingTask(null); setShowForm(true); }}>
              + New Task
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  {isAdmin && <th>Assigned To</th>}
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, i) => (
                  <tr key={task._id} className="fade-in" style={{ animationDelay: `${i * 0.03}s` }}>
                    <td>
                      <div>
                        <div className="task-title">{task.title}</div>
                        {task.description && (
                          <div className="task-desc">{task.description}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        disabled={statusLoading === task._id}
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                    </td>
                    <td><PriorityBadge priority={task.priority} /></td>
                    {isAdmin && (
                      <td className="task-assignee">{task.assignedTo?.name || '—'}</td>
                    )}
                    <td className="task-date">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : '—'
                      }
                    </td>
                    <td>
                      <div className="task-actions">
                        <button
                          className="btn btn-ghost btn-icon btn-sm"
                          title="Edit"
                          onClick={() => { setEditingTask(task); setShowForm(true); }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          className="btn btn-danger btn-icon btn-sm"
                          title="Delete"
                          onClick={() => setDeleteTarget(task)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination fade-up">
          <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
            ← Prev
          </button>
          <div className="pagination-pages">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`pagination-page${page === i + 1 ? ' active' : ''}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
            Next →
          </button>
        </div>
      )}

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onClose={() => { setShowForm(false); setEditingTask(null); }}
          onSaved={fetchTasks}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Task"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default Tasks;
