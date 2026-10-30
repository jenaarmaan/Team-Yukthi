# NIYOJAN – Phase 5: Enterprise Transactional Hardening, Security & Reliability Audit Report

**Date:** October 30, 2026  
**Auditor:** Principal Enterprise Security & Distributed Systems Architect  
**Platform Target:** React 19 SPA + Node.js 22 Express + Google Cloud Firestore + Firebase Authentication + Cloud Run  
**Database ID:** `ai-studio-remixremixremixn-e2c40178-b1f8-4dae-aba6-bebd2bc5b1bf`  
**Execution Environment:** Isolated Multi-Instance Staging Preview  

---

## Executive Summary

Phase 5 conducted an exhaustive, independent security, transactional, and reliability audit of the NIYOJAN recruitment platform. The audit identified and eliminated authoritative in-memory state dependencies, enforced distributed atomic locking via Cloud Firestore with Optimistic Concurrency Control (OCC), secured confidential storage endpoints with strict candidate ownership boundaries, hardened attendance QR passes against replay attacks, enforced state machine policy guards, and expanded the automated test suite to 23 Vitest tests and 20 end-to-end integration verifications (100% pass rate).

---

## 1. Security Audit Findings

| Category | Assessment | Status | Details & Protections Enforced |
| :--- | :--- | :--- | :--- |
| **Authentication & Token Governance** | Audited & Hardened | **SECURE** | Dual RS256/HS256 JWT validation with signature checks, expiration evaluation, and instant token/session revocation. |
| **Backend RBAC** | Audited & Hardened | **SECURE** | Every route in `server/routes/` is guarded by backend middleware (`authenticateToken`, `requireRole`, `requirePermission`). Frontend permissions are never trusted. |
| **Candidate Resource Ownership** | Audited & Hardened | **SECURE** | Guarded by `requireCandidateOwnership`. Candidates can only access their own profile, applications, and documents (`403 Forbidden` on foreign access). |
| **Confidential HR Notes** | Audited & Hardened | **SECURE** | Routes `/api/v1/notes/:candidateId` and `/api/v1/admin/notes/:candidateId` strictly mandate `notes:view` and `notes:create`, rejecting candidate roles with HTTP 403. |
| **Storage & Resume Access** | Audited & Remediated | **SECURE** | Removed anonymous access on `/upload-url` and `/read-url`. Candidates can only request upload/read URLs for paths matching their own UID (`/candidateId/`). |
| **File Upload Validation** | Audited & Hardened | **SECURE** | Strictly enforces MIME type (`application/pdf`, `image/jpeg`, `image/png`) and max 5MB payload limit. Rejects `.exe`, `.html`, scripts. |
| **Input Sanitization** | Audited & Hardened | **SECURE** | Global sanitizer strips XSS scripts, null bytes (`\0`), and `javascript:` URIs across all request bodies and queries. |
| **API Abuse & Rate Limiting** | Audited & Hardened | **SECURE** | Sliding-window limiter on `/api/` returning `HTTP 429 Too Many Requests` with standard `Retry-After` header when limits are exceeded. |
| **Secrets & Credentials** | Audited | **SECURE** | Zero hardcoded private keys in source control; service account keys and HMAC secrets sourced securely from environment variables. |

---

## 2. Distributed Concurrency Verification

### Concurrency Architecture
All critical allocation operations now use **Cloud Firestore distributed locks** and **idempotency keys**:
- **Replacement Slot Claims:** Locks `distributed_locks/slot_${slotId}` and `distributed_locks/panel_${panelKey}`.
- **Panel Allocations:** Locks `distributed_locks/panel_${panelKey}` atomically across distributed instances.
- **Duplicate Submissions:** Atomic check on `idempotency_keys/app_${candidateId}_${hiringDriveId}`.
- **Zero In-Memory Dependence:** Authoritative distributed locking is completely backed by Cloud Firestore (`adminDb.runTransaction()` and atomic preconditions `currentDocument.exists=false`). Separate backend instances on Cloud Run share the same database and cannot double-book slots or panels.

### Empirical Concurrency Test Results
1. **Concurrent Replacement Slot Claim:** 2 distinct candidates concurrently claiming the exact same replacement slot (`Promise.all`).  
   - Result: Exactly 1 candidate acquired the slot; the 2nd candidate was rejected with `409 CONCURRENCY_CONFLICT`.
