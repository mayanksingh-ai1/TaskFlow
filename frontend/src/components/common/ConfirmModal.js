import React from 'react';

const ConfirmModal = ({ title, message, onConfirm, onCancel, loading, confirmLabel = 'Delete', danger = true }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
    <div className="modal confirm-dialog">
      <div style={{ fontSize: 40, marginBottom: 8 }}>{danger ? '🗑️' : '⚠️'}</div>
      <h2 className="modal-title" style={{ justifyContent: 'center' }}>{title}</h2>
      <p>{message}</p>
      <div className="actions">
        <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>Cancel</button>
        <button
          className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? <><span className="spinner" /> Deleting…</> : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
