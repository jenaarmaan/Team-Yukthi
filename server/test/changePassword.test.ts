import { describe, it, expect, beforeAll } from 'vitest';
import { AuthController, hashPassword, verifyPassword } from '../controllers/authController.ts';
import { initializeDatabaseSeed } from '../services/seedService.ts';
import { usersRepository } from '../repositories/index.ts';
import { JwtUtil } from '../utils/jwt.ts';

function createMockReqRes(options: {
  body?: any;
  headers?: Record<string, string>;
  user?: any;
  ip?: string;
}) {
  let statusCode = 200;
  let responseData: any = null;

  const res: any = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      responseData = data;
      return this;
    },
    setHeader() {
      return this;
    }
  };

  const req: any = {
    headers: options.headers || {},
    body: options.body || {},
    user: options.user,
    ip: options.ip || '127.0.0.1'
  };

  return {
    req,
    res,
    getStatus: () => statusCode,
    getData: () => responseData
  };
}

describe('AuthController.changePassword Unit & Endpoint Verification', () => {
  beforeAll(async () => {
    await initializeDatabaseSeed();
  });

  it('1. should change password successfully when authenticated with valid user', async () => {
    const testUid = `user_test_1_${Date.now()}`;
    const testEmail = `test.user.1.${Date.now()}@example.com`;
    const initialPass = 'InitialSecret123!';
    const { hash, salt } = hashPassword(initialPass);

    await usersRepository.create(testUid, {
      uid: testUid,
      email: testEmail,
      role: 'candidate',
      displayName: 'Test Candidate',
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: new Date().toISOString()
    } as any);

    const { req, res, getStatus, getData } = createMockReqRes({
      user: {
        uid: testUid,
        email: testEmail,
        role: 'candidate',
        displayName: 'Test Candidate'
      },
      body: {
        currentPassword: initialPass,
        newPassword: 'BrandNewSecretPassword123!'
      }
    });

    await AuthController.changePassword(req, res);

    expect(getStatus()).toBe(200);
    expect(getData().success).toBe(true);
    expect(getData().data.updated).toBe(true);

    // Verify in database that new password matches
    const updated = await usersRepository.findById(testUid);
    expect(verifyPassword('BrandNewSecretPassword123!', (updated as any).passwordHash, (updated as any).passwordSalt)).toBe(true);
    expect(verifyPassword(initialPass, (updated as any).passwordHash, (updated as any).passwordSalt)).toBe(false);
  });

  it('2. should authenticate via Bearer token in header when req.user is undefined', async () => {
    const testUid = `user_bearer_${Date.now()}`;
    const testEmail = `bearer.user.${Date.now()}@example.com`;
    const initialPass = 'BearerSecret123!';
    const { hash, salt } = hashPassword(initialPass);

    await usersRepository.create(testUid, {
      uid: testUid,
      email: testEmail,
      role: 'candidate',
      displayName: 'Bearer User',
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: new Date().toISOString()
    } as any);

    const token = JwtUtil.sign({
      uid: testUid,
      email: testEmail,
      role: 'candidate',
      displayName: 'Bearer User'
    });

    const { req, res, getStatus, getData } = createMockReqRes({
      headers: {
        authorization: `Bearer ${token}`
      },
      body: {
        currentPassword: initialPass,
        newPassword: 'UpdatedBearerSecret2026!'
      }
    });

    await AuthController.changePassword(req, res);

    expect(getStatus()).toBe(200);
    expect(getData().success).toBe(true);
    expect(getData().data.updated).toBe(true);
  });

  it('3. should support demo persona fallback headers (x-niyojan-uid, x-niyojan-email)', async () => {
    const testUid = `user_headers_${Date.now()}`;
    const testEmail = `headers.user.${Date.now()}@example.com`;
    const initialPass = 'HeaderSecret123!';
    const { hash, salt } = hashPassword(initialPass);

    await usersRepository.create(testUid, {
      uid: testUid,
      email: testEmail,
      role: 'candidate',
      displayName: 'Headers User',
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: new Date().toISOString()
    } as any);

    const { req, res, getStatus, getData } = createMockReqRes({
      headers: {
        'x-niyojan-uid': testUid,
        'x-niyojan-email': testEmail,
        'x-niyojan-role': 'candidate'
      },
      body: {
        currentPassword: initialPass,
        newPassword: 'HeadersUpdatedPass123!'
      }
    });

    await AuthController.changePassword(req, res);

    expect(getStatus()).toBe(200);
    expect(getData().success).toBe(true);
  });

  it('4. should reject with 401 when current password is wrong', async () => {
    const testUid = `user_wrong_${Date.now()}`;
    const testEmail = `wrong.user.${Date.now()}@example.com`;
    const initialPass = 'CorrectInitial123!';
    const { hash, salt } = hashPassword(initialPass);

    await usersRepository.create(testUid, {
      uid: testUid,
      email: testEmail,
      role: 'candidate',
      displayName: 'Wrong Test User',
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: new Date().toISOString()
    } as any);

    const { req, res, getStatus, getData } = createMockReqRes({
      headers: {
        'x-niyojan-uid': testUid,
        'x-niyojan-email': testEmail
      },
      body: {
        currentPassword: 'TotallyWrongPassword123!',
        newPassword: 'ShouldNotBeUpdated123!'
      }
    });

    await AuthController.changePassword(req, res);

    expect(getStatus()).toBe(401);
    expect(getData().success).toBe(false);
    expect(getData().error.code).toBe('auth/wrong-password');
  });

  it('5. should reject with 400 when new password is too short (< 6 chars)', async () => {
    const { req, res, getStatus, getData } = createMockReqRes({
      headers: {
        'x-niyojan-uid': 'cand_rohan_sharma',
        'x-niyojan-email': 'rohan.sharma@example.com'
      },
      body: {
        currentPassword: 'CandidateSecret123!',
        newPassword: '123'
      }
    });

    await AuthController.changePassword(req, res);

    expect(getStatus()).toBe(400);
    expect(getData().success).toBe(false);
  });
});
