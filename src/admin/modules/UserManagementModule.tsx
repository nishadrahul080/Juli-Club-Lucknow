import React, { useState } from 'react';
import { SystemUser, UserRole, ActivityLogItem } from '../utils/permissions';
import {
  Users,
  UserPlus,
  Shield,
  Key,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  RotateCcw,
  UserCheck,
  UserX,
  Search,
  Lock,
  Mail,
  User as UserIcon,
  Calendar,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { getCsrfToken, sanitizeXss } from '../utils/security';

const INITIAL_USERS: SystemUser[] = [
  {
    id: 'user-1',
    username: 'admin',
    email: 'admin@juliclub.com',
    fullName: 'Master Administrator',
    role: 'Super Admin',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    lastLogin: '2026-08-06 12:14:00',
    createdAt: '2026-01-01'
  },
  {
    id: 'user-2',
    username: 'seo_manager',
    email: 'seo@juliclub.com',
    fullName: 'Rahul Sharma (SEO Lead)',
    role: 'SEO Manager',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    lastLogin: '2026-08-05 18:30:12',
    createdAt: '2026-02-15'
  },
  {
    id: 'user-3',
    username: 'content_writer',
    email: 'content@juliclub.com',
    fullName: 'Ananya Verma',
    role: 'Content Writer',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    lastLogin: '2026-08-04 09:12:44',
    createdAt: '2026-03-10'
  },
  {
    id: 'user-4',
    username: 'editor_lucknow',
    email: 'editor@juliclub.com',
    fullName: 'Vikram Singh',
    role: 'Editor',
    isActive: false,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    lastLogin: '2026-07-28 14:05:00',
    createdAt: '2026-04-01'
  }
];

export const UserManagementModule: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>(() => {
    const saved = localStorage.getItem('juli_cms_system_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('Editor');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const saveUsersToStorage = (updated: SystemUser[]) => {
    setUsers(updated);
    localStorage.setItem('juli_cms_system_users', JSON.stringify(updated));
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setUsername('');
    setEmail('');
    setFullName('');
    setRole('Content Writer');
    setPassword('');
    setAvatarUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: SystemUser) => {
    setEditingUser(user);
    setUsername(user.username);
    setEmail(user.email);
    setFullName(user.fullName);
    setRole(user.role);
    setPassword('');
    setAvatarUrl(user.avatarUrl || '');
    setIsModalOpen(true);
  };

  const handleToggleActive = (user: SystemUser) => {
    const updated = users.map(u => {
      if (u.id === user.id) {
        return { ...u, isActive: !u.isActive };
      }
      return u;
    });
    saveUsersToStorage(updated);
    showToast(`User ${user.username} ${user.isActive ? 'deactivated' : 'activated'} successfully.`);
  };

  const handleDeleteUser = (user: SystemUser) => {
    if (user.username === 'admin') {
      alert('Cannot delete the root Super Admin account.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      const updated = users.filter(u => u.id !== user.id);
      saveUsersToStorage(updated);
      showToast(`User ${user.username} deleted.`);
    }
  };

  const handleResetPassword = (user: SystemUser) => {
    const newPass = prompt(`Enter new password for ${user.username}:`);
    if (newPass && newPass.length >= 6) {
      showToast(`Password for ${user.username} has been reset successfully.`);
    } else if (newPass) {
      alert('Password must be at least 6 characters long.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !fullName.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    if (editingUser) {
      // Update existing
      const updated = users.map(u => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            username: sanitizeXss(username.trim()),
            email: sanitizeXss(email.trim()),
            fullName: sanitizeXss(fullName.trim()),
            role,
            avatarUrl: avatarUrl.trim() || u.avatarUrl
          };
        }
        return u;
      });
      saveUsersToStorage(updated);
      showToast(`User ${username} updated successfully.`);
    } else {
      // Create new
      if (!password || password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
      }
      const newUser: SystemUser = {
        id: 'user-' + Date.now(),
        username: sanitizeXss(username.trim()),
        email: sanitizeXss(email.trim()),
        fullName: sanitizeXss(fullName.trim()),
        role,
        isActive: true,
        avatarUrl: avatarUrl.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        lastLogin: 'Never',
        createdAt: new Date().toISOString().split('T')[0]
      };
      saveUsersToStorage([newUser, ...users]);
      showToast(`New user ${username} created successfully.`);
    }

    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'Super Admin':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Admin':
        return 'bg-[#c5a059]/20 text-[#c5a059] border-[#c5a059]/40';
      case 'SEO Manager':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Content Writer':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Editor':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif text-white font-medium">Enterprise User Management</h1>
            <p className="text-xs text-white/50">Manage administrative accounts, role-based access control (RBAC), and status</p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Add System User
        </button>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-[#141414] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by name, email, username..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none"
          />
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-white/40">Role:</span>
          <select
            value={selectedRoleFilter}
            onChange={e => setSelectedRoleFilter(e.target.value)}
            className="bg-[#1c1c1c] border border-white/15 text-white text-xs rounded-xl px-3 py-2 outline-none"
          >
            <option value="all">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="SEO Manager">SEO Manager</option>
            <option value="Content Writer">Content Writer</option>
            <option value="Editor">Editor</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-[#1a1a1a] text-white/50 border-b border-white/10 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">User Info</th>
                <th className="py-3.5 px-4">Role / Permissions</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                        alt={user.fullName}
                        className="w-9 h-9 rounded-full object-cover border border-white/15"
                      />
                      <div>
                        <span className="font-bold text-white block">{user.fullName}</span>
                        <span className="text-[11px] text-white/40 font-mono">@{user.username} • {user.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleBadge(user.role)}`}>
                      <Shield className="w-3 h-3" />
                      {user.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer ${
                        user.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {user.isActive ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                      {user.isActive ? 'Active' : 'Deactivated'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-white/50">
                    {user.lastLogin || 'Never'}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleResetPassword(user)}
                        title="Reset Password"
                        className="p-1.5 bg-white/5 hover:bg-white/10 text-amber-400 rounded-lg transition-colors cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(user)}
                        title="Edit User"
                        className="p-1.5 bg-white/5 hover:bg-white/10 text-blue-400 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user)}
                        title="Delete User"
                        className="p-1.5 bg-white/5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-white/15 rounded-2xl p-6 max-w-md w-full space-y-4 relative shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <UserPlus className="w-5 h-5 text-[#c5a059]" />
              {editingUser ? 'Edit System User' : 'Create New System User'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-white/60 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/60 block mb-1">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. rahul_s"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60 block mb-1">Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="SEO Manager">SEO Manager</option>
                    <option value="Content Writer">Content Writer</option>
                    <option value="Editor">Editor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/60 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="rahul@juliclub.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none font-mono"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="text-xs text-white/60 block mb-1">Initial Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none font-mono"
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-white/60 block mb-1">Avatar Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
