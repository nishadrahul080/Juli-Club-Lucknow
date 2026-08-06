import React, { useState } from 'react';
import { ActivityLogItem } from '../utils/permissions';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  Trash2,
  Clock,
  User,
  Activity,
  CheckCircle2,
  Lock,
  FileText
} from 'lucide-react';

const INITIAL_LOGS: ActivityLogItem[] = [
  {
    id: 'log-101',
    timestamp: '2026-08-06 12:14:02',
    user: 'admin',
    role: 'Super Admin',
    action: 'LOGIN',
    module: 'Auth',
    details: 'User logged in successfully via SHA-256 password validation.',
    ipAddress: '192.168.1.42'
  },
  {
    id: 'log-102',
    timestamp: '2026-08-06 11:50:18',
    user: 'admin',
    role: 'Super Admin',
    action: 'SETTINGS_CHANGE',
    module: 'Settings',
    details: 'Updated global site settings & maintenance mode configuration.',
    ipAddress: '192.168.1.42'
  },
  {
    id: 'log-103',
    timestamp: '2026-08-06 10:22:10',
    user: 'seo_manager',
    role: 'SEO Manager',
    action: 'SEO_CHANGE',
    module: 'SEO',
    details: 'Generated dynamic XML Sitemap & updated breadcrumb schemas for Lucknow pages.',
    ipAddress: '10.0.4.15'
  },
  {
    id: 'log-104',
    timestamp: '2026-08-05 16:45:00',
    user: 'content_writer',
    role: 'Content Writer',
    action: 'PUBLISH',
    module: 'Blog',
    details: 'Published blog article: "Gomti Nagar Independent Escort Service Guide 2026".',
    ipAddress: '172.16.0.8'
  },
  {
    id: 'log-105',
    timestamp: '2026-08-05 14:10:33',
    user: 'admin',
    role: 'Super Admin',
    action: 'BACKUP_RESTORE',
    module: 'Backup',
    details: 'Created full CMS JSON snapshot backup (juli_club_cms_backup_20260805.json).',
    ipAddress: '192.168.1.42'
  }
];

export const ActivityLogsModule: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogItem[]>(() => {
    const saved = localStorage.getItem('juli_cms_activity_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>('all');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all audit logs? This action cannot be undone.')) {
      setLogs([]);
      localStorage.removeItem('juli_cms_activity_logs');
      showToast('Activity audit logs cleared.');
    }
  };

  const handleExportLogs = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(logs, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `juli_club_activity_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Activity logs exported to JSON.');
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = selectedActionFilter === 'all' || log.action === selectedActionFilter;
    return matchesSearch && matchesAction;
  });

  const getActionBadge = (act: string) => {
    switch (act) {
      case 'LOGIN':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'LOGOUT':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
      case 'CREATE':
      case 'PUBLISH':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'DELETE':
      case 'UNPUBLISH':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'SEO_CHANGE':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'SETTINGS_CHANGE':
        return 'bg-[#c5a059]/20 text-[#c5a059] border-[#c5a059]/40';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif text-white font-medium">System Activity & Audit Logs</h1>
            <p className="text-xs text-white/50">Comprehensive immutable audit trail of all administrative actions, changes, and logins</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportLogs}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/15 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#c5a059]" />
            Export Audit JSON
          </button>

          <button
            onClick={handleClearLogs}
            className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Logs
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-[#141414] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search log activity or user..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none"
          />
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-white/40">Action Type:</span>
          <select
            value={selectedActionFilter}
            onChange={e => setSelectedActionFilter(e.target.value)}
            className="bg-[#1c1c1c] border border-white/15 text-white text-xs rounded-xl px-3 py-2 outline-none"
          >
            <option value="all">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="LOGOUT">LOGOUT</option>
            <option value="CREATE">CREATE</option>
            <option value="EDIT">EDIT</option>
            <option value="DELETE">DELETE</option>
            <option value="PUBLISH">PUBLISH</option>
            <option value="SEO_CHANGE">SEO_CHANGE</option>
            <option value="SETTINGS_CHANGE">SETTINGS_CHANGE</option>
            <option value="BACKUP_RESTORE">BACKUP_RESTORE</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-[#1a1a1a] text-white/50 border-b border-white/10 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">User & Role</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4">Details</th>
                <th className="py-3.5 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-white/40 font-mono text-xs">
                    No activity logs recorded matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-white/60 whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-white block">@{log.user}</span>
                        <span className="text-[10px] text-white/40 uppercase font-mono">{log.role}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#c5a059]">
                      {log.module}
                    </td>

                    <td className="py-3.5 px-4 text-white/80 max-w-md">
                      {log.details}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-[11px] text-white/40">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