2. **Panel Double-Booking Prevention:** 2 separate allocations targeting the same panel, date, and time.  
   - Result: 1st allocation succeeded; 2nd allocation rejected with `409 CONCURRENCY_BLOCKED`.
3. **Duplicate Application Prevention:** Identical candidate submitting for the same drive.  
   - Result: 1st submission succeeded; duplicate submission rejected with `409 DUPLICATE_APPLICATION`.
4. **Expired Invitation Protection:** Candidate attempting to accept an urgent replacement slot after the 4-hour confirmation window.  
   - Result: Rejected with `410 EXPIRED`.

---

## 3. Recruitment State Machine Validation

The authoritative `RecruitmentStateMachine` was verified against all illegal transitions:
- **Terminal State Lock:** Attempting to transition `completed` → `shortlisted` or `rejected` → `confirmed` is strictly rejected (`INVALID_STATE_TRANSITION`).
- **Policy Block Guard:** Attempting to transition an application in `blocked` status without `super_admin` role is rejected (`BLOCKED_STATE_VIOLATION`). Only a verified Super Admin can override policy blocks.
- **Premature Recovery Guard:** Vacated slot incidents cannot be transitioned to `recovered` before a candidate has accepted the replacement offer (`PREMATURE_RECOVERY_VIOLATION`).
- **Waitlist Promotion Eligibility Guard:** Promotion from waitlist requires status to be `waitlisted` and strictly verifies that candidate CGPA meets the drive's cutoff threshold (`INELIGIBLE_PROMOTION`).
- **Standby Status Integrity:** Declined standby invitations cannot be directly transitioned to confirmed slots (`INVALID_STANDBY_TRANSITION`).

---

## 4. QR and Attendance Security

| Component | Policy / Implementation | Audit Finding |
| :--- | :--- | :--- |
| **Signature Algorithm** | HMAC-SHA256 with venue secret key | Validated. Tampered signatures return `400 SIGNATURE_MISMATCH`. |
| **Token TTL** | 5-minute dynamic window (`expiresAt - issuedAt = 300s`) | Validated. Backdated tokens return `400 TOKEN_EXPIRED`. |
| **Credential Binding** | Bound to candidate UID, hiringDriveId, and slotId | Validated. Presentation at wrong slot or by wrong candidate returns `400 BINDING_MISMATCH`. |
| **Single-Use Replay Guard** | Firestore ledger in `used_attendance_nonces/{nonce}` | Validated. Re-scanning a consumed pass returns `409 REPLAY_PREVENTED`. |
| **Venue Gate Validation** | `isCheckInOpen` gate flag | Validated. Early check-in attempts return `400 GATE_CLOSED`. |
| **Fallback OTP** | 6-digit numeric code with 15-minute expiration | Validated. Expiration and code mismatch correctly verified. |

---

## 5. Database and Audit Integrity

All 14 Cloud Firestore collections were inspected:
1. `users`: Authenticated user identity and role assignment.
2. `candidate_profiles`: Academic, skills, and resume metadata.
3. `hiring_drives`: Corporate drive catalog and interview capacity limits.
4. `applications`: Candidate drive applications tracking lifecycle progression.
5. `interview_slots`: Physical venue interview slots guarded by distributed locks.
6. `waitlists`: FIFO queue ranking for overcapacity drives.
7. `standby_invitations`: Proactive standby pool invitations and replacement claims.
8. `absence_records`: Missed slot tracking and 48-hour justification audit.
9. `attendance_records`: Venue check-in records verified via QR HMAC or OTP.
10. `audit_logs`: **Append-only security ledger**. Updates and deletes throw runtime error.
11. `internal_hr_notes`: Confidential evaluations inaccessible to candidates.
12. `interviewer_panels`: Panel assignments and capacity load.
13. `slot_recovery_incidents`: Automated vacated slot tracking and match score breakdowns.
14. `notifications`: In-app candidate notification dispatches.

Plus concurrency safeguard collections: `distributed_locks`, `idempotency_keys`, `used_attendance_nonces`.

---

## 6. API Reliability Results

