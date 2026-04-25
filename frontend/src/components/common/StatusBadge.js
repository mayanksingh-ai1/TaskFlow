import React from 'react';

const StatusBadge = ({ status }) => {
  const map = {
    'Pending':     'badge badge-pending',
    'In Progress': 'badge badge-progress',
    'Completed':   'badge badge-done',
  };
  return <span className={map[status] || 'badge'}>{status}</span>;
};

export default StatusBadge;
