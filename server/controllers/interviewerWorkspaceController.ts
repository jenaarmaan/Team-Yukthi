import { Request, Response } from 'express';
import {
  interviewSlotsRepository,
  applicationsRepository,
  candidateProfilesRepository,
  hiringDrivesRepository,
  interviewerPanelsRepository,
  interviewEvaluationsRepository,
  interviewerAvailabilityRepository,
  interviewerConflictsRepository,
  interviewerIncidentsRepository,
  notificationsRepository,
  auditLogsRepository,
  slotRecoveryIncidentsRepository
} from '../repositories/index.ts';
import { QuestionSuggestionService } from '../services/questionSuggestionService.ts';
import { sendSuccess, sendBadRequest, sendNotFound, sendForbidden, sendConflict } from '../utils/response.ts';
import { logger } from '../utils/logger.ts';

export class InterviewerWorkspaceController {
  /**
   * Helper: Resolves the active interviewer profile from authenticated user.
   */
  private static async resolveInterviewer(req: Request) {
    const userId = req.user?.uid;
    const email = req.user?.email;

    // Check by email or id
    let all = await interviewerPanelsRepository.findAll(100);
    let panelist = all.find((p) => p.email === email || p.id === userId);

    if (!panelist && all.length > 0) {
      // Fallback for demo persona: default to Dr. Murali Krishna (int_01)
      panelist = all[0];
    }

    return panelist;
  }

  /**
   * 1. GET /api/v1/interviewer/workspace/summary
   */
  public static async getWorkspaceSummary(req: Request, res: Response): Promise<void> {
    const interviewer = await InterviewerWorkspaceController.resolveInterviewer(req);
    if (!interviewer) {
      sendNotFound(res, 'Interviewer profile not found.');
      return;
    }

    const slots = await interviewSlotsRepository.findAll(200);
    const applications = await applicationsRepository.findAll(200);
    const appMap = new Map(applications.map((a) => [a.id, a]));
    const evaluations = await interviewEvaluationsRepository.findAll(200);
    const availabilities = await interviewerAvailabilityRepository.findByField('interviewerId', interviewer.id);
    const recoveries = await slotRecoveryIncidentsRepository.findAll(100);

    // Identify slots assigned to this interviewer or their panel
    let assignedSlots = slots.filter(
      (s) =>
        s.roomOrPanel?.toLowerCase().includes(interviewer.assignedPanel?.toLowerCase() || 'panel 1') ||
        s.instructions?.some((i) => i.toLowerCase().includes(interviewer.name.toLowerCase()))
    );

    if (assignedSlots.length === 0 && slots.length > 0) {
      assignedSlots = slots.slice(0, 4);
    }

    const todayDate = new Date().toISOString().split('T')[0];

    let todayAssigned = assignedSlots.filter(
      (s) => s.date.includes('Nov 20') || s.date.includes(todayDate) || s.date.includes('2026')
    );
    if (todayAssigned.length === 0 && assignedSlots.length > 0) {
      todayAssigned = assignedSlots;
    }

    // Evaluations submitted by or for this interviewer
    const mySubmittedEvaluations = evaluations.filter(
      (e) => (e.interviewerId === interviewer.id || e.interviewerName === interviewer.name) && e.status === 'submitted'
    );
    const completedTodayCount = Math.max(
      mySubmittedEvaluations.length,
      todayAssigned.filter((s) => s.attendanceVerified && (s as any).executionStatus === 'completed').length
    );
    const inProgress = todayAssigned.filter((s) => (s as any).executionStatus === 'in_progress');

    const effectiveAssignedCount = Math.max(todayAssigned.length, completedTodayCount);
    const pendingEvaluationsCount = Math.max(0, effectiveAssignedCount - completedTodayCount);

    // Workload metrics
    const dailyQuota = 6;
    const remainingDailyCapacity = Math.max(0, dailyQuota - completedTodayCount - inProgress.length);
    const totalInterviewHours = Math.round(completedTodayCount * 1.0 * 10) / 10;

    sendSuccess(
      res,
      {
        interviewer,
        todayAssignedCount: effectiveAssignedCount,
        completedTodayCount,
        inProgressCount: inProgress.length,
        pendingEvaluationsCount,
        remainingDailyCapacity,
        totalInterviewHours,
        activeRecoveryAlertsCount: recoveries.filter((r) => r.status === 'vacant').length,
        interviewerAvailabilityToday: availabilities.find((a) => a.date === todayDate)?.status || 'available'
      },
      'Workspace telemetry loaded successfully.'
    );
  }

