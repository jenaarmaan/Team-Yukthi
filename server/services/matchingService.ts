import {
  candidateProfilesRepository,
  hiringDrivesRepository,
  applicationsRepository,
  standbyInvitationsRepository,
  auditLogsRepository
} from '../repositories/index.ts';
import { logger } from '../utils/logger.ts';

export interface StandbyMatchResult {
  totalScore: number;
  skillsScore: number;
  locationScore: number;
  academicScore: number;
  availabilityScore: number;
  isEligible: boolean;
  reasons: string[];
}

import { DistributedTransactionService } from './distributedTransactionService.ts';

export class ConcurrencyLockManager {
  public static async resetSlot(slotId: string) {
    await DistributedTransactionService.releaseFirestoreLock('distributed_locks', `slot_${slotId}`);
  }

  public static async acquireSlotClaim(
    slotId: string,
    candidateId: string,
    panelKey?: string
  ): Promise<{ success: boolean; errorCode?: string; message: string }> {
    const slotRes = await DistributedTransactionService.acquireFirestoreLock(
      'distributed_locks',
      `slot_${slotId}`,
      candidateId
    );
    if (!slotRes.success) {
      return {
        success: false,
        errorCode: 'CONCURRENCY_CONFLICT',
        message: 'This replacement interview slot has just been confirmed by another standby candidate. Concurrency conflict averted.'
      };
    }

    if (panelKey) {
      const panelRes = await DistributedTransactionService.acquireFirestoreLock(
        'distributed_locks',
        `panel_${panelKey.replace(/[^a-zA-Z0-9]/g, '_')}`,
        candidateId
      );
      if (!panelRes.success) {
        await DistributedTransactionService.releaseFirestoreLock('distributed_locks', `slot_${slotId}`);
        return {
          success: false,
          errorCode: 'CONCURRENCY_CONFLICT',
          message: 'Panel schedule conflict detected. The interview panel has already been locked for another interview.'
        };
      }
    }

    return { success: true, message: 'Slot acquired successfully via Cloud Firestore distributed lock.' };
  }

  public static async acquirePanelLock(
    panelKey: string,
    candidateId: string
  ): Promise<{ success: boolean; errorCode?: string; message: string }> {
    const res = await DistributedTransactionService.allocatePanelTransaction({
      panelKey,
      candidateId,
      slotId: 'slot_direct_lock',
      venue: panelKey,
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM'
    });
    return {
      success: res.success,
      errorCode: res.errorCode,
      message: res.message
    };
  }
}

/**
 * 100-Point Deterministic Standby Matching Formula:
 * - Mandatory & Preferred Skills Compatibility (Max 40 points)
 * - Geographic & Location Alignment (Max 25 points)
 * - Academic & Degree Accreditation (Max 20 points)
 * - Standby Responsiveness & Pool Status (Max 15 points)
 * Minimum eligibility bar: >= 60 points total score AND candidate CGPA >= minimum drive CGPA.
 */
