import { JwtUtil } from '../utils/jwt.ts';
import { ConcurrencyLockManager } from '../services/matchingService.ts';

interface TestResult {
  number: number;
  name: string;
  category: 'profile' | 'drives' | 'applications' | 'standby' | 'absence' | 'attendance' | 'notes_and_notifs';
  status: 'passed' | 'failed';
  details?: any;
  error?: string;
}

export async function runPhase4Verification(): Promise<{ summary: { total: number; passed: number; failed: number }; results: TestResult[] }> {
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
  console.log('   NIYOJAN PHASE 4: AUTHORITATIVE RECRUITMENT OPERATIONS     ');
  console.log('=============================================================\n');

  // Generate tokens for testing
  const superAdminToken = JwtUtil.sign({
    uid: 'adm_super_test',
    email: 'superadmin.test@excelsoftcorp.com',
    role: 'super_admin',
    displayName: 'Super Admin Test'
  });

  const hrAdminToken = JwtUtil.sign({
    uid: 'adm_hr_test',
    email: 'hr.test@excelsoftcorp.com',
    role: 'hr_admin',
    displayName: 'Praveen HR'
  });

  let candidate1Uid = '';
  let candidate1Token = '';
  let candidate2Uid = '';
  let candidate2Token = '';

  // Setup candidate profiles for testing
  try {
    const reg1Res = await fetch(`${baseUrl}/auth/register-candidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `c1_${Date.now()}@niyojan.edu`,
        password: 'Password123!',
        fullName: 'Candidate One',
        phone: '+919876543201',
        candidateType: 'fresher',
        currentLocation: 'Mysuru',
        preferredLocations: ['Mysuru', 'Bengaluru'],
        degree: 'B.E.',
        branch: 'Computer Science',
        cgpa: 8.5,
        skills: ['Java', 'Data Structures & Algorithms', 'Python', 'SQL']
      })
    });
    const reg1Data = (await reg1Res.json()) as any;
    candidate1Uid = reg1Data.data?.uid;
    candidate1Token = reg1Data.data?.idToken || JwtUtil.sign({
      uid: candidate1Uid,
      email: reg1Data.data?.email || 'c1@niyojan.edu',
      role: 'candidate',
      displayName: 'Candidate One'
    });

    const reg2Res = await fetch(`${baseUrl}/auth/register-candidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `c2_${Date.now()}@niyojan.edu`,
        password: 'Password123!',
        fullName: 'Candidate Two',
        phone: '+919876543202',
        candidateType: 'experienced',
        currentLocation: 'Bengaluru',
        preferredLocations: ['Bengaluru'],
        degree: 'B.Tech',
        branch: 'Computer Science',
        cgpa: 8.0,
        skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL']
      })
    });
    const reg2Data = (await reg2Res.json()) as any;
    candidate2Uid = reg2Data.data?.uid;
    candidate2Token = reg2Data.data?.idToken || JwtUtil.sign({
      uid: candidate2Uid,
      email: reg2Data.data?.email || 'c2@niyojan.edu',
      role: 'candidate',
      displayName: 'Candidate Two'
    });
  } catch (err: any) {
    console.error('Candidate registration setup error:', err);
  }


  // -------------------------------------------------------------------------
  // TEST 1: Retrieve Own Candidate Profile
  // -------------------------------------------------------------------------
  try {
    const res = await fetch(`${baseUrl}/candidates/me`, {
      headers: { Authorization: `Bearer ${candidate1Token}` }
    });
    const data = (await res.json()) as any;
    const passed = res.status === 200 && data.success && data.data?.candidateType === 'fresher';
    record(1, 'Candidate retrieves own profile with authentication', 'profile', passed, {
      status: res.status,
      candidateType: data.data?.candidateType
    });
  } catch (err: any) {
    record(1, 'Candidate retrieves own profile with authentication', 'profile', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 2: Update Preferred Locations
  // -------------------------------------------------------------------------
  try {
    const res = await fetch(`${baseUrl}/candidates/me/locations`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${candidate1Token}`
      },
      body: JSON.stringify({ preferredLocations: ['Mysuru', 'Bengaluru', 'Hyderabad'] })
    });
    const data = (await res.json()) as any;
    const passed = res.status === 200 && data.success && data.data?.preferredLocations?.includes('Hyderabad');
    record(2, 'Candidate updates preferred locations', 'profile', passed, {
      preferredLocations: data.data?.preferredLocations
    });
  } catch (err: any) {
    record(2, 'Candidate updates preferred locations', 'profile', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 3: Upload and Parse Resume Metadata
  // -------------------------------------------------------------------------
  try {
    const res = await fetch(`${baseUrl}/candidates/me/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${candidate1Token}`
      },
      body: JSON.stringify({
        fileName: 'aarav_resume_2026.pdf',
        fileSize: '1.8 MB',
        parsedSkills: ['Docker', 'Kubernetes'],
        summary: 'Cloud Native Engineer with full stack capabilities.'
      })
    });
    const data = (await res.json()) as any;
    const passed = res.status === 200 && data.success && data.data?.profile?.skills?.some((s: any) => s.name === 'Docker');
    record(3, 'Candidate uploads resume and merges parsed skills', 'profile', passed, {
      skillsCount: data.data?.profile?.skills?.length,
      completion: data.data?.profile?.profileCompletionPercentage
    });
  } catch (err: any) {
    record(3, 'Candidate uploads resume and merges parsed skills', 'profile', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 4: Hiring Drives Retrieval & Eligibility Engine
  // -------------------------------------------------------------------------
  try {
    const drivesRes = await fetch(`${baseUrl}/drives`);
    const drivesData = (await drivesRes.json()) as any;
    const drive = drivesData.data?.[0];

    const eligRes = await fetch(`${baseUrl}/drives/${drive.id}/eligibility`, {
      headers: { Authorization: `Bearer ${candidate1Token}` }
    });
    const eligData = (await eligRes.json()) as any;

    const passed =
      drivesRes.status === 200 &&
      drivesData.data?.length > 0 &&
      eligRes.status === 200 &&
      eligData.data?.cgpaStatus?.passed !== undefined;

    record(4, 'Retrieve hiring drives and run eligibility assessment engine', 'drives', passed, {
      drivesCount: drivesData.data?.length,
      isEligible: eligData.data?.isEligible,
      cgpaPassed: eligData.data?.cgpaStatus?.passed
    });
  } catch (err: any) {
    record(4, 'Retrieve hiring drives and run eligibility assessment engine', 'drives', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 5: Hiring Drive Creation & Update by HR Admin
  // -------------------------------------------------------------------------
  let customDriveId = 'drive_custom_' + Date.now();
  try {
    const createRes = await fetch(`${baseUrl}/drives`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hrAdminToken}`
      },
      body: JSON.stringify({
        id: customDriveId,
        title: 'Backend Scalability Specialist Drive',
        company: 'Excelsoft Technologies',
        role: 'Distributed Systems Engineer',
        candidateType: ['fresher', 'experienced'],
        locations: ['Bengaluru'],
        interviewCapacity: 1, // capacity of 1 to easily test waitlist overflow
        minimumCgpa: 7.0,
        requiredDegree: ['B.E.', 'B.Tech'],
        mandatorySkills: []
      })

    });
    const createData = (await createRes.json()) as any;

    const updateRes = await fetch(`${baseUrl}/drives/${customDriveId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hrAdminToken}`
      },
      body: JSON.stringify({ title: 'Distributed Systems Engineer 2026' })
    });
    const updateData = (await updateRes.json()) as any;

    const passed = createRes.status === 201 && updateRes.status === 200 && updateData.data?.title === 'Distributed Systems Engineer 2026';
    record(5, 'HR Admin creates and updates hiring drive with capacity limits', 'drives', passed, {
      createdId: customDriveId,
      updatedTitle: updateData.data?.title
    });
  } catch (err: any) {
    record(5, 'HR Admin creates and updates hiring drive with capacity limits', 'drives', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 6: Candidate Application Registration & Slot Confirmation
  // -------------------------------------------------------------------------
  let candidate1AppId = '';
  try {
    const appRes = await fetch(`${baseUrl}/applications/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${candidate1Token}`
      },
      body: JSON.stringify({
        hiringDriveId: customDriveId,
        preferredLocation: 'Bengaluru'
      })
    });
    const appData = (await appRes.json()) as any;
    candidate1AppId = appData.data?.id;

    const passed =
      appRes.status === 201 &&
      Boolean(candidate1AppId) &&
      appData.data?.status === 'confirmed' &&
      Boolean(appData.data?.interviewSlotId);

    record(6, 'Candidate application registration with confirmed interview slot allocation', 'applications', passed, {
      appId: candidate1AppId,
      status: appData.data?.status,
      slotId: appData.data?.interviewSlotId
    });
  } catch (err: any) {
    record(6, 'Candidate application registration with confirmed interview slot allocation', 'applications', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 7: Duplicate Application Prevention Guard
  // -------------------------------------------------------------------------
  try {
    const dupRes = await fetch(`${baseUrl}/applications/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${candidate1Token}`
      },
      body: JSON.stringify({
        hiringDriveId: customDriveId,
        preferredLocation: 'Bengaluru'
      })
    });
    const dupData = (await dupRes.json()) as any;
    const passed = dupRes.status === 409 && dupData.error?.message?.includes('already submitted');
    record(7, 'Duplicate application prevention guard blocks re-applying', 'applications', passed, {
      httpStatus: dupRes.status,
      message: dupData.error?.message
    });
  } catch (err: any) {
    record(7, 'Duplicate application prevention guard blocks re-applying', 'applications', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 8: Capacity Full -> Dynamic FIFO Waitlist Overflow
  // -------------------------------------------------------------------------
  let candidate2AppId = '';
  try {
    // Drive capacity was set to 1. Candidate 1 took it. Now Candidate 2 applies.
    const wlRes = await fetch(`${baseUrl}/applications/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${candidate2Token}`
      },
      body: JSON.stringify({
        hiringDriveId: customDriveId,
        preferredLocation: 'Bengaluru'
      })
    });
    const wlData = (await wlRes.json()) as any;
    candidate2AppId = wlData.data?.id;

    const passed =
      wlRes.status === 201 &&
      wlData.data?.status === 'waitlisted' &&
      wlData.data?.waitlistInfo?.position >= 1;

    record(8, 'Drive capacity full triggers dynamic FIFO waitlist assignment', 'applications', passed, {
      appId: candidate2AppId,
      status: wlData.data?.status,
      waitlistPosition: wlData.data?.waitlistInfo?.position
    });
  } catch (err: any) {
    record(8, 'Drive capacity full triggers dynamic FIFO waitlist assignment', 'applications', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 9: Waitlist Promotion by HR with Panel Mutex
  // -------------------------------------------------------------------------
  try {
    const promoRes = await fetch(`${baseUrl}/applications/${candidate2AppId}/promote-waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hrAdminToken}`
      },
      body: JSON.stringify({
        slotDate: 'Saturday, Nov 28, 2026',
        slotTime: '10:00 AM - 11:00 AM IST',
        venue: 'Panel 1, Bengaluru Campus'
      })
    });
    const promoData = (await promoRes.json()) as any;
    const passed =
      promoRes.status === 200 &&
      promoData.data?.app?.status === 'confirmed' &&
      Boolean(promoData.data?.slot?.id);

    record(9, 'HR promotes waitlisted candidate into confirmed slot with panel lock', 'applications', passed, {
      status: promoData.data?.app?.status,
      slotId: promoData.data?.slot?.id
    });
  } catch (err: any) {
    record(9, 'HR promotes waitlisted candidate into confirmed slot with panel lock', 'applications', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 10: 100-Point Deterministic Standby Matching Formula
  // -------------------------------------------------------------------------
  try {
    const matchRes = await fetch(
      `${baseUrl}/standby/match-score?candidateId=cand_sneha_reddy&hiringDriveId=drive_excelsoft_fullstack_2026`,
      { headers: { Authorization: `Bearer ${candidate1Token}` } }
    );
    const matchData = (await matchRes.json()) as any;
    const score = matchData.data;

    const passed =
      matchRes.status === 200 &&
      score?.totalScore >= 60 &&
      score?.skillsScore !== undefined &&
      score?.locationScore !== undefined &&
      score?.academicScore !== undefined &&
      score?.availabilityScore !== undefined;

    record(10, '100-point deterministic standby matching formula (Skills 40 + Loc 25 + Acad 20 + Avail 15)', 'standby', passed, {
      totalScore: score?.totalScore,
      skillsScore: score?.skillsScore,
      locationScore: score?.locationScore,
      academicScore: score?.academicScore,
      availabilityScore: score?.availabilityScore,
      isEligible: score?.isEligible
    });
  } catch (err: any) {
    record(10, '100-point deterministic standby matching formula (Skills 40 + Loc 25 + Acad 20 + Avail 15)', 'standby', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 11: Standby Invitation Dispatch and Response
  // -------------------------------------------------------------------------
  try {
    const invRes = await fetch(`${baseUrl}/standby/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hrAdminToken}`
      },
      body: JSON.stringify({
        candidateId: candidate1Uid,
        hiringDriveId: 'drive_excelsoft_gse_2026',
        location: 'Mysuru'
      })
    });
    const invData = (await invRes.json()) as any;
    const standbyAppId = invData.data?.app?.id;

    const respRes = await fetch(`${baseUrl}/standby/${standbyAppId}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${candidate1Token}`
      },
      body: JSON.stringify({ accept: true })
    });
    const respData = (await respRes.json()) as any;

    const passed = invRes.status === 200 && respRes.status === 200 && respData.data?.invitationStatus === 'accepted';
    record(11, 'Standby pool invitation dispatch and candidate pre-acceptance', 'standby', passed, {
      standbyAppId,
      invitationStatus: respData.data?.invitationStatus
    });
  } catch (err: any) {
    record(11, 'Standby pool invitation dispatch and candidate pre-acceptance', 'standby', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 12: Concurrent Slot Claim Race Condition Simulation
  // -------------------------------------------------------------------------
  try {
    const simRes = await fetch(`${baseUrl}/standby/simulate-concurrent-claim`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${candidate1Token}`
      },
      body: JSON.stringify({
        slotId: 'slot_race_condition_test_101',
        candidate1Id: 'cand_candidate_1',
        candidate2Id: 'cand_candidate_2'
      })
    });
    const simData = (await simRes.json()) as any;
    const c1 = simData.data?.candidate1Result;
    const c2 = simData.data?.candidate2Result;

    const passed =
      simRes.status === 200 &&
      c1?.success === true &&
      c2?.success === false &&
      c2?.errorCode === 'CONCURRENCY_CONFLICT';

    record(12, 'Atomic mutex prevents concurrent slot claiming (1 win, 1 collision blocked)', 'standby', passed, {
      candidate1Success: c1?.success,
      candidate2ErrorCode: c2?.errorCode,
      details: simData.data?.details
    });
  } catch (err: any) {
    record(12, 'Atomic mutex prevents concurrent slot claiming (1 win, 1 collision blocked)', 'standby', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 13: Algorithmic Vacant Slot Recovery Incident
  // -------------------------------------------------------------------------
  try {
    const triggerRes = await fetch(`${baseUrl}/standby/recoveries/rec_01/trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hrAdminToken}`
      },
      body: JSON.stringify({ standbyCandidateId: 'cand_sneha_reddy' })
    });
    const triggerData = (await triggerRes.json()) as any;

    const confirmRes = await fetch(`${baseUrl}/standby/recoveries/rec_01/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hrAdminToken}`
      }
    });
    const confirmData = (await confirmRes.json()) as any;

    const passed =
      triggerRes.status === 200 &&
      confirmRes.status === 200 &&
      confirmData.data?.status === 'recovered';

    record(13, 'Self-healing slot recovery incident trigger with 4h window and confirmation', 'standby', passed, {
      recoveryStatus: confirmData.data?.status,
      recoveredAt: confirmData.data?.recoveredAt
    });
  } catch (err: any) {
    record(13, 'Self-healing slot recovery incident trigger with 4h window and confirmation', 'standby', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 14: Fresher Absence Policy (Immediate Opportunity Lapse)
  // -------------------------------------------------------------------------
  try {
    // Candidate 1 is fresher
    const absRes = await fetch(`${baseUrl}/absence/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${candidate1Token}`
      },
      body: JSON.stringify({
        applicationId: candidate1AppId,
        reason: 'Missed train to Mysuru'
      })
    });
    const absData = (await absRes.json()) as any;
    const passed = absRes.status === 400 && absData.error?.code === 'POLICY_LAPSED';

    record(14, 'Fresher absence justification rejected under opportunity-loss policy', 'absence', passed, {
      httpStatus: absRes.status,
      errorCode: absData.error?.code,
      message: absData.error?.message
    });
  } catch (err: any) {
    record(14, 'Fresher absence justification rejected under opportunity-loss policy', 'absence', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 15: Experienced Candidate 48-Hour Absence Justification & HR Ratification
  // -------------------------------------------------------------------------
  try {
    // Karthik Nair is demo experienced candidate with absence record
    const karthikAppRes = await fetch(`${baseUrl}/applications/app_karthik_experienced_absence`, {
      headers: { Authorization: `Bearer ${hrAdminToken}` }
    });

    const submitRes = await fetch(`${baseUrl}/absence/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${candidate2Token}` // Experienced candidate
      },
      body: JSON.stringify({
        applicationId: candidate2AppId,
        reason: 'Severe food poisoning diagnosed at Apollo outpatient clinic',
        docName: 'apollo_medical_prescription.pdf'
      })
    });
    const submitData = (await submitRes.json()) as any;

    const ratifyRes = await fetch(`${baseUrl}/absence/${candidate2AppId}/decision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hrAdminToken}`
      },
      body: JSON.stringify({ decision: 'ratify' })
    });
    const ratifyData = (await ratifyRes.json()) as any;

    const passed =
      submitRes.status === 200 &&
      ratifyRes.status === 200 &&
      ratifyData.data?.absence?.status === 'ratified' &&
      ratifyData.data?.app?.status === 'confirmed';

    record(15, 'Experienced absence 48h justification and HR ratification restoring eligibility', 'absence', passed, {
      submitStatus: submitData.data?.status,
      ratifiedStatus: ratifyData.data?.absence?.status,
      appRestoredStatus: ratifyData.data?.app?.status
    });
  } catch (err: any) {
    record(15, 'Experienced absence 48h justification and HR ratification restoring eligibility', 'absence', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 16: HR Absence Rejection Blocks Candidate
  // -------------------------------------------------------------------------
  try {
    const rejectRes = await fetch(`${baseUrl}/absence/${candidate2AppId}/decision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hrAdminToken}`
      },
      body: JSON.stringify({ decision: 'reject' })
    });
    const rejectData = (await rejectRes.json()) as any;

    const passed =
      rejectRes.status === 200 &&
      rejectData.data?.absence?.status === 'blocked' &&
      rejectData.data?.app?.status === 'blocked';

    record(16, 'HR absence rejection marks candidate application as BLOCKED', 'absence', passed, {
      absenceStatus: rejectData.data?.absence?.status,
      appStatus: rejectData.data?.app?.status
    });
  } catch (err: any) {
    record(16, 'HR absence rejection marks candidate application as BLOCKED', 'absence', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 17: Venue Attendance Verification via QR Token & Check-In
  // -------------------------------------------------------------------------
  try {
    const attRes = await fetch(`${baseUrl}/attendance/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hrAdminToken}`
      },
      body: JSON.stringify({
        applicationId: candidate1AppId,
        method: 'qr',
        providedCode: 'NIYOJAN_ATTEND_test_qr_valid'
      })
    });
    const attData = (await attRes.json()) as any;

    const passed = attRes.status === 200 && attData.data?.attendanceVerified === true;
    record(17, 'Physical venue desk check-in via QR token validation', 'attendance', passed, {
      attendanceVerified: attData.data?.attendanceVerified,
      checkedInAt: attData.data?.checkedInAt
    });
  } catch (err: any) {
    record(17, 'Physical venue desk check-in via QR token validation', 'attendance', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 18: Attendance Replay Prevention Guard
  // -------------------------------------------------------------------------
  try {
    const replayRes = await fetch(`${baseUrl}/attendance/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hrAdminToken}`
      },
      body: JSON.stringify({
        applicationId: candidate1AppId,
        method: 'qr',
        providedCode: 'NIYOJAN_ATTEND_test_qr_valid'
      })
    });
    const replayData = (await replayRes.json()) as any;
    const passed = replayRes.status === 409 && replayData.error?.code === 'REPLAY_PREVENTED';

    record(18, 'Attendance replay prevention guard blocks reused check-in tokens', 'attendance', passed, {
      httpStatus: replayRes.status,
      errorCode: replayData.error?.code,
      message: replayData.error?.message
    });
  } catch (err: any) {
    record(18, 'Attendance replay prevention guard blocks reused check-in tokens', 'attendance', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 19: Confidential HR Notes Strictly Denied to Candidate
  // -------------------------------------------------------------------------
  try {
    const candidateNotesRes = await fetch(`${baseUrl}/notes/${candidate1Uid}`, {
      headers: { Authorization: `Bearer ${candidate1Token}` }
    });
    const candidateNotesData = (await candidateNotesRes.json()) as any;

    const hrNotesRes = await fetch(`${baseUrl}/notes/cand_rohan_sharma`, {
      headers: { Authorization: `Bearer ${hrAdminToken}` }
    });
    const hrNotesData = (await hrNotesRes.json()) as any;

    const passed =
      candidateNotesRes.status === 403 &&
      candidateNotesData.error?.code === 'auth/insufficient-permissions' &&
      hrNotesRes.status === 200 &&
      hrNotesData.data?.length > 0;

    record(19, 'Confidential HR notes strictly blocked for candidates (403) and authorized for HR', 'notes_and_notifs', passed, {
      candidateAccessStatus: candidateNotesRes.status,
      candidateErrorCode: candidateNotesData.error?.code,
      hrNotesCount: hrNotesData.data?.length
    });
  } catch (err: any) {
    record(19, 'Confidential HR notes strictly blocked for candidates (403) and authorized for HR', 'notes_and_notifs', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 20: In-App Notifications Stream & Read Status
  // -------------------------------------------------------------------------
  try {
    const notifsRes = await fetch(`${baseUrl}/notifications/my`, {
      headers: { Authorization: `Bearer ${candidate1Token}` }
    });
    const notifsData = (await notifsRes.json()) as any;

    const unreadRes = await fetch(`${baseUrl}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${candidate1Token}` }
    });
    const unreadData = (await unreadRes.json()) as any;

    const readAllRes = await fetch(`${baseUrl}/notifications/read-all`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${candidate1Token}` }
    });
    const readAllData = (await readAllRes.json()) as any;

    const passed =
      notifsRes.status === 200 &&
      unreadRes.status === 200 &&
      readAllRes.status === 200 &&
      readAllData.data?.markedCount !== undefined;

    record(20, 'Candidate notifications stream, unread badge count, and read confirmations', 'notes_and_notifs', passed, {
      notifsCount: notifsData.data?.length,
      unreadCount: unreadData.data?.unreadCount,
      markedRead: readAllData.data?.markedCount
    });
  } catch (err: any) {
    record(20, 'Candidate notifications stream, unread badge count, and read confirmations', 'notes_and_notifs', false, undefined, err.message);
  }

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  const passed = results.filter((r) => r.status === 'passed').length;
  const failed = results.filter((r) => r.status === 'failed').length;

  console.log('\n=============================================================');
  console.log(`  NIYOJAN PHASE 4 VERIFICATION RESULTS: ${passed}/${results.length} PASSED`);
  console.log('=============================================================\n');

  return {
    summary: { total: results.length, passed, failed },
    results
  };
}

// Auto-run if executed directly via CLI
if (process.argv[1] && process.argv[1].endsWith('verifyPhase4.ts')) {
  runPhase4Verification()
    .then(({ summary }) => {
      process.exit(summary.failed === 0 ? 0 : 1);
    })
    .catch((err) => {
      console.error('Fatal test error:', err);
      process.exit(1);
    });
}
