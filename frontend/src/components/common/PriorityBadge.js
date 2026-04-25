import React from 'react';

const PriorityBadge = ({ priority }) => {
  const map = {
    'High':   'badge badge-high',
    'Medium': 'badge badge-medium',
    'Low':    'badge badge-low',
  };
  return <span className={map[priority] || 'badge'}>{priority}</span>;
};

export default PriorityBadge;
