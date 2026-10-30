/**
 * NIYOJAN Firestore Schema & Entity Type Definitions
 * 
 * Defines the 14 core collections and documents representing the complete
 * recruitment lifecycle, ensuring strict architectural separation between
 * User identity (authentication & RBAC) and Candidate Profile (academic/work data).
 */

export type UserRole =
  | 'candidate'
  | 'super_admin'
  | 'hr_admin'
  | 'recruitment_manager'
  | 'interview_coordinator'
  | 'interviewer';

export type CandidateType = 'fresher' | 'experienced';

export type ApplicationStatus =
  | 'registered'
  | 'shortlisted'
  | 'waitlisted'
  | 'standby'
  | 'confirmed'
  | 'under_review'
  | 'completed'
  | 'rejected'
  | 'blocked';

export type StandbyStatus =
  | 'pending_response'
  | 'accepted'
  | 'declined'
  | 'replacement_offered'
  | 'confirmed_slot'
  | 'expired';

export type AbsenceStatus =
  | 'missed_unexplained'
  | 'explanation_submitted'
  | 'ratified'
  | 'blocked'
  | 'rejected'
  | 'not_applicable';



// 1. users: Authenticated system actors (Admins, Coordinators, Interviewers, Candidates)
export interface UserDocument {
  uid: string;
  email: string;
  phone?: string;
  role: UserRole;
  displayName: string;
  avatarInitials: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 2. candidate_profiles: Extended academic and professional records
export interface CandidateProfileDocument {
  id: string; // Matches User.uid
  candidateType: CandidateType;
  fullName: string;
  email: string;
  phone: string;
  currentLocation: string;
  preferredLocations: string[];
  education: {
    institution: string;
    degree: string;
    branch: string;
    yearOfPassing: number;
    cgpa: number;
    percentage?: number;
  };
  workExperience?: {
    years: number;
    currentCompany?: string;
    currentDesignation?: string;
    noticePeriodDays?: number;
  };
  skills: Array<{
    id: string;
    name: string;
    category: 'language' | 'framework' | 'database' | 'tool' | 'core';
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    verificationLevel: 'self_declared' | 'assessment_verified' | 'hr_verified';
    verifiedAt?: string;
  }>;
  verificationStatus: 'pending' | 'verified' | 'action_required';
  profileCompletionPercentage: number;
  resumeStorageUrl?: string; // Private gs:// path
  resumeOriginalName?: string;
  createdAt: string;
  updatedAt: string;
}

// 3. hiring_drives: Corporate recruitment campaigns
export interface HiringDriveDocument {
  id: string;
  title: string;
  company: string;
  role: string;
  candidateType: CandidateType;
  locations: string[];
  startDate: string;
  endDate: string;
  interviewCapacity: number;
  currentRegistrations: number;
  mandatorySkills: string[];
  preferredSkills: string[];
  minimumCgpa: number;
  requiredDegree: string[];
  description: string;
  status: 'active' | 'upcoming' | 'completed' | 'paused';
  stages: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// 4. applications: Job applications tracking stage progression
export interface ApplicationDocument {
  id: string;
  candidateId: string;
  hiringDriveId: string;
  hiringDriveTitle: string;
  role: string;
  company: string;
  appliedLocation: string;
  appliedDate: string;
  status: ApplicationStatus;
  stages: Array<{
    step: number;
    title: string;
    description: string;
    status: 'completed' | 'current' | 'pending' | 'skipped';
    date?: string;
  }>;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    note: string;
  }>;
  interviewSlotId?: string;
  interviewSlot?: any;
  waitlistInfo?: any;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}


// 5. interview_slots: Physical campus venue slots with mutex concurrency locks
export interface InterviewSlotDocument {
  id: string;
  hiringDriveId: string;
  applicationId?: string;
  candidateId?: string;
  date: string;
  time: string;
  reportingTime: string;
  location: string;
  roomOrPanel: string;
  venueAddress: string;
  instructions: string[];
  isLocked: boolean;
  lockedUntil?: string;
  isCheckInOpen: boolean;
  attendanceVerified: boolean;
  checkedInAt?: string;
  qrTokenHash: string;
  otpCode: string;
  otpExpiresAt?: string;
  createdAt: string;
}

// 6. waitlists: FIFO queue for high-demand drives
export interface WaitlistEntryDocument {
  id: string;
  hiringDriveId: string;
  applicationId: string;
  candidateId: string;
  position: number;
  totalInQueue: number;
  status: 'active' | 'promoted_to_confirmed' | 'expired';
  potentialBatchDate: string;
  promotedAt?: string;
  createdAt: string;
}

// 7. standby_invitations: Proactive replacement candidates
export interface StandbyInvitationDocument {
  id: string;
  hiringDriveId: string;
  applicationId: string;
  candidateId: string;
  location: string;
  invitationStatus: StandbyStatus;
  invitedAt: string;
  responseDeadline: string;
  respondedAt?: string;
  replacementSlot?: {
    slotId: string;
    date: string;
    time: string;
    venue: string;
    confirmationDeadline: string;
    acceptedAt?: string;
  };
  createdAt: string;
}

// 8. absence_records: Missed slot audit and justification tracking
export interface AbsenceRecordDocument {
  id: string;
  applicationId: string;
  hiringDriveId: string;
  interviewSlotId: string;
  candidateId: string;
  candidateType: CandidateType;
  missedDate: string;
  deadlineForExplanation: string;
  explanationReason?: string;
  supportingDocStorageUrl?: string;
  supportingDocName?: string;
  submittedAt?: string;
  status: AbsenceStatus;
  hrReviewNotes?: string;
  reviewedByAdminId?: string;
  reviewedAt?: string;
  createdAt: string;
}

// 9. attendance_records: Venue physical check-in validations
export interface AttendanceRecordDocument {
  id: string;
  interviewSlotId: string;
  applicationId: string;
  candidateId: string;
  hiringDriveId: string;
  verifiedMethod: 'qr_hmac' | 'otp_passcode' | 'admin_override';
  verifiedByUserId: string;
  verifiedAt: string;
  location: string;
  roomOrPanel: string;
  notes?: string;
}

// 10. audit_logs: Immutable administrative actions
export interface AuditLogDocument {
  id: string;
  timestamp: string;
  action: string;
  actorId: string;
  actorRole: string;
  targetId: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

// 11. internal_hr_notes: Private recruiter remarks
export interface InternalHRNoteDocument {
  id: string;
  candidateId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  note: string;
  createdAt: string;
}

// 12. interviewer_panels: Evaluator roster and technical panels
export interface InterviewerPanelDocument {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  skills: string[];
  assignedPanel: string;
  location: string;
  activeInterviewsCount: number;
  availableDays: string[];
  createdAt: string;
}

// 13. slot_recovery_incidents: Algorithmic self-healing incidents
export interface SlotRecoveryIncidentDocument {
  id: string;
  vacantSlotId: string;
  hiringDriveId: string;
  role: string;
  venue: string;
  slotDate: string;
  slotTime: string;
  vacatedByCandidateId: string;
  vacatedByCandidateName: string;
  vacatedReason: 'no_show' | 'candidate_cancelled' | 'rescheduled';
  detectedAt: string;
  status: 'vacant' | 'invitations_dispatched' | 'recovered' | 'unfilled';
  matchedStandbyCandidateId?: string;
  matchedStandbyCandidateName?: string;
  matchScore?: number;
  matchScoreBreakdown?: {
    skills: number;
    location: number;
    academic: number;
    availability: number;
  };
  candidateResponseDeadline?: string;
  recoveredAt?: string;
}

// 14. notifications: Candidate notifications
export interface NotificationDocument {
  id: string;
  candidateId: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  deliveryChannel: 'in_app' | 'fcm' | 'sms' | 'email' | 'simulated_email' | 'simulated_sms' | 'simulated_fcm';
  isSimulatedExternal: boolean;
  actionRoute?: {
    tab: string;
    subView?: string;
    targetId?: string;
  };
}

export const NIYOJAN_COLLECTION_NAMES = [
  'users',
  'candidate_profiles',
  'hiring_drives',
  'applications',
  'interview_slots',
  'waitlists',
  'standby_invitations',
  'absence_records',
  'attendance_records',
  'audit_logs',
  'internal_hr_notes',
  'interviewer_panels',
  'slot_recovery_incidents',
  'notifications'
] as const;

export type NiyojanCollectionName = typeof NIYOJAN_COLLECTION_NAMES[number];
