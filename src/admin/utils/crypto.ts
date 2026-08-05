/**
 * Security & Cryptography Utilities for Admin CMS Authentication
 * Standard Web Crypto API (SHA-256 with Salt)
 */

const DEFAULT_SALT = 'juli_club_lucknow_secure_salt_2026';
const STORAGE_CREDS_KEY = 'juli_cms_auth_credentials';
const STORAGE_SESSION_KEY = 'juli_cms_auth_session';
const STORAGE_ATTEMPTS_KEY = 'juli_cms_auth_attempts';

export interface AdminCredentials {
  username: string;
  passwordHash: string;
  salt: string;
  updatedAt: string;
}

export interface AuthSession {
  username: string;
  token: string;
  createdAt: number;
  expiresAt: number;
}

export interface RateLimitState {
  attempts: number;
  lockoutUntil: number | null;
}

/**
 * Computes SHA-256 hash using Web Crypto API
 */
export async function hashPassword(password: string, salt: string = DEFAULT_SALT): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Initializes default credentials if not present
 * Initial username: 'admin'
 * Initial default password is set safely via hash
 */
export async function getStoredCredentials(): Promise<AdminCredentials> {
  const raw = localStorage.getItem(STORAGE_CREDS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // Fallback if corrupt
    }
  }

  // Initial default salt and hash for initial setup ('admin' / 'admin123')
  const defaultSalt = crypto.randomUUID();
  const defaultHash = await hashPassword('admin123', defaultSalt);
  const initialCreds: AdminCredentials = {
    username: 'admin',
    passwordHash: defaultHash,
    salt: defaultSalt,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_CREDS_KEY, JSON.stringify(initialCreds));
  return initialCreds;
}

/**
 * Save new credentials (Username and Password)
 */
export async function saveCredentials(username: string, newPassword: string): Promise<AdminCredentials> {
  const newSalt = crypto.randomUUID();
  const newHash = await hashPassword(newPassword, newSalt);
  const creds: AdminCredentials = {
    username: username.trim(),
    passwordHash: newHash,
    salt: newSalt,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_CREDS_KEY, JSON.stringify(creds));
  return creds;
}

/**
 * Verifies username and password
 */
export async function verifyPassword(password: string, creds: AdminCredentials): Promise<boolean> {
  const testHash = await hashPassword(password, creds.salt);
  return testHash === creds.passwordHash;
}

/**
 * Session management (2 Hours Expiration by default)
 */
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

export function createSession(username: string): AuthSession {
  const now = Date.now();
  const session: AuthSession = {
    username,
    token: crypto.randomUUID(),
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
  };
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getValidSession(): AuthSession | null {
  const raw = localStorage.getItem(STORAGE_SESSION_KEY);
  if (!raw) return null;

  try {
    const session: AuthSession = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_SESSION_KEY);
}

/**
 * Rate Limiting & Brute Force Lockout Management
 * Max 5 failed attempts within 15 mins -> 15 min lockout
 */
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

export function getRateLimitState(): RateLimitState {
  const raw = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
  if (!raw) return { attempts: 0, lockoutUntil: null };

  try {
    const state: RateLimitState = JSON.parse(raw);
    if (state.lockoutUntil && Date.now() > state.lockoutUntil) {
      // Lockout expired, reset
      resetRateLimit();
      return { attempts: 0, lockoutUntil: null };
    }
    return state;
  } catch {
    resetRateLimit();
    return { attempts: 0, lockoutUntil: null };
  }
}

export function recordFailedAttempt(): RateLimitState {
  const current = getRateLimitState();
  const newAttempts = current.attempts + 1;
  let lockoutUntil: number | null = null;

  if (newAttempts >= MAX_ATTEMPTS) {
    lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
  }

  const newState: RateLimitState = {
    attempts: newAttempts,
    lockoutUntil,
  };

  localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify(newState));
  return newState;
}

export function resetRateLimit(): void {
  localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
}