export async function calculateStandbyMatchScore(
  candidateId: string,
  hiringDriveId: string,
  targetVenue?: string
): Promise<StandbyMatchResult> {
  const candidate = await candidateProfilesRepository.findById(candidateId);
  const drive = await hiringDrivesRepository.findById(hiringDriveId);

  if (!candidate || !drive) {
    return {
      totalScore: 0,
      skillsScore: 0,
      locationScore: 0,
      academicScore: 0,
      availabilityScore: 0,
      isEligible: false,
      reasons: ['Candidate or Hiring Drive not found in recruitment database']
    };
  }

  const reasons: string[] = [];

  // 1. Mandatory & Preferred Skills Compatibility (Max 40 points)
  let skillsScore = 0;
  const driveMandatory = drive.mandatorySkills.map((s) => s.toLowerCase());
  const candidateSkillMap = new Map(candidate.skills.map((s) => [s.name.toLowerCase(), s]));

  let mandatoryMatched = 0;
  driveMandatory.forEach((ms) => {
    const found = candidateSkillMap.get(ms);
    if (found) {
      mandatoryMatched++;
      if (found.verificationLevel === 'hr_verified' || found.verificationLevel === 'assessment_verified') {
        skillsScore += 25 / Math.max(1, driveMandatory.length);
      } else {
        skillsScore += 18 / Math.max(1, driveMandatory.length);
      }
    }
  });

  if (mandatoryMatched === driveMandatory.length) {
    reasons.push(`100% mandatory skill coverage verified (${drive.mandatorySkills.join(', ')})`);
  } else {
    reasons.push(`Partial skill match: ${mandatoryMatched}/${driveMandatory.length} mandatory skills demonstrated`);
  }

  const drivePreferred = (drive.preferredSkills || []).map((s) => s.toLowerCase());
  drivePreferred.forEach((ps) => {
    if (candidateSkillMap.has(ps)) {
      skillsScore += 15 / Math.max(1, drivePreferred.length);
    }
  });
  skillsScore = Math.min(40, Math.round(skillsScore));

  // 2. Geographic & Location Alignment (Max 25 points)
  let locationScore = 0;
  const targetLoc = (targetVenue || drive.locations[0] || '').toLowerCase();
  const candidatePrefs = (candidate.preferredLocations || []).map((l) => l.toLowerCase());
  const candidateBase = (candidate.currentLocation || '').toLowerCase();

  const isDirectPref = candidatePrefs.some((p) => targetLoc.includes(p) || p.includes(targetLoc));
  const isBaseCity = targetLoc.includes(candidateBase) || candidateBase.includes(targetLoc);

  if (isDirectPref) {
    locationScore = 25;
    reasons.push(`Target interview venue matches candidate priority preference (${candidate.preferredLocations.join(', ')})`);
  } else if (isBaseCity) {
    locationScore = 20;
    reasons.push(`Target venue is in candidate base city of residence (${candidate.currentLocation})`);
  } else {
    locationScore = 8;
    reasons.push(`Venue requires travel from base location (${candidate.currentLocation})`);
  }

  // 3. Academic & Degree Accreditation (Max 20 points)
  let academicScore = 0;
  const cgpa = candidate.education.cgpa;
  const minCgpa = drive.minimumCgpa;

  if (cgpa >= minCgpa) {
    academicScore += 12;
    reasons.push(`Academic CGPA (${cgpa.toFixed(2)}) clears threshold bar (min ${minCgpa.toFixed(2)})`);
  } else {
    reasons.push(`Academic CGPA (${cgpa.toFixed(2)}) below standard requirement (${minCgpa.toFixed(2)})`);
  }

  const degreeMatches = drive.requiredDegree.some(
    (d) =>
      candidate.education.degree.toLowerCase().includes(d.toLowerCase()) ||
      d.toLowerCase().includes(candidate.education.degree.toLowerCase())
  );
  if (degreeMatches) {
    academicScore += 8;
    reasons.push(`Degree specialization (${candidate.education.degree} - ${candidate.education.branch}) aligns with job prerequisites`);
  } else {
    academicScore += 4;
    reasons.push(`Alternative degree qualification evaluated`);
  }

  // 4. Standby Responsiveness & Pool Status (Max 15 points)
  let availabilityScore = 0;
  const userStandbys = await standbyInvitationsRepository.findByField('candidateId', candidateId);
  const standbyApp = userStandbys.find((s) => s.hiringDriveId === hiringDriveId) || userStandbys[0];

  if (standbyApp && standbyApp.invitationStatus === 'accepted') {
    availabilityScore = 15;
    reasons.push('Candidate pre-accepted standby terms and is immediately available for rapid deployment');
  } else if (standbyApp && standbyApp.invitationStatus === 'pending_response') {
    availabilityScore = 10;
    reasons.push('Standby invitation awaiting confirmation with responsive in-app activity');
  } else {
    availabilityScore = 5;
    reasons.push('Standby pool terms not yet acknowledged');
  }

  const totalScore = Math.min(100, Math.round(skillsScore + locationScore + academicScore + availabilityScore));
  const isEligible = totalScore >= 60 && cgpa >= minCgpa;

  return {
    totalScore,
    skillsScore,
    locationScore,
    academicScore,
    availabilityScore,
    isEligible,
    reasons
  };
}
