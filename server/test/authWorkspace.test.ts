import { describe, it, expect } from 'vitest';
import { JwtUtil } from '../utils/jwt.ts';
import { hashPassword, verifyPassword } from '../controllers/authController.ts';
import { usersRepository, interviewerPanelsRepository } from '../repositories/index.ts';
import { hasPermission } from '../middleware/rbacMatrix.ts';

describe('NIYOJAN Authentication, Staff Provisioning & Six Role Dashboards Test Suite', () => {
  describe('1. Scrypt Cryptographic Password Security & JWT Session Isolation', () => {
    it('should generate secure unique salts and hashes for user passwords', () => {
      const pass = 'SuperSecret123!';
      const hash1 = hashPassword(pass);
      const hash2 = hashPassword(pass);

      expect(hash1.salt).toBeDefined();
      expect(hash2.salt).toBeDefined();
      expect(hash1.salt).not.toBe(hash2.salt);
      expect(hash1.hash).not.toBe(hash2.hash);

      expect(verifyPassword(pass, hash1.hash, hash1.salt)).toBe(true);
      expect(verifyPassword(pass, hash2.hash, hash2.salt)).toBe(true);
      expect(verifyPassword('WrongPassword', hash1.hash, hash1.salt)).toBe(false);
    });

    it('should sign and verify HS256 JWT tokens with role claims', async () => {
      const token = JwtUtil.sign({
        uid: 'user_hr_123',
        email: 'hr.lead@excelsoftcorp.com',
        role: 'hr_admin',
        displayName: 'HR Lead'
      });

      const decoded = await JwtUtil.verify(token);
      expect(decoded).not.toBeNull();
      expect(decoded.uid).toBe('user_hr_123');
      expect(decoded.role).toBe('hr_admin');
      expect(decoded.email).toBe('hr.lead@excelsoftcorp.com');
    });
  });

  describe('2. HR Admin Self-Registration & SQLite User Provisioning', () => {
    const testEmail = `hr.test.${Date.now()}@excelsoftcorp.com`;
    const rawPass = 'AdminSecret2026!';
    let registeredUid = '';

    it('should register a new HR admin and store scrypt hash in users repository', async () => {
      const cryptoInfo = hashPassword(rawPass);
      const uid = `hr_${Date.now()}`;
      registeredUid = uid;

      const user = await usersRepository.create(uid, {
        uid,
        email: testEmail,
        displayName: 'Aditi Deshmukh',
        role: 'hr_admin',
        department: 'Talent Acquisition',
        phone: '+91 98765 43210',
        employeeId: 'EMP-TA-9901',
        passwordHash: cryptoInfo.hash,
        passwordSalt: cryptoInfo.salt,
        status: 'active',
        createdAt: new Date().toISOString()
      });

      expect(user.uid).toBe(uid);
      expect(user.role).toBe('hr_admin');

      // Verify retrieval and password matching
      const retrieved = await usersRepository.findById(uid);
      expect(retrieved).not.toBeNull();
      expect(verifyPassword(rawPass, (retrieved as any).passwordHash, (retrieved as any).passwordSalt)).toBe(true);
    });

    it('should support updating password securely via scrypt', async () => {
      const newPass = 'UpdatedSecurePass2026!';
      const newCrypto = hashPassword(newPass);

      await usersRepository.update(registeredUid, {
        passwordHash: newCrypto.hash,
        passwordSalt: newCrypto.salt,
        updatedAt: new Date().toISOString()
      });

      const updated = await usersRepository.findById(registeredUid);
      expect(verifyPassword(newPass, (updated as any).passwordHash, (updated as any).passwordSalt)).toBe(true);
      expect(verifyPassword(rawPass, (updated as any).passwordHash, (updated as any).passwordSalt)).toBe(false);
    });
  });

  describe('3. Staff Invitation & Provisioning (Manager, Coordinator, Interviewer)', () => {
    it('should provision a new Interviewer and configure their panel & specialization in SQLite', async () => {
      const invUid = `inv_${Date.now()}`;
      const invEmail = `panelist.${Date.now()}@excelsoftcorp.com`;
      const passInfo = hashPassword('StaffSecretPassword123!');

      await usersRepository.create(invUid, {
        uid: invUid,
        email: invEmail,
        displayName: 'Dr. Vikramaditya',
        role: 'interviewer',
        department: 'Cloud Infrastructure Panel',
        assignedPanel: 'Panel 4 (Distributed Systems)',
        specialization: 'Kubernetes, Go, Microservices',
        passwordHash: passInfo.hash,
        passwordSalt: passInfo.salt,
        status: 'active',
        createdAt: new Date().toISOString()
      });

      // Panel assignment record
      await interviewerPanelsRepository.create(invUid, {
        id: invUid,
        interviewerId: invUid,
        name: 'Dr. Vikramaditya',
        email: invEmail,
        role: 'Senior Staff Engineer',
        assignedPanel: 'Panel 4 (Distributed Systems)',
        skills: ['Kubernetes', 'Go', 'Microservices'],
        status: 'active',
        createdAt: new Date().toISOString()
      });

      const invRecord = await usersRepository.findById(invUid);
      expect(invRecord).not.toBeNull();
      expect((invRecord as any).role).toBe('interviewer');
      expect((invRecord as any).assignedPanel).toBe('Panel 4 (Distributed Systems)');

      const panelRecord = await interviewerPanelsRepository.findById(invUid);
      expect(panelRecord).not.toBeNull();
      expect((panelRecord as any).skills).toContain('Kubernetes');
    });

    it('should provision a Recruitment Manager and Interview Coordinator', async () => {
      const mgrUid = `mgr_${Date.now()}`;
      await usersRepository.create(mgrUid, {
        uid: mgrUid,
        email: `mgr.${Date.now()}@excelsoftcorp.com`,
        displayName: 'Karan Mehra',
        role: 'recruitment_manager',
        department: 'University Relations',
        status: 'active',
        createdAt: new Date().toISOString()
      });

      const coordUid = `coord_${Date.now()}`;
      await usersRepository.create(coordUid, {
        uid: coordUid,
        email: `coord.${Date.now()}@excelsoftcorp.com`,
        displayName: 'Swati Sen',
        role: 'interview_coordinator',
        department: 'Campus Logistics',
        status: 'active',
        createdAt: new Date().toISOString()
      });

      const mgr = await usersRepository.findById(mgrUid);
      const coord = await usersRepository.findById(coordUid);

      expect((mgr as any).role).toBe('recruitment_manager');
      expect((coord as any).role).toBe('interview_coordinator');
    });
  });

  describe('4. Six Role-Based Dashboard Privilege Matrices', () => {
    it('Super Admin should have comprehensive enterprise authority', () => {
      expect(hasPermission('super_admin', 'drives:create')).toBe(true);
      expect(hasPermission('super_admin', 'interviewer:conflicts:view_all')).toBe(true);
      expect(hasPermission('super_admin', 'auth:manage_roles')).toBe(true);
    });

    it('HR Admin should manage hiring drives, waitlists, and absence governance', () => {
      expect(hasPermission('hr_admin', 'drives:create')).toBe(true);
      expect(hasPermission('hr_admin', 'waitlist:promote')).toBe(true);
      expect(hasPermission('hr_admin', 'absence:ratify')).toBe(true);
      expect(hasPermission('hr_admin', 'auth:view_users')).toBe(true);
      expect(hasPermission('hr_admin', 'interviewer:evaluations:submit')).toBe(false);
    });

    it('Recruitment Manager should manage candidate database, verify skills, and schedule slots', () => {
      expect(hasPermission('recruitment_manager', 'profile:verify')).toBe(true);
      expect(hasPermission('recruitment_manager', 'slots:allocate')).toBe(true);
      expect(hasPermission('recruitment_manager', 'drives:create')).toBe(false);
    });

    it('Interview Coordinator should manage venue desks and live attendance check-ins', () => {
      expect(hasPermission('interview_coordinator', 'attendance:verify')).toBe(true);
      expect(hasPermission('interview_coordinator', 'slots:allocate')).toBe(true);
      expect(hasPermission('interview_coordinator', 'drives:create')).toBe(false);
    });

    it('Interviewer should access dedicated scorecards, question suggestions and execution desk', () => {
      expect(hasPermission('interviewer', 'interviewer:workspace:view')).toBe(true);
      expect(hasPermission('interviewer', 'interviewer:evaluations:submit')).toBe(true);
      expect(hasPermission('interviewer', 'attendance:verify')).toBe(false);
      expect(hasPermission('interviewer', 'drives:create')).toBe(false);
    });

    it('Candidate should be strictly restricted to candidate applicant portal', () => {
      expect(hasPermission('candidate', 'drives:create')).toBe(false);
      expect(hasPermission('candidate', 'profile:verify')).toBe(false);
      expect(hasPermission('candidate', 'attendance:verify')).toBe(false);
      expect(hasPermission('candidate', 'interviewer:workspace:view')).toBe(false);
      expect(hasPermission('candidate', 'auth:manage_roles')).toBe(false);
    });
  });
});

