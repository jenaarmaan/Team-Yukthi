import { ApplicationStatus, StandbyStatus, AbsenceStatus } from '../repositories/types.ts';

export interface StateTransitionValidationResult {
  isValid: boolean;
  errorCode?: string;
  errorMessage?: string;
}

/**
 * Authoritative NIYOJAN Recruitment State Machine
 * Formally governs allowed lifecycle transitions and enforces terminal states.
 */
export class RecruitmentStateMachine {
  // Allowed application status transitions
  private static readonly ALLOWED_APPLICATION_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
    registered: ['shortlisted', 'waitlisted', 'confirmed', 'rejected', 'under_review'],
    shortlisted: ['confirmed', 'waitlisted', 'standby', 'rejected'],
    waitlisted: ['confirmed', 'rejected'], // Promoted to confirmed or drive closed
    standby: ['confirmed', 'rejected', 'blocked'], // Replacement slot confirmed or declined
    confirmed: ['completed', 'under_review', 'rejected', 'blocked'], // Attendance verified, absence review, or no-show
    under_review: ['confirmed', 'blocked', 'rejected'], // Ratified restores confirmed/eligible; rejection blocks
    completed: [], // Terminal
    rejected: [], // Terminal for standard lifecycle
    blocked: [] // Strictly terminal under recruitment policy unless explicitly overridden by super_admin
  };

  // Allowed standby invitation status transitions
  private static readonly ALLOWED_STANDBY_TRANSITIONS: Record<StandbyStatus, StandbyStatus[]> = {
    pending_response: ['accepted', 'declined', 'expired'],
    accepted: ['replacement_offered', 'declined'],
    declined: [], // Terminal
    replacement_offered: ['confirmed_slot', 'expired'],
    confirmed_slot: [], // Terminal
    expired: [] // Terminal
  };

  // Allowed absence status transitions
  private static readonly ALLOWED_ABSENCE_TRANSITIONS: Record<AbsenceStatus, AbsenceStatus[]> = {
    missed_unexplained: ['explanation_submitted', 'blocked', 'rejected'],
    explanation_submitted: ['ratified', 'blocked', 'rejected'],
    ratified: [], // Terminal
    blocked: [], // Terminal
    rejected: [], // Terminal
    not_applicable: [] // Terminal
  };

  /**
   * Validates application status transition.
   */
  public static validateApplicationTransition(
    currentStatus: ApplicationStatus,
    targetStatus: ApplicationStatus,
    actorRole?: string
  ): StateTransitionValidationResult {
    // If status remains the same, allow
    if (currentStatus === targetStatus) {
      return { isValid: true };
    }

    // Guard: Blocked applications cannot be transitioned without super_admin override
    if (currentStatus === 'blocked') {
      if (actorRole !== 'super_admin') {
        return {
          isValid: false,
          errorCode: 'BLOCKED_STATE_VIOLATION',
          errorMessage: 'Application is BLOCKED by enterprise recruitment policy. Only Super Admin can override.'
        };
      }
      return { isValid: true };
    }

    const allowed = this.ALLOWED_APPLICATION_TRANSITIONS[currentStatus];
    if (!allowed || !allowed.includes(targetStatus)) {
      return {
        isValid: false,
        errorCode: 'INVALID_STATE_TRANSITION',
        errorMessage: `Illegal application state transition from "${currentStatus}" to "${targetStatus}".`
      };
    }

    return { isValid: true };
  }

  /**
   * Validates standby status transition.
   */
  public static validateStandbyTransition(
    currentStatus: StandbyStatus,
    targetStatus: StandbyStatus
  ): StateTransitionValidationResult {
    if (currentStatus === targetStatus) {
      return { isValid: true };
    }

    const allowed = this.ALLOWED_STANDBY_TRANSITIONS[currentStatus];
    if (!allowed || !allowed.includes(targetStatus)) {
      return {
        isValid: false,
        errorCode: 'INVALID_STANDBY_TRANSITION',
        errorMessage: `Illegal standby invitation transition from "${currentStatus}" to "${targetStatus}".`
      };
    }

    return { isValid: true };
  }

  /**
   * Validates slot recovery status transition.
   * Enforces that a vacant slot incident CANNOT be marked as 'recovered'
   * unless a candidate has actually accepted the replacement slot.
   */
  public static validateRecoveryTransition(
    currentStatus: 'vacant' | 'invitations_dispatched' | 'recovered' | 'unfilled',
    targetStatus: 'vacant' | 'invitations_dispatched' | 'recovered' | 'unfilled',
    hasAcceptedCandidate: boolean
  ): StateTransitionValidationResult {
    if (currentStatus === targetStatus) return { isValid: true };

    if (targetStatus === 'recovered' && !hasAcceptedCandidate) {
      return {
        isValid: false,
        errorCode: 'PREMATURE_RECOVERY_VIOLATION',
        errorMessage: 'A slot cannot be marked as RECOVERED before successful candidate acceptance.'
      };
    }

    if (currentStatus === 'recovered') {
      return {
        isValid: false,
        errorCode: 'TERMINAL_STATE_VIOLATION',
        errorMessage: 'Slot recovery incident is already finalized as RECOVERED.'
      };
    }

    return { isValid: true };
  }
}
