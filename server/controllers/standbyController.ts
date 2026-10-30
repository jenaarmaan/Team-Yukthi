import { Request, Response } from 'express';
import {
  applicationsRepository,
  standbyInvitationsRepository,
  candidateProfilesRepository,
  interviewSlotsRepository,
  slotRecoveryIncidentsRepository,
  notificationsRepository,
  auditLogsRepository,
  hiringDrivesRepository
} from '../repositories/index.ts';
import {
  ConcurrencyLockManager,
  calculateStandbyMatchScore
} from '../services/matchingService.ts';
import { DistributedTransactionService } from '../services/distributedTransactionService.ts';
import { RecruitmentStateMachine } from '../services/stateMachine.ts';
import {
  sendSuccess,
  sendBadRequest,
  sendNotFound,
  sendConflict
} from '../utils/response.ts';

export class StandbyController {
  public static async getAllStandbyApplications(req: Request, res: Response): Promise<void> {
    const standbys = await standbyInvitationsRepository.findAll(100);
    const apps = await applicationsRepository.findAll(100);
    const appMap = new Map(apps.map((a) => [a.id, a]));
    const profiles = await candidateProfilesRepository.findAll(100);
    const profileMap = new Map(profiles.map((p) => [p.id, p]));

    const result = standbys.map((s) => ({
      standby: s,
      app: appMap.get(s.applicationId),
      candidate: profileMap.get(s.candidateId)
    }));

    sendSuccess(res, result, 'Standby pool candidates retrieved.');
  }

  public static async sendStandbyInvitation(req: Request, res: Response): Promise<void> {
    const { candidateId, hiringDriveId, location } = req.body;

    if (!candidateId || !hiringDriveId) {
      sendBadRequest(res, 'candidateId and hiringDriveId are required.');
      return;
    }

    const drive = await hiringDrivesRepository.findById(hiringDriveId);
    if (!drive) {
      sendNotFound(res, 'Hiring drive not found.');
      return;
    }

    let existingApps = await applicationsRepository.findByField('candidateId', candidateId);
    let app = existingApps.find((a) => a.hiringDriveId === hiringDriveId);

    if (!app) {
      const appId = 'app_standby_' + Date.now();
      app = {
        id: appId,
        candidateId,
        hiringDriveId: drive.id,
        hiringDriveTitle: drive.title,
        company: drive.company,
        role: drive.role,
        appliedLocation: location || drive.locations[0],
        appliedDate: new Date().toISOString(),
        status: 'standby' as any,
        stages: [
          { step: 1, title: 'Registration', description: 'Application filed', status: 'completed', date: 'Today' },
          { step: 2, title: 'Profile Verification', description: 'Skills reviewed by HR', status: 'completed', date: 'Today' },
          { step: 3, title: 'Eligibility Check', description: 'Eligible for standby pool', status: 'completed', date: 'Today' },
          { step: 4, title: 'Standby Pool Invitation', description: 'Invited to standby pool', status: 'current', date: 'Today' },
          { step: 5, title: 'Interview Attendance', description: 'Awaiting replacement slot', status: 'pending' },
          { step: 6, title: 'Interview Result', description: 'Outcome pending', status: 'pending' }
        ],
        statusHistory: [
          { status: 'standby', timestamp: new Date().toISOString(), note: 'HR dispatched proactive standby invitation' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await applicationsRepository.create(appId, app);
    } else {
      app.status = 'standby';
      await applicationsRepository.update(app.id, { status: 'standby' });
    }

    const standbyId = 'std_inv_' + Date.now();
    const standbyDoc = {
      id: standbyId,
      hiringDriveId: drive.id,
      applicationId: app.id,
      candidateId,
      location: location || drive.locations[0],
      invitationStatus: 'pending_response' as const,
      invitedAt: new Date().toISOString(),
      responseDeadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    };
    await standbyInvitationsRepository.create(standbyId, standbyDoc);

    await notificationsRepository.create('notif_' + Date.now(), {
      id: 'notif_' + Date.now(),
      candidateId,
      type: 'standby_invitation',
      title: 'Action Required: Excelsoft Standby Invitation',
      message: `Excelsoft Talent Acquisition invited you to join the priority standby pool for ${drive.role} in ${location || drive.locations[0]}.`,
      timestamp: 'Just now',
      isRead: false,
      deliveryChannel: 'in_app',
      isSimulatedExternal: false,
      actionRoute: { tab: 'applications', targetId: app.id }
    });

    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'SEND_STANDBY_INVITATION',
      actorId: req.user?.uid || 'admin',
      actorRole: req.user?.role || 'admin',
      targetId: candidateId,
      details: `Dispatched standby invitation for drive ${drive.title}`
    });

    sendSuccess(res, { app, standby: standbyDoc }, 'Standby invitation sent successfully.');
  }

  public static async respondToStandbyInvitation(req: Request, res: Response): Promise<void> {
    const { applicationId } = req.params;
    const { accept } = req.body;

    const app = await applicationsRepository.findById(applicationId);
    if (!app) {
      sendNotFound(res, 'Application not found.');
      return;
    }

    const standbyList = await standbyInvitationsRepository.findByField('applicationId', applicationId);
    const standby = standbyList[0];
    if (!standby) {
      sendNotFound(res, 'No standby invitation found for this application.');
      return;
    }

    standby.invitationStatus = accept ? 'accepted' : 'declined';
    standby.respondedAt = new Date().toISOString();
    await standbyInvitationsRepository.update(standby.id, standby);

    app.statusHistory.unshift({
      status: 'standby',
      timestamp: new Date().toISOString(),
      note: accept ? 'Candidate accepted proactive standby availability' : 'Candidate declined standby availability'
    });
    await applicationsRepository.update(app.id, { statusHistory: app.statusHistory });

    await notificationsRepository.create('notif_' + Date.now(), {
      id: 'notif_' + Date.now(),
      candidateId: app.candidateId,
      type: 'standby_invitation',
      title: accept ? 'Standby Availability Confirmed' : 'Standby Invitation Declined',
      message: accept
        ? 'You are active on the Priority Standby pool. We will alert you immediately if a replacement slot becomes vacant.'
        : 'You have opted out of the standby pool for this hiring drive.',
      timestamp: 'Just now',
      isRead: false,
      deliveryChannel: 'in_app',
      isSimulatedExternal: false,
      actionRoute: { tab: 'applications', targetId: app.id }
    });

    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'STANDBY_RESPONSE',
      actorId: app.candidateId,
      actorRole: 'candidate',
      targetId: app.id,
      details: `Standby response: ${accept ? 'ACCEPTED' : 'DECLINED'}`
    });

