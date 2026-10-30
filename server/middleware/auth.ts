import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../repositories/types.ts';
import { Permission, hasPermission } from './rbacMatrix.ts';
import { JwtUtil } from '../utils/jwt.ts';
import { logger } from '../utils/logger.ts';

export interface AuthenticatedUser {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  emailVerified?: boolean;
  customClaims?: Record<string, any>;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Authentication Middleware:
 * Extracts Bearer token, verifies signature and expiration, attaches verified user identity and role.
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: {
        code: 'auth/unauthorized',
        message: 'Authentication required. Authorization header must contain Bearer <Firebase_ID_Token>.'
      },
      timestamp: new Date().toISOString()
    });
    return;
  }

  const token = authHeader.split('Bearer ')[1]?.trim();

  if (!token) {
    res.status(401).json({
      success: false,
      error: {
        code: 'auth/invalid-token-format',
        message: 'Bearer token string is empty or missing.'
      },
      timestamp: new Date().toISOString()
    });
    return;
  }

  try {
    const verifiedUser = await JwtUtil.verify(token);
    req.user = verifiedUser;
    next();
  } catch (error: any) {
    logger.warn('Token verification failed:', { error: error.message, code: error.code });

    const isExpired = error.code === 'auth/id-token-expired';
    const isRevoked = error.code === 'auth/id-token-revoked';

    res.status(401).json({
      success: false,
      error: {
        code: error.code || 'auth/invalid-token',
        message: isExpired
          ? 'Firebase ID token has expired. Please refresh your session.'
          : isRevoked
          ? 'Firebase session has been revoked upon logout. Please sign in again.'
          : 'Invalid or forged authentication credentials.'
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Role-Based Access Control Middleware:
 * Enforces that authenticated user holds one of the required roles.
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'auth/unauthorized',
          message: 'Authentication required prior to role evaluation.'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'auth/forbidden',
          message: `Access denied. Role "${req.user.role}" does not have privilege for this operation. Required: [${allowedRoles.join(', ')}].`
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    next();
  };
};

/**
 * Fine-Grained Permission Middleware:
 * Enforces that authenticated user's role satisfies the specified NIYOJAN permission.
 */
export const requirePermission = (permission: Permission) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'auth/unauthorized',
          message: 'Authentication required prior to permission evaluation.'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    if (!hasPermission(req.user.role, permission)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'auth/insufficient-permissions',
          message: `Access denied: Role "${req.user.role}" lacks required permission "${permission}".`
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    next();
  };
};

/**
 * Candidate Ownership Guard:
 * Ensures candidates can only access their own profile or records.
 * Administrative roles (HR, Coordinators, Interviewers) bypass candidate ownership.
 */
export const requireCandidateOwnership = (paramField = 'candidateId') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'auth/unauthorized', message: 'Authentication required.' },
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Administrative roles are authorized to access any candidate's record
    if (['super_admin', 'hr_admin', 'recruitment_manager', 'interview_coordinator', 'interviewer'].includes(req.user.role)) {
      return next();
    }

    const targetCandidateId = req.params[paramField] || req.body[paramField] || req.query[paramField];

    if (!targetCandidateId || targetCandidateId !== req.user.uid) {
      res.status(403).json({
        success: false,
        error: {
          code: 'auth/forbidden-ownership',
          message: 'Access denied: Candidates are strictly restricted from accessing other candidates\' private records.'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    next();
  };
};
