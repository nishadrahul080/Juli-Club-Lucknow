import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getStoredCredentials,
  saveCredentials,
  verifyPassword,
  createSession,
  getValidSession,
  clearSession,
  getRateLimitState,
  recordFailedAttempt,
  resetRateLimit,
  AuthSession
} from '../utils/crypto';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  session: AuthSession | null;
  attempts: number;
  lockoutRemainingSeconds: number;
  login: (usernameInput: string, passwordInput: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateCredentials: (currentPassword: string, newUsername: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(() => getValidSession());
  const [rateLimit, setRateLimit] = useState(() => getRateLimitState());
  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState<number>(0);

  // Periodic session and lockout validator
  useEffect(() => {
    const timer = setInterval(() => {
      // Check session expiry
      const valid = getValidSession();
      if (!valid && session) {
        setSession(null);
      }

      // Check lockout countdown
      const state = getRateLimitState();
      setRateLimit(state);
      if (state.lockoutUntil) {
        const remaining = Math.max(0, Math.ceil((state.lockoutUntil - Date.now()) / 1000));
        setLockoutRemainingSeconds(remaining);
      } else {
        setLockoutRemainingSeconds(0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [session]);

  const login = async (usernameInput: string, passwordInput: string): Promise<{ success: boolean; error?: string }> => {
    const currentState = getRateLimitState();
    if (currentState.lockoutUntil && Date.now() < currentState.lockoutUntil) {
      const remainingMinutes = Math.ceil((currentState.lockoutUntil - Date.now()) / 60000);
      return {
        success: false,
        error: `Too many failed attempts. Login locked for ${remainingMinutes} more minute(s).`
      };
    }

    const creds = await getStoredCredentials();

    // Verify username (case insensitive check) and password
    if (usernameInput.trim().toLowerCase() !== creds.username.toLowerCase()) {
      const newState = recordFailedAttempt();
      setRateLimit(newState);
      const remaining = 5 - newState.attempts;
      return {
        success: false,
        error: remaining > 0 ? `Invalid credentials. ${remaining} attempt(s) remaining.` : 'Maximum attempts exceeded. Account locked out for 15 minutes.'
      };
    }

    const isMatch = await verifyPassword(passwordInput, creds);
    if (!isMatch) {
      const newState = recordFailedAttempt();
      setRateLimit(newState);
      const remaining = 5 - newState.attempts;
      return {
        success: false,
        error: remaining > 0 ? `Invalid credentials. ${remaining} attempt(s) remaining.` : 'Maximum attempts exceeded. Account locked out for 15 minutes.'
      };
    }

    // Success! Reset attempts and create session
    resetRateLimit();
    setRateLimit({ attempts: 0, lockoutUntil: null });
    const newSession = createSession(creds.username);
    setSession(newSession);
    return { success: true };
  };

  const logout = () => {
    clearSession();
    setSession(null);
  };

  const updateCredentials = async (
    currentPassword: string,
    newUsername: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    const creds = await getStoredCredentials();
    const isCurrentValid = await verifyPassword(currentPassword, creds);
    if (!isCurrentValid) {
      return { success: false, error: 'Current password confirmation failed.' };
    }

    if (!newUsername.trim() || newUsername.trim().length < 3) {
      return { success: false, error: 'Username must be at least 3 characters long.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    const updated = await saveCredentials(newUsername.trim(), newPassword);
    // Refresh active session username
    if (session) {
      const newSess = createSession(updated.username);
      setSession(newSess);
    }
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session,
        username: session ? session.username : null,
        session,
        attempts: rateLimit.attempts,
        lockoutRemainingSeconds,
        login,
        logout,
        updateCredentials
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