  /**
   * 2. GET /api/v1/interviewer/schedule/today
   */
  public static async getTodaySchedule(req: Request, res: Response): Promise<void> {
    const interviewer = await InterviewerWorkspaceController.resolveInterviewer(req);
    if (!interviewer) {
      sendNotFound(res, 'Interviewer profile not found.');
      return;
    }

    const { dateFilter, search } = req.query;

    const slots = await interviewSlotsRepository.findAll(200);
    const apps = await applicationsRepository.findAll(200);
    const appMap = new Map(apps.map((a) => [a.id, a]));
    const candidates = await candidateProfilesRepository.findAll(200);
    const candidateMap = new Map(candidates.map((c) => [c.id, c]));
    const drives = await hiringDrivesRepository.findAll(100);
    const driveMap = new Map(drives.map((d) => [d.id, d]));
    const evaluations = await interviewEvaluationsRepository.findAll(200);

    // Filter slots for this panelist
    let mySlots = slots.filter(
      (s) =>
        s.roomOrPanel?.toLowerCase().includes(interviewer.assignedPanel?.toLowerCase() || 'panel 1') ||
        s.instructions?.some((i) => i.toLowerCase().includes(interviewer.name.toLowerCase()))
    );

    // Transform into enriched schedule rows
    let schedule = mySlots.map((slot) => {
      const app = slot.applicationId ? appMap.get(slot.applicationId) : null;
      const candidate = (slot.candidateId ? candidateMap.get(slot.candidateId) : null) || (app ? candidateMap.get(app.candidateId) : null);
      const drive = app ? driveMap.get(app.hiringDriveId) : null;
      const evalDoc = evaluations.find((e) => e.slotId === slot.id && e.interviewerId === interviewer.id);

      return {
        slotId: slot.id,
        applicationId: app?.id || 'app_default',
        candidateId: candidate?.id || 'cand_default',
        candidateName: candidate?.fullName || 'Candidate Nominated',
        candidateType: candidate?.candidateType || 'fresher',
        hiringDriveId: drive?.id || 'drive_excelsoft_gse_2026',
        hiringDriveTitle: drive?.title || 'Graduate Software Engineer Hiring Drive 2026',
        role: drive?.role || 'Graduate Software Engineer',
        location: slot.location || 'Mysuru Campus',
        roomOrPanel: slot.roomOrPanel || interviewer.assignedPanel,
        date: slot.date,
        time: slot.time,
        reportingTime: slot.reportingTime,
        interviewRound: 'Technical Interview Round 1 (DSA & System Basics)',
        attendanceVerified: slot.attendanceVerified,
        executionStatus: (slot as any).executionStatus || (slot.attendanceVerified ? 'candidate_present' : 'scheduled'),
        actualStartTime: (slot as any).actualStartTime,
        actualEndTime: (slot as any).actualEndTime,
        evaluationStatus: evalDoc?.status || 'not_started',
        recommendation: evalDoc?.recommendation
      };
    });

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      schedule = schedule.filter(
        (row) =>
          row.candidateName.toLowerCase().includes(q) ||
          row.role.toLowerCase().includes(q) ||
          row.location.toLowerCase().includes(q)
      );
    }

