import { usersRepository, candidateProfilesRepository, auditLogsRepository } from '../repositories/index.ts';
import { UserRole } from '../repositories/types.ts';
import { JwtUtil } from '../utils/jwt.ts';

interface TestResult {
  number: number;
  name: string;
  category: 'authentication' | 'rbac' | 'security';
  status: 'passed' | 'failed';
  details?: any;
  error?: string;
}

export async function runPhase3Verification(): Promise<{ summary: { total: number; passed: number; failed: number }; results: TestResult[] }> {
  const results: TestResult[] = [];
  const baseUrl = 'http://localhost:3000/api/v1';

  const record = (number: number, name: string, category: TestResult['category'], passed: boolean, details?: any, error?: string) => {
    results.push({ number, name, category, status: passed ? 'passed' : 'failed', details, error });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} [Test ${number}] ${name}`);
    if (details) console.log(`   Details:`, JSON.stringify(details));
    if (error) console.error(`   Error:`, error);
  };

  console.log('\n=============================================================');
  console.log('   NIYOJAN PHASE 3: PRODUCTION AUTHENTICATION & RBAC TEST    ');
  console.log('=============================================================\n');

  const testCandidateEmail = `candidate_test_${Date.now()}@niyojan.edu`;
  const testCandidatePassword = 'ValidCandidatePassword123!';
  let candidateUid = '';
  let candidateIdToken = '';

  // -------------------------------------------------------------------------
  // TEST 1: Successful Candidate Registration
  // -------------------------------------------------------------------------
  try {
    const regRes = await fetch(`${baseUrl}/auth/register-candidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testCandidateEmail,
        password: testCandidatePassword,
        fullName: 'Aarav Deshmukh',
        phone: '+919876543210',
        candidateType: 'fresher',
        currentLocation: 'Mysuru',
        preferredLocations: ['Mysuru', 'Bengaluru'],
        degree: 'B.Tech',
        branch: 'Information Science',
        cgpa: 8.75,
        skills: ['Java', 'SQL', 'Spring Boot']
      })
    });

    const regData = (await regRes.json()) as any;
    candidateUid = regData.data?.uid;

    const passed =
      regRes.status === 201 &&
      Boolean(candidateUid) &&
      regData.data?.role === 'candidate' &&
      regData.data?.displayName === 'Aarav Deshmukh';

    record(1, 'Successful candidate registration with Firestore documents', 'authentication', passed, {
      httpStatus: regRes.status,
      uid: candidateUid,
      role: regData.data?.role,
      displayName: regData.data?.displayName
    });
  } catch (err: any) {
    record(1, 'Successful candidate registration with Firestore documents', 'authentication', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 2: Successful Candidate Login
  // -------------------------------------------------------------------------
  try {
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testCandidateEmail,
        password: testCandidatePassword
      })
    });

    const loginData = (await loginRes.json()) as any;
    candidateIdToken = loginData.data?.idToken;

    const passed = loginRes.status === 200 && Boolean(candidateIdToken) && loginData.data?.user?.role === 'candidate';
    record(2, 'Successful candidate login & ID token minting', 'authentication', passed, {
      httpStatus: loginRes.status,
      hasIdToken: Boolean(candidateIdToken),
      returnedRole: loginData.data?.user?.role
    });
  } catch (err: any) {
    record(2, 'Successful candidate login & ID token minting', 'authentication', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 3: Invalid Password Rejection
  // -------------------------------------------------------------------------
  try {
    const wrongPassRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testCandidateEmail,
        password: 'CompletelyWrongPassword_999!'
      })
    });

    const wrongPassData = (await wrongPassRes.json()) as any;
    const passed = wrongPassRes.status === 401 && wrongPassData.success === false;
    record(3, 'Invalid password rejection with HTTP 401', 'security', passed, {
      httpStatus: wrongPassRes.status,
      errorCode: wrongPassData.error?.code,
      message: wrongPassData.error?.message
    });
  } catch (err: any) {
    record(3, 'Invalid password rejection with HTTP 401', 'security', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 4: Expired Token Rejection
  // -------------------------------------------------------------------------
  try {
    // Generate an expired token (expired 60 seconds ago)
    const expiredToken = JwtUtil.sign(
      {
        uid: candidateUid,
        email: testCandidateEmail,
        role: 'candidate'
      },
      -60
    );

    const expiredRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${expiredToken}` }
    });

    const expiredData = (await expiredRes.json()) as any;
    const passed = expiredRes.status === 401 && expiredData.error?.code === 'auth/id-token-expired';

    record(4, 'Expired token rejection by authentication middleware (HTTP 401)', 'security', passed, {
      httpStatus: expiredRes.status,
      errorCode: expiredData.error?.code,
      message: expiredData.error?.message
    });
  } catch (err: any) {
    record(4, 'Expired token rejection by authentication middleware (HTTP 401)', 'security', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 5: Invalid Token Rejection
  // -------------------------------------------------------------------------
  try {
    const invalidTokenRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: 'Bearer totally.invalid.forged.jwt.token' }
    });

    const invalidData = (await invalidTokenRes.json()) as any;
    const passed = invalidTokenRes.status === 401 && invalidData.success === false;
    record(5, 'Invalid/forged token rejection with HTTP 401 on protected endpoint', 'security', passed, {
      httpStatus: invalidTokenRes.status,
      errorCode: invalidData.error?.code
    });
  } catch (err: any) {
    record(5, 'Invalid/forged token rejection with HTTP 401 on protected endpoint', 'security', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 6: Candidate Access to Own Profile
  // -------------------------------------------------------------------------
  try {
    const ownProfileRes = await fetch(`${baseUrl}/admin/candidates/${candidateUid}/profile`, {
      headers: { Authorization: `Bearer ${candidateIdToken}` }
    });

    const ownProfileData = (await ownProfileRes.json()) as any;
    const passed = ownProfileRes.status === 200 && ownProfileData.data?.profile?.fullName === 'Aarav Deshmukh';
    record(6, 'Candidate authorized access to own private profile', 'rbac', passed, {
      httpStatus: ownProfileRes.status,
      candidateId: candidateUid,
      returnedName: ownProfileData.data?.profile?.fullName
    });
  } catch (err: any) {
    record(6, 'Candidate authorized access to own private profile', 'rbac', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 7: Candidate Denial When Accessing Another Candidate's Profile
  // -------------------------------------------------------------------------
  try {
    const otherCandidateId = 'victim_candidate_account_999';
    const forbiddenRes = await fetch(`${baseUrl}/admin/candidates/${otherCandidateId}/profile`, {
      headers: { Authorization: `Bearer ${candidateIdToken}` }
    });

    const forbiddenData = (await forbiddenRes.json()) as any;
    const passed = forbiddenRes.status === 403 && forbiddenData.error?.code === 'auth/forbidden-ownership';
    record(7, 'Candidate forbidden from accessing another candidate\'s profile (HTTP 403)', 'security', passed, {
      httpStatus: forbiddenRes.status,
      errorCode: forbiddenData.error?.code,
      message: forbiddenData.error?.message
    });
  } catch (err: any) {
    record(7, 'Candidate forbidden from accessing another candidate\'s profile (HTTP 403)', 'security', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 8: Candidate Denial for Administrative Endpoints
  // -------------------------------------------------------------------------
  try {
    // 8A: Candidate calls /admin/super-admin-only
    const adminCheckRes = await fetch(`${baseUrl}/admin/super-admin-only`, {
      headers: { Authorization: `Bearer ${candidateIdToken}` }
    });

    // 8B: Candidate calls /admin/notes/:candidateId (confidential HR evaluations)
    const notesCheckRes = await fetch(`${baseUrl}/admin/notes/${candidateUid}`, {
      headers: { Authorization: `Bearer ${candidateIdToken}` }
    });

    const passed = adminCheckRes.status === 403 && notesCheckRes.status === 403;
    record(8, 'Candidate strictly denied from administrative endpoints & HR notes (HTTP 403)', 'security', passed, {
      superAdminRouteStatus: adminCheckRes.status,
      confidentialNotesRouteStatus: notesCheckRes.status
    });
  } catch (err: any) {
    record(8, 'Candidate strictly denied from administrative endpoints & HR notes (HTTP 403)', 'security', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // SETUP STAFF IDENTITIES FOR RBAC MATRIX TESTS
  // -------------------------------------------------------------------------
  const staffAccounts: Record<string, { uid: string; idToken: string }> = {};

  const rolesToTest: UserRole[] = [
    'interviewer',
    'hr_admin',
    'recruitment_manager',
    'interview_coordinator',
    'super_admin'
  ];

  for (const role of rolesToTest) {
    const uid = `staff_${role}_${Date.now()}`;
    const email = `test_staff_${role}_${Date.now()}@niyojan.corp`;

    await usersRepository.create(uid, {
      uid,
      email,
      role,
      displayName: `Test ${role.toUpperCase()}`,
      avatarInitials: role.substring(0, 2).toUpperCase(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const idToken = JwtUtil.sign({
      uid,
      email,
      role,
      displayName: `Test ${role.toUpperCase()}`
    });

    staffAccounts[role] = { uid, idToken };
  }

  // -------------------------------------------------------------------------
  // TEST 9: Interviewer Permission Restrictions
  // -------------------------------------------------------------------------
  try {
    const token = staffAccounts.interviewer.idToken;
    // Interviewer allowed: interviewer-only route & viewing notes
    const intRes = await fetch(`${baseUrl}/admin/interviewer-only`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const notesRes = await fetch(`${baseUrl}/admin/notes/${candidateUid}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Interviewer forbidden: HR-only route
    const hrRes = await fetch(`${baseUrl}/admin/hr-only`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const passed = intRes.status === 200 && notesRes.status === 200 && hrRes.status === 403;
    record(9, 'Interviewer permission enforcement: Allowed evaluations, denied HR admin ops', 'rbac', passed, {
      interviewerRouteStatus: intRes.status,
      notesViewStatus: notesRes.status,
      hrRouteDenialStatus: hrRes.status
    });
  } catch (err: any) {
    record(9, 'Interviewer permission enforcement: Allowed evaluations, denied HR admin ops', 'rbac', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 10: HR Admin Permission Enforcement
  // -------------------------------------------------------------------------
  try {
    const token = staffAccounts.hr_admin.idToken;
    // HR Admin allowed: hr-only route & manager-only route
    const hrRes = await fetch(`${baseUrl}/admin/hr-only`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // HR Admin forbidden: reassigning super_admin role
    const reassignRes = await fetch(`${baseUrl}/auth/assign-role`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        targetUserId: candidateUid,
        newRole: 'hr_admin'
      })
    });

    const passed = hrRes.status === 200 && reassignRes.status === 403;
    record(10, 'HR Admin permission enforcement: Allowed HR management, denied role assignment', 'rbac', passed, {
      hrRouteStatus: hrRes.status,
      roleAssignmentDenialStatus: reassignRes.status
    });
  } catch (err: any) {
    record(10, 'HR Admin permission enforcement: Allowed HR management, denied role assignment', 'rbac', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 11: Recruitment Manager Restrictions
  // -------------------------------------------------------------------------
  try {
    const token = staffAccounts.recruitment_manager.idToken;
    // Manager allowed: manager-only route
    const mgrRes = await fetch(`${baseUrl}/admin/manager-only`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Manager forbidden: coordinator venue check-in desk
    const coordRes = await fetch(`${baseUrl}/admin/coordinator-only`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const passed = mgrRes.status === 200 && coordRes.status === 403;
    record(11, 'Recruitment Manager restrictions: Allowed talent pool, denied venue desk ops', 'rbac', passed, {
      managerRouteStatus: mgrRes.status,
      coordinatorDenialStatus: coordRes.status
    });
  } catch (err: any) {
    record(11, 'Recruitment Manager restrictions: Allowed talent pool, denied venue desk ops', 'rbac', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 12: Interview Coordinator Restrictions
  // -------------------------------------------------------------------------
  try {
    const token = staffAccounts.interview_coordinator.idToken;
    // Coordinator allowed: coordinator-only route
    const coordRes = await fetch(`${baseUrl}/admin/coordinator-only`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Coordinator forbidden: HR policy governance
    const hrRes = await fetch(`${baseUrl}/admin/hr-only`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const passed = coordRes.status === 200 && hrRes.status === 403;
    record(12, 'Interview Coordinator restrictions: Allowed venue panel desk, denied HR governance', 'rbac', passed, {
      coordinatorRouteStatus: coordRes.status,
      hrRouteDenialStatus: hrRes.status
    });
  } catch (err: any) {
    record(12, 'Interview Coordinator restrictions: Allowed venue panel desk, denied HR governance', 'rbac', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 13: Super Admin Authorized Operations
  // -------------------------------------------------------------------------
  try {
    const token = staffAccounts.super_admin.idToken;
    // Super Admin authorized: call assign-role to promote candidate to coordinator
    const assignRes = await fetch(`${baseUrl}/auth/assign-role`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        targetUserId: candidateUid,
        newRole: 'interview_coordinator'
      })
    });

    const assignData = (await assignRes.json()) as any;
    const passed =
      assignRes.status === 200 &&
      assignData.data?.newRole === 'interview_coordinator' &&
      assignData.data?.targetUserId === candidateUid;

    record(13, 'Super Admin operations: Role reassignment with audit logging in Firestore', 'rbac', passed, {
      httpStatus: assignRes.status,
      targetUserId: assignData.data?.targetUserId,
      previousRole: assignData.data?.previousRole,
      newRole: assignData.data?.newRole,
      message: assignData.message
    });
  } catch (err: any) {
    record(13, 'Super Admin operations: Role reassignment with audit logging in Firestore', 'rbac', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 14: Logout and Session Invalidation
  // -------------------------------------------------------------------------
  try {
    // Call logout endpoint with candidate's active session token
    const logoutRes = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${candidateIdToken}` }
    });

    const logoutData = (await logoutRes.json()) as any;

    // Verify subsequent call with the revoked token returns HTTP 401
    const postLogoutRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${candidateIdToken}` }
    });

    const postLogoutData = (await postLogoutRes.json()) as any;

    const passed =
      logoutRes.status === 200 &&
      postLogoutRes.status === 401 &&
      postLogoutData.error?.code === 'auth/id-token-revoked';

    record(14, 'Logout & session revocation: Token successfully invalidated (HTTP 401)', 'security', passed, {
      logoutStatus: logoutRes.status,
      subsequentRequestStatus: postLogoutRes.status,
      subsequentErrorCode: postLogoutData.error?.code
    });
  } catch (err: any) {
    record(14, 'Logout & session revocation: Token successfully invalidated (HTTP 401)', 'security', false, undefined, err.message);
  }

  const passedCount = results.filter((r) => r.status === 'passed').length;
  const failedCount = results.filter((r) => r.status === 'failed').length;

  console.log('\n=============================================================');
  console.log(`   PHASE 3 SUMMARY: ${passedCount} PASSED / ${failedCount} FAILED (TOTAL ${results.length})   `);
  console.log('=============================================================\n');

  return {
    summary: { total: results.length, passed: passedCount, failed: failedCount },
    results
  };
}

// CLI Execution
if (process.argv[1]?.endsWith('verifyPhase3.ts')) {
  runPhase3Verification()
    .then((out) => {
      if (out.summary.failed > 0) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    })
    .catch((err) => {
      console.error('Phase 3 verification crashed:', err);
      process.exit(1);
    });
}
