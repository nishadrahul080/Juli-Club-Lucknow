import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Key, User, Lock, CheckCircle2, AlertCircle, Clock, ShieldAlert } from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { username, updateCredentials, session, attempts, lockoutRemainingSeconds } = useAuth();

  const [newUsername, setNewUsername] = useState<string>(username || 'admin');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentPassword) {
      setErrorMsg('Please enter your current password to confirm changes.');
      return;
    }

    if (!newUsername.trim()) {
      setErrorMsg('Username cannot be empty.');
      return;
    }

    if (!newPassword) {
      setErrorMsg('Please enter a new password.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirm password do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await updateCredentials(currentPassword, newUsername, newPassword);
      if (res.success) {
        setSuccessMsg('Admin credentials updated successfully! New password is now active.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMsg(res.error || 'Failed to update credentials.');
      }
    } catch {
      setErrorMsg('An unexpected security error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="bg-[#141414] border border-white/10 rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 rounded-xl">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif text-white">Security & Admin Passcode Settings</h1>
            <p className="text-xs text-white/50">Manage admin credentials, password hashing, and session policies</p>
          </div>
        </div>

        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SHA-256 Hashing Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Credentials Form */}
        <div className="lg:col-span-2 bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-base font-medium text-white flex items-center gap-2">
              <User className="w-4 h-4 text-[#c5a059]" />
              Update Credentials
            </h2>
            <p className="text-xs text-white/50 mt-1">
              Change your username and admin passcode. Password is stored securely using Web Crypto SHA-256 salt hashing.
            </p>
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/80 uppercase tracking-wider block">
                Current Admin Passcode (Required)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current passcode"
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                />
                <Lock className="w-4 h-4 text-white/40 absolute right-3.5 top-3" />
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/80 uppercase tracking-wider block">
                  New Admin Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter new username"
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                  <User className="w-4 h-4 text-white/40 absolute right-3.5 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/80 uppercase tracking-wider block">
                    New Passcode
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/80 uppercase tracking-wider block">
                    Confirm New Passcode
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new passcode"
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#c5a059] hover:bg-[#d4b578] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg transition-colors cursor-pointer"
              >
                {isSubmitting ? 'Saving...' : 'Save Security Credentials'}
              </button>
            </div>
          </form>
        </div>

        {/* Security Overview Card */}
        <div className="space-y-6">
          <div className="bg-[#141414] border border-white/10 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-medium text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Clock className="w-4 h-4 text-[#c5a059]" />
              Active Session Status
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center text-white/70">
                <span>Active User:</span>
                <span className="text-[#c5a059] font-bold">{username}</span>
              </div>
              <div className="flex justify-between items-center text-white/70">
                <span>Session Expiry:</span>
                <span className="text-emerald-400 font-bold">2 Hours (Auto-Renew)</span>
              </div>
              <div className="flex justify-between items-center text-white/70">
                <span>Session ID:</span>
                <span className="text-white/40 text-[10px] truncate max-w-[120px]">
                  {session?.token || 'Active'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#141414] border border-white/10 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-medium text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <ShieldAlert className="w-4 h-4 text-[#c5a059]" />
              Brute Force Protection
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-white/70">
                <span>Failed Attempts:</span>
                <span className="font-mono font-bold text-white">{attempts} / 5</span>
              </div>
              <div className="flex justify-between items-center text-white/70">
                <span>Lockout Status:</span>
                {lockoutRemainingSeconds > 0 ? (
                  <span className="text-red-400 font-bold font-mono">Locked ({lockoutRemainingSeconds}s)</span>
                ) : (
                  <span className="text-emerald-400 font-bold">Clear (0 Lockouts)</span>
                )}
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed pt-2 border-t border-white/5">
                After 5 consecutive invalid passcode attempts, the CMS locks logins for 15 minutes to prevent unauthorized access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
