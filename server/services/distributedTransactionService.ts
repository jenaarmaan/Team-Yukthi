import { db, runTransaction } from '../config/database.ts';
import {
  interviewSlotsRepository,
  InterviewSlotDocument
} from '../repositories/index.ts';
import { logger } from '../utils/logger.ts';

export interface TransactionResult<T> {
  success: boolean;
  data?: T;
  errorCode?: string;
  message: string;
}

export class DistributedTransactionService {
  /**
   * Database-backed atomic lock acquire on SQLite.
   * Uses SQLite table UNIQUE constraints and transactional locks
   * to guarantee distributed mutex semantics without any external cloud dependency.
   */
  public static async acquireLock(
    collection: string,
    docId: string,
    holderId: string,
    additionalData?: Record<string, any>,
    allowReentry = false
  ): Promise<{ success: boolean; conflictHolderId?: string }> {
    const nowIso = new Date().toISOString();

    if (collection === 'idempotency_keys') {
      try {
        const stmt = db.prepare(`INSERT INTO idempotency_keys (key, actor_id, created_at) VALUES (?, ?, ?)`);
        stmt.run(docId, holderId, nowIso);
        return { success: true };
      } catch (err: any) {
        if (err.message?.includes('UNIQUE constraint failed')) {
          const row = db.prepare(`SELECT actor_id FROM idempotency_keys WHERE key = ?`).get(docId) as any;
          if (allowReentry && row?.actor_id === holderId) {
            return { success: true };
          }
          return { success: false, conflictHolderId: row?.actor_id || 'duplicate_key' };
        }
        logger.error(`SQLite idempotency lock error:`, err);
        return { success: false, conflictHolderId: 'error' };
      }
    }

    if (collection === 'used_attendance_nonces') {
      try {
        const stmt = db.prepare(`
          INSERT INTO used_attendance_nonces (nonce, candidate_id, slot_id, hiring_drive_id, consumed_at)
          VALUES (?, ?, ?, ?, ?)
        `);
        stmt.run(
          docId,
          holderId,
          additionalData?.slotId || null,
          additionalData?.hiringDriveId || null,
          nowIso
        );
        return { success: true };
      } catch (err: any) {
        if (err.message?.includes('UNIQUE constraint failed')) {
          return { success: false, conflictHolderId: 'already_used_nonce' };
        }
        logger.error(`SQLite nonce lock error:`, err);
        return { success: false, conflictHolderId: 'error' };
      }
    }

    // Default to distributed_locks table
    const lockKey = `${collection}:${docId}`;
    try {
      const stmt = db.prepare(`INSERT INTO distributed_locks (lock_key, holder_id, data, acquired_at) VALUES (?, ?, ?, ?)`);
      stmt.run(lockKey, holderId, JSON.stringify(additionalData || {}), nowIso);
      return { success: true };
    } catch (err: any) {
      if (err.message?.includes('UNIQUE constraint failed')) {
        const row = db.prepare(`SELECT holder_id FROM distributed_locks WHERE lock_key = ?`).get(lockKey) as any;
        if (allowReentry && row?.holder_id === holderId) {
          return { success: true };
        }
        return { success: false, conflictHolderId: row?.holder_id || 'concurrent_holder' };
      }
      logger.error(`SQLite distributed lock error:`, err);
      return { success: false, conflictHolderId: 'error' };
    }
  }

  // Alias for backward compatibility with existing callers
  public static async acquireFirestoreLock(
    collection: string,
    docId: string,
    holderId: string,
    additionalData?: Record<string, any>,
    allowReentry = false
  ): Promise<{ success: boolean; conflictHolderId?: string }> {
    return this.acquireLock(collection, docId, holderId, additionalData, allowReentry);
  }

  /**
   * Release database-backed lock.
   */
  public static async releaseLock(collection: string, docId: string): Promise<void> {
    try {
      if (collection === 'idempotency_keys') {
        db.prepare(`DELETE FROM idempotency_keys WHERE key = ?`).run(docId);
      } else if (collection === 'used_attendance_nonces') {
        db.prepare(`DELETE FROM used_attendance_nonces WHERE nonce = ?`).run(docId);
      } else {
        const lockKey = `${collection}:${docId}`;
        db.prepare(`DELETE FROM distributed_locks WHERE lock_key = ?`).run(lockKey);
      }
    } catch (err: any) {
      logger.warn(`Error releasing SQLite lock ${collection}/${docId}:`, err.message);
    }
  }

  // Alias for backward compatibility
  public static async releaseFirestoreLock(collection: string, docId: string): Promise<void> {
    return this.releaseLock(collection, docId);
  }

