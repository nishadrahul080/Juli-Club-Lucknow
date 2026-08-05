import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Home,
  MapPin,
  Users,
  Image as ImageIcon,
  Search,
  Star,
  HelpCircle,
  Settings,
  Server,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ activeTab, onSelectTab, children }) => {
  const { username, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'homepage', label: 'Homepage', icon: <Home className="w-4 h-4" /> },
    { id: 'location-pages', label: 'Location Pages', icon: <MapPin className="w-4 h-4" /> },
    { id: 'profiles', label: 'Profiles', icon: <Users className="w-4 h-4" /> },
    { id: 'media-library', label: 'Media Library', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'seo', label: 'SEO', icon: <Search className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'system', label: 'System', icon: <Server className="w-4 h-4" /> },
  ];

  const activeItem = navItems.find((item) => item.id === activeTab) || navItems[0];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row font-sans selection:bg-[#c5a059] selection:text-black">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#121212] border-r border-white/10 shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#c5a059] to-[#8a6d3b] flex items-center justify-center font-serif text-black font-bold text-lg shadow-lg">
              J
            </div>
            <div>
              <h2 className="font-serif font-bold text-white text-base tracking-wide leading-tight">Juli Club</h2>
              <span className="text-[10px] text-[#c5a059] font-bold uppercase tracking-widest block">Admin CMS Portal</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
            Main Management
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#c5a059] text-black font-bold shadow-md shadow-[#c5a059]/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-black' : 'text-[#c5a059]'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-black shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* Admin User Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0f0f0f] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] font-bold text-xs uppercase">
              {username ? username.charAt(0) : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{username || 'Admin User'}</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Authenticated Session
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#121212] border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#c5a059] flex items-center justify-center font-serif text-black font-bold text-sm">
            J
          </div>
          <div>
            <span className="font-serif font-bold text-white text-sm">Juli Club Admin</span>
            <span className="text-[10px] text-[#c5a059] block font-mono uppercase">{activeItem.label}</span>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-white/10 text-white rounded-lg border border-white/10"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#141414] border-b border-white/10 p-4 space-y-2 sticky top-[65px] z-30 shadow-2xl">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-medium ${
                  isActive
                    ? 'bg-[#c5a059] text-black font-bold'
                    : 'text-white/80 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-black' : 'text-[#c5a059]'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-white/50">Logged in as: <strong className="text-[#c5a059]">{username}</strong></span>
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded text-xs font-bold"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 bg-[#121212]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#c5a059]/10 text-[#c5a059] rounded-lg border border-[#c5a059]/20">
              {activeItem.icon}
            </div>
            <div>
              <h1 className="text-lg font-serif text-white font-medium">{activeItem.label}</h1>
              <span className="text-[11px] text-white/40 font-sans">Juli Club Lucknow CMS Control Hub</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 rounded-lg text-xs transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#c5a059]" />
            </a>

            <div className="h-4 w-px bg-white/10"></div>

            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
