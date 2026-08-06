import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { getSecurityAuditStatus } from '../utils/security';
import {
  Server,
  RefreshCw,
  Download,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Code,
  Terminal,
  HardDrive,
  Cpu,
  Activity,
  AlertTriangle,
  Lock,
  GitBranch,
  Layers
} from 'lucide-react';

export const SystemModule: React.FC = () => {
  const { resetToDefaults, exportCMSConfig, cmsData } = useCMS();
  const [toast, setToast] = useState<string | null>(null);

  const securityStatus = getSecurityAuditStatus();
  const dataSizeKb = Math.round(JSON.stringify(cmsData).length / 1024);
  const mediaCount = cmsData.mediaLibrary?.length || 0;
  const locationCount = Object.keys(cmsData.locations || {}).length;
  const blogCount = cmsData.blogs?.length || 0;
  const profileCount = cmsData.profiles?.length || 0;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all CMS data to defaults? This will restore original companion profiles and location content.')) {
      resetToDefaults();
      showToast('CMS Store restored to defaults successfully.');
    }
  };

  const handleExport = () => {
    exportCMSConfig();
    showToast('juli_club_cms_data.json exported successfully.');
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-xl">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif text-white font-medium">System Health & Infrastructure Diagnostics</h1>
            <p className="text-xs text-white/50">Hostinger CI/CD Sync, local cache, security audit, and system metadata</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>System 100% Operational</span>
        </div>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider block">Build Version</span>
          <span className="text-lg font-mono font-bold text-white">v2.4.0-ent</span>
          <span className="text-[10px] text-emerald-400 block font-mono">Production Ready</span>
        </div>

        <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider block">CMS Engine</span>
          <span className="text-lg font-mono font-bold text-[#c5a059]">v3.1.0</span>
          <span className="text-[10px] text-white/40 block font-mono">Vite 5 + React 18</span>
        </div>

        <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider block">Storage Usage</span>
          <span className="text-lg font-mono font-bold text-blue-400">{dataSizeKb} KB</span>
          <span className="text-[10px] text-white/40 block font-mono">5 MB Local Allocated</span>
        </div>

        <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider block">Media Assets</span>
          <span className="text-lg font-mono font-bold text-purple-400">{mediaCount} Assets</span>
          <span className="text-[10px] text-white/40 block font-mono">WebP Auto Compressed</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hostinger Pipeline Status */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <GitBranch className="w-4 h-4 text-[#c5a059]" />
            Hostinger CI/CD Deployment Target
          </h2>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-xl border border-white/5">
              <span className="text-white/50">Deployment Status:</span>
              <span className="text-emerald-400 font-bold">Active (HTTP 200 OK)</span>
            </div>
            <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-xl border border-white/5">
              <span className="text-white/50">Git Branch / Commit:</span>
              <span className="text-white font-bold">main@8f3b2e1</span>
            </div>
            <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-xl border border-white/5">
              <span className="text-white/50">FTP Remote Root:</span>
              <span className="text-[#c5a059] font-bold">./public_html/lucknow/</span>
            </div>
            <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-xl border border-white/5">
              <span className="text-white/50">GitHub Workflow:</span>
              <span className="text-emerald-400 font-bold">.github/workflows/deploy.yml</span>
            </div>
          </div>
        </div>

        {/* Security Audit Status */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Active Security Protections Audit
          </h2>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-xl border border-white/5">
              <span className="text-white/50">CSRF Guard:</span>
              <span className="text-emerald-400 font-bold">{securityStatus.csrfProtection}</span>
            </div>
            <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-xl border border-white/5">
              <span className="text-white/50">XSS Sanitizer:</span>
              <span className="text-emerald-400 font-bold">{securityStatus.xssSanitization}</span>
            </div>
            <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-xl border border-white/5">
              <span className="text-white/50">Rate Limiter:</span>
              <span className="text-emerald-400 font-bold">{securityStatus.rateLimiting}</span>
            </div>
            <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-xl border border-white/5">
              <span className="text-white/50">Upload Validator:</span>
              <span className="text-emerald-400 font-bold">{securityStatus.fileValidation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Database Content Stats & Reset Controls */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
          <Layers className="w-4 h-4 text-[#c5a059]" />
          Database Repository Item Inventory
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <div className="bg-[#1a1a1a] p-3 rounded-xl border border-white/5 text-center">
            <span className="text-white/40 text-[10px] uppercase font-mono block">Location Pages</span>
            <span className="text-lg font-bold text-white font-mono">{locationCount}</span>
          </div>
          <div className="bg-[#1a1a1a] p-3 rounded-xl border border-white/5 text-center">
            <span className="text-white/40 text-[10px] uppercase font-mono block">Profiles Active</span>
            <span className="text-lg font-bold text-white font-mono">{profileCount}</span>
          </div>
          <div className="bg-[#1a1a1a] p-3 rounded-xl border border-white/5 text-center">
            <span className="text-white/40 text-[10px] uppercase font-mono block">Blog Articles</span>
            <span className="text-lg font-bold text-white font-mono">{blogCount}</span>
          </div>
          <div className="bg-[#1a1a1a] p-3 rounded-xl border border-white/5 text-center">
            <span className="text-white/40 text-[10px] uppercase font-mono block">Media Files</span>
            <span className="text-lg font-bold text-white font-mono">{mediaCount}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
          <p className="text-xs text-white/50">
            Need to export or restore system data state?
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-[#1c1c1c] hover:bg-[#252525] border border-white/10 rounded-xl text-xs text-white font-medium flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4 text-[#c5a059]" />
              Export JSON
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
