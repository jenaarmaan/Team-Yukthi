import { Request, Response } from 'express';
import {
  candidateProfilesRepository,
  applicationsRepository,
  auditLogsRepository
} from '../repositories/index.ts';
import { sendSuccess, sendBadRequest, sendNotFound, sendForbidden } from '../utils/response.ts';
import { logger } from '../utils/logger.ts';

export class CandidatesController {
  public static async getOwnProfile(req: Request, res: Response): Promise<void> {
    const uid = req.user?.uid;
    if (!uid) {
      sendBadRequest(res, 'Authentication required');
      return;
    }

    const profile = await candidateProfilesRepository.findById(uid);
    if (!profile) {
      sendNotFound(res, 'Candidate profile not found.');
      return;
    }

    sendSuccess(res, profile, 'Candidate profile retrieved successfully.');
  }

  public static async updateOwnProfile(req: Request, res: Response): Promise<void> {
    const uid = req.user?.uid;
    if (!uid) {
      sendBadRequest(res, 'Authentication required');
      return;
    }

    const existing = await candidateProfilesRepository.findById(uid);
    if (!existing) {
      sendNotFound(res, 'Candidate profile not found.');
      return;
    }

    const updates = req.body;
    const merged = { ...existing, ...updates };

    // Recalculate completion percentage
    let score = 30; // base info
    if (merged.education?.cgpa) score += 20;
    if (merged.skills?.length >= 3) score += 20;
    if (merged.preferredLocations?.length >= 1) score += 10;
    if (merged.resumeOriginalName || merged.resumeStorageUrl) score += 20;
    merged.profileCompletionPercentage = Math.min(100, score);
    merged.updatedAt = new Date().toISOString();

    await candidateProfilesRepository.update(uid, merged);

    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'UPDATE_PROFILE',
      actorId: uid,
      actorRole: req.user?.role || 'candidate',
      targetId: uid,
      details: 'Candidate updated own profile details'
    });

    sendSuccess(res, merged, 'Profile updated successfully.');
  }

  public static async updatePreferredLocations(req: Request, res: Response): Promise<void> {
    const uid = req.user?.uid;
    const { preferredLocations } = req.body;

    if (!Array.isArray(preferredLocations)) {
      sendBadRequest(res, 'preferredLocations must be an array of strings.');
      return;
    }

    const existing = await candidateProfilesRepository.findById(uid!);
    if (!existing) {
      sendNotFound(res, 'Candidate profile not found.');
      return;
    }

    await candidateProfilesRepository.update(uid!, { preferredLocations });
    existing.preferredLocations = preferredLocations;
    sendSuccess(res, existing, 'Preferred locations updated.');
  }

  public static async uploadParsedResume(req: Request, res: Response): Promise<void> {
    const uid = req.user?.uid;
    const { fileName, fileSize, parsedSkills, summary } = req.body;

    if (!fileName) {
      sendBadRequest(res, 'fileName is required.');
      return;
    }

    const current = await candidateProfilesRepository.findById(uid!);
    if (!current) {
      sendNotFound(res, 'Candidate profile not found.');
      return;
    }

    const newSkills = [...current.skills];
    (parsedSkills || []).forEach((skillName: string) => {
      if (!newSkills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) {
        newSkills.push({
          id: 'sk_parsed_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
          name: skillName,
          category: 'core',
          proficiency: 'intermediate',
          verificationLevel: 'self_declared'
        });
      }
    });

    current.resumeOriginalName = fileName;
    current.skills = newSkills;
    current.profileCompletionPercentage = Math.min(100, current.profileCompletionPercentage + 10);
    current.updatedAt = new Date().toISOString();

    await candidateProfilesRepository.update(uid!, current);

    sendSuccess(res, {
      profile: current,
      summary,
      parsedSkills
    }, 'Resume metadata and parsed skills recorded successfully.');
  }

  public static async getAllCandidatesForAdmin(req: Request, res: Response): Promise<void> {
    const profiles = await candidateProfilesRepository.findAll(100);
    const allApps = await applicationsRepository.findAll(200);

    const result = profiles.map((p) => {
      const apps = allApps.filter((a) => a.candidateId === p.id);
      return {
        profile: p,
        personaKey: p.id,
        applications: apps
      };
    });

    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;
    const total = result.length;
    const paginated = result.slice(offset, offset + limit);

    res.setHeader('X-Total-Count', total.toString());
    res.setHeader('X-Limit', limit.toString());
    res.setHeader('X-Offset', offset.toString());

    if (req.query.limit !== undefined || req.query.offset !== undefined || req.query.paginated === 'true') {
      sendSuccess(res, { items: paginated, total, limit, offset }, 'Candidate profiles retrieved for recruitment administration.');
    } else {
      sendSuccess(res, result, 'Candidate profiles retrieved for recruitment administration.');
    }
  }

  public static async getCandidateById(req: Request, res: Response): Promise<void> {
    const { candidateId } = req.params;

    // Candidate Isolation Check: Candidates are strictly forbidden from viewing another candidate's profile
    if (req.user?.role === 'candidate' && req.user.uid !== candidateId) {
      sendForbidden(res, 'Access denied: candidates cannot view profiles of other candidates.');
      return;
    }

    const profile = await candidateProfilesRepository.findById(candidateId);
    if (!profile) {
      sendNotFound(res, 'Candidate profile not found.');
      return;
    }
    const apps = await applicationsRepository.findByField('candidateId', candidateId);
    sendSuccess(res, { profile, applications: apps }, 'Candidate details retrieved.');
  }

  public static async verifySkill(req: Request, res: Response): Promise<void> {
    const { candidateId, skillId } = req.params;
    const { level } = req.body;

    const profile = await candidateProfilesRepository.findById(candidateId);
    if (!profile) {
      sendNotFound(res, 'Candidate profile not found.');
      return;
    }

    const skill = profile.skills.find((s) => s.id === skillId);
    if (!skill) {
      sendNotFound(res, 'Skill not found on candidate profile.');
      return;
    }

    skill.verificationLevel = level || 'hr_verified';
    skill.verifiedAt = new Date().toISOString();
    await candidateProfilesRepository.update(candidateId, profile);

    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'VERIFY_SKILL',
      actorId: req.user?.uid || 'admin',
      actorRole: req.user?.role || 'admin',
      targetId: candidateId,
      details: `Upgraded skill ${skill.name} to ${level}`
    });

    sendSuccess(res, profile, `Skill ${skill.name} verified as ${level}.`);
  }

  public static async updateCandidateProfileVerification(req: Request, res: Response): Promise<void> {
    const { candidateId } = req.params;
    const { status } = req.body;

    const profile = await candidateProfilesRepository.findById(candidateId);
    if (!profile) {
      sendNotFound(res, 'Candidate profile not found.');
      return;
    }

    profile.verificationStatus = status || 'verified';
    profile.updatedAt = new Date().toISOString();
    await candidateProfilesRepository.update(candidateId, profile);

    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'VERIFY_PROFILE',
      actorId: req.user?.uid || 'admin',
      actorRole: req.user?.role || 'admin',
      targetId: candidateId,
      details: `Profile verification set to ${status}`
    });

    sendSuccess(res, profile, `Candidate profile verification updated to ${status}.`);
  }
}
