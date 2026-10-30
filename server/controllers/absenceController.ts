import { Request, Response } from 'express';
import {
  absenceRecordsRepository,
  applicationsRepository,
  candidateProfilesRepository,
  notificationsRepository,
  auditLogsRepository
} from '../repositories/index.ts';
import { sendSuccess, sendBadRequest, sendNotFound } from '../utils/response.ts';

export class AbsenceController {
  public static async submitAbsenceExplanation(req: Request, res: Response): Promise<void> {
    const candidateId = req.user?.uid;
    const { applicationId, reason, docName } = req.body;

    if (!applicationId || !reason) {
      sendBadRequest(res, 'applicationId and reason are required.');
      return;
    }

    const app = await applicationsRepository.findById(applicationId);
    if (!app) {
      sendNotFound(res, 'Application not found.');
      return;
    }

    const profile = await candidateProfilesRepository.findById(candidateId!);
    if (!profile) {
      sendNotFound(res, 'Candidate profile not found.');
      return;
    }

    // Enterprise Rule: Freshers do NOT have an absence justification workflow
    if (profile.candidateType === 'fresher') {
      res.status(400).json({
        success: false,
        error: {
          code: 'POLICY_LAPSED',
          message: 'Under company recruitment policy, fresher candidates do not have an absence justification workflow. This opportunity has lapsed.'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Experienced candidates: 48-hour justification window
    let absenceList = await absenceRecordsRepository.findByField('applicationId', applicationId);
    let absence = absenceList[0];

    const absId = absence?.id || 'abs_' + Date.now();
    const absenceRecord = {
      id: absId,
      applicationId: app.id,
      hiringDriveId: app.hiringDriveId,
      interviewSlotId: app.interviewSlotId || 'slot_default',
      candidateId: profile.id,
      candidateType: 'experienced' as const,
      missedDate: absence?.missedDate || new Date().toISOString(),
      deadlineForExplanation: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      explanationReason: reason,
      supportingDocName: docName || 'medical_supporting_affidavit.pdf',
      submittedAt: new Date().toISOString(),
      status: 'explanation_submitted' as const,
      hrReviewNotes: 'Pending Talent Acquisition Committee formal review.',
      createdAt: absence?.createdAt || new Date().toISOString()
    };

    if (absence) {
      await absenceRecordsRepository.update(absId, absenceRecord);
    } else {
      await absenceRecordsRepository.create(absId, absenceRecord);
    }

    app.status = 'under_review';
    app.stages = app.stages.map((st) => {
      if (st.step === 5) {
        return {
          ...st,
          title: 'Absence Explanation Submitted',
          description: 'Awaiting HR decision and ratification',
          status: 'current' as const
        };
      }
      return st;
    });

    app.statusHistory.unshift({
      status: 'under_review',
      timestamp: new Date().toISOString(),
      note: 'Candidate submitted formal explanation with supporting documentation. Under HR review.'
    });

    await applicationsRepository.update(app.id, app);

    await notificationsRepository.create('notif_' + Date.now(), {
      id: 'notif_' + Date.now(),
      candidateId: profile.id,
      type: 'absence_policy_alert',
      title: 'Absence Justification Under Review',
      message: 'Your absence justification has been logged. The Talent Acquisition panel will review within 24 business hours.',
      timestamp: 'Just now',
      isRead: false,
      deliveryChannel: 'in_app',
      isSimulatedExternal: false,
      actionRoute: { tab: 'applications', targetId: app.id }
    });

    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'SUBMIT_ABSENCE_EXPLANATION',
      actorId: profile.id,
      actorRole: 'candidate',
      targetId: app.id,
      details: `Submitted absence reason: ${reason.substring(0, 40)}...`
    });

    sendSuccess(res, absenceRecord, 'Your explanation has been recorded and submitted to the HR committee for review.');
  }

  public static async getAllAbsenceRecords(req: Request, res: Response): Promise<void> {
    const absences = await absenceRecordsRepository.findAll(100);
    const apps = await applicationsRepository.findAll(100);
    const appMap = new Map(apps.map((a) => [a.id, a]));
    const profiles = await candidateProfilesRepository.findAll(100);
    const profileMap = new Map(profiles.map((p) => [p.id, p]));

    const result = absences.map((abs) => ({
      absence: abs,
      application: appMap.get(abs.applicationId),
      candidate: profileMap.get(abs.candidateId)
    }));

    sendSuccess(res, result, 'All absence governance records retrieved.');
  }

  public static async simulateHrAbsenceDecision(req: Request, res: Response): Promise<void> {
    const { applicationId } = req.params;
    const { decision } = req.body; // 'ratify' | 'reject'

    if (!['ratify', 'reject'].includes(decision)) {
      sendBadRequest(res, 'decision must be either "ratify" or "reject".');
      return;
    }

    const app = await applicationsRepository.findById(applicationId);
    if (!app) {
      sendNotFound(res, 'Application not found.');
      return;
    }

    const absenceList = await absenceRecordsRepository.findByField('applicationId', applicationId);
    const abs = absenceList[0];
    if (!abs) {
      sendNotFound(res, 'No absence record found for this application.');
      return;
    }

    if (decision === 'ratify') {
      abs.status = 'ratified';
      abs.reviewedAt = new Date().toISOString();
      abs.reviewedByAdminId = req.user?.uid || 'admin';
      abs.hrReviewNotes = 'Absence reason verified as genuine medical circumstance. Candidate eligibility restored for rescheduled drive.';
      await absenceRecordsRepository.update(abs.id, abs);

      app.status = 'confirmed'; // Restored eligibility
      app.stages = app.stages.map((st) => {
        if (st.step === 5) {
          return {
            ...st,
            title: 'Absence Ratified by HR',
            description: 'Eligibility restored under policy exception',
            status: 'completed' as const,
            date: 'Today'
          };
        }
        if (st.step === 4) {
          return {
            ...st,
            title: 'Rescheduling in Queue',
            description: 'Awaiting next available interview batch allocation',
            status: 'current' as const
          };
        }
        return st;
      });

      app.statusHistory.unshift({
        status: 'confirmed',
        timestamp: new Date().toISOString(),
        note: 'HR Talent Acquisition Committee ratified the absence. Candidate retains eligibility.'
      });

      await applicationsRepository.update(app.id, app);

      await notificationsRepository.create('notif_' + Date.now(), {
        id: 'notif_' + Date.now(),
        candidateId: app.candidateId,
        type: 'absence_decision',
        title: 'HR Decision: Absence Explanation Ratified',
        message: 'Your absence reason was approved by the HR committee. You will be scheduled in the next interview batch.',
        timestamp: 'Just now',
        isRead: false,
        deliveryChannel: 'in_app',
        isSimulatedExternal: false,
        actionRoute: { tab: 'applications', targetId: app.id }
      });
    } else {
      abs.status = 'blocked';
      abs.reviewedAt = new Date().toISOString();
      abs.reviewedByAdminId = req.user?.uid || 'admin';
      abs.hrReviewNotes = 'Absence justification did not satisfy recruitment policy requirements. Candidate blocked.';
      await absenceRecordsRepository.update(abs.id, abs);

      app.status = 'blocked';
      app.rejectionReason = 'Absence justification rejected by HR panel under recruitment policy.';
      app.stages = app.stages.map((st) => {
        if (st.step === 5) {
          return {
            ...st,
            title: 'Absence Justification Rejected',
            description: 'Candidate blocked under policy',
            status: 'completed' as const,
            date: 'Today'
          };
        }
        return st;
      });

      app.statusHistory.unshift({
        status: 'blocked',
        timestamp: new Date().toISOString(),
        note: 'HR Talent Acquisition Committee rejected absence explanation. Candidate set to BLOCKED.'
      });

      await applicationsRepository.update(app.id, app);

      await notificationsRepository.create('notif_' + Date.now(), {
        id: 'notif_' + Date.now(),
        candidateId: app.candidateId,
        type: 'absence_decision',
        title: 'HR Decision: Account Blocked',
        message: 'Your absence justification was rejected. In accordance with drive policy, your profile is blocked for this recruitment cycle.',
        timestamp: 'Just now',
        isRead: false,
        deliveryChannel: 'in_app',
        isSimulatedExternal: false,
        actionRoute: { tab: 'applications', targetId: app.id }
      });
    }

    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'HR_ABSENCE_DECISION',
      actorId: req.user?.uid || 'admin',
      actorRole: req.user?.role || 'admin',
      targetId: app.id,
      details: `HR decision: ${decision.toUpperCase()}`
    });

    sendSuccess(res, { app, absence: abs }, decision === 'ratify' ? 'Absence ratified! Eligibility restored.' : 'Absence rejected. Candidate blocked.');
  }
}
