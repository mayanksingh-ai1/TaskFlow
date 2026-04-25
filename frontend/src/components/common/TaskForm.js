import React, { useState, useEffect } from 'react';
import { taskAPI, userAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const EMPTY = {
  title: '', description: '', status: 'Pending',
  priority: 'Medium', dueDate: '', assignedTo: '',
};

const TaskForm = ({ task, onClose, onSaved }) => {
  const { isAdmin, user } = useAuth();
  const isEdit = !!task;

  const [form, setForm]     = useState(EMPTY);
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setForm({
        title:       task.title || '',
        description: task.description || '',
        status:      task.status || 'Pending',
        priority:    task.priority || 'Medium',
        dueDate:     task.dueDate ? task.dueDate.slice(0, 10) : '',
        assignedTo:  task.assignedTo?._id || task.assignedTo || '',
      });
    }
  }, [task]);

  // Admin: fetch users list for assignedTo dropdown
  useEffect(() => {
    if (isAdmin) {
      userAPI.getAll({ limit: 100 })
        .then(({ data }) => setUsers(data.users))
        .catch(() => {});
    }
  }, [isAdmin]);

  const validate = () => {
    const e = {};
    if (!form.title.trim())            e.title = 'Title is required';
    else if (form.title.trim().length < 3) e.title = 'Title must be at least 3 characters';
    return e;
  };

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const payload = { ...form };
    if (!payload.assignedTo) payload.assignedTo = user._id;
    if (!payload.dueDate)    delete payload.dueDate;

    try {
      if (isEdit) {
        await taskAPI.update(task._id, payload);
        toast.success('Task updated!');
      } else {
        await taskAPI.create(payload);
        toast.success('Task created!');
      }
      onSaved();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Task' : 'New Task'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6"  y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text" name="title" value={form.title} onChange={handleChange}
              className={`form-input${errors.title ? ' error' : ''}`}
              placeholder="What needs to be done?"
              autoFocus
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              className="form-input" rows={3}
              placeholder="Add more details…"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="form-input form-select">
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange}
                className="form-input form-select">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date" name="dueDate" value={form.dueDate} onChange={handleChange}
              className="form-input"
            />
          </div>

          {isAdmin && (
            <div className="form-group">
              <label className="form-label">Assign To</label>
              <select name="assignedTo" value={form.assignedTo} onChange={handleChange}
                className="form-input form-select">
                <option value="">— Assign to yourself —</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 8, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading
                ? <><span className="spinner" /> {isEdit ? 'Saving…' : 'Creating…'}</>
                : isEdit ? 'Save Changes' : 'Create Task'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
