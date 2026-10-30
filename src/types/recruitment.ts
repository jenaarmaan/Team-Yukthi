export type CandidateType = 'fresher' | 'experienced';

export type SkillVerificationLevel = 
  | 'self_declared'
  | 'resume_extracted'
  | 'assessment_verified'
  | 'hr_verified';

export interface CandidateSkill {
  id: string;
  name: string;
  category: 'programming' | 'framework' | 'tools' | 'database' | 'domain';
  verificationLevel: SkillVerificationLevel;
  rating?: number; // 1-5
}

export interface Education {
  institution: string;
  degree: string;
  branch: string;
  graduationYear: number;
  cgpa: number;
  verified: boolean;
}

export interface WorkExperience {
  organization: string;
  jobTitle: string;
  durationMonths: number;
  startDate: string;
  endDate?: string; // empty if currently working
  isCurrent: boolean;
  description: string;
  relevantSkills: string[];
}

export interface CandidateProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  candidateType: CandidateType;
  currentLocation: string;
  preferredLocations: string[];
  education: Education;
  workExperience: WorkExperience[];
  skills: CandidateSkill[];
  certifications: string[];
  preferredJobRoles: string[];
  profileCompletionPercentage: number;
  verificationStatus: 'pending' | 'verified' | 'action_required';
  resume?: {
    fileName: string;
    uploadedAt: string;
    fileSize: string;
    parsedData?: {
      summary: string;
      detectedSkills: string[];
      educationDetected: string;
      yearsOfExperience: number;
    };
  };
}

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'verification_pending'
  | 'under_review'
  | 'eligible'
  | 'ineligible'
  | 'confirmed'
  | 'waitlisted'
  | 'standby'
  | 'completed'
  | 'rejected'
  | 'blocked';

export interface HiringDriveStage {
  step: number;
  title: string;
  description: string;
  status: 'pending' | 'current' | 'completed' | 'skipped';
  date?: string;
}

export interface HiringDrive {
  id: string;
  company: string;
  title: string;
  role: string;
  department: string;
  description: string;
  locations: string[];
  requiredDegree: string[];
  minimumCgpa: number;
  eligibleCandidateTypes: CandidateType[];
  mandatorySkills: string[];
  preferredSkills: string[];
  minExperienceMonths: number;
  registrationDeadline: string;
  hiringDriveDate: string;
  stages: string[];
  isRegistrationOpen: boolean;
  totalOpenings: number;
  interviewCapacity: number;
  currentRegistrations: number;
}

export interface InterviewSlot {
  id: string;
  hiringDriveId: string;
  date: string;
  time: string;
  reportingTime: string;
  location: string;
  roomOrPanel: string;
  venueAddress: string;
  instructions: string[];
  qrToken: string;
  otpCode: string;
  isCheckInOpen: boolean;
  attendanceVerified: boolean;
  checkedInAt?: string;
}

export interface WaitlistInfo {
  id: string;
  hiringDriveId: string;
  position: number;
  totalInWaitlist: number;
  status: 'active' | 'promoted_to_standby' | 'promoted_to_confirmed' | 'expired';
  lastUpdatedAt: string;
  expectedNextSteps: string;
  tentativeFutureDate?: string;
}

export interface StandbyInvitation {
  id: string;
  hiringDriveId: string;
  company: string;
  jobRole: string;
  location: string;
  invitationStatus: 'pending_response' | 'accepted' | 'declined' | 'replacement_offered' | 'confirmed_slot' | 'expired';
  invitedAt: string;
  responseDeadline: string;
  potentialSlotDate?: string;
  replacementSlot?: {
    slotId: string;
    date: string;
    time: string;
    venue: string;
    confirmationDeadline: string;
    acceptedAt?: string;
  };
}

export type AbsenceStatus =
  | 'not_applicable'
  | 'missed_unexplained'
  | 'explanation_submitted'
  | 'ratified'
  | 'rejected'
  | 'blocked';

