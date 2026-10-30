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
  database: 'firebase_firestore';
  mode: 'production_firestore' | 'staging_storage_ready';
  phase: string;
  projectId: string;
  databaseId: string;
  storageBucket: string;
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
    service: 'firebase_auth';
    tokenVerificationConfigured: boolean;
  };
  storageStatus: {
    service: 'firebase_storage';
    bucket: string;
    uploadMode: 'signed_v4_direct' | 'secure_backend_proxy';
  };
  credentials: {
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