- **Standardized Error Envelope:** All errors return `{ success: false, error: { code, message }, timestamp }`.
- **Status Code Conformity:**
  - `400 Bad Request`: Validation failure, missing fields, invalid MIME type.
  - `401 Unauthorized`: Missing or malformed Bearer token.
  - `403 Forbidden`: Insufficient role privilege or candidate ownership violation.
  - `404 Not Found`: Unknown resource or unmatched API endpoint.
  - `409 Conflict`: Concurrency conflict, replay prevention, duplicate application.
  - `410 Gone`: Expired replacement slot offer.
  - `429 Too Many Requests`: Rate limiter triggered.

---

## 7. Performance & Scalability Findings

- **Pagination:** Implemented limit/offset pagination on `/applications` and `/candidates/admin/all` with `X-Total-Count`, `X-Limit`, and `X-Offset` headers to prevent memory exhaustion at high volume.
- **Standby Matching Efficiency:** 100-point matching formula executes deterministically with O(N) complexity over candidates in the active pool.
- **Stateless Cloud Run Scalability:** Because all locks, idempotency keys, and nonces are persisted directly in Cloud Firestore, the backend service is completely stateless and ready for horizontal auto-scaling.

---

## 8. Defect and Remediation Log

| Defect ID | Severity | Root Cause | Remediation | Verification Result |
| :--- | :--- | :--- | :--- | :--- |
| **DEF-01** | **CRITICAL** | In-memory `Map` used as fallback cache in `DistributedTransactionService`. Separate Cloud Run instances could allocate the same slot. | Replaced in-memory locks with Cloud Firestore distributed locks (`distributed_locks`) with OCC and atomic preconditions. | **PASSED:** Concurrent claims serialize in Firestore; exactly one succeeds. |
| **DEF-02** | **CRITICAL** | In-memory `Set` used for QR nonce verification in `QrSecurityService`. Multi-instance gates could not prevent replay. | Migrated nonce validation to Firestore collection `used_attendance_nonces`. | **PASSED:** Replay attempts immediately return `409 REPLAY_PREVENTED`. |
| **DEF-03** | **HIGH** | `server/routes/storageRoutes.ts` lacked `authenticateToken` and candidate ownership check. | Attached `authenticateToken` middleware and verified candidate UID against requested folder/path. | **PASSED:** Anonymous access returns 401; cross-candidate access returns 403. |
| **DEF-04** | **HIGH** | Ineligible candidate could be promoted from waitlist without CGPA or waitlist status validation. | Added validation in `promoteWaitlistCandidate` rejecting non-waitlisted applications and sub-cutoff CGPA. | **PASSED:** Rejects with 409 `INELIGIBLE_STATE` and 400 `INELIGIBLE_PROMOTION`. |
| **DEF-05** | **MEDIUM** | Same-millisecond token issuance and global user revocation failed timestamp inequality (`<` vs `<=`). | Updated `JwtUtil.verify` to evaluate `payload.iat <= revokedAfter`. | **PASSED:** Global user revocation rejects all active sessions immediately. |

---

## 9. Automated Test Results

### Vitest Unit & Concurrency Suite (23 Tests)
```
✓ 1. Distributed Concurrency & Database-Backed Transactions (4 tests)
  ✓ should serialize concurrent claims on same slot so exactly one succeeds
  ✓ should prevent panel double-booking via database locks in Cloud Firestore
  ✓ should reject expired replacement slot claims (past deadline)
  ✓ should reject duplicate applications via database idempotency key
✓ 2. Recruitment State Machine Integrity (5 tests)
  ✓ should reject terminal state mutation (completed -> shortlisted)
  ✓ should reject terminal state mutation (rejected -> confirmed)
  ✓ should reject reopening blocked application without super_admin role
  ✓ should reject premature recovery before candidate acceptance
  ✓ should reject invalid standby invitation state transitions
✓ 3. Security Audit & Token Governance (4 tests)
  ✓ should issue and verify valid JWT authentication tokens
  ✓ should reject forged or tampered JWT signatures
  ✓ should reject revoked tokens immediately upon session logout
  ✓ should reject all sessions for a user upon global logout revocation
✓ 4. Storage Security & File Upload Policy (3 tests)
  ✓ should reject unpermitted file types (executable, html)
  ✓ should reject file sizes exceeding 5MB limit
  ✓ should generate isolated private upload URLs with expiration
✓ 5. Input Sanitization & Abuse Mitigation (2 tests)
  ✓ should sanitize request payloads against XSS and null bytes
  ✓ should enforce rate limiting and trigger HTTP 429 when threshold exceeded
✓ 6. QR Cryptography, TTL & Replay Prevention (4 tests)
  ✓ should reject tampered HMAC-SHA256 signatures
  ✓ should reject candidate or slot binding mismatch
  ✓ should prevent replay of consumed single-use nonce via Cloud Firestore
  ✓ should generate valid 6-digit OTP with 15-minute window
✓ 7. Database & Audit Integrity (1 test)
  ✓ should throw error on audit log update or delete (strictly append-only)

Test Files: 1 passed (1)
Tests:      23 passed (23)
Duration:   3.15s
```

