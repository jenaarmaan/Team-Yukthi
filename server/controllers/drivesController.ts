import { Request, Response } from 'express';
import {
  hiringDrivesRepository,
  candidateProfilesRepository,
  auditLogsRepository,
  interviewSlotsRepository,
  applicationsRepository,
  interviewEvaluationsRepository,
  interviewerConflictsRepository
} from '../repositories/index.ts';
import { sendSuccess, sendBadRequest, sendNotFound } from '../utils/response.ts';
import { CandidateType } from '../repositories/types.ts';

export class DrivesController {
  public static async listDrives(req: Request, res: Response): Promise<void> {
    const drives = await hiringDrivesRepository.findAll(100);
    sendSuccess(res, drives, 'Hiring drives retrieved successfully.');
  }

  public static async getDriveById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const drive = await hiringDrivesRepository.findById(id);
    if (!drive) {
      sendNotFound(res, 'Hiring drive not found.');
      return;
    }
    sendSuccess(res, drive, 'Hiring drive details retrieved.');
  }

  public static async createDrive(req: Request, res: Response): Promise<void> {
    const body = req.body;
    if (!body.title || !body.role || !body.company) {
      sendBadRequest(res, 'title, role, and company are required fields.');
      return;
    }

    const newId = body.id || 'drive_excelsoft_' + Date.now().toString(36);
    const newDrive = {
      ...body,
      id: newId,
      interviewCapacity: body.interviewCapacity || 50,
      currentRegistrations: 0,
      status: body.status || 'active',
      stages: body.stages || [
        { step: 1, title: 'Registration & Online Screening', description: 'Initial profile screening' },
        { step: 2, title: 'Technical Interview', description: 'Core competency assessment' },
        { step: 3, title: 'HR Evaluation', description: 'Final cultural fit round' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await hiringDrivesRepository.create(newId, newDrive);

    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'CREATE_HIRING_DRIVE',
      actorId: req.user?.uid || 'admin',
      actorRole: req.user?.role || 'admin',
      targetId: newId,
      details: `Created new drive: ${newDrive.title} (${newDrive.role})`
    });

    sendSuccess(res, newDrive, 'Hiring drive created successfully.', 201);
  }

  public static async updateDrive(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const existing = await hiringDrivesRepository.findById(id);
    if (!existing) {
      sendNotFound(res, 'Hiring drive not found.');
      return;
    }

    const updates = req.body;
    await hiringDrivesRepository.update(id, updates);
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };

    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'UPDATE_HIRING_DRIVE',
      actorId: req.user?.uid || 'admin',
      actorRole: req.user?.role || 'admin',
      targetId: id,
      details: `Updated hiring drive: ${existing.title}`
    });

    sendSuccess(res, updated, 'Hiring drive updated successfully.');
  }

  public static async checkEligibility(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const candidateId = (req.query.candidateId as string) || req.user?.uid;

    if (!candidateId) {
      sendBadRequest(res, 'Candidate ID required for eligibility calculation.');
      return;
    }

    const drive = await hiringDrivesRepository.findById(id);
    if (!drive) {
      sendNotFound(res, 'Hiring drive not found.');
      return;
    }

    const profile = await candidateProfilesRepository.findById(candidateId);
    if (!profile) {
      sendNotFound(res, 'Candidate profile not found.');
      return;
    }

    const reasons: string[] = [];
    const actualCgpa = profile.education?.cgpa || 0;
    const cgpaPassed = actualCgpa >= drive.minimumCgpa;
    if (!cgpaPassed) {
      reasons.push(`CGPA ${actualCgpa} is below the required minimum of ${drive.minimumCgpa}`);
    }

    const actualDegree = profile.education?.degree || '';
    const degreePassed = drive.requiredDegree.some(
      (d) =>
        actualDegree.toLowerCase().includes(d.toLowerCase()) ||
        d.toLowerCase().includes(actualDegree.toLowerCase())
    );
    if (!degreePassed) {
      reasons.push(`Degree (${actualDegree}) does not match drive criteria (${drive.requiredDegree.join(', ')})`);
    }

    const eligibleTypes = Array.isArray(drive.candidateType) ? drive.candidateType : [drive.candidateType];
    const typePassed = eligibleTypes.includes(profile.candidateType as any) || eligibleTypes.length === 0;
    if (!typePassed) {
      reasons.push(`Hiring drive is for ${eligibleTypes.join('/')} candidates only.`);
    }

    // Check mandatory skills
    const candidateSkillNames = (profile.skills || []).map((s) => s.name.toLowerCase());
    const missingSkills = (drive.mandatorySkills || []).filter(
      (mand) => !candidateSkillNames.some((cs) => cs.includes(mand.toLowerCase()) || mand.toLowerCase().includes(cs))
    );
    if (missingSkills.length > 0) {
      reasons.push(`Missing mandatory skills: ${missingSkills.join(', ')}`);
    }

    const isEligible = cgpaPassed && degreePassed && typePassed;

    sendSuccess(res, {
      isEligible,
      reasons,
      missingSkills,
      cgpaStatus: { required: drive.minimumCgpa, actual: actualCgpa, passed: cgpaPassed },
      degreeStatus: { required: drive.requiredDegree, actual: actualDegree, passed: degreePassed },
      candidateTypeStatus: { required: eligibleTypes, actual: profile.candidateType, passed: typePassed }
    }, 'Eligibility assessment completed.');
  }

  public static async getUpcomingInterviewSlots(req: Request, res: Response): Promise<void> {
    const slots = await interviewSlotsRepository.findAll(100);
    const apps = await applicationsRepository.findAll(100);
    const appMap = new Map(apps.map((a) => [a.id, a]));
    const candidates = await candidateProfilesRepository.findAll(100);
    const candidateMap = new Map(candidates.map((c) => [c.id, c]));
    const drives = await hiringDrivesRepository.findAll(50);
    const driveMap = new Map(drives.map((d) => [d.id, d]));
    const evaluations = await interviewEvaluationsRepository.findAll(100);
    const conflicts = await interviewerConflictsRepository.findAll(50);

    const enriched = slots.map((slot) => {
      const app = slot.applicationId ? appMap.get(slot.applicationId) : null;
      const candidateId = slot.candidateId || app?.candidateId;
      const candidate = candidateId ? candidateMap.get(candidateId) : null;
      const driveId = slot.hiringDriveId || app?.hiringDriveId;
      const drive = driveId ? driveMap.get(driveId) : null;

      const evaluation = evaluations.find(
        (e) => (e.slotId === slot.id || (candidateId && e.candidateId === candidateId) || (app && e.applicationId === app.id)) && e.status === 'submitted'
      );

      const conflict = conflicts.find(
        (c) => (c.slotId === slot.id || (candidateId && c.candidateId === candidateId) || (app && c.applicationId === app.id)) && c.status === 'declared'
      );

      const executionStatus = (slot as any).executionStatus || (evaluation ? 'completed' : slot.attendanceVerified ? 'candidate_present' : 'scheduled');

      return {
        slotId: slot.id,
        appId: app?.id || `app_${slot.id}`,
        candidateId: candidateId || 'cand_unknown',
        candidateName: candidate?.fullName || 'Candidate',
        candidateType: candidate?.candidateType || 'fresher',
        role: drive?.role || app?.role || 'Graduate Software Engineer',
        driveTitle: drive?.title || app?.hiringDriveTitle || 'Campus Recruitment Drive 2026',
        time: slot.time || '10:00 AM - 11:00 AM IST',
        date: slot.date || 'Today',
        room: slot.roomOrPanel || 'Panel 1 (Technical)',
        venue: slot.location || 'Mysuru Campus',
        attendanceVerified: Boolean(slot.attendanceVerified || evaluation),
        checkedInAt: slot.checkedInAt,
        executionStatus,
        actualStartTime: (slot as any).actualStartTime,
        actualEndTime: (slot as any).actualEndTime,
        evaluation: evaluation ? {
          id: evaluation.id,
          recommendation: evaluation.recommendation,
          recommendationReason: evaluation.recommendationReason,
          interviewerName: evaluation.interviewerName,
          overallSummary: evaluation.overallSummary,
          submittedAt: evaluation.submittedAt
        } : null,
        conflict: conflict ? {
          id: conflict.id,
          candidateName: conflict.candidateName,
          category: conflict.category,
          status: conflict.status
        } : null
      };
    });

    sendSuccess(res, enriched, 'Upcoming interview slots retrieved.');
  }
}