export interface AbsenceRecord {
  id: string;
  applicationId: string;
  hiringDriveId: string;
  interviewSlotId: string;
  candidateType: CandidateType;
  missedDate: string;
  deadlineForExplanation: string;
  status: AbsenceStatus;
  explanationReason?: string;
  supportingDocName?: string;
  supportingDocUrl?: string;
  submittedAt?: string;
  hrReviewNotes?: string;
  reviewedAt?: string;
}

export interface Application {
  id: string;
  candidateId: string;
  hiringDriveId: string;
  hiringDriveTitle: string;
  company: string;
  role: string;
  appliedLocation: string;
  appliedDate: string;
  status: ApplicationStatus;
  stages: HiringDriveStage[];
  interviewSlot?: InterviewSlot;
  waitlistInfo?: WaitlistInfo;
  standbyInfo?: StandbyInvitation;
  absenceRecord?: AbsenceRecord;
  rejectionReason?: string;
  resultOutcome?: 'Selected' | 'On Hold' | 'Not Selected';
  statusHistory: {
    status: ApplicationStatus;
    timestamp: string;
    note: string;
  }[];
}

export type NotificationType =
  | 'registration_confirmed'
  | 'profile_verified'
  | 'eligibility_result'
  | 'interview_allocated'
  | 'interview_reminder'
  | 'waitlist_update'
  | 'standby_invitation'
  | 'replacement_opportunity'
  | 'attendance_confirmed'
  | 'absence_policy_alert'
  | 'absence_decision'
  | 'interview_result';

export type NotificationDeliveryChannel = 
  | 'in_app' 
  | 'simulated_fcm' 
  | 'simulated_email' 
  | 'simulated_sms';

export interface AppNotification {
  id: string;
  candidateId: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  deliveryChannel?: NotificationDeliveryChannel;
  isSimulatedExternal?: boolean;
  actionRoute?: {
    tab: 'home' | 'opportunities' | 'applications' | 'notifications' | 'profile';
    subView?: string;
    targetId?: string;
  };
}

// --- Admin & HR Dashboard Types ---

export type AdminRole =
  | 'super_admin'
  | 'hr_admin'
  | 'recruitment_manager'
  | 'interview_coordinator'
  | 'interviewer';

export type AdminPermission =
  | 'MANAGE_DRIVES'
  | 'VERIFY_CANDIDATE'
  | 'ALLOCATE_SLOTS'
  | 'PROMOTE_WAITLIST'
  | 'MANAGE_STANDBY'
  | 'MARK_ATTENDANCE'
  | 'DECIDE_ABSENCE'
  | 'MANAGE_RECOVERY'
  | 'MANAGE_INTERVIEWERS'
  | 'EXPORT_DATA';

export interface MatchScoreBreakdown {
  totalScore: number; // 0 to 100
  skillsScore: number; // max 40
  locationScore: number; // max 25
  academicScore: number; // max 20
  availabilityScore: number; // max 15
  isEligible: boolean;
  reasons: string[];
}

export interface ServiceResult<T = void> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: 'UNAUTHORIZED' | 'CONCURRENCY_CONFLICT' | 'EXPIRED' | 'NOT_FOUND' | 'VALIDATION_FAILED';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  department: string;
  avatarInitials: string;
}

export interface InterviewerProfile {
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
}

export interface VacantSlotRecovery {
  id: string;
  vacantSlotId: string;
  hiringDriveId: string;
  hiringDriveTitle: string;
  role: string;
  venue: string;
  slotDate: string;
  slotTime: string;
  vacatedByCandidateName: string;
  vacatedReason: 'no_show' | 'candidate_cancelled' | 'rescheduled' | 'medical_absence';
  detectedAt: string;
  status: 'vacant' | 'invitations_dispatched' | 'recovered' | 'unrecovered';
  matchedStandbyCandidateId?: string;
  matchedStandbyCandidateName?: string;
  candidateResponseDeadline?: string;
  recoveredAt?: string;
}

export interface InternalCandidateNote {
  id: string;
  candidateId: string;
  authorName: string;
  authorRole: string;
  note: string;
  createdAt: string;
}
