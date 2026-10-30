# NIYOJAN – Full-Stack Backend Architecture and Migration Plan

**Document Version:** 1.0.0  
**Target Architecture:** Node.js + Express (TypeScript) · Firebase Firestore · Firebase Authentication · Cloud Storage · Google Cloud Run  
**Author:** Principal Software Architect & Lead Systems Engineer  
**Date:** October 30, 2026  

---

## 1. Current Architecture Assessment

### 1.1 Existing System Topology
The current NIYOJAN application is built as a single-page React 19 application bundled with Vite 8.
- **Client Runtime:** Runs in the user's browser, housing both the **Candidate-Facing Mobile Application** (390×844px mobile viewport) and the **HR Admin Command Center** (1440px SaaS dashboard).
- **State Store:** `RecruitmentService` (implemented in `src/services/storageService.ts`) acts as an in-memory singleton. Mutations trigger reactivity via a publish-subscribe listener mechanism (`subscribe() / notify()`).
- **Persistence:** Serialized synchronously to browser `localStorage` across 8 keys (`niyojan_personas_data_v1`, `niyojan_hiring_drives_v1`, `niyojan_internal_notes_v1`, etc.).
- **Authentication:** Simulated persona switching (`confirmed`, `waitlisted`, `standby`, `absent`, `new_applicant`) stored in memory.
- **Authorization:** Client-side role switcher evaluating `AdminRole` (`super_admin`, `hr_admin`, `recruitment_manager`, `interview_coordinator`, `interviewer`).
- **Concurrency & Locking:** Handled in the browser heap using `claimedSlotIds: Set<string>` and `venuePanelLocks: Map<string, string>`.

### 1.2 Limitations for Enterprise Production
1. **No Shared Database Across Clients:** Candidate actions on Device A do not reflect on HR Dashboard on Device B in real time.
2. **Client-Side Authorization Vulnerability:** Admin permission checks execute in client JavaScript; an attacker can execute arbitrary mutations via browser console.
3. **In-Memory Concurrency Scope:** Double-booking prevention works only within a single browser tab. True concurrent submissions from different devices result in race conditions.
4. **Simulated External Integrations:** QR codes use non-cryptographic timestamp tokens; push notifications, SMS, and email alerts are simulated tags without real gateway dispatches.
5. **No File Binary Storage:** Candidate resumes and medical absence justifications store only filenames rather than encrypted, virus-scanned cloud storage objects.

---

## 2. Target System Architecture

```
+-----------------------------------------------------------------------------------+
|                                CLIENT VIEWPORTS                                   |
|   +------------------------------------+   +----------------------------------+   |
|   |   Candidate Mobile App (390px)     |   |    HR Admin Portal (1440px)      |   |
|   |  - QR Attendance & OTP Pass        |   |   - Command Overview & Analytics |   |
|   |  - Application Stage Tracker       |   |   - Hiring Drives & Schedulers   |   |
|   |  - Standby Replacement Claims      |   |   - Absence Governance Panel     |   |
|   |  - Justification File Uploads      |   |   - Self-Healing Slot Recovery   |   |
|   +-----------------+------------------+   +-----------------+----------------+   |
+---------------------|----------------------------------------|--------------------+
                      | HTTPS (REST + Bearer JWT Token)        |
                      v                                        v
+-----------------------------------------------------------------------------------+
|                         GOOGLE CLOUD RUN API GATEWAY                              |
|   +---------------------------------------------------------------------------+   |
|   | Node.js 22 LTS + Express + TypeScript Router                              |   |
|   |                                                                           |   |
|   | [Middlewares]                                                             |   |
|   |  - CORS & Helmet Security Headers                                         |   |
|   |  - Rate Limiter (express-rate-limit)                                      |   |
|   |  - Firebase Auth Token Verification Middleware (firebase-admin)           |   |
|   |  - RBAC Middleware (requirePermission(permission))                        |   |
|   |  - Request Validation (Zod schemas)                                       |   |
|   |                                                                           |   |
|   | [Controllers & Domain Services]                                           |   |
|   |  - Auth & Profile Controller         - Hiring Drive Controller            |   |
|   |  - Application Lifecycle Controller  - Slot Recovery & Standby Engine     |   |
|   |  - QR / OTP Attendance Controller    - Absence Governance Controller      |   |
|   |  - Concurrency Lock Service          - Audit Logging Engine               |   |
|   +---------------------------------------------------------------------------+   |
+--------------------------------------|--------------------------------------------+
                                       |
    +----------------------------------+----------------------------------+
    |                                  |                                  |
    v                                  v                                  v
+-----------------------+  +-----------------------+  +-----------------------+
|  FIREBASE FIRESTORE   |  |     FIREBASE AUTH     |  | CLOUD STORAGE FOR GCS |
| - Real-time listeners |  | - Email/Password & OTP|  | - Encrypted PDF/Resumes|
| - ACID Transactions   |  | - Custom Claims (RBAC)|  | - Signed URLs (15 min)|
| - Row-level security  |  | - Revocable sessions  |  | - Virus scan triggers |
+-----------------------+  +-----------------------+  +-----------------------+
```