  /**
   * Database-backed atomic claim of a replacement interview slot.
   * Guarantees that across multiple concurrent requests, only one candidate can acquire the slot.
   */
  public static async claimReplacementSlotTransaction(params: {
    applicationId: string;
    candidateId: string;
    hiringDriveId: string;
    slotId: string;
    venue: string;
    date: string;
    time: string;
    location: string;
    confirmationDeadline?: string;
  }): Promise<TransactionResult<InterviewSlotDocument>> {
    const {
      applicationId,
      candidateId,
      hiringDriveId,
      slotId,
      venue,
      date,
      time,
      location,
      confirmationDeadline
    } = params;

    // 1. Validate Expiration (4-hour window)
    if (confirmationDeadline && new Date() > new Date(confirmationDeadline)) {
      return {
        success: false,
        errorCode: 'EXPIRED',
        message: 'The confirmation window for this urgent replacement slot has lapsed.'
      };
    }

    const sanitizedPanelKey = `${venue.replace(/[^a-zA-Z0-9]/g, '_')}_${date.replace(/[^a-zA-Z0-9]/g, '_')}_${time.replace(/[^a-zA-Z0-9]/g, '_')}`;

    // 2. Acquire Slot Lock in SQLite
    const slotLock = await this.acquireLock(
      'distributed_locks',
      `slot_${slotId}`,
      candidateId,
      { slotId, applicationId, hiringDriveId }
    );

    if (!slotLock.success) {
      return {
        success: false,
        errorCode: 'CONCURRENCY_CONFLICT',
        message: 'This replacement interview slot has just been confirmed by another standby candidate. Concurrency conflict averted.'
      };
    }

    // 3. Acquire Panel Lock in SQLite
    const panelLock = await this.acquireLock(
      'distributed_locks',
      `panel_${sanitizedPanelKey}`,
      candidateId,
      { slotId, panelKey: sanitizedPanelKey }
    );

    if (!panelLock.success) {
      // Rollback slot lock
      await this.releaseLock('distributed_locks', `slot_${slotId}`);
      return {
        success: false,
        errorCode: 'CONCURRENCY_CONFLICT',
        message: 'Panel schedule conflict detected. The interview panel is already locked.'
      };
    }

    // 4. Construct confirmed slot document
    const nowIso = new Date().toISOString();
    const confirmedSlotData: InterviewSlotDocument = {
      id: slotId,
      hiringDriveId,
      applicationId,
      candidateId,
      date,
      time,
      reportingTime: '30 mins prior to interview time',
      location,
      roomOrPanel: venue,
      venueAddress: `Excelsoft Technologies, ${location}`,
      instructions: [
        'Urgent Replacement Slot confirmed via Distributed Transaction Lock.',
        'Report strictly 30 minutes in advance with original photo ID and resume copies.',
        'Display your NIYOJAN In-App QR Pass at check-in.'
      ],
      isLocked: true,
      lockedUntil: new Date(Date.now() + 86400000).toISOString(),
      isCheckInOpen: true,
      attendanceVerified: false,
      qrTokenHash: `NIYOJAN_REPL_${candidateId}_${Date.now()}`,
      otpCode: Math.floor(100000 + Math.random() * 900000).toString(),
      createdAt: nowIso
    };

    await interviewSlotsRepository.create(slotId, confirmedSlotData);

    return {
      success: true,
      data: confirmedSlotData,
      message: 'Replacement interview slot confirmed via distributed database transaction.'
    };
  }

  /**
   * Atomic Panel Allocation Guard: Prevents panel double-booking across multiple admin sessions/instances.
   */
  public static async allocatePanelTransaction(params: {
    panelKey: string;
    candidateId: string;
    slotId: string;
    venue: string;
    date: string;
    time: string;
  }): Promise<TransactionResult<boolean>> {
    const { panelKey, candidateId, slotId, venue, date, time } = params;
    const sanitizedKey = panelKey.replace(/[^a-zA-Z0-9]/g, '_');

    const result = await this.acquireLock(
      'distributed_locks',
      `panel_${sanitizedKey}`,
      candidateId,
      { slotId, panelKey: sanitizedKey, venue, date, time }
    );

    if (!result.success) {
      return {
        success: false,
        errorCode: 'CONCURRENCY_BLOCKED',
        message: `Panel ${panelKey} is already allocated to another interview.`
      };
    }

    return { success: true, data: true, message: 'Panel allocation lock secured in SQLite database.' };
  }

  /**
   * Duplicate application prevention transaction using database-backed idempotency keys.
   */
  public static async registerApplicationTransaction(params: {
    candidateId: string;
    hiringDriveId: string;
  }): Promise<TransactionResult<boolean>> {
    const { candidateId, hiringDriveId } = params;
    const idempotencyKey = `app_${candidateId}_${hiringDriveId}`;

    const result = await this.acquireLock(
      'idempotency_keys',
      idempotencyKey,
      candidateId,
      { hiringDriveId, appliedAt: new Date().toISOString() }
    );

    if (!result.success) {
      return {
        success: false,
        errorCode: 'DUPLICATE_APPLICATION',
        message: 'You have already submitted an application for this hiring drive.'
      };
    }

    return { success: true, data: true, message: 'Idempotency verified in SQLite database.' };
  }
}
