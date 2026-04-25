import React, { useState, useEffect, useCallback } from 'react';
import { userAPI } from '../api';
import ConfirmModal from '../components/common/ConfirmModal';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './AdminUsers.css';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [roleFilter, setRoleFilter] = useState('');
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [roleLoading,   setRoleLoading]   = useState('');
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (roleFilter) params.role = roleFilter;
      const { data } = await userAPI.getAll(params);
      setUsers(data.users);
      setTotal(data.total);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleRoleToggle = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    setRoleLoading(u._id);
    try {
      await userAPI.update(u._id, { role: newRole });
      toast.success(`${u.name} is now ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    } finally {
      setRoleLoading('');
    }
  };

  const handleToggleActive = async (u) => {
    setRoleLoading(u._id + '_active');
    try {
      await userAPI.update(u._id, { isActive: !u.isActive });
      toast.success(`${u.name} ${u.isActive ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setRoleLoading('');
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await userAPI.remove(deleteTarget._id);
      toast.success('User deleted');
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="admin-users-page">
      <div className="page-header">
        <div>
          <h1 className="page-title fade-up">User Management</h1>
          <p className="page-subtitle fade-up">{total} registered user{total !== 1 ? 's' : ''}</p>
        </div>
        <div className="fade-up">
          <select
            className="form-input form-select filter-select"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div className="spinner spinner-lg" style={{ margin: '0 auto' }} />
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3>No users found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id} className="fade-in" style={{ animationDelay: `${i * 0.03}s` }}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-sm">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="user-cell-name">
                            {u.name}
                            {u._id === currentUser._id && (
                              <span className="you-label">you</span>
                            )}
                          </div>
                          <div className="user-cell-email">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${u.role}`}>{u.role}</span>
                    </td>
                    <td>
                      <span className={`status-dot ${u.isActive ? 'active' : 'inactive'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-2)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                   {currentUser && u._id !== currentUser._id ? (
                        <div className="task-actions">
                          {/* Toggle Role */}
                          <button
                            className="btn btn-ghost btn-sm"
                            title={u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                            onClick={() => handleRoleToggle(u)}
                            disabled={roleLoading === u._id}
                          >
                            {roleLoading === u._id
                              ? <span className="spinner" />
                              : u.role === 'admin' ? '↓ User' : '↑ Admin'
                            }
                          </button>

                          {/* Toggle Active */}
                          <button
                            className={`btn btn-sm ${u.isActive ? 'btn-ghost' : 'btn-primary'}`}
                            onClick={() => handleToggleActive(u)}
                            disabled={roleLoading === u._id + '_active'}
                          >
                            {roleLoading === u._id + '_active'
                              ? <span className="spinner" />
                              : u.isActive ? 'Deactivate' : 'Activate'
                            }
                          </button>

                          {/* Delete */}
                          <button
                            className="btn btn-danger btn-icon btn-sm"
                            title="Delete user"
                            onClick={() => setDeleteTarget(u)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                              <path d="M10 11v6M14 11v6"/>
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 13, color: 'var(--text-3)' }}>—</span>
                      )}
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
          <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Prev</button>
          <div className="pagination-pages">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`pagination-page${page === i + 1 ? ' active' : ''}`}
                onClick={() => setPage(i + 1)}
              >{i + 1}</button>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next →</button>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete User"
          message={`Delete "${deleteTarget.name}"? This will also delete all their tasks and cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default AdminUsers;