---

## 3. Firestore Database Schema

### 3.1 `users`
*Represents authenticated system actors (Candidates, Admins, Interviewers).*
```typescript
interface UserDocument {
  uid: string; // Firebase Auth UID
  email: string;
  phone: string;
  role: 'candidate' | 'super_admin' | 'hr_admin' | 'recruitment_manager' | 'interview_coordinator' | 'interviewer';
  displayName: string;
  avatarInitials: string;
  department?: string; // For HR & Interviewers
  isActive: boolean;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

### 3.2 `candidate_profiles`
*Extends `users` for candidates.*
```typescript
interface CandidateProfileDocument {
  id: string; // Same as User UID
  candidateType: 'fresher' | 'experienced';
  fullName: string;
  email: string;
  phone: string;
  currentLocation: string;
  preferredLocations: string[];
  education: {
    institution: string;
    degree: string;
    branch: string;
    yearOfPassing: number;
    cgpa: number;
    percentage?: number;
  };
  workExperience?: {
    years: number;
    currentCompany?: string;
    currentDesignation?: string;
    noticePeriodDays?: number;
  };
  skills: {
    id: string;
    name: string;
    category: 'language' | 'framework' | 'database' | 'tool' | 'core';
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    verificationLevel: 'self_declared' | 'assessment_verified' | 'hr_verified';
    verifiedAt?: FirebaseFirestore.Timestamp;
  }[];
  verificationStatus: 'pending' | 'verified' | 'action_required';
  profileCompletionPercentage: number;
  resumeStorageUrl?: string; // gs://bucket/resumes/{uid}.pdf
  resumeOriginalName?: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

### 3.3 `hiring_drives`
```typescript
interface HiringDriveDocument {
  id: string; // e.g. drive_excelsoft_gse_2026
  title: string;
  company: string;
  role: string;
  candidateType: 'fresher' | 'experienced';
  locations: string[];
  startDate: string;
  endDate: string;
  interviewCapacity: number;
  currentRegistrations: number;
  mandatorySkills: string[];
  preferredSkills: string[];
  minimumCgpa: number;
  requiredDegree: string[];
  description: string;
  status: 'active' | 'upcoming' | 'completed' | 'paused';
  stages: {
    step: number;
    title: string;
    description: string;
  }[];
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

### 3.4 `applications`
```typescript
interface ApplicationDocument {
  id: string;
  candidateId: string;
  hiringDriveId: string;
  hiringDriveTitle: string;
  role: string;
  company: string;
  appliedLocation: string;
  appliedDate: FirebaseFirestore.Timestamp;
  status: 'registered' | 'shortlisted' | 'waitlisted' | 'standby' | 'confirmed' | 'under_review' | 'completed' | 'rejected' | 'blocked';
  stages: {
    step: number;
    title: string;
    description: string;
    status: 'completed' | 'current' | 'pending';
    date?: string;
  }[];
  statusHistory: {
    status: string;
    timestamp: FirebaseFirestore.Timestamp;
    note: string;
  }[];
  interviewSlotId?: string;
  rejectionReason?: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

### 3.5 `interview_slots`
*Represents discrete physical venue panels.*
```typescript
interface InterviewSlotDocument {
  id: string;
  hiringDriveId: string;
  applicationId?: string; // Locked candidate
  candidateId?: string;
  date: string; // ISO date 'YYYY-MM-DD'
  time: string; // '10:00 AM - 11:00 AM IST'
  reportingTime: string;
  location: string; // 'Mysuru Campus'
  roomOrPanel: string; // 'Panel 1 (Assessment Room A)'
  venueAddress: string;
  instructions: string[];
  isLocked: boolean; // Concurrency mutex
  lockedUntil?: FirebaseFirestore.Timestamp;
  isCheckInOpen: boolean;
  attendanceVerified: boolean;
  checkedInAt?: FirebaseFirestore.Timestamp;
  qrTokenHash: string; // SHA-256 hash of HMAC signed token
  otpCode: string; // 6 digits
  createdAt: FirebaseFirestore.Timestamp;
}
```

### 3.6 `waitlist_entries`
```typescript
interface WaitlistEntryDocument {
  id: string;
  hiringDriveId: string;
  applicationId: string;
  candidateId: string;
  position: number;
  totalInQueue: number;
  status: 'active' | 'promoted_to_confirmed' | 'expired';
  potentialBatchDate: string;
  promotedAt?: FirebaseFirestore.Timestamp;
  createdAt: FirebaseFirestore.Timestamp;
}
```

### 3.7 `standby_invitations`
```typescript
interface StandbyInvitationDocument {
  id: string;
  hiringDriveId: string;
  applicationId: string;
  candidateId: string;
  location: string;
  invitationStatus: 'pending_response' | 'accepted' | 'declined' | 'replacement_offered' | 'confirmed_slot';
  invitedAt: FirebaseFirestore.Timestamp;
  responseDeadline: FirebaseFirestore.Timestamp; // 48 hours
  respondedAt?: FirebaseFirestore.Timestamp;
  replacementSlot?: {
    slotId: string;
    date: string;
    time: string;
    venue: string;
    confirmationDeadline: FirebaseFirestore.Timestamp; // 4 hours
    acceptedAt?: FirebaseFirestore.Timestamp;
  };
  createdAt: FirebaseFirestore.Timestamp;
}
```

### 3.8 `absence_records`
```typescript
interface AbsenceRecordDocument {
  id: string;
  applicationId: string;
  hiringDriveId: string;
  interviewSlotId: string;
  candidateId: string;
  candidateType: 'fresher' | 'experienced';
  missedDate: FirebaseFirestore.Timestamp;
  deadlineForExplanation: FirebaseFirestore.Timestamp; // 48 hours
  explanationReason?: string;
  supportingDocStorageUrl?: string;
  supportingDocName?: string;
  submittedAt?: FirebaseFirestore.Timestamp;
  status: 'missed_unexplained' | 'explanation_submitted' | 'ratified' | 'blocked';
  hrReviewNotes?: string;
  reviewedByAdminId?: string;
  reviewedAt?: FirebaseFirestore.Timestamp;
  createdAt: FirebaseFirestore.Timestamp;
}
```

### 3.9 `vacant_slot_recoveries`
```typescript
interface VacantSlotRecoveryDocument {
  id: string;
  vacantSlotId: string;
  hiringDriveId: string;
  role: string;
  venue: string;
  slotDate: string;
  slotTime: string;
  vacatedByCandidateId: string;
  vacatedByCandidateName: string;
  vacatedReason: 'no_show' | 'candidate_cancelled' | 'rescheduled';
  detectedAt: FirebaseFirestore.Timestamp;
  status: 'vacant' | 'invitations_dispatched' | 'recovered' | 'unfilled';
  matchedStandbyCandidateId?: string;
  matchedStandbyCandidateName?: string;
  matchScore?: number;
  matchScoreBreakdown?: {
    skills: number;
    location: number;
    academic: number;
    availability: number;
  };
  candidateResponseDeadline?: FirebaseFirestore.Timestamp;
  recoveredAt?: FirebaseFirestore.Timestamp;
}
```

### 3.10 `notifications`
```typescript
interface NotificationDocument {
  id: string;
  candidateId: string;
  type: string;
  title: string;
  message: string;
  timestamp: FirebaseFirestore.Timestamp;
  isRead: boolean;
  deliveryChannel: 'in_app' | 'fcm' | 'sms' | 'email';
  isSimulatedExternal: boolean;
  actionRoute?: {
    tab: string;
    subView?: string;
    targetId?: string;
  };
}
```

### 3.11 `interviewers`
```typescript
interface InterviewerDocument {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  skills: string[];
  assignedPanel: string;
  location: string;
  activeInterviewsCount: number;
  availableDays: string[];
  createdAt: FirebaseFirestore.Timestamp;
}
```

### 3.12 `internal_notes`
```typescript
interface InternalNoteDocument {
  id: string;
  candidateId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  note: string;
  createdAt: FirebaseFirestore.Timestamp;
}
```

### 3.13 `audit_logs`
```typescript
interface AuditLogDocument {
  id: string;
  timestamp: FirebaseFirestore.Timestamp;
  action: string;
  actorId: string;
  actorRole: string;
  targetId: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}
```

---

## 4. Complete REST API Specification

All endpoints are prefixed with `/api/v1` and require an `Authorization: Bearer <Firebase_ID_Token>` header unless marked Public.

### 4.1 Authentication & Profile
- `POST /api/v1/auth/register-candidate` (Public)
  - **Body:** `{ fullName, email, password, phone, candidateType, currentLocation, preferredLocations, degree, branch, cgpa, skills }`
  - **Action:** Creates Firebase Auth account, writes `users` and `candidate_profiles` doc.
- `GET /api/v1/candidates/me` (Role: `candidate`)
  - **Returns:** Candidate profile, active applications, notifications count.
- `PUT /api/v1/candidates/me` (Role: `candidate`)
  - **Body:** Partial updates (education, skills, preferences).
- `POST /api/v1/candidates/me/resume` (Role: `candidate`)
  - **Action:** Generates signed GCS upload URL; verifies MIME type `application/pdf`.

### 4.2 Hiring Drives & Eligibility
- `GET /api/v1/drives` (Public / Candidate / Admin)
  - **Query:** `?candidateType=fresher&location=Mysuru`
- `GET /api/v1/drives/:id` (Authenticated)
- `POST /api/v1/drives` (Role: `super_admin`, `hr_admin`, `recruitment_manager`)
  - **Body:** Drive specification, capacity limits, skill prerequisites.
- `PUT /api/v1/drives/:id` (Role: `super_admin`, `hr_admin`, `recruitment_manager`)
- `POST /api/v1/drives/:id/check-eligibility` (Role: `candidate`)
  - **Returns:** `{ isEligible: boolean, reasons: string[], score: number }`

### 4.3 Applications & Capacity Management
- `POST /api/v1/drives/:id/apply` (Role: `candidate`)
  - **Body:** `{ preferredLocation: string }`
  - **Atomic Behavior:** Checks `currentRegistrations < interviewCapacity`.
    - If capacity available: increments count, creates `status: 'shortlisted'`.
    - If capacity full: creates `status: 'waitlisted'`, writes `waitlist_entries` with sequential `position`.
- `GET /api/v1/applications/my-applications` (Role: `candidate`)
- `GET /api/v1/admin/applications` (Admin Roles)
  - **Query:** `?driveId=...&status=waitlisted&page=1&limit=20`

### 4.4 Interview Scheduling & Concurrency Locks
- `POST /api/v1/admin/slots/allocate` (Role: `super_admin`, `hr_admin`, `interview_coordinator`)
  - **Body:** `{ applicationId, date, time, location, roomOrPanel }`
  - **Atomic Check:** Verifies no other slot exists for this panel/date/time. Mints QR token & OTP.
- `POST /api/v1/admin/waitlist/promote` (Role: `super_admin`, `hr_admin`, `recruitment_manager`)
  - **Body:** `{ applicationId, slotDate, slotTime, venue }`
  - **Atomic Check:** Promotes waitlist candidate, locks panel, shifts queue.

### 4.5 Standby Management & Self-Healing Recovery
- `POST /api/v1/admin/standby/invite` (Role: `super_admin`, `hr_admin`, `recruitment_manager`)
  - **Body:** `{ candidateId, hiringDriveId, location }`
- `POST /api/v1/standby/:invitationId/respond` (Role: `candidate`)
  - **Body:** `{ accept: boolean }`
- `POST /api/v1/standby/claim-replacement` (Role: `candidate`)
  - **Body:** `{ applicationId }`
  - **Atomic Check:** Validates `confirmationDeadline > now` and slot not in `claimedSlotIds`. Locks slot, updates status to `confirmed`.
- `GET /api/v1/admin/self-healing/rankings` (Admin Roles)
  - **Query:** `?driveId=...&venue=...`
  - **Returns:** Deterministic rankings with 4-tier score breakdown for all standby candidates.
- `POST /api/v1/admin/self-healing/dispatch` (Role: `super_admin`, `hr_admin`, `interview_coordinator`)
  - **Body:** `{ recoveryId, standbyCandidateId }`

### 4.6 QR & OTP Attendance Verification
- `POST /api/v1/attendance/verify` (Role: `super_admin`, `hr_admin`, `interview_coordinator`)
  - **Body:** `{ applicationId, method: 'qr' | 'otp', tokenOrCode: string }`
  - **Verification:**
    1. Replay prevention check: `if (slot.attendanceVerified) return 409 Conflict`.
    2. Gate check: `if (!slot.isCheckInOpen) return 403 Forbidden`.
    3. HMAC signature hash comparison.
    4. Sets `attendanceVerified = true` and `checkedInAt = timestamp`.
- `POST /api/v1/admin/attendance/manual` (Role: `super_admin`, `hr_admin`, `interview_coordinator`)
  - **Body:** `{ applicationId, status: 'present' | 'absent' }`

### 4.7 Absence Management & Governance
- `POST /api/v1/absence/submit-justification` (Role: `candidate`)
  - **Body:** `{ applicationId, reason, docStorageUrl }`
  - **Policy Rule:** Rejects freshers (fresher no-show rule applies).
- `POST /api/v1/admin/absence/decide` (Role: `super_admin`, `hr_admin`)
  - **Body:** `{ applicationId, decision: 'ratify' | 'reject', notes: string }`

---

## 5. RBAC Permission Matrix

| Operation / Endpoint | Super Admin | HR Admin | Recruitment Manager | Interview Coordinator | Interviewer | Candidate |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| View Hiring Drives |  |  |  |  |  |  |
| Apply to Drive / Check Eligibility |  |  |  |  |  |  |
| View Personal Applications & QR Pass |  |  |  |  |  |  |
| Accept / Decline Standby Offer |  |  |  |  |  |  |
| Claim Replacement Interview Slot |  |  |  |  |  |  |
| Submit Medical Absence Justification |  |  |  |  |  |  |
| Create / Edit Hiring Drive |  |  |  |  |  |  |
| Verify Candidate Skills & Profile |  |  |  |  |  |  |
| Promote Dynamic Waitlist Candidate |  |  |  |  |  |  |
| Dispatch Proactive Standby Invitation |  |  |  |  |  |  |
| Mark Venue Check-in (Scan QR / Enter OTP)|  |  |  |  |  |  |
| Trigger Self-Healing Recovery Dispatch|  |  |  |  |  |  |
| Ratify / Reject Candidate Absence |  |  |  |  |  |  |
| Add Internal Candidate Assessment Note |  |  |  |  |  |  |
| Manage Interviewer Directory Panels |  |  |  |  |  |  |
| Export Compliance & Audit Reports |  |  |  |  |  |  |

---

## 6. Transaction & Concurrency Design

All concurrent mutations execute within Firestore `runTransaction()` blocks:

### 6.1 Simultaneous Replacement Slot Claim (Atomic Mutex)
```typescript
await db.runTransaction(async (transaction) => {
  const slotRef = db.collection('interview_slots').doc(slotId);
  const appRef = db.collection('applications').doc(applicationId);
  const standbyRef = db.collection('standby_invitations').doc(standbyInvitationId);

  const slotDoc = await transaction.get(slotRef);
  const standbyDoc = await transaction.get(standbyRef);

  if (!slotDoc.exists || slotDoc.data()?.isLocked) {
    throw new ConcurrencyConflictError('Slot has already been claimed by another standby candidate.');
  }

  const standby = standbyDoc.data();
  if (new Date() > standby?.replacementSlot?.confirmationDeadline.toDate()) {
    throw new ExpiredOfferError('The 4-hour acceptance window for this slot has lapsed.');
  }

  // Atomic lock acquisition
  transaction.update(slotRef, {
    isLocked: true,
    applicationId,
    candidateId: standby.candidateId,
    lockedAt: FirebaseFirestore.FieldValue.serverTimestamp()
  });

  transaction.update(appRef, {
    status: 'confirmed',
    interviewSlotId: slotId,
    updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
  });

  transaction.update(standbyRef, {
    invitationStatus: 'confirmed_slot',
    'replacementSlot.acceptedAt': FirebaseFirestore.FieldValue.serverTimestamp()
  });
});
```

### 6.2 Drive Capacity & Automatic Waitlisting Transaction
```typescript
await db.runTransaction(async (transaction) => {
  const driveRef = db.collection('hiring_drives').doc(driveId);
  const driveDoc = await transaction.get(driveRef);
  const drive = driveDoc.data();

  if (drive.currentRegistrations < drive.interviewCapacity) {
    transaction.update(driveRef, {
      currentRegistrations: FirebaseFirestore.FieldValue.increment(1)
    });
    // Create Shortlisted Application
  } else {
    // Capacity reached: Atomically query next queue position
    const waitlistQuery = db.collection('waitlist_entries')
      .where('hiringDriveId', '==', driveId)
      .where('status', '==', 'active');
    const snapshot = await transaction.get(waitlistQuery);
    const nextPosition = snapshot.size + 1;

    // Create Waitlisted Application with exact position
  }
});
```

---

## 7. Security Architecture

### 7.1 Cryptographic QR Code Verification & Anti-Replay
1. **Token Generation:**  
   $Token = Payload + HMAC\_SHA256(Payload, SECRET\_KEY)$  
   Where $Payload = applicationId + candidateId + slotId + driveId + expiryUnix$
2. **Server-Side Validation:**  
   Backend recalculates HMAC. If signature matches and $now < expiryUnix$, verifies slot document.
3. **Replay Prevention:**  
   If `slotDoc.attendanceVerified === true`, rejects immediately with HTTP 409 Conflict and records security alert in `audit_logs`.

### 7.2 Secure File Upload Architecture
- Candidate uploads directly to private Cloud Storage bucket via **Signed V4 URLs** (valid for 15 minutes).
- Backend validates file headers (`Content-Type: application/pdf`, max size 5 MB).
- Files stored at `/documents/{driveId}/{candidateId}/{uuid}.pdf`.
- HR views documents via short-lived signed read URLs. No public access granted.

---

## 8. Migration Roadmap (Phased Execution)

```
+-------------------------------------------------------------------------------+
| PHASE 1: Backend Scaffolding & Express Applet Bridge                         |
| - Create server.ts mounting Express API routes alongside Vite dev middleware. |
| - Configure Firebase Admin SDK and environment variables.                     |
|                                                                               |
| PHASE 2: Firestore Database Bootstrapping & Seed Migration                    |
| - Provision collections matching the 13 defined schemas.                      |
| - Seed initial drives, interviewers, and persona templates.                   |
|                                                                               |
| PHASE 3: Authentication & RBAC Middleware                                     |
| - Connect Firebase Auth client-side SDK.                                      |
| - Implement server token verification middleware and role assertion.          |
|                                                                               |
| PHASE 4: Core Transactional Endpoints Implementation                          |
| - Implement slot allocation, standby claim mutex, and attendance validation.  |
| - Wire deterministic matching engine into /self-healing endpoint.             |
|                                                                               |
| PHASE 5: Frontend API Client Adapter Layer                                    |
| - Create src/services/apiClient.ts mirroring recruitmentService methods.      |
| - Seamless transition without altering React components or styling.           |
|                                                                               |
| PHASE 6: Cloud Run Containerization & CI/CD                                   |
| - Write production multi-stage Dockerfile.                                    |
| - Configure Cloud Run deployment and Vitest/Playwright test pipelines.        |
+-------------------------------------------------------------------------------+
```

---

## 9. Testing & Deployment Plan

### 9.1 Vitest Unit & Integration Tests
- `tests/unit/matchingEngine.test.ts`: Deterministic 100-point formula tests.
- `tests/integration/concurrency.test.ts`: Parallel promise execution asserting 1 win and 1 conflict.
- `tests/integration/rbac.test.ts`: Matrix test across all 6 roles against protected routes.

### 9.2 Playwright E2E Tests
- Re-run Scenarios 1–7 in headless Chromium targeting the Express API backend.
- Mobile viewport test (390×844) validating touch interactions and QR rendering.

### 9.3 Cloud Run Production Dockerfile
```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
EXPOSE 8080
CMD ["npm", "run", "start"]
```

---

## 10. Source Files Map

### Files to Create:
1. `/server.ts` (Express server entry point mounting `/api/v1/*` routes)
2. `/server/config/firebase.ts` (Firebase Admin SDK initialization)
3. `/server/middlewares/auth.ts` (Token verification & RBAC check)
4. `/server/controllers/drivesController.ts`
5. `/server/controllers/applicationsController.ts`
6. `/server/controllers/standbyController.ts`
7. `/server/controllers/attendanceController.ts`
8. `/server/controllers/absenceController.ts`
9. `/server/services/matchingService.ts`
10. `/src/services/apiClient.ts` (Frontend HTTP client adapter)
11. `/Dockerfile` (Production container configuration)

### Files to Modify:
1. `package.json` (Add backend start scripts `"start": "node dist/server.js"`)
2. `src/services/storageService.ts` (Switch implementation to delegate to `apiClient` with fallback)
3. `.env.example` (Add `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, etc.)
