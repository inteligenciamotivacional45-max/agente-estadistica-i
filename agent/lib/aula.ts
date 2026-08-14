import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { isTeacherEmail, normalizeEmail } from "./umss";

const DEFAULT_NOTICE =
  "El aula aún no está habilitada. El docente la abrirá durante el periodo de clase.";

export type AulaState = {
  isOpen: boolean;
  notice: string;
  updatedAt: string;
  updatedBy: string | null;
};

export type StudentRecord = {
  email: string;
  name: string;
  firstSeen: string;
  lastSeen: string;
};

type AulaRow = {
  is_open: number;
  notice: string;
  updated_at: string;
  updated_by: string | null;
};

type StudentRow = {
  email: string;
  name: string;
  first_seen: string;
  last_seen: string;
};

let database: DatabaseSync | undefined;

export function aulaDatabasePath(): string {
  return process.env.AULA_DB_PATH ?? join(process.cwd(), ".eve", ".workflow-data", "aula.sqlite");
}

function getDatabase(): DatabaseSync {
  if (database !== undefined) {
    return database;
  }

  const path = aulaDatabasePath();
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA busy_timeout = 5000;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS aula_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      is_open INTEGER NOT NULL DEFAULT 0,
      notice TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL,
      updated_by TEXT
    );
    CREATE TABLE IF NOT EXISTS students (
      email TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      first_seen TEXT NOT NULL,
      last_seen TEXT NOT NULL
    );
  `);

  const existing = db.prepare("SELECT id FROM aula_state WHERE id = 1").get();
  if (existing === undefined) {
    db.prepare(
      "INSERT INTO aula_state (id, is_open, notice, updated_at, updated_by) VALUES (1, 0, ?, ?, NULL)",
    ).run(DEFAULT_NOTICE, new Date().toISOString());
  }

  database = db;
  return db;
}

export function getAulaState(): AulaState {
  const row = getDatabase().prepare("SELECT is_open, notice, updated_at, updated_by FROM aula_state WHERE id = 1").get() as
    | AulaRow
    | undefined;

  if (row === undefined) {
    return {
      isOpen: false,
      notice: DEFAULT_NOTICE,
      updatedAt: new Date().toISOString(),
      updatedBy: null,
    };
  }

  return {
    isOpen: row.is_open === 1,
    notice: row.notice,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  };
}

export function setAulaOpen(isOpen: boolean, updatedBy: string): AulaState {
  getDatabase()
    .prepare("UPDATE aula_state SET is_open = ?, updated_at = ?, updated_by = ? WHERE id = 1")
    .run(isOpen ? 1 : 0, new Date().toISOString(), normalizeEmail(updatedBy));
  getDatabase().exec("PRAGMA wal_checkpoint(PASSIVE);");
  return getAulaState();
}

export function setAulaNotice(notice: string, updatedBy: string): AulaState {
  const text = notice.trim().length === 0 ? DEFAULT_NOTICE : notice.trim();
  getDatabase()
    .prepare("UPDATE aula_state SET notice = ?, updated_at = ?, updated_by = ? WHERE id = 1")
    .run(text, new Date().toISOString(), normalizeEmail(updatedBy));
  return getAulaState();
}

export function recordStudentVisit(email: string, name: string | null | undefined): void {
  const normalized = normalizeEmail(email);
  if (normalized.length === 0 || isTeacherEmail(normalized)) {
    return;
  }

  const now = new Date().toISOString();
  const displayName = name?.trim() || normalized;
  const db = getDatabase();
  const existing = db.prepare("SELECT email FROM students WHERE email = ?").get(normalized) as
    | { email: string }
    | undefined;

  if (existing === undefined) {
    db.prepare(
      "INSERT INTO students (email, name, first_seen, last_seen) VALUES (?, ?, ?, ?)",
    ).run(normalized, displayName, now, now);
    return;
  }

  db.prepare("UPDATE students SET name = ?, last_seen = ? WHERE email = ?").run(
    displayName,
    now,
    normalized,
  );
}

export function listStudents(): StudentRecord[] {
  const rows = getDatabase()
    .prepare("SELECT email, name, first_seen, last_seen FROM students ORDER BY last_seen DESC")
    .all() as StudentRow[];

  return rows.map((row) => ({
    email: row.email,
    name: row.name,
    firstSeen: row.first_seen,
    lastSeen: row.last_seen,
  }));
}

export function closedAulaMessage(state = getAulaState()): string {
  const notice = state.notice.trim();
  if (notice.length > 0) {
    return notice;
  }
  return DEFAULT_NOTICE;
}
