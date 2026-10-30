import { BaseFirestoreRepository } from './baseRepository.ts';
import {
  UserDocument,
  CandidateProfileDocument,
  HiringDriveDocument,
  ApplicationDocument,
  InterviewSlotDocument,
  WaitlistEntryDocument,
  StandbyInvitationDocument,
  AbsenceRecordDocument,
  AttendanceRecordDocument,
  AuditLogDocument,
  InternalHRNoteDocument,
  InterviewerPanelDocument,
  SlotRecoveryIncidentDocument,
  NotificationDocument,
  InterviewEvaluationDocument,
  InterviewerAvailabilityDocument,
  InterviewerConflictDocument,
  InterviewerIncidentDocument,
  QuestionBankDocument
} from './types.ts';

export * from './types.ts';
export * from './baseRepository.ts';

// Reusable typed repositories for all 14 NIYOJAN collections
export const usersRepository = new BaseFirestoreRepository<UserDocument>('users');
export const candidateProfilesRepository = new BaseFirestoreRepository<CandidateProfileDocument>('candidate_profiles');
export const hiringDrivesRepository = new BaseFirestoreRepository<HiringDriveDocument>('hiring_drives');
export const applicationsRepository = new BaseFirestoreRepository<ApplicationDocument>('applications');
export const interviewSlotsRepository = new BaseFirestoreRepository<InterviewSlotDocument>('interview_slots');
export const waitlistsRepository = new BaseFirestoreRepository<WaitlistEntryDocument>('waitlists');
export const standbyInvitationsRepository = new BaseFirestoreRepository<StandbyInvitationDocument>('standby_invitations');
export const absenceRecordsRepository = new BaseFirestoreRepository<AbsenceRecordDocument>('absence_records');
export const attendanceRecordsRepository = new BaseFirestoreRepository<AttendanceRecordDocument>('attendance_records');
export const auditLogsRepository = new BaseFirestoreRepository<AuditLogDocument>('audit_logs');
export const internalHRNotesRepository = new BaseFirestoreRepository<InternalHRNoteDocument>('internal_hr_notes');
export const interviewerPanelsRepository = new BaseFirestoreRepository<InterviewerPanelDocument>('interviewer_panels');
export const slotRecoveryIncidentsRepository = new BaseFirestoreRepository<SlotRecoveryIncidentDocument>('slot_recovery_incidents');
export const notificationsRepository = new BaseFirestoreRepository<NotificationDocument>('notifications');
export const interviewEvaluationsRepository = new BaseFirestoreRepository<InterviewEvaluationDocument>('interview_evaluations');
export const interviewerAvailabilityRepository = new BaseFirestoreRepository<InterviewerAvailabilityDocument>('interviewer_availability');
export const interviewerConflictsRepository = new BaseFirestoreRepository<InterviewerConflictDocument>('interviewer_conflicts');
export const interviewerIncidentsRepository = new BaseFirestoreRepository<InterviewerIncidentDocument>('interviewer_incidents');
export const questionBanksRepository = new BaseFirestoreRepository<QuestionBankDocument>('question_banks');

export const repositories = {
  users: usersRepository,
  candidateProfiles: candidateProfilesRepository,
  hiringDrives: hiringDrivesRepository,
  applications: applicationsRepository,
  interviewSlots: interviewSlotsRepository,
  waitlists: waitlistsRepository,
  standbyInvitations: standbyInvitationsRepository,
  absenceRecords: absenceRecordsRepository,
  attendanceRecords: attendanceRecordsRepository,
  auditLogs: auditLogsRepository,
  internalHRNotes: internalHRNotesRepository,
  interviewerPanels: interviewerPanelsRepository,
  slotRecoveryIncidents: slotRecoveryIncidentsRepository,
  notifications: notificationsRepository,
  interviewEvaluations: interviewEvaluationsRepository,
  interviewerAvailability: interviewerAvailabilityRepository,
  interviewerConflicts: interviewerConflictsRepository,
  interviewerIncidents: interviewerIncidentsRepository,
  questionBanks: questionBanksRepository
};
