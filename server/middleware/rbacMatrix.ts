import { UserRole } from '../repositories/types.ts';

export type Permission =
  // User & Role Management
  | 'auth:manage_roles'
  | 'auth:view_users'
  | 'auth:bootstrap_admin'
  // Profile Management
  | 'profile:view_own'
  | 'profile:edit_own'
  | 'profile:verify'
  // Hiring Drives
  | 'drives:create'
  | 'drives:edit'
  | 'drives:view'
  | 'drives:delete'
  // Applications
  | 'applications:view_all'
  | 'applications:view_own'
  | 'applications:manage_status'
  | 'applications:apply'
  // Interview Slots & Panel Schedulers
  | 'slots:allocate'
  | 'slots:view_all'
  | 'slots:view_own'
  | 'slots:cancel'
  | 'waitlist:promote'
  // Attendance Desk
  | 'attendance:verify'
  | 'attendance:view_all'
  | 'attendance:view_own'
  // Absence Governance
  | 'absence:review'
  | 'absence:ratify'
  | 'absence:submit'
  | 'absence:view_all'
  | 'absence:view_own'
  // Standby & Self-Healing
  | 'standby:invite'
  | 'standby:claim'
  | 'standby:view_all'
  | 'standby:view_own'
  | 'recovery:view'
  | 'recovery:trigger'
  // Internal Evaluator Notes (STRICTLY FORBIDDEN to Candidates)
  | 'notes:create'
  | 'notes:view'
  // Interviewer Management
  | 'interviewers:view'
  | 'interviewers:manage'
  // Audit Logs
  | 'audit:view';

/**
 * Approved NIYOJAN Enterprise Role-Based Access Control (RBAC) Matrix
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // 1. Super Admin: Unrestricted organizational authority, role provisioning, and audit governance
  super_admin: [
    'auth:manage_roles',
    'auth:view_users',
    'auth:bootstrap_admin',
    'profile:view_own',
    'profile:edit_own',
    'profile:verify',
    'drives:create',
    'drives:edit',
    'drives:view',
    'drives:delete',
    'applications:view_all',
    'applications:view_own',
    'applications:manage_status',
    'slots:allocate',
    'slots:view_all',
    'slots:view_own',
    'slots:cancel',
    'waitlist:promote',
    'attendance:verify',
    'attendance:view_all',
    'absence:review',
    'absence:ratify',
    'absence:view_all',
    'standby:invite',
    'standby:view_all',
    'recovery:view',
    'recovery:trigger',
    'notes:create',
    'notes:view',
    'interviewers:view',
    'interviewers:manage',
    'audit:view'
  ],

  // 2. HR Admin: Full campus hiring management, drive lifecycle, waitlists, absence ratification
  hr_admin: [
    'auth:view_users',
    'profile:view_own',
    'profile:verify',
    'drives:create',
    'drives:edit',
    'drives:view',
    'applications:view_all',
    'applications:view_own',
    'applications:manage_status',
    'slots:allocate',
    'slots:view_all',
    'slots:view_own',
    'slots:cancel',
    'waitlist:promote',
    'attendance:verify',
    'attendance:view_all',
    'absence:review',
    'absence:ratify',
    'absence:view_all',
    'standby:invite',
    'standby:view_all',
    'recovery:view',
    'recovery:trigger',
    'notes:create',
    'notes:view',
    'interviewers:view',
    'interviewers:manage',
    'audit:view'
  ],

  // 3. Recruitment Manager: Talent pool pipeline, standby allocations, capacity and candidate vetting
  recruitment_manager: [
    'profile:view_own',
    'profile:verify',
    'drives:view',
    'drives:edit',
    'applications:view_all',
    'applications:view_own',
    'applications:manage_status',
    'slots:allocate',
    'slots:view_all',
    'slots:view_own',
    'waitlist:promote',
    'absence:review',
    'absence:view_all',
    'standby:invite',
    'standby:view_all',
    'recovery:view',
    'recovery:trigger',
    'notes:create',
    'notes:view',
    'interviewers:view'
  ],

  // 4. Interview Coordinator: Physical venue desk operations, panel allocations, QR & OTP check-in desk
  interview_coordinator: [
    'profile:view_own',
    'drives:view',
    'applications:view_all',
    'slots:allocate',
    'slots:view_all',
    'slots:view_own',
    'waitlist:promote',
    'attendance:verify',
    'attendance:view_all',
    'notes:create',
    'notes:view',
    'interviewers:view',
    'interviewers:manage',
    'recovery:view',
    'recovery:trigger'
  ],

  // 5. Interviewer: Technical panel assessments and candidate evaluations
  interviewer: [
    'profile:view_own',
    'drives:view',
    'applications:view_all',
    'slots:view_all',
    'attendance:view_all',
    'notes:create',
    'notes:view',
    'interviewers:view'
  ],

  // 6. Candidate: Strictly bounded to candidate self-service actions
  candidate: [
    'profile:view_own',
    'profile:edit_own',
    'drives:view',
    'applications:view_own',
    'applications:apply',
    'slots:view_own',
    'attendance:view_own',
    'absence:submit',
    'absence:view_own',
    'standby:claim',
    'standby:view_own'
  ]
};

export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  const allowed = ROLE_PERMISSIONS[role];
  if (!allowed) return false;
  return allowed.includes(permission);
};