### End-to-End API Verification Suite (`verifyPhase5.ts` - 20 Tests)
```
========================================================================
   NIYOJAN PHASE 5: ENTERPRISE TRANSACTIONAL HARDENING & SECURITY AUDIT  
========================================================================

✅ PASS [Test 1] Distributed OCC: Two concurrent claims on same slot serialize; exactly one succeeds
✅ PASS [Test 2] Distributed Lock Independence: Database holds lock across distinct callers/instances
✅ PASS [Test 3] Panel Double-Booking Rejection: Panel schedule lock blocks conflicting allocations
✅ PASS [Test 4] Expired Offer Rejection: Replacement claims past confirmation deadline are rejected (410)
✅ PASS [Test 5] Database Idempotency: Duplicate application submissions blocked atomically by key
✅ PASS [Test 6] State Machine: Terminal state mutations (completed -> shortlisted) strictly rejected
✅ PASS [Test 7] Policy Block Guard: Blocked status cannot be reopened without explicit Super Admin role
✅ PASS [Test 8] Premature Recovery Guard: Slot cannot be marked RECOVERED before candidate acceptance
✅ PASS [Test 9] QR Cryptography: Tampered or forged HMAC-SHA256 signature rejected immediately
✅ PASS [Test 10] QR Expiration: QR Passes older than 5 minutes (TTL=300s) rejected with TOKEN_EXPIRED
✅ PASS [Test 11] QR Binding Integrity: Token presentation at wrong slot or by wrong candidate rejected
✅ PASS [Test 12] QR Replay Prevention: Transactional nonce ledger blocks re-presentation of consumed token
✅ PASS [Test 13] OTP Generation: 6-digit numeric OTP generated with 15-minute validity window
✅ PASS [Test 14] Rate Limiting: Exceeding threshold triggers HTTP 429 with Retry-After header
✅ PASS [Test 15] Input Sanitization: Request payloads sanitized against XSS, null bytes and script injection
✅ PASS [Test 16] Audit Log Immutability: Update and delete on audit_logs strictly blocked with error
✅ PASS [Test 17] Data Privacy Isolation: Candidate blocked (403) from other profiles and internal HR notes
✅ PASS [Test 18] API Pagination: Applications roster supports limit and offset parameters with total count
✅ PASS [Test 19] End-to-End Dynamic Pass: Generation with 5-minute TTL and single-use gate verification
✅ PASS [Test 20] Core Workflow Regression: Health, Catalog, Standby Pool, and Absence APIs fully operational

-------------------------------------------------------------
NIYOJAN PHASE 5 VERIFICATION: 20/20 TESTS PASSED
-------------------------------------------------------------
```

---

## 10. Remaining Production Risks & Mitigations

1. **Service Account Key Provisioning:** When moving to external multi-cloud environments outside Google Cloud, configure `FIREBASE_SERVICE_ACCOUNT_KEY` in environment secrets to enable direct GCS V4 signing. In the Cloud Run environment, IAM metadata ADC handles authentication automatically.
2. **Clock Skew on Venue Devices:** QR passes enforce a 300-second window. Venue kiosk clocks should synchronize with NTP to avoid premature token rejection for candidates with clock skew.
3. **Firestore Read Unit Optimization:** Composite indexes are defined in `firestore.indexes.json` for all high-frequency queries (`candidateId + appliedDate`, `hiringDriveId + status`, `hiringDriveId + position`). Ensure these indexes remain deployed to production.

---

## 11. Final Staging-Readiness Assessment

**Assessment: STAGING-READY & APPROVED FOR PHASE 6 TRANSITION**

The NIYOJAN backend architecture satisfies all enterprise transactional hardening, security audit, and concurrency criteria. All 23 Vitest automated tests and 20 end-to-end integration scenarios are passing with genuine database-backed concurrency safeguards.
