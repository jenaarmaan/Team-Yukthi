import { Request, Response } from 'express';
import {
  applicationsRepository,
  hiringDrivesRepository,
  candidateProfilesRepository,
  interviewSlotsRepository,
  waitlistsRepository,
  notificationsRepository,
  auditLogsRepository
} from '../repositories/index.ts';
import { ConcurrencyLockManager } from '../services/matchingService.ts';
import { DistributedTransactionService } from '../services/distributedTransactionService.ts';
import { RecruitmentStateMachine } from '../services/stateMachine.ts';
import { sendSuccess, sendBadRequest, sendNotFound, sendConflict } from '../utils/response.ts';
import { ApplicationStatus } from '../repositories/types.ts';

export class ApplicationsController {
  public static async applyForDrive(req: Request, res: Response): Promise<void> {
    const candidateId = req.user?.uid;
    const { hiringDriveId, preferredLocation } = req.body;

    if (!candidateId || !hiringDriveId) {
      sendBadRequest(res, 'hiringDriveId is required.');
      return;
    }

    const drive = await hiringDrivesRepository.findById(hiringDriveId);
    if (!drive) {
      sendNotFound(res, 'Hiring drive not found.');
      return;
    }

    const profile = await candidateProfilesRepository.findById(candidateId);
    if (!profile) {
      sendNotFound(res, 'Candidate profile not found. Please complete profile registration first.');
      return;
    }

    // 1. Policy Block Check: If candidate has a blocked application, reject re-application unless super_admin
    const existingApps = await applicationsRepository.findByField('candidateId', candidateId);
    const blockedApp = existingApps.find((a) => a.status === 'blocked');
    if (blockedApp && req.user?.role !== 'super_admin') {
      res.status(403).json({
        success: false,
        error: {
          code: 'BLOCKED_STATE_VIOLATION',
          message: 'Application is BLOCKED by enterprise recruitment policy. Only Super Admin can override.'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    // 2. Prevent Duplicate Application via Database-Backed Idempotency Key
    const idempotencyCheck = await DistributedTransactionService.registerApplicationTransaction({
      candidateId,
      hiringDriveId
    });
    if (!idempotencyCheck.success) {
      sendConflict(res, idempotencyCheck.message);
      return;
    }

    const alreadyApplied = existingApps.find((a) => a.hiringDriveId === hiringDriveId);
    if (alreadyApplied) {
      sendConflict(res, 'You have already submitted an application for this hiring drive.');
      return;
    }

    // 2. Eligibility Evaluation
    const actualCgpa = profile.education?.cgpa || 0;
    const cgpaPassed = actualCgpa >= drive.minimumCgpa;
    const actualDegree = profile.education?.degree || '';
    const degreePassed = drive.requiredDegree.some(
      (d) =>
        actualDegree.toLowerCase().includes(d.toLowerCase()) ||
        d.toLowerCase().includes(actualDegree.toLowerCase())
    );
    const eligibleTypes = Array.isArray(drive.candidateType) ? drive.candidateType : [drive.candidateType];
    const typePassed = eligibleTypes.includes(profile.candidateType as any) || eligibleTypes.length === 0;

    if (!cgpaPassed || !degreePassed || !typePassed) {
      sendBadRequest(res, 'Candidate does not meet basic eligibility prerequisites for this hiring drive.');
      return;
    }

    // 3. Dynamic Capacity Check: If full -> Waitlist FIFO queue, else Confirmed Slot
    const isCapacityFull = drive.currentRegistrations >= drive.interviewCapacity;
    const appId = 'app_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const slotId = isCapacityFull ? undefined : 'slot_auto_' + Date.now();
    const locationName = preferredLocation || drive.locations[0] || 'Mysuru';

    let interviewSlotData = undefined;
    let waitlistData = undefined;

    if (!isCapacityFull && slotId) {
      interviewSlotData = {
        id: slotId,
        hiringDriveId: drive.id,
        applicationId: appId,
        candidateId,
        date: 'Saturday, Nov 21, 2026',
        time: '11:00 AM - 12:00 PM IST',
        reportingTime: '10:30 AM IST',
        location: `${locationName} Tech Center`,
        roomOrPanel: 'Panel 1 - Main Assessment Hall',
        venueAddress: `Excelsoft Technologies, ${locationName} Campus`,
        instructions: [
          'Bring government photo ID and resume copies.',
          'Present the NIYOJAN In-App QR Pass at the reception desk for check-in.',
          'Arrive strictly 30 minutes before your reporting time.'
        ],
        isLocked: false,
        isCheckInOpen: true,
        attendanceVerified: false,
        qrTokenHash: `NIYOJAN_ATTEND_${candidateId}_${Date.now()}`,
        otpCode: Math.floor(100000 + Math.random() * 900000).toString(),
        createdAt: new Date().toISOString()
      };
      await interviewSlotsRepository.create(slotId, interviewSlotData);
    } else {
      const allWaitlisted = await waitlistsRepository.findByField('hiringDriveId', drive.id);
      const position = allWaitlisted.length + 1;
      waitlistData = {
        id: 'wl_' + Date.now(),
        hiringDriveId: drive.id,
        applicationId: appId,
        candidateId,
        position,
        totalInQueue: allWaitlisted.length + 1,
        status: 'active' as const,
        potentialBatchDate: 'Saturday, Nov 28, 2026',
        createdAt: new Date().toISOString()
      };
      await waitlistsRepository.create(waitlistData.id, waitlistData);
    }

    const newApp = {
      id: appId,
      candidateId,
      hiringDriveId: drive.id,
      hiringDriveTitle: drive.title,
      role: drive.role,
      company: drive.company,
      appliedLocation: locationName,
      appliedDate: new Date().toISOString(),
      status: (isCapacityFull ? 'waitlisted' : 'confirmed') as ApplicationStatus,
      stages: [
        { step: 1, title: 'Registration', description: 'Application received and registered', status: 'completed' as const, date: 'Just now' },
        { step: 2, title: 'Profile Verification', description: 'Degree & CGPA evaluated', status: 'completed' as const, date: 'Just now' },
        { step: 3, title: 'Eligibility Check', description: 'Meets prerequisite qualifications', status: 'completed' as const, date: 'Just now' },
        {
          step: 4,
          title: isCapacityFull ? 'Waitlist Queue' : 'Interview Allocation',
          description: isCapacityFull ? 'Capacity full; queued on waitlist' : 'Assigned scheduled interview slot',
          status: 'current' as const,
          date: 'Just now'
        },
        { step: 5, title: 'Interview Attendance', description: 'QR / Biometric check-in at venue', status: 'pending' as const },
        { step: 6, title: 'Interview Result', description: 'Final selection decision', status: 'pending' as const }
      ],
      statusHistory: [
        { status: 'submitted', timestamp: new Date().toISOString(), note: 'Applied for hiring drive' },
        {
          status: isCapacityFull ? 'waitlisted' : 'confirmed',
          timestamp: new Date().toISOString(),
          note: isCapacityFull ? `Assigned to dynamic waitlist position #${waitlistData?.position}` : 'Interview slot automatically allocated'
        }
      ],
      interviewSlotId: slotId,
      interviewSlot: interviewSlotData,
      waitlistInfo: waitlistData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await applicationsRepository.create(appId, newApp);

    // Update drive registration count
    await hiringDrivesRepository.update(drive.id, {
      currentRegistrations: drive.currentRegistrations + 1
    });

    // Send notification
    await notificationsRepository.create('notif_' + Date.now(), {
      id: 'notif_' + Date.now(),
      candidateId,
      type: isCapacityFull ? 'waitlist_update' : 'interview_allocated',
      title: isCapacityFull ? `Application Registered: Waitlist Position #${waitlistData?.position}` : 'Interview Confirmed: ' + drive.role,
      message: isCapacityFull
        ? `You have been added to the dynamic waitlist for ${drive.title}. We will alert you upon slot movement.`
        : `Your interview slot for ${drive.title} in ${locationName} has been allocated. Access your QR pass.`,
      timestamp: 'Just now',
      isRead: false,
      deliveryChannel: 'in_app',
      isSimulatedExternal: false,
      actionRoute: { tab: 'applications', targetId: appId }
    });

    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'REGISTER_DRIVE',
      actorId: candidateId,
      actorRole: 'candidate',
      targetId: drive.id,
      details: `Candidate registered for ${drive.title} (${newApp.status})`
    });

    sendSuccess(res, newApp, isCapacityFull ? 'Application queued onto dynamic waitlist.' : 'Interview slot successfully confirmed!', 201);
  }

  public static async getMyApplications(req: Request, res: Response): Promise<void> {
    const candidateId = req.user?.uid;
    const apps = await applicationsRepository.findByField('candidateId', candidateId!);
    sendSuccess(res, apps, 'Candidate applications retrieved.');
  }

  public static async getApplicationById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const app = await applicationsRepository.findById(id);
    if (!app) {
      sendNotFound(res, 'Application not found.');
      return;
    }

    // Candidate ownership check
    if (req.user?.role === 'candidate' && app.candidateId !== req.user.uid) {
      res.status(403).json({
        success: false,
        error: { code: 'auth/forbidden', message: 'Access denied to application.' },
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Attach interviewSlot or waitlistInfo if present
    if (app.interviewSlotId) {
      const slot = await interviewSlotsRepository.findById(app.interviewSlotId);
      if (slot) app.interviewSlot = slot;
    }
    const waitlists = await waitlistsRepository.findByField('applicationId', app.id);
    if (waitlists.length > 0) {
      app.waitlistInfo = waitlists[0];
    }

    sendSuccess(res, app, 'Application retrieved successfully.');
  }

  public static async getAllApplications(req: Request, res: Response): Promise<void> {
    const apps = await applicationsRepository.findAll(200);
    const profiles = await candidateProfilesRepository.findAll(200);
    const profileMap = new Map(profiles.map((p) => [p.id, p]));

    const enriched = apps.map((app) => ({
      ...app,
      candidateProfile: profileMap.get(app.candidateId)
    }));

    const limit = parseInt(req.query.limit as string) || 200;
    const offset = parseInt(req.query.offset as string) || 0;
    const total = enriched.length;
    const paginated = enriched.slice(offset, offset + limit);

    res.setHeader('X-Total-Count', total.toString());
    res.setHeader('X-Limit', limit.toString());
    res.setHeader('X-Offset', offset.toString());

    if (req.query.limit !== undefined || req.query.offset !== undefined || req.query.paginated === 'true') {
      sendSuccess(res, { items: paginated, total, limit, offset }, 'All applications retrieved for HR.');
    } else {
      sendSuccess(res, enriched, 'All applications retrieved for HR.');
    }
  }

  public static async getAllWaitlistApplications(req: Request, res: Response): Promise<void> {
    const waitlists = await waitlistsRepository.findAll(200);
    const apps = await applicationsRepository.findAll(200);
    const appMap = new Map(apps.map((a) => [a.id, a]));
    const profiles = await candidateProfilesRepository.findAll(200);
    const profileMap = new Map(profiles.map((p) => [p.id, p]));

    const result = waitlists
      .filter((w) => w.status === 'active')
      .map((w) => {
        const app = appMap.get(w.applicationId);
        const cand = profileMap.get(w.candidateId);
        return {
          waitlist: w,
          app,
          candidate: cand
        };
      })
      .sort((a, b) => a.waitlist.position - b.waitlist.position);

    sendSuccess(res, result, 'Active waitlist queue retrieved in FIFO rank order.');
  }

  public static async promoteWaitlistCandidate(req: Request, res: Response): Promise<void> {
    const { id } = req.params; // applicationId
    const { slotDate, slotTime, venue } = req.body;

    const app = await applicationsRepository.findById(id);
    if (!app) {
      sendNotFound(res, 'Application not found.');
      return;
    }

    // 1. State Machine Transition Verification: Must be in waitlisted status
    if (app.status !== 'waitlisted') {
      res.status(409).json({
        success: false,
        error: {
          code: 'INELIGIBLE_STATE',
          message: `Cannot promote application in status "${app.status}". Only candidates in "waitlisted" status can be promoted.`
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    const stateCheck = RecruitmentStateMachine.validateApplicationTransition(app.status, 'confirmed', req.user?.role);
    if (!stateCheck.isValid) {
      res.status(409).json({
        success: false,
        error: {
          code: stateCheck.errorCode || 'INVALID_STATE_TRANSITION',
          message: stateCheck.errorMessage || 'Invalid application state transition.'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    // 2. Candidate Eligibility Verification: Ineligible candidates cannot be promoted
    const drive = await hiringDrivesRepository.findById(app.hiringDriveId);
    const profile = await candidateProfilesRepository.findById(app.candidateId);
    if (drive && profile) {
      const actualCgpa = profile.education?.cgpa || 0;
      if (actualCgpa < drive.minimumCgpa) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INELIGIBLE_PROMOTION',
            message: `Candidate CGPA (${actualCgpa.toFixed(2)}) does not meet drive minimum prerequisite (${drive.minimumCgpa.toFixed(2)}). Promotion rejected.`
          },
          timestamp: new Date().toISOString()
        });
        return;
      }
    }

    // 3. Distributed Database-Backed Concurrency Lock Check for venue & panel
    const slotId = 'slot_promoted_' + Date.now();
    const effectiveVenue = venue || 'Excelsoft Technologies Pvt. Ltd., Campus Center';
    const effectiveDate = slotDate || 'Saturday, Nov 28, 2026';
    const effectiveTime = slotTime || '10:00 AM - 11:00 AM IST';
    const panelKey = `${effectiveVenue}_${effectiveDate}_${effectiveTime}`;

    const lockResult = await DistributedTransactionService.allocatePanelTransaction({
      panelKey,
      candidateId: app.candidateId,
      slotId,
      venue: effectiveVenue,
      date: effectiveDate,
      time: effectiveTime
    });

    if (!lockResult.success) {
      sendConflict(res, lockResult.message);
      return;
    }

    const waitlistEntries = await waitlistsRepository.findByField('applicationId', id);
    const wl = waitlistEntries[0];
    if (wl) {
      await waitlistsRepository.update(wl.id, {
        status: 'promoted_to_confirmed',
        promotedAt: new Date().toISOString()
      });
    }

    const confirmedSlot = {
      id: slotId,
      hiringDriveId: app.hiringDriveId,
      applicationId: app.id,
      candidateId: app.candidateId,
      date: slotDate || 'Saturday, Nov 28, 2026',
      time: slotTime || '10:00 AM - 11:00 AM IST',
      reportingTime: '30 mins prior to interview time',
      location: (venue || 'Mysuru Campus').split(',')[0],
      roomOrPanel: 'Panel 1 - Assessment Room A',
      venueAddress: venue || 'Excelsoft Technologies Pvt. Ltd., Campus Center',
      instructions: [
        'Promoted from Dynamic Waitlist into Confirmed Slot.',
        'Report strictly with photo ID and resume copies.',
        'Present your NIYOJAN In-App QR Pass at check-in.'
      ],
      isLocked: false,
      isCheckInOpen: true,
      attendanceVerified: false,
      qrTokenHash: `NIYOJAN_ATTEND_${app.candidateId}_${Date.now()}`,
      otpCode: Math.floor(100000 + Math.random() * 900000).toString(),
      createdAt: new Date().toISOString()
    };
    await interviewSlotsRepository.create(slotId, confirmedSlot);

    app.status = 'confirmed';
    app.interviewSlotId = slotId;
    app.stages = app.stages.map((st) => {
      if (st.step === 4) {
        return {
          ...st,
          title: 'Promoted from Waitlist: Slot Confirmed',
          description: `Assigned confirmed slot for ${confirmedSlot.date} at ${confirmedSlot.time}`,
          status: 'completed' as const,
          date: 'Today'
        };
      }
      if (st.step === 5) {
        return { ...st, status: 'current' as const };
      }
      return st;
    });

    app.statusHistory.unshift({
      status: 'confirmed',
      timestamp: new Date().toISOString(),
      note: `HR promoted candidate from Waitlist Position #${wl?.position || 1} into confirmed slot on ${confirmedSlot.date}`
    });

    await applicationsRepository.update(app.id, app);

    await notificationsRepository.create('notif_' + Date.now(), {
      id: 'notif_' + Date.now(),
      candidateId: app.candidateId,
      type: 'interview_allocated',
      title: 'Waitlist Promotion: Slot Confirmed!',
      message: `Congratulations! You have been promoted from the waitlist into a confirmed slot for ${app.role} on ${confirmedSlot.date} at ${confirmedSlot.time}.`,
      timestamp: 'Just now',
      isRead: false,
      deliveryChannel: 'in_app',
      isSimulatedExternal: false,
      actionRoute: { tab: 'applications', targetId: app.id }
    });

    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'PROMOTE_WAITLIST',
      actorId: req.user?.uid || 'admin',
      actorRole: req.user?.role || 'admin',
      targetId: app.candidateId,
      details: `Candidate promoted from waitlist to confirmed slot ${slotId}`
    });

    sendSuccess(res, { app, slot: confirmedSlot }, 'Candidate promoted from waitlist to confirmed slot successfully.');
  }
}
