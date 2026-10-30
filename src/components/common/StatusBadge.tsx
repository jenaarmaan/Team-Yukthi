import React from 'react';
import { ApplicationStatus, CandidateType } from '../../types/recruitment';
import { CheckCircle2, Clock, AlertCircle, AlertTriangle, XCircle, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<ApplicationStatus, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
    confirmed: {
      label: 'Slot Confirmed',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />
    },
    waitlisted: {
      label: 'Waitlisted',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: <Clock className="w-3.5 h-3.5" />
    },
    standby: {
      label: 'Standby Pool',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      icon: <Sparkles className="w-3.5 h-3.5" />
    },
    eligible: {
      label: 'Eligible',
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      border: 'border-teal-200',
      icon: <UserCheck className="w-3.5 h-3.5" />
    },
    ineligible: {
      label: 'Ineligible',
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-300',
      icon: <XCircle className="w-3.5 h-3.5" />
    },
    under_review: {
      label: 'Under HR Review',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: <AlertCircle className="w-3.5 h-3.5" />
    },
    verification_pending: {
      label: 'Verification Pending',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <Clock className="w-3.5 h-3.5" />
    },
    submitted: {
      label: 'Submitted',
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-200',
      icon: <Clock className="w-3.5 h-3.5" />
    },
    completed: {
      label: 'Completed',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />
    },
    rejected: {
      label: 'Application Closed',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: <XCircle className="w-3.5 h-3.5" />
    },
    blocked: {
      label: 'Candidate Blocked',
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: <ShieldAlert className="w-3.5 h-3.5" />
    },
    draft: {
      label: 'Draft',
      bg: 'bg-slate-50',
      text: 'text-slate-500',
      border: 'border-slate-200',
      icon: <AlertTriangle className="w-3.5 h-3.5" />
    }
  };

  const config = configs[status] || configs.submitted;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} whitespace-nowrap`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export const CandidateTypeBadge: React.FC<{ type: CandidateType }> = ({ type }) => {
  if (type === 'fresher') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
        Fresher (2026 Batch)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
      Experienced Professional
    </span>
  );
};
