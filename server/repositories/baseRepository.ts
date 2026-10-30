import { db } from '../config/database.ts';
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

export interface RepositoryErrorInfo {
  error: string;
  operationType: OperationType;
  path: string;
  timestamp: string;
}

export class BaseRepository<T extends { id?: string; [key: string]: any }> {
  protected readonly collectionName: NiyojanCollectionName;

  constructor(collectionName: NiyojanCollectionName) {
    this.collectionName = collectionName;
  }

  public getCollectionPath(): string {
    return this.collectionName;
  }

  public async findById(id: string): Promise<T | null> {
    try {
      const stmt = db.prepare('SELECT data FROM documents WHERE collection = ? AND id = ?');
      const row = stmt.get(this.collectionName, id) as any;
      if (!row) {
        return null;
      }
      return JSON.parse(row.data) as T;
    } catch (err: any) {
      logger.error(`SQLite findById error on [${this.collectionName}/${id}]:`, err.message);
      return null;
    }
  }

  public async exists(id: string): Promise<boolean> {
    try {
      const stmt = db.prepare('SELECT 1 FROM documents WHERE collection = ? AND id = ?');
      const row = stmt.get(this.collectionName, id);
      return Boolean(row);
    } catch (err: any) {
      logger.error(`SQLite exists check error on [${this.collectionName}/${id}]:`, err.message);
      return false;
    }
  }

  public async findAll(limitCount = 50): Promise<T[]> {
    try {
      const stmt = db.prepare('SELECT data FROM documents WHERE collection = ? ORDER BY created_at DESC LIMIT ?');
      const rows = stmt.all(this.collectionName, limitCount) as any[];
      return rows.map((r) => JSON.parse(r.data) as T);
    } catch (err: any) {
      logger.error(`SQLite findAll error on [${this.collectionName}]:`, err.message);
      return [];
    }
  }

  public async findByField(field: string, value: any, limitCount = 50): Promise<T[]> {
    try {
      const jsonPath = `$.${field}`;
      let rows: any[] = [];

      if (typeof value === 'string') {
        const stmt = db.prepare(`SELECT data FROM documents WHERE collection = ? AND LOWER(json_extract(data, ?)) = LOWER(?) LIMIT ?`);
        rows = stmt.all(this.collectionName, jsonPath, value, limitCount) as any[];
      } else if (typeof value === 'number') {
        const stmt = db.prepare(`SELECT data FROM documents WHERE collection = ? AND json_extract(data, ?) = ? LIMIT ?`);
        rows = stmt.all(this.collectionName, jsonPath, value, limitCount) as any[];
      } else if (typeof value === 'boolean') {
        const stmt = db.prepare(`SELECT data FROM documents WHERE collection = ? AND json_extract(data, ?) = ? LIMIT ?`);
        rows = stmt.all(this.collectionName, jsonPath, value ? 1 : 0, limitCount) as any[];
      } else {
        const stmt = db.prepare(`SELECT data FROM documents WHERE collection = ? LIMIT 200`);
        const all = stmt.all(this.collectionName) as any[];
        return all
          .map((r) => JSON.parse(r.data) as T)
          .filter((item: any) => item[field] === value)
          .slice(0, limitCount);
      }

      return rows.map((r) => JSON.parse(r.data) as T);
    } catch (err: any) {
      logger.error(`SQLite findByField error on [${this.collectionName} where ${field}==${value}]:`, err.message);
      return [];
    }
  }

  public async create(id: string, data: T): Promise<T> {
    const cleanData: Record<string, any> = {};
    for (const [k, v] of Object.entries(data)) {
      if (v !== undefined) {
        cleanData[k] = v;
      }
    }
    const now = new Date().toISOString();
    if (!cleanData.createdAt) {
      cleanData.createdAt = now;
    }
    if (!cleanData.updatedAt) {
      cleanData.updatedAt = now;
    }

    const payload = { id, ...cleanData } as T;
    const serialized = JSON.stringify(payload);

    try {
      const stmt = db.prepare(`
        INSERT INTO documents (collection, id, data, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(collection, id) DO UPDATE SET
          data = excluded.data,
          updated_at = excluded.updated_at
      `);
      stmt.run(this.collectionName, id, serialized, cleanData.createdAt, cleanData.updatedAt);
    } catch (err: any) {
      logger.error(`SQLite create error on [${this.collectionName}/${id}]:`, err.message);
      throw err;
    }

    return payload;
  }

  public async update(id: string, partialData: Partial<T>): Promise<void> {
    if (this.collectionName === 'audit_logs') {
      throw new Error('Audit logs are append-only and strictly immutable under enterprise governance.');
    }

    const existing = await this.findById(id);
    const updated: Record<string, any> = {
      ...(existing || {}),
      updatedAt: new Date().toISOString()
    };
    for (const [k, v] of Object.entries(partialData)) {
      if (v !== undefined) {
        updated[k] = v;
      }
    }

    const serialized = JSON.stringify(updated);
    try {
      const stmt = db.prepare(`
        INSERT INTO documents (collection, id, data, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(collection, id) DO UPDATE SET
          data = excluded.data,
          updated_at = excluded.updated_at
      `);
      stmt.run(this.collectionName, id, serialized, updated.createdAt || updated.updatedAt, updated.updatedAt);
    } catch (err: any) {
      logger.error(`SQLite update error on [${this.collectionName}/${id}]:`, err.message);
      throw err;
    }
  }

  public async delete(id: string): Promise<void> {
    if (this.collectionName === 'audit_logs') {
      throw new Error('Audit logs are append-only and strictly immutable under enterprise governance.');
    }

    try {
      const stmt = db.prepare('DELETE FROM documents WHERE collection = ? AND id = ?');
      stmt.run(this.collectionName, id);
    } catch (err: any) {
      logger.error(`SQLite delete error on [${this.collectionName}/${id}]:`, err.message);
      throw err;
    }
  }
}

// Backward-compatible alias for codebase continuity
export { BaseRepository as BaseFirestoreRepository };
export type FirestoreErrorInfo = RepositoryErrorInfo;
