import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Server, RefreshCw, Download, RotateCcw, ShieldCheck, CheckCircle2, Code, Terminal, HardDrive } from 'lucide-react';

export const SystemModule: React.FC = () => {
  const { resetToDefaults, exportCMSConfig, cmsData } = useCMS();
  const [toast, setToast] = useState<string | null>(null);

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
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="bg-[#141414] border border-white/10 rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-xl">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif text-white">System & Infrastructure Diagnostics</h1>
            <p className="text-xs text-white/50">Hostinger CI/CD Sync, local cache, and environment metadata</p>
          </div>
        </div>

        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-full text-xs font-semibold">
          <Terminal className="w-3.5 h-3.5" />
          <span>Vite SPA Build</span>
        </div>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* System Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hostinger Pipeline Status */}
        <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-medium text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Server className="w-4 h-4 text-[#c5a059]" />
            Hostinger CI/CD Deployment Target
          </h2>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-lg border border-white/5">
              <span className="text-white/50">FTP Remote Root:</span>
              <span className="text-[#c5a059] font-bold">./lucknow/</span>
            </div>
            <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-lg border border-white/5">
              <span className="text-white/50">GitHub Workflow:</span>
              <span className="text-emerald-400 font-bold">.github/workflows/deploy.yml</span>
            </div>
            <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-lg border border-white/5">
              <span className="text-white/50">Install Command:</span>
              <span className="text-white font-bold">npm install</span>
            </div>
            <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-lg border border-white/5">
              <span className="text-white/50">Build Tool:</span>
              <span className="text-white font-bold">npm run build (Vite 5)</span>
            </div>
          </div>
        </div>

        {/* Local Storage & Cache Controls */}
        <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-medium text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <HardDrive className="w-4 h-4 text-[#c5a059]" />
            CMS Data & Cache Management
          </h2>

          <p className="text-xs text-white/60 leading-relaxed">
            Backup your current JSON configuration or reset local storage state to fresh defaults.
          </p>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#1c1c1c] hover:bg-[#252525] border border-white/10 rounded-lg text-xs text-white font-medium transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-[#c5a059]" />
                <span>Export CMS Config JSON</span>
              </div>
              <span className="text-[10px] text-white/40 font-mono">Download</span>
            </button>

            <button
              onClick={handleReset}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#1c1c1c] hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-lg text-xs text-white hover:text-red-400 font-medium transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-red-400" />
                <span>Reset Store to Default JSON</span>
              </div>
              <span className="text-[10px] text-red-400/60 font-mono">Restore</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
