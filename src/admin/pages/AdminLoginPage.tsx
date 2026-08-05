import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ShieldCheck, AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';

interface AdminLoginPageProps {
  onSuccessNavigate: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccessNavigate }) => {
  const { isAuthenticated, login, lockoutRemainingSeconds, attempts } = useAuth();

  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      onSuccessNavigate();
    }
  }, [isAuthenticated, onSuccessNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!usernameInput.trim()) {
      setErrorMsg('Please enter your admin username.');
      return;
    }

    if (!passwordInput) {
      setErrorMsg('Please enter your admin passcode.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login(usernameInput, passwordInput);
      if (res.success) {
        onSuccessNavigate();
      } else {
        setErrorMsg(res.error || 'Authentication failed.');
      }
    } catch {
      setErrorMsg('An unexpected security error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 selection:bg-[#c5a059] selection:text-black">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#c5a059] to-[#8a6d3b] flex items-center justify-center font-serif text-black font-bold text-2xl shadow-2xl mx-auto border border-[#c5a059]/40">
            J
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
              Juli Club Lucknow
            </h1>
            <p className="text-xs text-[#c5a059] font-bold uppercase tracking-widest mt-1">
              Secure Admin CMS Login
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#c5a059]/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="space-y-1">
            <h2 className="text-lg font-serif text-white font-medium">Administrator Authentication</h2>
            <p className="text-xs text-white/50">Enter credentials to unlock CMS background management.</p>
          </div>

          {lockoutRemainingSeconds > 0 && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs space-y-1 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Account Security Lockout Active</strong>
                <span>Maximum invalid attempts reached. Please wait {lockoutRemainingSeconds}s before retrying.</span>
              </div>
            </div>
          )}

          {errorMsg && lockoutRemainingSeconds === 0 && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  disabled={lockoutRemainingSeconds > 0}
                  placeholder="Enter admin username"
                  className="w-full bg-[#1c1c1c] border border-white/10 focus:border-[#c5a059] disabled:opacity-50 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-colors pr-10"
                  autoFocus
                />
                <User className="w-4 h-4 text-white/40 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block">
                Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  disabled={lockoutRemainingSeconds > 0}
                  placeholder="Enter admin passcode"
                  className="w-full bg-[#1c1c1c] border border-white/10 focus:border-[#c5a059] disabled:opacity-50 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-colors pr-10"
                />
                <Lock className="w-4 h-4 text-white/40 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || lockoutRemainingSeconds > 0}
              className="w-full py-3 bg-[#c5a059] hover:bg-[#d4b578] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {attempts > 0 && lockoutRemainingSeconds === 0 && (
            <p className="text-[10px] text-amber-400 text-center font-mono">
              ⚠️ Warning: {attempts}/5 invalid login attempts recorded.
            </p>
          )}

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
              SHA-256 Encrypted
            </span>
            <a href="/" className="hover:text-white transition-colors">
              ← Back to Site
            </a>
          </div>
        </div>

        <p className="text-center text-[11px] text-white/30">
          Juli Club Lucknow CMS Architecture • Hostinger Pipeline Secured
        </p>
      </div>
    </div>
  );
};