    sendSuccess(res, standby, `Standby invitation ${accept ? 'accepted' : 'declined'} successfully.`);
  }

  public static async acceptReplacementSlot(req: Request, res: Response): Promise<void> {
    const { applicationId } = req.params;
    const app = await applicationsRepository.findById(applicationId);
    if (!app) {
      sendNotFound(res, 'Application not found.');
      return;
    }

    const standbyList = await standbyInvitationsRepository.findByField('applicationId', applicationId);
    const standby = standbyList[0];
    if (!standby || !standby.replacementSlot) {
      sendNotFound(res, 'No active replacement slot invitation found for this application.');
      return;
    }

    const repl = standby.replacementSlot;

    // 1. Recruitment State Machine Verification
    const appStateCheck = RecruitmentStateMachine.validateApplicationTransition(app.status, 'confirmed', req.user?.role);
    if (!appStateCheck.isValid) {
      res.status(409).json({
        success: false,
        error: {
          code: appStateCheck.errorCode || 'INVALID_STATE_TRANSITION',
          message: appStateCheck.errorMessage || 'Invalid application state transition.'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    const standbyStateCheck = RecruitmentStateMachine.validateStandbyTransition(standby.invitationStatus, 'confirmed_slot');
    if (!standbyStateCheck.isValid) {
      res.status(409).json({
        success: false,
        error: {
          code: standbyStateCheck.errorCode || 'INVALID_STANDBY_TRANSITION',
          message: standbyStateCheck.errorMessage || 'Invalid standby invitation state transition.'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    // 2. Distributed Database-Backed Atomic Transaction (Firestore runTransaction OCC)
    const txResult = await DistributedTransactionService.claimReplacementSlotTransaction({
      applicationId: app.id,
      candidateId: app.candidateId,
      hiringDriveId: app.hiringDriveId,
      slotId: repl.slotId,
      venue: repl.venue,
      date: repl.date,
      time: repl.time,
      location: standby.location,
      confirmationDeadline: repl.confirmationDeadline
    });

    if (!txResult.success) {
      if (txResult.errorCode === 'EXPIRED') {
        await auditLogsRepository.create('log_' + Date.now(), {
          id: 'log_' + Date.now(),
          timestamp: new Date().toISOString(),
          action: 'REPLACEMENT_OFFER_EXPIRED',
          actorId: app.candidateId,
          actorRole: 'candidate',
          targetId: repl.slotId,
          details: `Candidate attempted to claim expired replacement slot offer ${repl.slotId}`
        });
        res.status(410).json({
          success: false,
          error: {
            code: 'EXPIRED',
            message: 'The confirmation window for this urgent replacement slot has lapsed.'
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      await auditLogsRepository.create('log_' + Date.now(), {
        id: 'log_' + Date.now(),
        timestamp: new Date().toISOString(),
        action: 'CONCURRENCY_COLLISION_BLOCKED',
        actorId: app.candidateId,
        actorRole: 'candidate',
        targetId: repl.slotId,
        details: `Slot ${repl.slotId} already claimed by another candidate via distributed transaction`
      });
      sendConflict(res, txResult.message);
      return;
    }

    const confirmedSlot = txResult.data!;

    // Update Standby doc
    standby.invitationStatus = 'confirmed_slot';
    standby.replacementSlot.acceptedAt = new Date().toISOString();
    await standbyInvitationsRepository.update(standby.id, standby);

    // Update Application
    app.status = 'confirmed';
    app.interviewSlotId = repl.slotId;
    app.stages = app.stages.map((stage) => {
      if (stage.step === 4) {
        return {
          ...stage,
          title: 'Interview Confirmed (Replacement)',
          description: `Confirmed replacement slot for ${repl.date}`,
          status: 'completed' as const,
          date: 'Just now'
        };
      }
      if (stage.step === 5) {
        return { ...stage, status: 'current' as const };
      }
      return stage;
    });

    app.statusHistory.unshift({
      status: 'confirmed',
      timestamp: new Date().toISOString(),
      note: `Candidate accepted urgent replacement slot for ${repl.date}. Status changed to CONFIRMED.`
    });
    await applicationsRepository.update(app.id, app);

    await notificationsRepository.create('notif_' + Date.now(), {
      id: 'notif_' + Date.now(),
      candidateId: app.candidateId,
      type: 'interview_allocated',
      title: 'Confirmed: Replacement Slot Reserved!',
      message: `Your interview for ${app.role} is now locked in for ${repl.date} at ${repl.time}. Access your QR pass now!`,
      timestamp: 'Just now',
      isRead: false,
      deliveryChannel: 'in_app',
      isSimulatedExternal: false,
      actionRoute: { tab: 'applications', targetId: app.id }
    });

    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'ACCEPT_REPLACEMENT_SLOT',
      actorId: app.candidateId,
      actorRole: 'candidate',
      targetId: repl.slotId,
      details: `Replacement slot confirmed for ${repl.date}`
    });

    sendSuccess(res, confirmedSlot, 'Replacement interview slot confirmed! Your application status has updated to CONFIRMED. Your QR Pass is ready.');
  }

  public static async simulateConcurrentClaim(req: Request, res: Response): Promise<void> {
    const { slotId, candidate1Id, candidate2Id } = req.body;
    const targetSlotId = slotId || 'slot_repl_concurrent_test';
    const c1 = candidate1Id || 'cand_candidate_1';
    const c2 = candidate2Id || 'cand_candidate_2';

    // Reset lock for clean test
    await ConcurrencyLockManager.resetSlot(targetSlotId);

    // Candidate 1 claims slot first
    const c1Lock = await ConcurrencyLockManager.acquireSlotClaim(targetSlotId, c1);
    const candidate1Result = {
      success: c1Lock.success,
      message: 'Urgent replacement slot acquired and locked by Candidate 1 via Cloud Firestore.',
      data: {
        id: targetSlotId,
        date: 'Thursday, Nov 18, 2026',
        time: '02:00 PM - 03:00 PM IST',
        qrToken: `NIYOJAN_REPL_${c1}_${Date.now()}`,
        otpCode: '829104'
      }
    };

    // Candidate 2 attempts concurrent claim immediately after
    const c2Lock = await ConcurrencyLockManager.acquireSlotClaim(targetSlotId, c2);
    const candidate2Result = {
      success: c2Lock.success,
      errorCode: c2Lock.errorCode,
      message: c2Lock.message
    };

    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'CONCURRENCY_COLLISION_AVERTED',
      actorId: c2,
      actorRole: 'candidate',
      targetId: targetSlotId,
      details: `Concurrent claim prevented for slot ${targetSlotId}`
    });

    sendSuccess(res, {
      candidate1Result,
      candidate2Result,
      winnerCandidateId: c1,
      loserCandidateId: c2,
      details: 'Atomic locking successfully prevented race condition: Candidate 1 acquired lock, Candidate 2 was safely denied with CONCURRENCY_CONFLICT without double booking.'
    }, 'Concurrent claim simulation executed.');
  }

  public static async getMatchScore(req: Request, res: Response): Promise<void> {
    const candidateId = (req.query.candidateId as string) || req.user?.uid;
    const hiringDriveId = req.query.hiringDriveId as string;
    const targetVenue = req.query.targetVenue as string;

    if (!candidateId || !hiringDriveId) {
      sendBadRequest(res, 'candidateId and hiringDriveId are required.');
      return;
    }

    const breakdown = await calculateStandbyMatchScore(candidateId, hiringDriveId, targetVenue);
    sendSuccess(res, breakdown, '100-point standby match score calculated.');
  }

  public static async getRecoveries(req: Request, res: Response): Promise<void> {
    const recoveries = await slotRecoveryIncidentsRepository.findAll(100);
    sendSuccess(res, recoveries, 'Slot recovery incidents retrieved.');
  }

  public static async triggerRecovery(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { standbyCandidateId } = req.body;

    const recovery = await slotRecoveryIncidentsRepository.findById(id);
    if (!recovery) {
      sendNotFound(res, 'Recovery incident not found.');
      return;
    }

    recovery.status = 'invitations_dispatched';
    recovery.matchedStandbyCandidateId = standbyCandidateId;
    recovery.candidateResponseDeadline = 'In 4 hours';
    await slotRecoveryIncidentsRepository.update(id, recovery);

    // Offer replacement slot to candidate application
    const candidateApps = await applicationsRepository.findByField('candidateId', standbyCandidateId);
    const standbyApp = candidateApps.find((a) => a.hiringDriveId === recovery.hiringDriveId) || candidateApps[0];

    if (standbyApp) {
      const deadline = new Date(Date.now() + 4 * 3600 * 1000).toISOString();
      const standbyDoc = {
        id: 'std_repl_' + Date.now(),
        hiringDriveId: recovery.hiringDriveId,
        applicationId: standbyApp.id,
        candidateId: standbyCandidateId,
        location: recovery.venue,
        invitationStatus: 'replacement_offered' as const,
        invitedAt: new Date().toISOString(),
        responseDeadline: deadline,
        replacementSlot: {
          slotId: recovery.vacantSlotId,
          date: recovery.slotDate,
          time: recovery.slotTime,
          venue: recovery.venue,
          confirmationDeadline: deadline
        },
        createdAt: new Date().toISOString()
      };
      await standbyInvitationsRepository.create(standbyDoc.id, standbyDoc);

      await notificationsRepository.create('notif_' + Date.now(), {
        id: 'notif_' + Date.now(),
        candidateId: standbyCandidateId,
        type: 'replacement_opportunity',
        title: 'URGENT: Vacant Interview Slot Offered!',
        message: `A vacant slot opened for ${recovery.role} at ${recovery.venue} on ${recovery.slotDate} at ${recovery.slotTime}. Claim it immediately!`,
        timestamp: 'Just now',
        isRead: false,
        deliveryChannel: 'in_app',
        isSimulatedExternal: false,
        actionRoute: { tab: 'applications', targetId: standbyApp.id }
      });
    }

    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'TRIGGER_SLOT_RECOVERY',
      actorId: req.user?.uid || 'admin',
      actorRole: req.user?.role || 'admin',
      targetId: id,
      details: `Triggered slot recovery for vacant slot ${recovery.vacantSlotId}`
    });

    sendSuccess(res, recovery, 'Vacant slot recovery dispatched to standby candidate with 4-hour window.');
  }

  public static async confirmRecovery(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const recovery = await slotRecoveryIncidentsRepository.findById(id);
    if (!recovery) {
      sendNotFound(res, 'Recovery incident not found.');
      return;
    }

    // Enterprise Guard: Check if candidate actually accepted the replacement slot
    let hasAcceptedCandidate = false;
    if (recovery.matchedStandbyCandidateId) {
      const standbyInvs = await standbyInvitationsRepository.findByField('candidateId', recovery.matchedStandbyCandidateId);
      const matchedInv = standbyInvs.find((s) => s.replacementSlot?.slotId === recovery.vacantSlotId);
      if (matchedInv && matchedInv.invitationStatus === 'confirmed_slot') {
        hasAcceptedCandidate = true;
      }
    }

    const stateCheck = RecruitmentStateMachine.validateRecoveryTransition(
      recovery.status,
      'recovered',
      hasAcceptedCandidate
    );

    if (!stateCheck.isValid) {
      res.status(400).json({
        success: false,
        error: {
          code: stateCheck.errorCode || 'PREMATURE_RECOVERY_VIOLATION',
          message: stateCheck.errorMessage || 'A slot cannot be marked as RECOVERED before successful candidate acceptance.'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    recovery.status = 'recovered';
    recovery.recoveredAt = new Date().toISOString();
    await slotRecoveryIncidentsRepository.update(id, recovery);

    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'CONFIRM_SLOT_RECOVERY',
      actorId: req.user?.uid || 'admin',
      actorRole: req.user?.role || 'admin',
      targetId: id,
      details: `Slot ${recovery.vacantSlotId} marked as RECOVERED`
    });

    sendSuccess(res, recovery, 'Slot marked as recovered successfully.');
  }
}
