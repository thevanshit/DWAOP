import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from './index';

const JWT_SECRET = process.env.JWT_SECRET || 'dwaop-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';
const REFRESH_TOKEN_EXPIRES_DAYS = 7;

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function generateRefreshToken(): { token: string; expiresAt: string } {
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);
  return { token, expiresAt: expiresAt.toISOString() };
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function saveRefreshToken(userId: string, token: string, expiresAt: string): void {
  db.prepare(`INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)`).run(
    uuidv4(), userId, token, expiresAt
  );
}

export function validateRefreshToken(token: string): string | null {
  const row = db.prepare(`SELECT user_id, expires_at FROM refresh_tokens WHERE token = ?`).get(token) as { user_id: string; expires_at: string } | undefined;
  
  if (!row) return null;
  
  if (new Date(row.expires_at) < new Date()) {
    db.prepare(`DELETE FROM refresh_tokens WHERE token = ?`).run(token);
    return null;
  }
  
  return row.user_id;
}

export function deleteRefreshToken(token: string): void {
  db.prepare(`DELETE FROM refresh_tokens WHERE token = ?`).run(token);
}

export function deleteUserRefreshTokens(userId: string): void {
  db.prepare(`DELETE FROM refresh_tokens WHERE user_id = ?`).run(userId);
}

export function getUserPermissions(role: string): string[] {
  const permissions: Record<string, string[]> = {
    student: [
      'view:own_profile', 'view:own_attendance', 'view:own_assignments', 'view:own_marks',
      'view:own_track_report', 'create:leave_request', 'submit:assignment', 'view:notifications'
    ],
    teacher: [
      'view:profile', 'view:subjects', 'manage:attendance', 'create:assignment',
      'grade:submission', 'manage:marks', 'create:task', 'view:notifications', 'view:students'
    ],
    hod: [
      'view:profile', 'view:department', 'manage:department', 'approve:leave',
      'manage:marks', 'view:all_workflows', 'manage:tasks', 'view:analytics', 'lock:marks'
    ],
    admin: [
      'manage:users', 'manage:departments', 'manage:subjects', 'manage:batches',
      'view:all_workflows', 'manage:all_tasks', 'view:audit_logs', 'manage:settings'
    ],
    auditor: [
      'view:audit_logs', 'view:all_workflows', 'view:reports'
    ]
  };
  
  return permissions[role] || [];
}

export function hasPermission(role: string, permission: string): boolean {
  return getUserPermissions(role).includes(permission);
}
