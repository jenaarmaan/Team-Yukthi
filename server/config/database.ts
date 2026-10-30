import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.ts';

export interface DatabaseGatewayState {
  isInitialized: boolean;
  engine: 'sqlite3_builtin';
  databasePath: string;
  isWalMode: boolean;
  tablesCount: number;
}

const resolveDbPath = (): string => {
  const envPath = process.env.DATABASE_PATH;
  if (envPath) {
    return path.resolve(process.cwd(), envPath);
  }
  return path.resolve(process.cwd(), 'data', 'niyojan.db');
};

const dbPath = resolveDbPath();
const dbDir = path.dirname(dbPath);

// Ensure the directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(dbPath);

// Initialize SQLite Schema and High-Performance Pragmas
export const initializeDatabase = (): void => {
  try {
    // 1. Pragmas for concurrency and durability
    db.exec(`
      PRAGMA busy_timeout = 5000;
    `);

    try {
      db.exec(`
        PRAGMA journal_mode = WAL;
        PRAGMA synchronous = NORMAL;
        PRAGMA foreign_keys = ON;
      `);
    } catch {
      // Ignore if another worker already set WAL mode
    }

    // 2. Primary polymorphic document store for all 19 NIYOJAN collections
    db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        collection TEXT NOT NULL,
        id TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        PRIMARY KEY (collection, id)
      );
      CREATE INDEX IF NOT EXISTS idx_documents_collection ON documents (collection);
    `);

    // 3. Distributed locks table for atomic concurrency and slot/panel reservations
    db.exec(`
      CREATE TABLE IF NOT EXISTS distributed_locks (
        lock_key TEXT PRIMARY KEY,
        holder_id TEXT NOT NULL,
        data TEXT,
        acquired_at TEXT NOT NULL
      );
    `);

    // 4. Used attendance nonces table for QR token replay prevention
    db.exec(`
      CREATE TABLE IF NOT EXISTS used_attendance_nonces (
        nonce TEXT PRIMARY KEY,
        candidate_id TEXT NOT NULL,
        slot_id TEXT,
        hiring_drive_id TEXT,
        consumed_at TEXT NOT NULL
      );
    `);

    // 5. Idempotency keys table for application and evaluation deduplication
    db.exec(`
      CREATE TABLE IF NOT EXISTS idempotency_keys (
        key TEXT PRIMARY KEY,
        actor_id TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);

    logger.info(`SQLite Database successfully initialized at: ${dbPath} (WAL Mode enabled)`);
  } catch (err) {
    logger.error('Failed to initialize SQLite database tables:', err);
    throw err;
  }
};

// Initialize schema on load
initializeDatabase();

/**
 * Executes a function within an atomic SQLite transaction.
 */
export const runTransaction = <T>(fn: () => T): T => {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    try {
      db.exec('ROLLBACK');
    } catch {
      // rollback could fail if already rolled back
    }
    throw err;
  }
};

export const getDatabaseGatewayStatus = (): DatabaseGatewayState => {
  let isWal = false;
  try {
    const row = db.prepare('PRAGMA journal_mode').get() as any;
    isWal = row?.journal_mode?.toLowerCase() === 'wal';
  } catch {
    // fallback
  }

  let tablesCount = 0;
  try {
    const row = db.prepare("SELECT count(*) as count FROM sqlite_master WHERE type='table'").get() as any;
    tablesCount = row?.count || 0;
  } catch {
    // fallback
  }

  return {
    isInitialized: true,
    engine: 'sqlite3_builtin',
    databasePath: dbPath,
    isWalMode: isWal,
    tablesCount
  };
};

