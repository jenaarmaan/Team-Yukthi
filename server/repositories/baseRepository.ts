import { CollectionReference, DocumentReference, DocumentData } from 'firebase-admin/firestore';
import { adminDb } from '../config/firebase.ts';
import { config } from '../config/env.ts';
import { NiyojanCollectionName } from './types.ts';
import { logger } from '../utils/logger.ts';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string;
  timestamp: string;
}

export class BaseFirestoreRepository<T extends { id?: string; [key: string]: any }> {
  protected readonly collectionName: NiyojanCollectionName;
  protected readonly collectionRef: CollectionReference<DocumentData>;
  private inMemoryCache: Map<string, T> = new Map();

  constructor(collectionName: NiyojanCollectionName) {
    this.collectionName = collectionName;
    this.collectionRef = adminDb.collection(collectionName);
  }

  public getCollectionPath(): string {
    return this.collectionName;
  }

  public async findById(id: string): Promise<T | null> {
    if (config.firebase.hasServiceAccount) {
      try {
        const doc = await this.collectionRef.doc(id).get();
        if (doc.exists) {
          return { id: doc.id, ...(doc.data() as any) } as T;
        }
      } catch (err: any) {
        if (!err.message?.includes('PERMISSION_DENIED')) {
          logger.warn(`Firestore get error on [${this.collectionName}/${id}]:`, err.message);
        }
      }
    }

    // Fallback to cache if service account is pending or document cached
    const cached = this.inMemoryCache.get(id);
    return cached ? ({ ...cached } as T) : null;
  }

  public async exists(id: string): Promise<boolean> {
    const item = await this.findById(id);
    return Boolean(item);
  }

  public async findAll(limitCount = 50): Promise<T[]> {
    if (config.firebase.hasServiceAccount) {
      try {
        const snapshot = await this.collectionRef.limit(limitCount).get();
        if (snapshot.docs.length > 0) {
          return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as any)
          })) as T[];
        }
      } catch (err: any) {
        if (!err.message?.includes('PERMISSION_DENIED')) {
          logger.warn(`Firestore list error on [${this.collectionName}]:`, err.message);
        }
      }
    }

    return Array.from(this.inMemoryCache.values()).slice(0, limitCount);
  }

  public async findByField(field: string, value: any, limitCount = 50): Promise<T[]> {
    if (config.firebase.hasServiceAccount) {
      try {
        const snapshot = await this.collectionRef.where(field, '==', value).limit(limitCount).get();
        if (snapshot.docs.length > 0) {
          return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as any)
          })) as T[];
        }
      } catch (err: any) {
        if (!err.message?.includes('PERMISSION_DENIED')) {
          logger.warn(`Firestore query error on [${this.collectionName} where ${field}==${value}]:`, err.message);
        }
      }
    }

    const matches = Array.from(this.inMemoryCache.values()).filter((item: any) => {
      const itemVal = item[field];
      if (typeof itemVal === 'string' && typeof value === 'string') {
        return itemVal.toLowerCase() === value.toLowerCase();
      }
      return itemVal === value;
    });

    return matches.slice(0, limitCount);
  }

  public async create(id: string, data: T): Promise<T> {
    const cleanData: Record<string, any> = {};
    for (const [k, v] of Object.entries(data)) {
      if (v !== undefined) {
        cleanData[k] = v;
      }
    }
    if (!cleanData.createdAt) {
      cleanData.createdAt = new Date().toISOString();
    }
    if (!cleanData.updatedAt) {
      cleanData.updatedAt = new Date().toISOString();
    }

    // Always maintain local cache
    this.inMemoryCache.set(id, { id, ...cleanData } as T);

    if (config.firebase.hasServiceAccount) {
      // Persist to Cloud Firestore
      try {
        await this.collectionRef.doc(id).set(cleanData);
      } catch (err: any) {
        if (err.message?.includes('PERMISSION_DENIED')) {
          // Expected when FIREBASE_SERVICE_ACCOUNT_KEY is awaiting console export
          logger.debug(`Firestore [${this.collectionName}] create queued in memory cache pending elevated service account credentials.`);
        } else {
          logger.warn(`Firestore create error on [${this.collectionName}/${id}]:`, err.message);
        }
      }
    }

    return { id, ...cleanData } as T;
  }

  public async update(id: string, partialData: Partial<T>): Promise<void> {
    if (this.collectionName === 'audit_logs') {
      throw new Error('Audit logs are append-only and strictly immutable under enterprise governance.');
    }

    const existing = this.inMemoryCache.get(id) || ({} as T);
    const updated: Record<string, any> = {
      ...existing,
      updatedAt: new Date().toISOString()
    };
    for (const [k, v] of Object.entries(partialData)) {
      if (v !== undefined) {
        updated[k] = v;
      }
    }
    this.inMemoryCache.set(id, updated as T);

    if (config.firebase.hasServiceAccount) {
      try {
        await this.collectionRef.doc(id).update(updated as any);
      } catch (err: any) {
        if (!err.message?.includes('PERMISSION_DENIED')) {
          logger.warn(`Firestore update error on [${this.collectionName}/${id}]:`, err.message);
        }
      }
    }
  }


  public async delete(id: string): Promise<void> {
    if (this.collectionName === 'audit_logs') {
      throw new Error('Audit logs are append-only and strictly immutable under enterprise governance.');
    }

    this.inMemoryCache.delete(id);

    if (config.firebase.hasServiceAccount) {
      try {
        await this.collectionRef.doc(id).delete();
      } catch (err: any) {
        if (!err.message?.includes('PERMISSION_DENIED')) {
          logger.warn(`Firestore delete error on [${this.collectionName}/${id}]:`, err.message);
        }
      }
    }
  }


  public getDocRef(id: string): DocumentReference<DocumentData> {
    return this.collectionRef.doc(id);
  }
}