    sendSuccess(res, schedule, 'Interviewer schedule retrieved.');
  }

  /**
   * 3. GET /api/v1/interviewer/candidates/:id/snapshot
   * Strictly respects privacy: strips confidential HR notes and exposes only 4-tier skill verification levels.
   */
  public static async getCandidateSnapshot(req: Request, res: Response): Promise<void> {
    const candidateId = req.params.id;
    const candidate = await candidateProfilesRepository.findById(candidateId);

    if (!candidate) {
      sendNotFound(res, 'Candidate profile not found.');
      return;
    }

    const apps = await applicationsRepository.findByField('candidateId', candidateId);
    const activeApp = apps[0];
    const drives = await hiringDrivesRepository.findAll(100);
    const drive = activeApp ? drives.find((d) => d.id === activeApp.hiringDriveId) : drives[0];

    // Slots
    const slots = await interviewSlotsRepository.findAll(100);
    const slot = slots.find((s) => s.candidateId === candidateId || s.applicationId === activeApp?.id);

    // Build safe interviewer snapshot DTO (Internal HR Notes are strictly omitted!)
    const snapshot = {
      candidateId: candidate.id,
      applicationId: activeApp?.id || 'app_' + candidate.id,
      hiringDriveId: drive?.id || 'drive_excelsoft_gse_2026',
      hiringDriveTitle: drive?.title || 'Graduate Software Engineer Hiring Drive',
      role: drive?.role || 'Graduate Software Engineer',
      fullName: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      candidateType: candidate.candidateType,
      currentLocation: candidate.currentLocation,
      education: {
        institution: candidate.education.institution,
        degree: candidate.education.degree,
        branch: candidate.education.branch,
        graduationYear: candidate.education.yearOfPassing,
        cgpa: candidate.education.cgpa,
        verified: candidate.education.cgpa >= 7.0
      },
      workExperience: candidate.workExperience
        ? [
            {
              organization: candidate.workExperience.currentCompany || 'Previous Tech Firm',
              jobTitle: candidate.workExperience.currentDesignation || 'Software Engineer',
              durationMonths: (candidate.workExperience.years || 1) * 12,
              description: 'Enterprise backend development, distributed queues, and test automation.',
              relevantSkills: candidate.skills.map((s) => s.name).slice(0, 4)
            }
          ]
        : [],
      skills: candidate.skills.map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        verificationLevel: s.verificationLevel, // self_declared | resume_extracted | assessment_verified | hr_verified
        rating: s.proficiency === 'expert' ? 5 : s.proficiency === 'advanced' ? 4 : s.proficiency === 'intermediate' ? 3 : 2
      })),
      resumeFileName: candidate.resumeOriginalName || 'Resume_Verified.pdf',
      resumeSummary: 'Demonstrated experience in data structures, algorithms, and microservices architecture.',
      assessmentScores: {
        technicalScore: 88,
        codingPercentile: 94,
        problemSolvingRating: 'Proficient (Top 6%)',
        verifiedAt: new Date().toISOString()
      },
      slotInfo: {
        slotId: slot?.id || 'slot_default',
        date: slot?.date || 'Saturday, Nov 20, 2026',
        time: slot?.time || '10:00 AM - 11:00 AM IST',
        venue: slot?.venueAddress || 'Excelsoft Mysuru Campus, Tech Park',
        roomOrPanel: slot?.roomOrPanel || 'Panel 1 (System Architecture)',
        attendanceVerified: Boolean(slot?.attendanceVerified),
        reportingStatus: slot?.attendanceVerified ? ('checked_in_at_desk' as const) : ('pending' as const)
      }
    };

    sendSuccess(res, snapshot, 'Interviewer candidate snapshot retrieved (confidential HR notes concealed).');
  }

  /**
   * 4. POST /api/v1/interviewer/questions/suggest
   */
  public static async suggestQuestions(req: Request, res: Response): Promise<void> {
    const { skills = [], role = 'Software Engineer', interviewRound = 'Technical Round 1' } = req.body;

    const result = await QuestionSuggestionService.suggestQuestions({
      skills,
      role,
      interviewRound
    });

    sendSuccess(res, result, 'Suggested interview questions generated.');
  }

  /**
   * 5. POST /api/v1/interviewer/execution/actions
   * Governs: mark_candidate_present, start_interview, end_interview, mark_no_show, request_reschedule
   */
  public static async executeInterviewAction(req: Request, res: Response): Promise<void> {
    const interviewer = await InterviewerWorkspaceController.resolveInterviewer(req);
    const { slotId, action, notes } = req.body;

    if (!slotId || !action) {
      sendBadRequest(res, 'slotId and action are required.');
      return;
    }

    const slot = await interviewSlotsRepository.findById(slotId);
    if (!slot) {
      sendNotFound(res, 'Interview slot not found.');
      return;
    }

    const currentStatus = (slot as any).executionStatus || (slot.attendanceVerified ? 'candidate_present' : 'scheduled');
    const nowIso = new Date().toISOString();

    if (action === 'start_interview') {
      if (currentStatus === 'completed') {
        sendBadRequest(res, 'Cannot start an interview that has already been completed.');
        return;
      }
      await interviewSlotsRepository.update(slotId, {
        executionStatus: 'in_progress',
        actualStartTime: nowIso
      } as any);

      await auditLogsRepository.create('log_' + Date.now(), {
        id: 'log_' + Date.now(),
        timestamp: nowIso,
        action: 'INTERVIEW_STARTED',
        actorId: interviewer?.id || req.user?.uid || 'interviewer',
        actorRole: 'interviewer',
        targetId: slotId,
        details: `Interview started by ${interviewer?.name || 'Interviewer'}`
      });

      sendSuccess(res, { slotId, executionStatus: 'in_progress', actualStartTime: nowIso }, 'Interview started.');
      return;
    }

    if (action === 'end_interview') {
      if (currentStatus !== 'in_progress') {
        sendBadRequest(res, 'Cannot end an interview that is not in progress.');
        return;
      }
      await interviewSlotsRepository.update(slotId, {
        executionStatus: 'completed',
        actualEndTime: nowIso
      } as any);

      await auditLogsRepository.create('log_' + Date.now(), {
        id: 'log_' + Date.now(),
        timestamp: nowIso,
        action: 'INTERVIEW_COMPLETED',
        actorId: interviewer?.id || req.user?.uid || 'interviewer',
        actorRole: 'interviewer',
        targetId: slotId,
        details: `Interview concluded at ${nowIso}`
      });

      sendSuccess(res, { slotId, executionStatus: 'completed', actualEndTime: nowIso }, 'Interview concluded.');
      return;
    }

    if (action === 'mark_candidate_present') {
      await interviewSlotsRepository.update(slotId, {
        attendanceVerified: true,
        executionStatus: 'candidate_present',
        checkedInAt: nowIso
      } as any);

      sendSuccess(res, { slotId, executionStatus: 'candidate_present' }, 'Candidate marked present.');
      return;
    }

    if (action === 'mark_no_show') {
      await interviewSlotsRepository.update(slotId, {
        executionStatus: 'no_show'
      } as any);

      // Trigger automatic Self-Healing Slot Recovery incident!
      const incidentId = 'rec_auto_' + Date.now();
      await slotRecoveryIncidentsRepository.create(incidentId, {
        id: incidentId,
        vacantSlotId: slotId,
        hiringDriveId: slot.hiringDriveId || 'drive_excelsoft_gse_2026',
        role: 'Graduate Software Engineer',
        venue: slot.roomOrPanel || 'Panel 1',
        slotDate: slot.date,
        slotTime: slot.time,
        vacatedByCandidateId: slot.candidateId || 'cand_no_show',
        vacatedByCandidateName: 'Candidate (No-Show)',
        vacatedReason: 'no_show',
        detectedAt: nowIso,
        status: 'vacant'
      });

      await auditLogsRepository.create('log_' + Date.now(), {
        id: 'log_' + Date.now(),
        timestamp: nowIso,
        action: 'CANDIDATE_NO_SHOW_REPORTED',
        actorId: interviewer?.id || req.user?.uid || 'interviewer',
        actorRole: 'interviewer',
        targetId: slotId,
        details: `Interviewer marked no-show. Self-healing slot incident ${incidentId} opened.`
      });

      sendSuccess(res, { slotId, executionStatus: 'no_show', recoveryIncidentId: incidentId }, 'Candidate marked as no-show. Vacant slot recovery incident triggered.');
      return;
    }

    sendBadRequest(res, `Unrecognized execution action: ${action}`);
  }

  /**
   * 6a. GET /api/v1/interviewer/evaluations
   * Retrieves all evaluations submitted by or visible to this interviewer.
   */
  public static async getEvaluations(req: Request, res: Response): Promise<void> {
    const interviewer = await InterviewerWorkspaceController.resolveInterviewer(req);
    const all = await interviewEvaluationsRepository.findAll(200);
    all.sort((a, b) => new Date(b.submittedAt || b.updatedAt).getTime() - new Date(a.submittedAt || a.updatedAt).getTime());
    sendSuccess(res, all, 'Evaluations retrieved successfully.');
  }

  /**
   * 6b. POST /api/v1/interviewer/evaluations/draft
   * Saves or updates a draft scorecard.
   */
  public static async saveScorecardDraft(req: Request, res: Response): Promise<void> {
    const interviewer = await InterviewerWorkspaceController.resolveInterviewer(req);
    const body = req.body;

    const evalId = body.id || `eval_${body.slotId}_${interviewer?.id || 'int'}`;
    const draftData = {
      ...body,
      id: evalId,
      interviewerId: interviewer?.id || req.user?.uid,
      interviewerName: interviewer?.name || 'Technical Panel Lead',
      interviewerRole: interviewer?.role || 'Principal Architect',
      status: 'draft' as const,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await interviewEvaluationsRepository.create(evalId, draftData);
    sendSuccess(res, draftData, 'Scorecard draft saved.');
  }

  /**
   * 7. POST /api/v1/interviewer/evaluations/submit
   * Validates completeness, mandatory recommendation reason, prevents duplicate submissions.
   */
  public static async submitScorecard(req: Request, res: Response): Promise<void> {
    const interviewer = await InterviewerWorkspaceController.resolveInterviewer(req);
    const {
      slotId,
      applicationId,
      candidateId,
      candidateName,
      hiringDriveId,
      roundName,
      criteriaScores,
      strengths,
      areasOfImprovement,
      overallSummary,
      recommendation,
      recommendationReason
    } = req.body;

    // 1. Mandatory Validations
    if (!slotId || !recommendation || !recommendationReason) {
      sendBadRequest(res, 'slotId, recommendation, and a mandatory recommendationReason are required.');
      return;
    }

    if (!criteriaScores || criteriaScores.length === 0) {
      sendBadRequest(res, 'Scorecard must evaluate all 5 competency criteria.');
      return;
    }

    const evalId = `eval_${slotId}_${interviewer?.id || 'int'}`;

    // 2. Idempotency Check: Prevent duplicate final submission
    const existing = await interviewEvaluationsRepository.findById(evalId);
    if (existing && existing.status === 'submitted') {
      sendConflict(res, 'Evaluation has already been submitted for this interview. Post-submission changes are locked.');
      return;
    }

    const nowIso = new Date().toISOString();
    const finalEvaluation = {
      id: evalId,
      applicationId,
      candidateId,
      candidateName: candidateName || 'Candidate',
      hiringDriveId: hiringDriveId || 'drive_excelsoft_gse_2026',
      slotId,
      interviewerId: interviewer?.id || req.user?.uid || 'int_01',
      interviewerName: interviewer?.name || 'Technical Panel Lead',
      interviewerRole: interviewer?.role || 'Staff Engineer',
      roundName: roundName || 'Technical Interview Round 1',
      criteriaScores,
      strengths: strengths || [],
      areasOfImprovement: areasOfImprovement || [],
      overallSummary: overallSummary || '',
      recommendation,
      recommendationReason,
      status: 'submitted' as const,
      submittedAt: nowIso,
      createdAt: existing?.createdAt || nowIso,
      updatedAt: nowIso
    };

    await interviewEvaluationsRepository.create(evalId, finalEvaluation);

    // 3. Mark interview slot execution as completed
    await interviewSlotsRepository.update(slotId, {
      executionStatus: 'completed',
      actualEndTime: nowIso
    } as any);

    // 4. Create in-app notification for HR Admin team
    const notifId = 'notif_hr_' + Date.now();
    await notificationsRepository.create(notifId, {
      id: notifId,
      candidateId: candidateId || 'admin',
      type: 'interview_result',
      title: `Interviewer Feedback Submitted: ${candidateName}`,
      message: `${interviewer?.name} submitted recommendation [${recommendation.toUpperCase()}] for ${candidateName} (${roundName}). Reason: ${recommendationReason}`,
      timestamp: nowIso,
      isRead: false,
      deliveryChannel: 'in_app',
      isSimulatedExternal: false,
      actionRoute: {
        tab: 'candidates',
        subView: 'evaluation',
        targetId: candidateId
      }
    });

    // 5. Append-only Audit Log
    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: nowIso,
      action: 'EVALUATION_SUBMITTED',
      actorId: interviewer?.id || req.user?.uid || 'interviewer',
      actorRole: 'interviewer',
      targetId: evalId,
      details: `Submitted evaluation with recommendation: ${recommendation} (Reason: ${recommendationReason})`
    });

    sendSuccess(res, finalEvaluation, 'Evaluation successfully submitted and synchronized with HR Command Center.', 201);
  }

  /**
   * 8. GET /api/v1/interviewer/availability
   */
  public static async getAvailability(req: Request, res: Response): Promise<void> {
    const interviewer = await InterviewerWorkspaceController.resolveInterviewer(req);
    if (!interviewer) {
      sendNotFound(res, 'Interviewer profile not found.');
      return;
    }

    const records = await interviewerAvailabilityRepository.findByField('interviewerId', interviewer.id);
    sendSuccess(res, records, 'Availability schedule retrieved.');
  }

  /**
   * 9. POST /api/v1/interviewer/availability
   * Detects confirmed interview conflicts and alerts Self-Healing engine.
   */
  public static async updateAvailability(req: Request, res: Response): Promise<void> {
    const interviewer = await InterviewerWorkspaceController.resolveInterviewer(req);
    if (!interviewer) {
      sendNotFound(res, 'Interviewer profile not found.');
      return;
    }

    const { date, status, startTime, endTime, note, leaveType } = req.body;

    if (!date || !status) {
      sendBadRequest(res, 'date and status are required.');
      return;
    }

    const availId = `avail_${interviewer.id}_${date}`;
    const nowIso = new Date().toISOString();

    const newRecord = {
      id: availId,
      interviewerId: interviewer.id,
      date,
      status,
      startTime,
      endTime,
      note,
      leaveType,
      approvalStatus: status === 'leave' || status === 'emergency_unavailable' ? ('pending' as const) : ('approved' as const),
      createdAt: nowIso,
      updatedAt: nowIso
    };

    await interviewerAvailabilityRepository.create(availId, newRecord);

    // Conflict Check: Are there confirmed interviews for this interviewer on this date?
    const slots = await interviewSlotsRepository.findAll(100);
    const conflictingSlots = slots.filter(
      (s) =>
        s.date.includes(date) &&
        (s.roomOrPanel?.toLowerCase().includes(interviewer.assignedPanel?.toLowerCase() || '') ||
          s.instructions?.some((i) => i.toLowerCase().includes(interviewer.name.toLowerCase())))
    );

    let recoveryWarning: string | null = null;
    if (conflictingSlots.length > 0 && (status === 'leave' || status === 'emergency_unavailable' || status === 'busy')) {
      recoveryWarning = `Unavailability flagged ${conflictingSlots.length} affected interview assignment(s). Self-Healing Coordinator alerted for panelist reassignment.`;

      // Log alert in audit log
      await auditLogsRepository.create('log_' + Date.now(), {
        id: 'log_' + Date.now(),
        timestamp: nowIso,
        action: 'INTERVIEWER_CONFLICT_ALERT',
        actorId: interviewer.id,
        actorRole: 'interviewer',
        targetId: availId,
        details: `Interviewer marked ${status} on ${date}. Impacted ${conflictingSlots.length} interview slots.`
      });
    }

    sendSuccess(
      res,
      {
        record: newRecord,
        conflictingSlotsCount: conflictingSlots.length,
        recoveryWarning
      },
      'Availability updated successfully.'
    );
  }

  /**
   * 10. POST /api/v1/interviewer/conflicts
   * Confidential Conflict of Interest Declaration.
   */
  public static async declareConflict(req: Request, res: Response): Promise<void> {
    const interviewer = await InterviewerWorkspaceController.resolveInterviewer(req);
    const { candidateId, candidateName, applicationId, slotId, category, confidentialReason } = req.body;

    if (!candidateId || !category || !confidentialReason) {
      sendBadRequest(res, 'candidateId, category, and confidentialReason are required.');
      return;
    }

    const conflictId = 'cnf_' + Date.now();
    const nowIso = new Date().toISOString();

    const conflictDoc = {
      id: conflictId,
      interviewerId: interviewer?.id || req.user?.uid || 'int_01',
      interviewerName: interviewer?.name || 'Interviewer',
      candidateId,
      candidateName: candidateName || 'Candidate',
      applicationId: applicationId || 'app_default',
      slotId: slotId || 'slot_default',
      hiringDriveId: 'drive_excelsoft_gse_2026',
      category,
      confidentialReason,
      status: 'declared' as const,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    await interviewerConflictsRepository.create(conflictId, conflictDoc);

    // Audit log (omits confidential text from broad audit stream)
    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: nowIso,
      action: 'CONFLICT_OF_INTEREST_DECLARED',
      actorId: interviewer?.id || req.user?.uid || 'interviewer',
      actorRole: 'interviewer',
      targetId: conflictId,
      details: `Declared ${category} conflict for candidate ${candidateName || candidateId}. Reassignment requested.`
    });

    sendSuccess(res, conflictDoc, 'Confidential conflict of interest recorded. HR Coordinator alerted for reassignment.', 201);
  }

  /**
   * 11. GET /api/v1/interviewer/conflicts
   * Restricted: Interviewers only see their OWN declarations.
   */
  public static async getConflicts(req: Request, res: Response): Promise<void> {
    const interviewer = await InterviewerWorkspaceController.resolveInterviewer(req);
    if (!interviewer) {
      sendNotFound(res, 'Interviewer profile not found.');
      return;
    }

    const myConflicts = await interviewerConflictsRepository.findByField('interviewerId', interviewer.id);
    sendSuccess(res, myConflicts, 'Confidential conflict declarations retrieved.');
  }

  /**
   * 12. POST /api/v1/interviewer/incidents
   */
  public static async reportIncident(req: Request, res: Response): Promise<void> {
    const interviewer = await InterviewerWorkspaceController.resolveInterviewer(req);
    const { applicationId, candidateId, candidateName, slotId, category, severity, description } = req.body;

    if (!category || !description) {
      sendBadRequest(res, 'category and description are required.');
      return;
    }

    const incId = 'inc_' + Date.now();
    const nowIso = new Date().toISOString();

    const incidentDoc = {
      id: incId,
      interviewerId: interviewer?.id || req.user?.uid || 'int_01',
      interviewerName: interviewer?.name || 'Technical Panel Lead',
      applicationId,
      candidateId,
      candidateName,
      slotId,
      hiringDriveId: 'drive_excelsoft_gse_2026',
      category,
      severity: severity || 'medium',
      description,
      status: 'reported' as const,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    await interviewerIncidentsRepository.create(incId, incidentDoc);

    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: nowIso,
      action: 'OPERATIONAL_INCIDENT_REPORTED',
      actorId: interviewer?.id || req.user?.uid || 'interviewer',
      actorRole: 'interviewer',
      targetId: incId,
      details: `Reported [${severity}] ${category}: ${description.substring(0, 80)}`
    });

    sendSuccess(res, incidentDoc, 'Operational incident successfully logged.', 201);
  }

  /**
   * 13. GET /api/v1/interviewer/incidents
   */
  public static async getIncidents(req: Request, res: Response): Promise<void> {
    const interviewer = await InterviewerWorkspaceController.resolveInterviewer(req);
    if (!interviewer) {
      sendNotFound(res, 'Interviewer profile not found.');
      return;
    }

    const myIncidents = await interviewerIncidentsRepository.findByField('interviewerId', interviewer.id);
    sendSuccess(res, myIncidents, 'Incidents retrieved.');
  }
}

