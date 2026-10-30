import {
  hiringDrivesRepository,
  candidateProfilesRepository,
  applicationsRepository,
  interviewSlotsRepository,
  waitlistsRepository,
  standbyInvitationsRepository,
  absenceRecordsRepository,
  internalHRNotesRepository,
  interviewerPanelsRepository,
  slotRecoveryIncidentsRepository,
  notificationsRepository,
  usersRepository
} from '../repositories/index.ts';
import { SEED_HIRING_DRIVES, DEMO_PERSONAS } from '../../src/data/seedData.ts';
import { logger } from '../utils/logger.ts';

export async function initializeDatabaseSeed(): Promise<void> {
  try {
    // 1. Seed Hiring Drives
    for (const drive of SEED_HIRING_DRIVES) {
      const exists = await hiringDrivesRepository.findById(drive.id);
      if (!exists) {
        await hiringDrivesRepository.create(drive.id, {
          id: drive.id,
          title: drive.title,
          company: drive.company,
          role: drive.role,
          candidateType: drive.eligibleCandidateTypes[0] || 'fresher',
          locations: drive.locations,
          startDate: drive.hiringDriveDate || new Date().toISOString(),
          endDate: drive.registrationDeadline || new Date().toISOString(),
          interviewCapacity: drive.interviewCapacity,
          currentRegistrations: drive.currentRegistrations,
          mandatorySkills: drive.mandatorySkills,
          preferredSkills: drive.preferredSkills,
          minimumCgpa: drive.minimumCgpa,
          requiredDegree: drive.requiredDegree,
          description: drive.description,
          status: drive.isRegistrationOpen ? 'active' : 'paused',
          stages: drive.stages.map((st, idx) => ({ step: idx + 1, title: st, description: st })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    // 2. Seed Interviewer Panels
    const defaultInterviewers = [
      {
        id: 'int_01',
        name: 'Dr. Murali Krishna',
        email: 'murali.k@excelsoftcorp.com',
        role: 'Principal Architect & Technical Director',
        department: 'Architecture & Scalability Lab',
        skills: ['Java', 'Cloud Architecture', 'Distributed Systems', 'DSA'],
        assignedPanel: 'Panel 1 (System Architecture)',
        location: 'Mysuru',
        activeInterviewsCount: 6,
        availableDays: ['Nov 16, 2026', 'Nov 20, 2026', 'Nov 28, 2026'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'int_02',
        name: 'Swati Bhattacharya',
        email: 'swati.b@excelsoftcorp.com',
        role: 'Staff Frontend Engineer',
        department: 'Enterprise Learning UI/UX',
        skills: ['React', 'TypeScript', 'Micro-frontends', 'State Management'],
        assignedPanel: 'Panel 2 (Frontend & UI Engineering)',
        location: 'Bengaluru',
        activeInterviewsCount: 4,
        availableDays: ['Nov 18, 2026', 'Nov 21, 2026'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'int_03',
        name: 'Raghuveer Hegde',
        email: 'raghuveer.h@excelsoftcorp.com',
        role: 'Principal SDET Lead',
        department: 'Global Quality Assurance',
        skills: ['Selenium', 'Playwright', 'Performance Engineering', 'CI/CD'],
        assignedPanel: 'Panel 3 (Automation & Test Architecture)',
        location: 'Mysuru',
        activeInterviewsCount: 5,
        availableDays: ['Nov 16, 2026', 'Nov 20, 2026'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'int_04',
        name: 'Deepika Joshi',
        email: 'deepika.j@excelsoftcorp.com',
        role: 'Lead AI Engineer',
        department: 'AI & Adaptive Learning Lab',
        skills: ['Python', 'PyTorch', 'Vector Databases', 'NLP'],
        assignedPanel: 'Panel 4 (Machine Learning & AI Systems)',
        location: 'Hyderabad',
        activeInterviewsCount: 3,
        availableDays: ['Nov 18, 2026', 'Dec 02, 2026'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'int_05',
        name: 'Arvind Kulkarni',
        email: 'arvind.k@excelsoftcorp.com',
        role: 'Senior Director of Engineering',
        department: 'K-12 & Higher Ed Core Platforms',
        skills: ['System Design', 'Engineering Leadership', 'PostgreSQL', 'Java'],
        assignedPanel: 'Panel 5 (Leadership & Technical Problem Solving)',
        location: 'Bengaluru',
        activeInterviewsCount: 4,
        availableDays: ['Nov 18, 2026', 'Nov 20, 2026'],
        createdAt: new Date().toISOString()
      }
    ];

    for (const intv of defaultInterviewers) {
      const exists = await interviewerPanelsRepository.findById(intv.id);
      if (!exists) {
        await interviewerPanelsRepository.create(intv.id, intv);
      }
    }

    // 3. Seed Internal Notes
    const defaultNotes = [
      {
        id: 'note_1',
        candidateId: 'cand_rohan_sharma',
        authorId: 'int_01',
        authorName: 'Dr. Murali Krishna',
        authorRole: 'Panel Lead (System Architecture)',
        note: 'Candidate scored 8.42 CGPA and cleared preliminary algorithmic test with 94 percentile. Slotted for technical assessment on Nov 20.',
        createdAt: '2026-10-28T11:00:00'
      },
      {
        id: 'note_2',
        candidateId: 'cand_ananya_iyer',
        authorId: 'adm_praveen',
        authorName: 'Praveen Kumar',
        authorRole: 'Campus Recruitment Lead',
        note: 'Placed at waitlist position #4 due to primary hall capacity limit (120 candidates). Eligible for Batch 2 priority promotion if capacity opens.',
        createdAt: '2026-10-28T12:30:00'
      },
      {
        id: 'note_3',
        candidateId: 'cand_karthik_nair',
        authorId: 'adm_sushmita',
        authorName: 'Sushmita Jena',
        authorRole: 'Talent Acquisition Director',
        note: 'Reviewing Apollo clinic medical prescription. Valid outpatient documentation submitted within 24 hours of absence. Recommendation: Ratify absence.',
        createdAt: '2026-10-29T16:00:00'
      }
    ];

    for (const note of defaultNotes) {
      const exists = await internalHRNotesRepository.findById(note.id);
      if (!exists) {
        await internalHRNotesRepository.create(note.id, note);
      }
    }

    // 4. Seed Slot Recovery Incidents
    const defaultRecoveries = [
      {
        id: 'rec_01',
        vacantSlotId: 'slot_repl_bengaluru_08',
        hiringDriveId: 'drive_excelsoft_fullstack_2026',
        role: 'Senior Software Engineer - Full Stack',
        venue: 'Panel 2, Manyata Tech Park Campus, Bengaluru',
        slotDate: 'Thursday, Nov 18, 2026',
        slotTime: '02:00 PM - 03:00 PM IST',
        vacatedByCandidateId: 'cand_rajesh_goud',
        vacatedByCandidateName: 'Rajesh Goud (Candidate Cancelled)',
        vacatedReason: 'candidate_cancelled' as const,
        detectedAt: '2026-10-30T04:15:00',
        status: 'invitations_dispatched' as const,
        matchedStandbyCandidateId: 'cand_sneha_reddy',
        matchedStandbyCandidateName: 'Sneha Reddy',
        candidateResponseDeadline: '2026-10-30T18:00:00'
      },
      {
        id: 'rec_02',
        vacantSlotId: 'slot_mysuru_panel_02_vacant',
        hiringDriveId: 'drive_excelsoft_gse_2026',
        role: 'Graduate Software Engineer',
        venue: 'Panel 2 - Brahmaputra Block, Mysuru Campus',
        slotDate: 'Saturday, Nov 20, 2026',
        slotTime: '02:30 PM - 03:30 PM IST',
        vacatedByCandidateId: 'cand_aditya_prasad',
        vacatedByCandidateName: 'Aditya Prasad (Travel Delay)',
        vacatedReason: 'rescheduled' as const,
        detectedAt: '2026-10-30T04:30:00',
        status: 'vacant' as const
      }
    ];

    for (const rec of defaultRecoveries) {
      const exists = await slotRecoveryIncidentsRepository.findById(rec.id);
      if (!exists) {
        await slotRecoveryIncidentsRepository.create(rec.id, rec);
      }
    }

    // 4b. Seed Admin Staff Users
    const defaultAdmins = [
      { uid: 'adm_sushmita', email: 'sushmita.jena@excelsoftcorp.com', displayName: 'Sushmita Jena', role: 'super_admin' as const, department: 'Global Talent Acquisition', avatarInitials: 'SJ' },
      { uid: 'adm_praveen', email: 'praveen.k@excelsoftcorp.com', displayName: 'Praveen Kumar', role: 'hr_admin' as const, department: 'Campus Recruitment & Operations', avatarInitials: 'PK' },
      { uid: 'adm_ananya', email: 'ananya.d@excelsoftcorp.com', displayName: 'Ananya Deshmukh', role: 'recruitment_manager' as const, department: 'Engineering & EdTech Hiring', avatarInitials: 'AD' },
      { uid: 'adm_rakesh', email: 'rakesh.r@excelsoftcorp.com', displayName: 'Rakesh Rao', role: 'interview_coordinator' as const, department: 'Interview Logistics & Facilities', avatarInitials: 'RR' },
      { uid: 'adm_murali', email: 'murali.k@excelsoftcorp.com', displayName: 'Dr. Murali Krishna', role: 'interviewer' as const, department: 'Architecture & Technical Panels', avatarInitials: 'MK' }
    ];

    for (const adminUser of defaultAdmins) {
      const exists = await usersRepository.findById(adminUser.uid);
      if (!exists) {
        await usersRepository.create(adminUser.uid, {
          uid: adminUser.uid,
          email: adminUser.email,
          phone: '+91 99000 12345',
          role: adminUser.role,
          displayName: adminUser.displayName,
          avatarInitials: adminUser.avatarInitials,
          department: adminUser.department,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as any);
      }
    }

    // 5. Seed Demo Personas (Profiles, Applications, Slots, Waitlists, Standby, Absence)
    for (const persona of Object.values(DEMO_PERSONAS)) {
      const prof = persona.profile;
      const userExists = await usersRepository.findById(prof.id);
      if (!userExists) {
        await usersRepository.create(prof.id, {
          uid: prof.id,
          email: prof.email,
          phone: prof.phone,
          role: 'candidate',
          displayName: prof.fullName,
          avatarInitials: prof.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      const profileExists = await candidateProfilesRepository.findById(prof.id);
      if (!profileExists) {
        await candidateProfilesRepository.create(prof.id, {
          id: prof.id,
          candidateType: prof.candidateType,
          fullName: prof.fullName,
          email: prof.email,
          phone: prof.phone,
          currentLocation: prof.currentLocation,
          preferredLocations: prof.preferredLocations,
          education: {
            institution: prof.education.institution,
            degree: prof.education.degree,
            branch: prof.education.branch,
            yearOfPassing: prof.education.graduationYear,
            cgpa: prof.education.cgpa,
            percentage: prof.education.cgpa ? prof.education.cgpa * 9.5 : 80
          },
          skills: prof.skills.map((s) => ({
            id: s.id,
            name: s.name,
            category: 'core',
            proficiency: 'advanced',
            verificationLevel: s.verificationLevel === 'assessment_verified' ? 'assessment_verified' : s.verificationLevel === 'hr_verified' ? 'hr_verified' : 'self_declared'
          })),
          verificationStatus: prof.verificationStatus,
          profileCompletionPercentage: prof.profileCompletionPercentage,
          resumeOriginalName: prof.resume?.fileName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      // Seed Applications
      for (const app of persona.applications) {
        const appExists = await applicationsRepository.findById(app.id);
        if (!appExists) {
          await applicationsRepository.create(app.id, {
            id: app.id,
            candidateId: prof.id,
            hiringDriveId: app.hiringDriveId,
            hiringDriveTitle: app.hiringDriveTitle,
            role: app.role,
            company: app.company,
            appliedLocation: app.appliedLocation,
            appliedDate: app.appliedDate,
            status: app.status as any,
            stages: app.stages,
            statusHistory: app.statusHistory,
            interviewSlotId: app.interviewSlot?.id,
            rejectionReason: app.rejectionReason,
            createdAt: app.appliedDate || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });

          // If confirmed interview slot exists
          if (app.interviewSlot) {
            const slot = app.interviewSlot;
            const slotExists = await interviewSlotsRepository.findById(slot.id);
            if (!slotExists) {
              await interviewSlotsRepository.create(slot.id, {
                id: slot.id,
                hiringDriveId: slot.hiringDriveId,
                applicationId: app.id,
                candidateId: prof.id,
                date: slot.date,
                time: slot.time,
                reportingTime: slot.reportingTime,
                location: slot.location,
                roomOrPanel: slot.roomOrPanel,
                venueAddress: slot.venueAddress,
                instructions: slot.instructions,
                isLocked: false,
                isCheckInOpen: slot.isCheckInOpen,
                attendanceVerified: slot.attendanceVerified,
                checkedInAt: slot.checkedInAt,
                qrTokenHash: slot.qrToken,
                otpCode: slot.otpCode,
                createdAt: new Date().toISOString()
              });
            }
          }

          // If waitlistInfo exists
          if (app.waitlistInfo) {
            const wl = app.waitlistInfo;
            const wlExists = await waitlistsRepository.findById(wl.id);
            if (!wlExists) {
              await waitlistsRepository.create(wl.id, {
                id: wl.id,
                hiringDriveId: wl.hiringDriveId,
                applicationId: app.id,
                candidateId: prof.id,
                position: wl.position,
                totalInQueue: wl.totalInWaitlist,
                status: 'active',
                potentialBatchDate: 'Saturday, Nov 28, 2026',
                createdAt: new Date().toISOString()
              });
            }
          }

          // If standbyInfo exists
          if (app.standbyInfo) {
            const sb = app.standbyInfo;
            const sbExists = await standbyInvitationsRepository.findById(sb.id);
            if (!sbExists) {
              await standbyInvitationsRepository.create(sb.id, {
                id: sb.id,
                hiringDriveId: sb.hiringDriveId,
                applicationId: app.id,
                candidateId: prof.id,
                location: sb.location,
                invitationStatus: sb.invitationStatus,
                invitedAt: sb.invitedAt,
                responseDeadline: sb.responseDeadline,
                replacementSlot: sb.replacementSlot,
                createdAt: new Date().toISOString()
              });
            }
          }

          // If absenceRecord exists
          if (app.absenceRecord) {
            const abs = app.absenceRecord;
            const absExists = await absenceRecordsRepository.findById(abs.id);
            if (!absExists) {
              await absenceRecordsRepository.create(abs.id, {
                id: abs.id,
                applicationId: abs.applicationId,
                hiringDriveId: abs.hiringDriveId,
                interviewSlotId: abs.interviewSlotId,
                candidateId: prof.id,
                candidateType: abs.candidateType,
                missedDate: abs.missedDate,
                deadlineForExplanation: abs.deadlineForExplanation,
                explanationReason: abs.explanationReason,
                supportingDocName: abs.supportingDocName,
                submittedAt: abs.submittedAt,
                status: abs.status,
                hrReviewNotes: abs.hrReviewNotes,
                createdAt: new Date().toISOString()
              });
            }
          }
        }
      }

      // Seed Notifications
      for (const notif of persona.notifications) {
        const notifExists = await notificationsRepository.findById(notif.id);
        if (!notifExists) {
          await notificationsRepository.create(notif.id, {
            id: notif.id,
            candidateId: notif.candidateId,
            type: notif.type,
            title: notif.title,
            message: notif.message,
            timestamp: notif.timestamp,
            isRead: notif.isRead,
            deliveryChannel: notif.deliveryChannel || 'in_app',
            isSimulatedExternal: Boolean(notif.isSimulatedExternal),
            actionRoute: notif.actionRoute
          });
        }
      }
    }

    logger.info('NIYOJAN Database initial seed verified successfully.');
  } catch (err: any) {
    logger.warn('NIYOJAN Database initial seed encountered non-fatal error:', err.message);
  }
}
