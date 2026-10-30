import { Request } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptimeSeconds: number;
  timestamp: string;
  nodeVersion: string;
  environment: string;
  memory: {
    rssMb: number;
    heapTotalMb: number;
    heapUsedMb: number;
  };
}

export interface DatabaseHealthResponse {
  status: 'connected' | 'degraded' | 'pending_provisioning' | 'disconnected';
  database: 'sqlite' | 'firebase_firestore';
  mode: string;
  phase?: string;
  databasePath?: string;
  isWalMode?: boolean;
  projectId?: string;
  databaseId?: string;
  storageBucket?: string;
  collectionsCount: number;
  collections: string[];
  connectivityTest: {
    writeSuccess: boolean;
    readSuccess: boolean;
    cleanupSuccess: boolean;
    latencyMs: number;
    testDocumentPath: string;
  };
  authStatus: {
    service: string;
    tokenVerificationConfigured: boolean;
  };
  storageStatus: {
    service: string;
    storagePath: string;
    uploadMode: string;
  };
  credentials?: {
    hasServiceAccount: boolean;
    source: string;
  };
  message: string;
  timestamp: string;
}

export interface SystemInfoResponse {
  application: string;
  tagline: string;
  partnerOrganization: string;
  version: string;
  environment: string;
  architecture: {
    runtime: string;
    framework: string;
    frontend: string;
    databaseTarget: string;
  };
  viewports: {
    candidateMobile: string;
    adminDashboard: string;
  };
  modules: {
    candidateMobileApp: boolean;
    hrAdminDashboard: boolean;
    concurrencyProtection: boolean;
    hmacQrAttendance: boolean;
    standbyRecoveryEngine: boolean;
    absenceGovernance: boolean;
    automatedQASuites: number;
  };
}

export interface AuthenticatedUser {
  uid: string;
  email: string;
  role: 'super_admin' | 'hr_admin' | 'recruitment_manager' | 'interview_coordinator' | 'interviewer' | 'candidate';
  displayName?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}
