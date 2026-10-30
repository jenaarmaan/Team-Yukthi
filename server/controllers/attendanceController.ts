import { Request, Response } from 'express';
import {
  interviewSlotsRepository,
  applicationsRepository,
  attendanceRecordsRepository,
  absenceRecordsRepository,
  candidateProfilesRepository,
  notificationsRepository,
  auditLogsRepository
} from '../repositories/index.ts';
import { QrSecurityService } from '../services/qrSecurityService.ts';
import { sendSuccess, sendBadRequest, sendNotFound, sendForbidden, sendConflict } from '../utils/response.ts';

export class AttendanceController {
  public static async verifyAttendance(req: Request, res: Response): Promise<void> {
    const { applicationId, method, providedCode } = req.body;

    if (!applicationId || !method || !providedCode) {
      sendBadRequest(res, 'applicationId, method ("qr" | "otp"), and providedCode are required.');
      return;
    }

    const app = await applicationsRepository.findById(applicationId);
    if (!app || !app.interviewSlotId) {
      sendNotFound(res, 'No confirmed interview slot found for this application.');
      return;
    }

    const slot = await interviewSlotsRepository.findById(app.interviewSlotId);
    if (!slot) {
      sendNotFound(res, 'Interview slot document not found.');
      return;
    }

    // 1. Gate Check
    if (!slot.isCheckInOpen) {
      await auditLogsRepository.create('log_' + Date.now(), {
        id: 'log_' + Date.now(),
        timestamp: new Date().toISOString(),
        action: 'CHECKIN_REJECTED',
        actorId: app.candidateId,
        actorRole: 'candidate',
        targetId: slot.id,
        details: `Check-in rejected: gates are closed for slot ${slot.id}`
      });
      res.status(400).json({
        success: false,
        error: {
          code: 'GATE_CLOSED',
          message: 'Check-in is currently closed for this interview slot. Please wait for the venue reporting desk to open.'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    // 2. Replay Prevention: Has attendance already been verified?
    if (slot.attendanceVerified) {
      await auditLogsRepository.create('log_' + Date.now(), {
        id: 'log_' + Date.now(),
        timestamp: new Date().toISOString(),
        action: 'REPLAY_PREVENTED',
        actorId: app.candidateId,
        actorRole: 'candidate',
        targetId: slot.id,
        details: `Replay attempt prevented for slot ${slot.id}`
      });
      res.status(409).json({
        success: false,
        error: {
          code: 'REPLAY_PREVENTED',
          message: `Attendance has already been verified for this interview slot at ${slot.checkedInAt || 'earlier today'}. Token cannot be reused.`
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    // 3. Token or OTP Matching
    if (method === 'qr') {
      const qrValidation = await QrSecurityService.verifySignedPass(providedCode, slot.id, app.candidateId);
      if (!qrValidation.valid) {
        await auditLogsRepository.create('log_' + Date.now(), {
          id: 'log_' + Date.now(),
          timestamp: new Date().toISOString(),
          action: qrValidation.errorCode || 'INVALID_TOKEN',
          actorId: app.candidateId,
          actorRole: 'candidate',
          targetId: slot.id,
          details: `Check-in rejected (${qrValidation.errorCode}): ${qrValidation.message}`
        });

        if (qrValidation.errorCode === 'REPLAY_PREVENTED') {
          res.status(409).json({
            success: false,
            error: { code: 'REPLAY_PREVENTED', message: qrValidation.message },
            timestamp: new Date().toISOString()
          });
          return;
        }

        res.status(400).json({
          success: false,
          error: { code: qrValidation.errorCode || 'INVALID_TOKEN', message: qrValidation.message },
          timestamp: new Date().toISOString()
        });
        return;
      }
    } else {
      if (slot.otpExpiresAt && new Date() > new Date(slot.otpExpiresAt)) {
        await auditLogsRepository.create('log_' + Date.now(), {
          id: 'log_' + Date.now(),
          timestamp: new Date().toISOString(),
          action: 'EXPIRED_OTP',
          actorId: app.candidateId,
          actorRole: 'candidate',
          targetId: slot.id,
          details: `Expired OTP entered: ${providedCode}`
        });
        res.status(400).json({
          success: false,
          error: { code: 'OTP_EXPIRED', message: 'The 6-digit OTP code has expired. Please generate a fresh code.' },
          timestamp: new Date().toISOString()
        });
        return;
      }

      if (providedCode !== slot.otpCode) {
        await auditLogsRepository.create('log_' + Date.now(), {
          id: 'log_' + Date.now(),
          timestamp: new Date().toISOString(),
          action: 'INVALID_OTP',
          actorId: app.candidateId,
          actorRole: 'candidate',
          targetId: slot.id,
          details: `Incorrect OTP entered: ${providedCode}`
        });
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_OTP', message: `Incorrect 6-digit OTP code. Expected code is ${slot.otpCode}.` },
          timestamp: new Date().toISOString()
        });
        return;
      }
    }

    const checkInTime = new Date().toISOString();
    slot.attendanceVerified = true;
    slot.checkedInAt = checkInTime;
    await interviewSlotsRepository.update(slot.id, slot);

    // Create attendance record
    const attId = 'att_' + Date.now();
    await attendanceRecordsRepository.create(attId, {
      id: attId,
      interviewSlotId: slot.id,
      applicationId: app.id,
      candidateId: app.candidateId,
      hiringDriveId: app.hiringDriveId,
      verifiedMethod: method === 'qr' ? 'qr_hmac' : 'otp_passcode',
      verifiedByUserId: req.user?.uid || 'desk_coordinator',
      verifiedAt: checkInTime,
      location: slot.location,
      roomOrPanel: slot.roomOrPanel
    });

    // Advance application stages
    app.stages = app.stages.map((st) => {
      if (st.step === 5) {
        return {
          ...st,
          title: 'Interview Attendance Verified',
          description: `Checked in successfully via ${method.toUpperCase()} verification at ${new Date().toLocaleTimeString()} IST`,
          status: 'completed' as const,
          date: 'Today'
        };
      }
      if (st.step === 6) {
        return {
          ...st,
          title: 'Technical Evaluation in Progress',
          description: 'Candidate undergoing interview panels; results to follow',
          status: 'current' as const
        };
      }
      return st;
    });

    app.statusHistory.unshift({
      status: 'confirmed',
      timestamp: checkInTime,
      note: `Verified attendance at venue via ${method.toUpperCase()} authentication.`
    });
    await applicationsRepository.update(app.id, app);

    await notificationsRepository.create('notif_' + Date.now(), {
      id: 'notif_' + Date.now(),
      candidateId: app.candidateId,
      type: 'attendance_confirmed',
      title: 'Attendance Verified: Check-in Successful!',
      message: `Your presence for ${app.role} has been recorded. Please wait in the designated lounge.`,
      timestamp: 'Just now',
      isRead: false,
      deliveryChannel: 'in_app',
      isSimulatedExternal: false,
      actionRoute: { tab: 'applications', targetId: app.id }
    });

    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: checkInTime,
      action: 'VERIFY_ATTENDANCE',
      actorId: app.candidateId,
      actorRole: req.user?.role || 'candidate',
      targetId: slot.id,
      details: `Attendance verified via ${method.toUpperCase()}`
    });

    sendSuccess(res, slot, 'Attendance verified successfully! Welcome to Excelsoft Technologies.');
  }

  public static async markAttendanceManual(req: Request, res: Response): Promise<void> {
    const { applicationId, status } = req.body; // status: 'present' | 'absent'

    if (!applicationId || !['present', 'absent'].includes(status)) {
      sendBadRequest(res, 'applicationId and status ("present" | "absent") are required.');
      return;
    }

    const app = await applicationsRepository.findById(applicationId);
    if (!app || !app.interviewSlotId) {
      sendNotFound(res, 'Interview slot not found for application.');
      return;
    }

    const slot = await interviewSlotsRepository.findById(app.interviewSlotId);
    if (!slot) {
      sendNotFound(res, 'Interview slot document not found.');
      return;
    }

    const profile = await candidateProfilesRepository.findById(app.candidateId);
    const isFresher = profile?.candidateType === 'fresher';

    if (status === 'present') {
      slot.attendanceVerified = true;
      slot.checkedInAt = new Date().toISOString();
      await interviewSlotsRepository.update(slot.id, slot);

      app.stages = app.stages.map((st) => {
        if (st.step === 5) {
          return {
            ...st,
            title: 'Attendance Verified (HR Desk)',
            description: 'Candidate marked present at venue desk',
            status: 'completed' as const,
            date: 'Today'
          };
        }
        if (st.step === 6) {
          return { ...st, status: 'current' as const };
        }
        return st;
      });
      await applicationsRepository.update(app.id, app);
    } else {
      // Absent
      slot.attendanceVerified = false;
      await interviewSlotsRepository.update(slot.id, slot);

      if (isFresher) {
        app.status = 'rejected';
        app.rejectionReason = 'No-show: Opportunity-loss policy applied for fresher recruitment drive.';
      } else {
        app.status = 'under_review';
        const absId = 'abs_' + Date.now();
        await absenceRecordsRepository.create(absId, {
          id: absId,
          applicationId: app.id,
          hiringDriveId: app.hiringDriveId,
          interviewSlotId: slot.id,
          candidateId: app.candidateId,
          candidateType: 'experienced',
          missedDate: new Date().toISOString(),
          deadlineForExplanation: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
          status: 'missed_unexplained',
          hrReviewNotes: 'Candidate absent for scheduled slot. Awaiting 48-hour justification submission.',
          createdAt: new Date().toISOString()
        });
      }
      await applicationsRepository.update(app.id, app);
    }

    await auditLogsRepository.create('log_' + Date.now(), {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'MARK_ATTENDANCE',
      actorId: req.user?.uid || 'admin',
      actorRole: req.user?.role || 'admin',
      targetId: app.id,
      details: `HR marked attendance as ${status.toUpperCase()}`
    });

    sendSuccess(res, { app, slot }, `Attendance marked as ${status.toUpperCase()}`);
  }

  public static async generateDynamicPass(req: Request, res: Response): Promise<void> {
    const { applicationId } = req.params;
    const app = await applicationsRepository.findById(applicationId);
    if (!app) {
      sendNotFound(res, 'Application not found.');
      return;
    }

    if (req.user?.role === 'candidate' && app.candidateId !== req.user.uid) {
      sendForbidden(res, 'Access denied.');
      return;
    }

    if (!app.interviewSlotId) {
      sendBadRequest(res, 'No confirmed interview slot for this application.');
      return;
    }

    const slot = await interviewSlotsRepository.findById(app.interviewSlotId);
    if (!slot) {
      sendNotFound(res, 'Slot document not found.');
      return;
    }

    const token = QrSecurityService.generateSignedPass(app.candidateId, app.hiringDriveId, slot.id);
    const { otp, expiresAt } = QrSecurityService.generateOtp();
    slot.otpCode = otp;
    slot.otpExpiresAt = expiresAt;
    slot.qrTokenHash = token;
    await interviewSlotsRepository.update(slot.id, slot);

    sendSuccess(res, {
      qrPass: token,
      otpCode: otp,
      otpExpiresAt: expiresAt,
      ttlSeconds: 300,
      slotId: slot.id,
      date: slot.date,
      time: slot.time,
      venue: slot.roomOrPanel
    }, 'Dynamic QR Attendance Pass generated.');
  }
}
