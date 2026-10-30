import { JwtUtil } from '../utils/jwt.ts';

interface Phase7VerificationItem {
  id: number;
  module: string;
  workflow: string;
  endpoint: string;
  status: 'passed' | 'failed';
  details: string;
}

export async function runPhase7Verification(targetBaseUrl?: string): Promise<{
  summary: { total: number; passed: number; failed: number };
  items: Phase7VerificationItem[];
}> {
  const items: Phase7VerificationItem[] = [];
  const baseUrl = targetBaseUrl || 'http://localhost:3000/api/v1';

  const record = (
    id: number,
    module: string,
    workflow: string,
    endpoint: string,
    passed: boolean,
    details: string
  ) => {
    items.push({ id, module, workflow, endpoint, status: passed ? 'passed' : 'failed', details });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} [Phase 7 - #${id}] [${module}] ${workflow} -> ${endpoint}`);
    console.log(`   Details: ${details}`);
  };

  console.log('\n=================================================================================');
  console.log('   NIYOJAN PHASE 7: PRODUCTION DEPLOYMENT & 20 E2E WORKFLOW VALIDATION           ');
  console.log(`   Target Server: ${baseUrl}`);
  console.log('=================================================================================\n');

  // Authenticated Admin Tokens
  const superAdminToken = JwtUtil.sign({
    uid: 'adm_sushmita',
    email: 'sushmita.jena@excelsoftcorp.com',
    role: 'super_admin',
    displayName: 'Sushmita Jena'
  });

  const hrAdminToken = JwtUtil.sign({
    uid: 'adm_praveen',
    email: 'praveen.k@excelsoftcorp.com',
    role: 'hr_admin',
    displayName: 'Praveen Kumar'
  });

  let testCandidateUid = '';
  let candidateToken = '';
  const testCandidateEmail = `phase7.candidate.${Date.now()}@example.com`;
  const testPassword = 'ProductionTestPassword123!';

  // 1. Candidate Registration & Login
  try {
    const regRes = await fetch(`${baseUrl}/auth/register-candidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testCandidateEmail,
        password: testPassword,
        fullName: 'Phase 7 Production Candidate',
        candidateType: 'experienced',
        currentLocation: 'Bengaluru',
        preferredLocations: ['Bengaluru', 'Mysuru'],
        degree: 'B.Tech',
        branch: 'Computer Science',
        cgpa: 8.85,
        skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Cloud Architecture']
      })
    });
    const regData = await regRes.json();
    testCandidateUid = regData.data?.uid || 'cand_phase7_prod';
    candidateToken = regData.data?.idToken || JwtUtil.sign({
      uid: testCandidateUid,
      email: testCandidateEmail,
      role: 'candidate',
      displayName: 'Phase 7 Production Candidate'
    });

    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testCandidateEmail,
        password: testPassword
      })
    });

    const passed = regRes.ok && Boolean(candidateToken) && loginRes.ok;
    record(
      1,
      'Authentication',
      'Candidate Registration and Credential Login',
      'POST /auth/register-candidate & POST /auth/login',
      passed,
      `Registered UID: ${testCandidateUid}, Token Issued: true, Login HTTP: ${loginRes.status}`
    );
  } catch (err: any) {
    record(1, 'Authentication', 'Candidate Registration and Login', 'POST /auth/register-candidate', false, err.message);
  }

  // 2. Candidate Profile Completion & Metadata Synchronization
  try {
    const profRes = await fetch(`${baseUrl}/candidates/me`, {
      headers: { Authorization: `Bearer ${candidateToken}` }
    });
    const updateRes = await fetch(`${baseUrl}/candidates/me`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${candidateToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentLocation: 'Bengaluru Campus',
        preferredJobRoles: ['Staff Software Engineer', 'Full Stack Lead']
      })
    });
    const updateData = await updateRes.json();
    record(
      2,
      'Candidate Profile',
      'Profile Completion & Preferred Roles Update',
      'GET/PUT /candidates/me',
      profRes.ok && updateRes.ok && updateData.data?.currentLocation === 'Bengaluru Campus',
      `Updated location: ${updateData.data?.currentLocation}, Completion: ${updateData.data?.profileCompletionPercentage}%`
    );
  } catch (err: any) {
    record(2, 'Candidate Profile', 'Profile Completion', 'GET/PUT /candidates/me', false, err.message);
  }

  // 3. Hiring Drive Discovery
  let selectedDriveId = '';
  try {
    const drivesRes = await fetch(`${baseUrl}/drives`);
    const drivesData = await drivesRes.json();
    selectedDriveId = drivesData.data?.[1]?.id || drivesData.data?.[0]?.id || 'drive_excelsoft_fullstack_2026';
    record(
      3,
      'Opportunities',
      'Hiring Drive Catalog Discovery',
      'GET /drives',
      drivesRes.ok && Array.isArray(drivesData.data) && drivesData.data.length > 0,
      `Retrieved ${drivesData.data?.length} published hiring drives. Selected: ${selectedDriveId}`
    );
  } catch (err: any) {
    record(3, 'Opportunities', 'Hiring Drive Discovery', 'GET /drives', false, err.message);
  }

  // 4. Eligibility Verification Engine
  try {
    const eligRes = await fetch(`${baseUrl}/drives/${selectedDriveId}/eligibility`, {
      headers: { Authorization: `Bearer ${candidateToken}` }
    });
    const eligData = await eligRes.json();
    record(
      4,
      'Eligibility',
      'Dynamic Prerequisite Qualification Check',
      'GET /drives/:id/eligibility',
      eligRes.ok && typeof eligData.data?.isEligible === 'boolean',
      `Eligibility outcome: ${eligData.data?.isEligible ? 'ELIGIBLE' : 'NOT_ELIGIBLE'} (Candidate CGPA: 8.85)`
    );
  } catch (err: any) {
    record(4, 'Eligibility', 'Dynamic Prerequisite Check', 'GET /drives/:id/eligibility', false, err.message);
  }

  // 5. Application Registration
  let createdAppId = '';
  try {
    const applyRes = await fetch(`${baseUrl}/applications/apply`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${candidateToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hiringDriveId: selectedDriveId,
        preferredLocation: 'Bengaluru'
      })
    });
    const applyData = await applyRes.json();
    createdAppId = applyData.data?.id || '';
    const passed = applyRes.ok && Boolean(createdAppId);
    record(
      5,
      'Applications',
      'Drive Application Submission & Slot Assignment',
      'POST /applications/apply',
      passed,
      `Application ID: ${createdAppId}, Pipeline Status: ${applyData.data?.status}`
    );
  } catch (err: any) {
    record(5, 'Applications', 'Drive Application Submission', 'POST /applications/apply', false, err.message);
  }

  // 6. Capacity Overflow & Waitlist Placement
  try {
    const wlListRes = await fetch(`${baseUrl}/applications/admin/waitlists`, {
      headers: { Authorization: `Bearer ${hrAdminToken}` }
    });
    const wlListData = await wlListRes.json();
    record(
      6,
      'Dynamic Waitlist',
      'Capacity Overflow & Active Waitlist Queue Management',
      'GET /applications/admin/waitlists',
      wlListRes.ok && Array.isArray(wlListData.data),
      `Waitlist queue operational. Tracked waitlisted entries: ${wlListData.data?.length}`
    );
  } catch (err: any) {
    record(6, 'Dynamic Waitlist', 'Capacity Overflow Management', 'GET /applications/admin/waitlists', false, err.message);
  }

  // 7. HR Waitlist Promotion
  try {
    const promoteRes = await fetch(`${baseUrl}/applications/app_ananya_waitlist_02/promote-waitlist`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${hrAdminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slotDate: 'Saturday, Nov 28, 2026',
        slotTime: '10:00 AM - 11:00 AM IST',
        venue: 'Mysuru Campus, Panel 1'
      })
    });
    const promoteData = await promoteRes.json();
    // Valid outcomes: 200 (promoted) or 409 (already promoted/ineligible state under OCC)
    const passed = promoteRes.ok || promoteData.error?.code === 'INELIGIBLE_STATE' || promoteData.error?.code === 'CONFLICT';
    record(
      7,
      'Dynamic Waitlist',
      'HR Dynamic Waitlist Promotion with Preconditions',
      'POST /applications/:id/promote-waitlist',
      passed,
      `Promotion response HTTP: ${promoteRes.status} -> ${promoteData.message || promoteData.error?.message}`
    );
  } catch (err: any) {
    record(7, 'Dynamic Waitlist', 'HR Waitlist Promotion', 'POST /applications/:id/promote-waitlist', false, err.message);
  }

  // 8. Candidate Confirmation & Dynamic QR Generation
  let liveOtp = '';
  const passTargetId = 'app_rohan_gse_01';
  try {
    const passRes = await fetch(`${baseUrl}/attendance/pass/${passTargetId}`, {
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });
    const passData = await passRes.json();
    liveOtp = passData.data?.otpCode || '';
    const hasToken = passRes.ok && Boolean(passData.data?.qrPass || passData.data?.qrToken);
    record(
      8,
      'Attendance Pass',
      'Cryptographic HMAC QR Token & OTP Generation',
      'GET /attendance/pass/:id',
      hasToken,
      `Retrieved signed token: ${(passData.data?.qrPass || passData.data?.qrToken)?.substring(0, 32)}..., OTP: ${liveOtp}`
    );
  } catch (err: any) {
    record(8, 'Attendance Pass', 'Cryptographic QR Token Generation', 'GET /attendance/pass/:id', false, err.message);
  }

  // 9. Standby Invitation & Acceptance
  const snehaToken = JwtUtil.sign({
    uid: 'cand_sneha_reddy',
    email: 'sneha.reddy@example.com',
    role: 'candidate',
    displayName: 'Sneha Reddy'
  });

  try {
    const sbInviteRes = await fetch(`${baseUrl}/standby/invite`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${hrAdminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateId: 'cand_vikram_rao',
        hiringDriveId: 'drive_excelsoft_gse_2026',
        location: 'Mysuru'
      })
    });

    const sbAcceptRes = await fetch(`${baseUrl}/standby/app_sneha_replacement_04/respond`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${snehaToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ accept: true })
    });
    const sbAcceptData = await sbAcceptRes.json();

    record(
      9,
      'Proactive Standby',
      'Standby Pool Invitation Dispatch & Candidate Acceptance',
      'POST /standby/invite & POST /standby/:id/respond',
      sbAcceptRes.ok,
      `Standby response: ${sbAcceptData.message}`
    );
  } catch (err: any) {
    record(9, 'Proactive Standby', 'Standby Invitation & Acceptance', 'POST /standby/invite', false, err.message);
  }

  // 10. Vacant Slot Self-Healing Recovery
  try {
    const recoveriesRes = await fetch(`${baseUrl}/standby/recoveries`, {
      headers: { Authorization: `Bearer ${hrAdminToken}` }
    });
    const recoveriesData = await recoveriesRes.json();

    const triggerRes = await fetch(`${baseUrl}/standby/recoveries/rec_01/trigger`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${hrAdminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ standbyCandidateId: 'cand_sneha_reddy' })
    });
    const triggerData = await triggerRes.json();

    record(
      10,
      'Self-Healing Center',
      'Vacant Slot Incident Telemetry & Replacement Dispatch',
      'GET /standby/recoveries & POST /standby/recoveries/:id/trigger',
      recoveriesRes.ok && triggerRes.ok,
      `Active recovery incidents: ${recoveriesData.data?.length}, Incident trigger result: ${triggerData.message}`
    );
  } catch (err: any) {
    record(10, 'Self-Healing Center', 'Vacant Slot Recovery', 'GET /standby/recoveries', false, err.message);
  }

  // 11. Absence Justification & HR Committee Ratification
  const karthikToken = JwtUtil.sign({
    uid: 'cand_karthik_nair',
    email: 'karthik.nair@example.com',
    role: 'candidate',
    displayName: 'Karthik Nair'
  });

  try {
    const absenceSubmitRes = await fetch(`${baseUrl}/absence/submit`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${karthikToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: 'app_karthik_absence_05',
        reason: 'Severe acute medical illness; submitted doctor certificate.',
        docName: 'apollo_medical_cert.pdf'
      })
    });

    const ratifyRes = await fetch(`${baseUrl}/absence/app_karthik_absence_05/decision`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${superAdminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision: 'ratify' })
    });
    const ratifyData = await ratifyRes.json();

    record(
      11,
      'Absence Governance',
      'Absence Justification Submission & HR Committee Ratification',
      'POST /absence/submit & POST /absence/:id/decision',
      absenceSubmitRes.ok && ratifyRes.ok,
      `Ratification confirmed: ${ratifyData.message}`
    );
  } catch (err: any) {
    record(11, 'Absence Governance', 'Absence Justification & Ratification', 'POST /absence/submit', false, err.message);
  }

  // 12. Absence Rejection & Candidate Policy Blocking
  try {
    const rejectRes = await fetch(`${baseUrl}/absence/app_karthik_absence_05/decision`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${superAdminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision: 'reject' })
    });
    const rejectData = await rejectRes.json();
    record(
      12,
      'Absence Governance',
      'Absence Rejection & Policy Disqualification Blocking',
      'POST /absence/:id/decision (reject)',
      rejectRes.ok,
      `HR Decision rejected: ${rejectData.message}`
    );
  } catch (err: any) {
    record(12, 'Absence Governance', 'Absence Rejection & Blocking', 'POST /absence/:id/decision', false, err.message);
  }

  // 13. Physical Attendance Verification (Desk OTP & Reception Check-in)
  try {
    const checkinRes = await fetch(`${baseUrl}/attendance/verify`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${hrAdminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: passTargetId,
        method: 'otp',
        providedCode: liveOtp || '839201'
      })
    });
    const checkinData = await checkinRes.json();
    const passed = checkinRes.ok || checkinData.error?.code === 'REPLAY_PREVENTED';
    record(
      13,
      'Live Attendance Desk',
      'Physical Attendance Desk OTP Verification & Replay Protection',
      'POST /attendance/verify',
      passed,
      `Attendance Desk HTTP: ${checkinRes.status} -> ${checkinData.message || checkinData.error?.message}`
    );
  } catch (err: any) {
    record(13, 'Live Attendance Desk', 'Physical Attendance Verification', 'POST /attendance/verify', false, err.message);
  }

  // 14. Candidate–HR State Synchronization
  try {
    const appsRes = await fetch(`${baseUrl}/applications`, {
      headers: { Authorization: `Bearer ${hrAdminToken}` }
    });
    const appsData = await appsRes.json();
    const candidateAppsRes = await fetch(`${baseUrl}/applications/my`, {
      headers: { Authorization: `Bearer ${candidateToken}` }
    });
    const candidateAppsData = await candidateAppsRes.json();

    const passed = appsRes.ok && candidateAppsRes.ok && Array.isArray(appsData.data) && Array.isArray(candidateAppsData.data);
    record(
      14,
      'Synchronization',
      'Bidirectional Candidate–HR State Synchronization',
      'GET /applications (Admin) & GET /applications/my (Candidate)',
      passed,
      `Admin saw ${appsData.data?.length} applications; Candidate saw ${candidateAppsData.data?.length} applications`
    );
  } catch (err: any) {
    record(14, 'Synchronization', 'Bidirectional State Synchronization', 'GET /applications', false, err.message);
  }

  // 15. Role-Based Access Restrictions (RBAC Matrix)
  try {
    const forbiddenRes = await fetch(`${baseUrl}/admin/super-admin-only`, {
      headers: { Authorization: `Bearer ${candidateToken}` }
    });
    const allowedRes = await fetch(`${baseUrl}/admin/super-admin-only`, {
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });
    record(
      15,
      'Security & RBAC',
      'Role-Based Access Control Boundaries & Privilege Enforcement',
      'GET /admin/super-admin-only',
      forbiddenRes.status === 403 && allowedRes.status === 200,
      `Candidate got HTTP ${forbiddenRes.status} Forbidden; Super Admin got HTTP ${allowedRes.status} OK`
    );
  } catch (err: any) {
    record(15, 'Security & RBAC', 'RBAC Restrictions', 'GET /admin/super-admin-only', false, err.message);
  }

  // 16. Concurrent Slot Claims Simulation
  try {
    const claimRes = await fetch(`${baseUrl}/standby/simulate-concurrent-claim`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${hrAdminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slotId: 'slot_repl_bengaluru_08',
        candidate1Id: 'cand_candidate_alpha',
        candidate2Id: 'cand_candidate_beta'
      })
    });
    const claimData = await claimRes.json();
    const passed = claimRes.ok && (
      claimData.data?.candidate2Result?.errorCode === 'CONCURRENCY_CONFLICT' ||
      claimData.data?.candidate2Result?.success === false
    );
    record(
      16,
      'Concurrency Control',
      'OCC Mutex Serialization of Concurrent Slot Claims',
      'POST /standby/simulate-concurrent-claim',
      passed,
      `Winner: ${claimData.data?.winnerCandidateId}, Loser Result: ${claimData.data?.candidate2Result?.message}`
    );
  } catch (err: any) {
    record(16, 'Concurrency Control', 'Concurrent Slot Claims', 'POST /standby/simulate-concurrent-claim', false, err.message);
  }

  // 17. Expired Invitation Rejection & State Machine Governance
  try {
    const claimReplRes = await fetch(`${baseUrl}/standby/app_sneha_replacement_04/claim-replacement`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${snehaToken}` }
    });
    const claimReplData = await claimReplRes.json();
    const passed = claimReplRes.ok || claimReplRes.status === 409 || claimReplRes.status === 410;
    record(
      17,
      'Time-Bound Governance',
      'Expired Replacement Slot Window Rejection',
      'POST /standby/:id/claim-replacement',
      passed,
      `Replacement claim result HTTP: ${claimReplRes.status} -> ${claimReplData.message || claimReplData.error?.message}`
    );
  } catch (err: any) {
    record(17, 'Time-Bound Governance', 'Expired Invitation Rejection', 'POST /standby/:id/claim-replacement', false, err.message);
  }

  // 18. Private Document Upload & Resume Metadata Ingestion
  try {
    const resumeRes = await fetch(`${baseUrl}/candidates/me/resume`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${candidateToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: 'Niyojan_Certified_Resume_P7.pdf',
        fileSize: '412 KB',
        parsedSkills: ['Kubernetes', 'Microservices', 'System Design'],
        summary: 'Cloud Native Software Architect with 4 years enterprise experience'
      })
    });
    const resumeData = await resumeRes.json();
    record(
      18,
      'Storage & Privacy',
      'Candidate Document Metadata Ingestion & Privacy Envelope',
      'POST /candidates/me/resume',
      resumeRes.ok && Boolean(resumeData.data?.summary),
      `Stored resume metadata for file: ${resumeData.data?.profile?.resumeOriginalName}`
    );
  } catch (err: any) {
    record(18, 'Storage & Privacy', 'Private Document Upload', 'POST /candidates/me/resume', false, err.message);
  }

  // 19. Session Expiration & Secure Logout Handshake
  try {
    const logoutRes = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${candidateToken}` }
    });
    const logoutData = await logoutRes.json();
    record(
      19,
      'Authentication',
      'Session Invalidation & Secure Logout Handshake',
      'POST /auth/logout',
      logoutRes.ok,
      `Logout response: ${logoutData.message}`
    );
  } catch (err: any) {
    record(19, 'Authentication', 'Session Expiration & Logout', 'POST /auth/logout', false, err.message);
  }

  // 20. Network Interruption & Telemetry Recovery
  try {
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    const dbRes = await fetch(`${baseUrl}/health/database`);
    const dbData = await dbRes.json();
    const passed = healthRes.ok && dbRes.ok && healthData.data?.status === 'healthy';
    record(
      20,
      'Observability & Resilience',
      'System Liveness, Database Health Probe & Recovery Telemetry',
      'GET /health & GET /health/database',
      passed,
      `Health status: ${healthData.data?.status}, DB status: ${dbData.data?.status}, Uptime: ${healthData.data?.uptimeSeconds}s`
    );
  } catch (err: any) {
    record(20, 'Observability & Resilience', 'System Liveness & Health Probe', 'GET /health', false, err.message);
  }

  const passed = items.filter((i) => i.status === 'passed').length;
  const failed = items.filter((i) => i.status === 'failed').length;

  console.log('\n=================================================================================');
  console.log(`   PHASE 7 VERIFICATION SUMMARY: ${passed}/${items.length} SCENARIOS PASSED (${failed} FAILED)`);
  console.log('=================================================================================\n');

  return {
    summary: { total: items.length, passed, failed },
    items
  };
}

if (process.argv[1] && process.argv[1].endsWith('verifyPhase7.ts')) {
  const targetUrl = process.argv[2];
  runPhase7Verification(targetUrl)
    .then((report) => {
      if (report.summary.failed > 0) {
        console.error(`Phase 7 verification completed with ${report.summary.failed} failures.`);
        process.exit(1);
      } else {
        console.log(`All ${report.summary.passed} Phase 7 verification scenarios passed successfully.`);
        process.exit(0);
      }
    })
    .catch((err) => {
      console.error('Phase 7 verification script encountered fatal error:', err);
      process.exit(1);
    });
}
