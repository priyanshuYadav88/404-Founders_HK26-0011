import React from 'react';
import { Severity, IncidentPriority, EventStatus, IncidentStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'severity' | 'priority' | 'status' | 'custom';
  severity?: Severity;
  priority?: IncidentPriority;
  status?: EventStatus | IncidentStatus | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  severity,
  priority,
  status,
  className = ''
}) => {
  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';

  if (severity) {
    switch (severity) {
      case 'critical':
        colorClasses = 'bg-red-950/60 text-red-400 border-red-800/80';
        break;
      case 'high':
        colorClasses = 'bg-orange-950/60 text-orange-400 border-orange-800/80';
        break;
      case 'medium':
        colorClasses = 'bg-amber-950/60 text-amber-400 border-amber-800/80';
        break;
      case 'low':
        colorClasses = 'bg-cyan-950/60 text-cyan-400 border-cyan-800/80';
        break;
      case 'info':
        colorClasses = 'bg-blue-950/60 text-blue-400 border-blue-800/80';
        break;
    }
  } else if (priority) {
    switch (priority) {
      case 'P1':
        colorClasses = 'bg-red-950/70 text-red-400 border-red-700 font-semibold';
        break;
      case 'P2':
        colorClasses = 'bg-orange-950/70 text-orange-400 border-orange-700 font-semibold';
        break;
      case 'P3':
        colorClasses = 'bg-amber-950/70 text-amber-400 border-amber-700';
        break;
      case 'P4':
        colorClasses = 'bg-blue-950/70 text-blue-400 border-blue-700';
        break;
    }
  } else if (status) {
    switch (status) {
      case 'Active':
      case 'detected':
        colorClasses = 'bg-red-950/50 text-red-400 border-red-800/60';
        break;
      case 'Investigating':
      case 'investigating':
        colorClasses = 'bg-amber-950/50 text-amber-400 border-amber-800/60';
        break;
      case 'Contained':
      case 'mitigated':
        colorClasses = 'bg-emerald-950/50 text-emerald-400 border-emerald-800/60';
        break;
      case 'Resolved':
        colorClasses = 'bg-blue-950/50 text-blue-400 border-blue-800/60';
        break;
      case 'false_positive':
        colorClasses = 'bg-slate-800/60 text-slate-400 border-slate-700';
        break;
      case 'Simulated':
      case 'Demo':
      case 'Illustrative':
      case 'Suggested':
        colorClasses = 'bg-cyan-950/50 text-cyan-300 border-cyan-800/60';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border ${colorClasses} ${className}`}
    >
      {children}
    </span>
  );
};
