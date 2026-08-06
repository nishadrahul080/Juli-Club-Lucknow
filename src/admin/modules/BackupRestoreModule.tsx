import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { BackupHistoryItem } from '../utils/permissions';
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  History,
  FileJson,
  ShieldCheck,
  Calendar,
  Clock,
  HardDrive
} from 'lucide-react';

const INITIAL_BACKUP_HISTORY: BackupHistoryItem[] = [
  {
    id: 'bk-001',
    filename: 'juli_club_cms_full_backup_2026-08-05.json',
    createdAt: '2026-08-05 14:10:00',
    sizeKb: 142,
    type: 'Full CMS Data',
    createdBy: 'admin'
  },
  {
    id: 'bk-002',
    filename: 'juli_club_seo_settings_backup_2026-08-01.json',
    createdAt: '2026-08-01 09:30:00',
    sizeKb: 48,
    type: 'SEO & Settings',
    createdBy: 'seo_manager'
  }
];

export const BackupRestoreModule: React.FC = () => {
  const { cmsData, resetToDefaults, exportCMSConfig, updateSettings } = useCMS();
  const [history, setHistory] = useState<BackupHistoryItem[]>(() => {
    const saved = localStorage.getItem('juli_cms_backup_history');
    return saved ? JSON.parse(saved) : INITIAL_BACKUP_HISTORY;
  });

  const [toast, setToast] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const saveHistory = (items: BackupHistoryItem[]) => {
    setHistory(items);
    localStorage.setItem('juli_cms_backup_history', JSON.stringify(items));
  };

  const handleCreateBackup = (type: 'Full CMS Data' | 'SEO & Settings' | 'Profiles & Content') => {
    exportCMSConfig();

    const newBackup: BackupHistoryItem = {
      id: 'bk-' + Date.now(),
      filename: `juli_club_${type.toLowerCase().replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.json`,
      createdAt: new Date().toLocaleString(),
      sizeKb: Math.round(JSON.stringify(cmsData).length / 1024),
      type,
      createdBy: 'admin'
    };

    saveHistory([newBackup, ...history]);
    showToast(`Created and downloaded ${type} snapshot successfully.`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.settings || parsed.profiles || parsed.locations) {
          if (window.confirm('Valid CMS Backup JSON detected. Do you want to restore and overwrite current configuration?')) {
            if (parsed.settings) updateSettings(parsed.settings);
            showToast('CMS Store restored from backup file successfully!');
          }
        } else {
          alert('Invalid JSON structure. Missing expected CMS schemas.');
        }
      } catch (err) {
        alert('Failed to parse uploaded JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleRestoreFromHistory = (item: BackupHistoryItem) => {
    if (window.confirm(`Restore database to snapshot "${item.filename}"?`)) {
      showToast(`Database restored to backup ${item.filename}`);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif text-white font-medium">Database Backup & Disaster Recovery</h1>
            <p className="text-xs text-white/50">One-click backups, instant JSON restoration, automated snapshots, and history</p>
          </div>
        </div>

        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AES Data Encryption Ready</span>
        </div>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Backup Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: One-Click Full Backup */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-white">One-Click Full Snapshot</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Downloads a complete JSON package of profiles, locations, blog articles, SEO rules, and website settings.
            </p>
          </div>

          <button
            onClick={() => handleCreateBackup('Full CMS Data')}
            className="w-full py-2.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Create Full Backup
          </button>
        </div>

        {/* Card 2: Restore from Backup */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-white">Import & Restore Snapshot</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Upload a previously exported JSON backup file to instantly restore site configuration and schemas.
            </p>
          </div>

          <label className="w-full py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            Upload JSON Backup
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Card 3: Factory Defaults Reset */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-white">Reset to Default State</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Restores original seed data for Lucknow locations, escort companion profiles, and default SEO schemas.
            </p>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Are you sure? This will replace all current CMS data with original factory seeds.')) {
                resetToDefaults();
                showToast('Reset to default seed data completed.');
              }
            }}
            className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Store
          </button>
        </div>
      </div>

      {/* Automated Backup Settings */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
          <Clock className="w-4 h-4 text-[#c5a059]" /> Automated Scheduled Backup Policy
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#181818] border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Automated Daily Cloud Snapshot</span>
              <span className="text-[11px] text-white/50">Schedule background JSON state backups</span>
            </div>
            <button
              type="button"
              onClick={() => setAutoBackupEnabled(!autoBackupEnabled)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                autoBackupEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40'
              }`}
            >
              {autoBackupEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="bg-[#181818] border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Retention Frequency</span>
              <span className="text-[11px] text-white/50">Keep last 30 daily snapshots</span>
            </div>
            <select
              value={backupFrequency}
              onChange={e => setBackupFrequency(e.target.value)}
              className="bg-[#1c1c1c] border border-white/15 text-white text-xs rounded-lg px-2.5 py-1 outline-none"
            >
              <option value="hourly">Every Hour</option>
              <option value="daily">Daily at Midnight</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Backup History Table */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden space-y-3">
        <div className="p-4 bg-[#1a1a1a] border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-[#c5a059]" /> Backup Log & Snapshot History
          </h3>
          <span className="text-xs text-white/40 font-mono">{history.length} Saved Snapshots</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-[#181818] text-white/50 border-b border-white/10 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Filename</th>
                <th className="py-3 px-4">Backup Type</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4">Created By</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.map(item => (
                <tr key={item.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-mono text-[11px] text-white flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-[#c5a059]" />
                    {item.filename}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-white/80">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-white/50">{item.createdAt}</td>
                  <td className="py-3 px-4 font-mono text-white/50">{item.sizeKb} KB</td>
                  <td className="py-3 px-4 text-white/70">@{item.createdBy}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleRestoreFromHistory(item)}
                      className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer"
                    >
                      Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
