import React from 'react';
import { Priority } from '../types';

interface PriorityBadgeProps {
  priority: Priority;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const badgeClasses = {
    [Priority.LOW]: 'bg-green-100 text-green-800',
    [Priority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
    [Priority.HIGH]: 'bg-red-100 text-red-800',
  };

  const priorityLabels = {
    [Priority.LOW]: 'Low',
    [Priority.MEDIUM]: 'Medium',
    [Priority.HIGH]: 'High',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[priority]}`}
    >
      {priorityLabels[priority]}
    </span>
  );
};

export default PriorityBadge;