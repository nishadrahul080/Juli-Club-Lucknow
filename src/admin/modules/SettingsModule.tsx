import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { useAuth } from '../context/AuthContext';
import { SiteSettings, NavItemConfig, QuickLinkConfig, PopupConfig, ThemeConfig } from '../../data/cmsStore';
import { MediaPickerModal } from '../media/components/MediaPickerModal';
import {
  Globe,
  Sliders,
  Image as ImageIcon,
  MessageSquare,
  Phone,
  Mail,
  Share2,
  Menu,
  FileText,
  Code,
  Shield,
  Key,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  Sparkles,
  Palette,
  Bell,
  Send,
  Zap,
  Check,
  Server,
  ShieldCheck,
  Clock,
  ShieldAlert,
  Layers
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { cmsData, updateSettings } = useCMS();
  const { username, updateCredentials, session, attempts, lockoutRemainingSeconds } = useAuth();

  // Active Category Tab
  const [activeTab, setActiveTab] = useState<
    'general' | 'contact' | 'navigation' | 'footer' | 'whatsapp' | 'popups' | 'theme' | 'custom_code' | 'integrations' | 'email' | 'security'
  >('general');

  // Master Form State initialized from CMS Context
  const [form, setForm] = useState<SiteSettings>(cmsData.settings);

  // Security Credentials Form State
  const [newUsername, setNewUsername] = useState<string>(username || 'admin');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Toast / Messages State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmittingCredentials, setIsSubmittingCredentials] = useState<boolean>(false);
  const [mediaPickerTargetField, setMediaPickerTargetField] = useState<keyof SiteSettings | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Field change handler
  const handleChange = (field: keyof SiteSettings, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Master Save Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    showToast('Global Website Settings saved & synced successfully!');
  };

  // Credentials Submit Handler
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

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

    setIsSubmittingCredentials(true);

    try {
      const res = await updateCredentials(currentPassword, newUsername, newPassword);
      if (res.success) {
        showToast('Admin credentials updated! New password is now active.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMsg(res.error || 'Failed to update credentials.');
      }
    } catch {
      setErrorMsg('An unexpected security error occurred.');
    } finally {
      setIsSubmittingCredentials(false);
    }
  };

  // Logo file upload helper (data URL conversion for CMS storage)
  const handleFileUpload = (field: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(field, reader.result as string);
        showToast('Asset uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const ensureArray = <T,>(val: any): T[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // ignore
      }
    }
    return [];
  };

  // Navigation Menu Helpers
  const navMenu = ensureArray<NavItemConfig>(form.navigationMenu);
  const handleNavChange = (index: number, key: keyof NavItemConfig, val: any) => {
    const updated = [...navMenu];
    updated[index] = { ...updated[index], [key]: val };
    handleChange('navigationMenu', updated);
  };

  const handleAddNavItem = () => {
    const newItem: NavItemConfig = {
      id: `nav-${Date.now()}`,
      label: 'New Menu Item',
      url: '#',
      show: true,
      order: navMenu.length + 1
    };
    handleChange('navigationMenu', [...navMenu, newItem]);
  };

  const handleRemoveNavItem = (id: string) => {
    handleChange(
      'navigationMenu',
      navMenu.filter(item => item.id !== id)
    );
  };

  // Footer Quick Links Helpers
  const quickLinks = ensureArray<QuickLinkConfig>(form.footerQuickLinks);
  const handleQuickLinkChange = (index: number, key: keyof QuickLinkConfig, val: any) => {
    const updated = [...quickLinks];
    updated[index] = { ...updated[index], [key]: val };
    handleChange('footerQuickLinks', updated);
  };

  const handleAddQuickLink = () => {
    const newLink: QuickLinkConfig = {
      id: `ql-${Date.now()}`,
      label: 'New Quick Link',
      url: '#'
    };
    handleChange('footerQuickLinks', [...quickLinks, newLink]);
  };

  const handleRemoveQuickLink = (id: string) => {
    handleChange(
      'footerQuickLinks',
      quickLinks.filter(item => item.id !== id)
    );
  };

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-[#c5a059] selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn sticky top-4 z-50 shadow-2xl">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#c5a059]/10 text-[#c5a059] rounded-xl border border-[#c5a059]/30">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold text-white">Global Website Configuration Suite</h1>
              <span className="px-2 py-0.5 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 rounded text-[10px] font-bold uppercase">
                Core CMS Settings
              </span>
            </div>
            <p className="text-xs text-white/60">
              Manage global brand metadata, header/footer navigation, contact info, integrations, popups, and security policies.
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <Check className="w-4 h-4" /> Save All Global Changes
        </button>
      </div>

      {/* Category Tabs */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-2 flex flex-wrap items-center gap-1.5 shadow-xl">
        {[
          { id: 'general', label: 'General & Branding', icon: <Globe className="w-3.5 h-3.5" /> },
          { id: 'contact', label: 'Contact & Social', icon: <Phone className="w-3.5 h-3.5" /> },
          { id: 'navigation', label: 'Header & Navigation', icon: <Menu className="w-3.5 h-3.5" /> },
          { id: 'footer', label: 'Footer & Legal', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'whatsapp', label: 'WhatsApp Settings', icon: <MessageSquare className="w-3.5 h-3.5" /> },
          { id: 'popups', label: 'Popups & Banners', icon: <Bell className="w-3.5 h-3.5" /> },
          { id: 'theme', label: 'Theme Settings', icon: <Palette className="w-3.5 h-3.5" /> },
          { id: 'custom_code', label: 'Custom Scripts & CSS', icon: <Code className="w-3.5 h-3.5" /> },
          { id: 'integrations', label: 'Integrations & Analytics', icon: <Zap className="w-3.5 h-3.5" /> },
          { id: 'email', label: 'SMTP Email Config', icon: <Server className="w-3.5 h-3.5" /> },
          { id: 'security', label: 'Security & Modes', icon: <ShieldCheck className="w-3.5 h-3.5" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#c5a059] text-black shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSaveSettings}>
        {/* TAB 1: GENERAL & BRANDING */}
        {activeTab === 'general' && (
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
            <h3 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#c5a059]" />
              General Brand Information & Assets
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">Website Name</label>
                <input
                  type="text"
                  value={form.websiteName || ''}
                  onChange={e => handleChange('websiteName', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Brand Name</label>
                <input
                  type="text"
                  value={form.brandName || ''}
                  onChange={e => handleChange('brandName', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-white mb-1">Website Tagline</label>
                <input
                  type="text"
                  value={form.websiteTagline || ''}
                  onChange={e => handleChange('websiteTagline', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-white mb-1">Company Description</label>
                <textarea
                  rows={3}
                  value={form.companyDescription || ''}
                  onChange={e => handleChange('companyDescription', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Copyright Text</label>
                <input
                  type="text"
                  value={form.copyrightText || ''}
                  onChange={e => handleChange('copyrightText', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Footer Text Summary</label>
                <input
                  type="text"
                  value={form.footerText || ''}
                  onChange={e => handleChange('footerText', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>
            </div>

            {/* Asset Uploads Section */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#c5a059]" /> Logo & Favicon Assets
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Header Logo */}
                <div className="bg-[#181818] border border-white/10 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-white block">Main Header Logo</span>
                  {form.logoUrl ? (
                    <div className="relative h-16 bg-black/40 rounded-lg flex items-center justify-center p-2 border border-white/10">
                      <img src={form.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                      <button
                        type="button"
                        onClick={() => handleChange('logoUrl', '')}
                        className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded hover:bg-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-16 bg-black/20 border border-dashed border-white/20 rounded-lg flex items-center justify-center text-white/40 text-[11px]">
                      Default Text Logo
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Image URL or upload below"
                    value={form.logoUrl || ''}
                    onChange={e => handleChange('logoUrl', e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMediaPickerTargetField('logoUrl')}
                      className="flex-1 py-1.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Media Library
                    </button>
                    <label className="flex-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-[#c5a059]" /> Upload
                      <input type="file" accept="image/*" onChange={handleFileUpload('logoUrl')} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Footer Logo */}
                <div className="bg-[#181818] border border-white/10 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-white block">Footer Logo</span>
                  {form.footerLogoUrl ? (
                    <div className="relative h-16 bg-black/40 rounded-lg flex items-center justify-center p-2 border border-white/10">
                      <img src={form.footerLogoUrl} alt="Footer Logo" className="max-h-full max-w-full object-contain" />
                      <button
                        type="button"
                        onClick={() => handleChange('footerLogoUrl', '')}
                        className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded hover:bg-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-16 bg-black/20 border border-dashed border-white/20 rounded-lg flex items-center justify-center text-white/40 text-[11px]">
                      Default Footer Logo
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Footer Image URL"
                    value={form.footerLogoUrl || ''}
                    onChange={e => handleChange('footerLogoUrl', e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMediaPickerTargetField('footerLogoUrl')}
                      className="flex-1 py-1.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Media Library
                    </button>
                    <label className="flex-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-[#c5a059]" /> Upload
                      <input type="file" accept="image/*" onChange={handleFileUpload('footerLogoUrl')} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Favicon */}
                <div className="bg-[#181818] border border-white/10 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-white block">Website Favicon</span>
                  {form.faviconUrl ? (
                    <div className="relative h-16 bg-black/40 rounded-lg flex items-center justify-center p-2 border border-white/10">
                      <img src={form.faviconUrl} alt="Favicon" className="w-8 h-8 object-contain" />
                      <button
                        type="button"
                        onClick={() => handleChange('faviconUrl', '')}
                        className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded hover:bg-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-16 bg-black/20 border border-dashed border-white/20 rounded-lg flex items-center justify-center text-white/40 text-[11px]">
                      Default Favicon
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Favicon URL"
                    value={form.faviconUrl || ''}
                    onChange={e => handleChange('faviconUrl', e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMediaPickerTargetField('faviconUrl')}
                      className="flex-1 py-1.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Media Library
                    </button>
                    <label className="flex-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-[#c5a059]" /> Upload
                      <input type="file" accept="image/x-icon,image/png" onChange={handleFileUpload('faviconUrl')} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTACT & SOCIAL */}
        {activeTab === 'contact' && (
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
            <h3 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#c5a059]" />
              Official Contact Numbers & Social Profile URLs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">Primary WhatsApp Number</label>
                <input
                  type="text"
                  placeholder="e.g. 918726179837"
                  value={form.whatsappNumber || ''}
                  onChange={e => handleChange('whatsappNumber', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-[#25D366] font-mono font-bold focus:border-[#c5a059] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Secondary WhatsApp Number</label>
                <input
                  type="text"
                  placeholder="e.g. 918726179837"
                  value={form.secondaryWhatsApp || ''}
                  onChange={e => handleChange('secondaryWhatsApp', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-[#25D366] font-mono font-bold focus:border-[#c5a059] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Public Phone Number</label>
                <input
                  type="text"
                  value={form.contactPhone || ''}
                  onChange={e => handleChange('contactPhone', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Support Email Address</label>
                <input
                  type="email"
                  value={form.contactEmail || ''}
                  onChange={e => handleChange('contactEmail', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-4">
              <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#c5a059]" /> Social Media & Messenger Links
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white mb-1">Facebook Page URL</label>
                  <input
                    type="text"
                    value={form.facebookUrl || ''}
                    onChange={e => handleChange('facebookUrl', e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">Instagram Handle URL</label>
                  <input
                    type="text"
                    value={form.instagramUrl || ''}
                    onChange={e => handleChange('instagramUrl', e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">X (Twitter) Handle URL</label>
                  <input
                    type="text"
                    value={form.twitterUrl || ''}
                    onChange={e => handleChange('twitterUrl', e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">Telegram Channel / User Link</label>
                  <input
                    type="text"
                    value={form.telegramUrl || ''}
                    onChange={e => handleChange('telegramUrl', e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-white mb-1">YouTube Channel URL</label>
                  <input
                    type="text"
                    value={form.youtubeUrl || ''}
                    onChange={e => handleChange('youtubeUrl', e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HEADER & NAVIGATION */}
        {activeTab === 'navigation' && (
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <Menu className="w-4 h-4 text-[#c5a059]" />
                Header Navigation Links & Top Bar CTA
              </h3>

              <button
                type="button"
                onClick={handleAddNavItem}
                className="px-3 py-1.5 bg-[#c5a059] text-black font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Menu Item
              </button>
            </div>

            <div className="space-y-3">
              {navMenu.map((item, idx) => (
                <div key={item.id} className="bg-[#181818] border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
                  <span className="w-6 text-center text-xs font-bold font-mono text-[#c5a059]">{idx + 1}</span>

                  <input
                    type="text"
                    value={item.label}
                    onChange={e => handleNavChange(idx, 'label', e.target.value)}
                    placeholder="Menu Label"
                    className="flex-1 bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />

                  <input
                    type="text"
                    value={item.url}
                    onChange={e => handleNavChange(idx, 'url', e.target.value)}
                    placeholder="Target URL (e.g. #profiles or /blog)"
                    className="flex-1 bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />

                  <button
                    type="button"
                    onClick={() => handleNavChange(idx, 'show', !item.show)}
                    className={`px-2.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                      item.show ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {item.show ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{item.show ? 'Visible' : 'Hidden'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveNavItem(item.id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Header CTA Button */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#c5a059]" /> Header CTA Button Configuration
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white mb-1">Header CTA Button Text</label>
                  <input
                    type="text"
                    value={form.headerCtaText || ''}
                    onChange={e => handleChange('headerCtaText', e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">Header CTA Target URL</label>
                  <input
                    type="text"
                    value={form.headerCtaUrl || ''}
                    onChange={e => handleChange('headerCtaUrl', e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-[#c5a059] font-mono focus:border-[#c5a059] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FOOTER & LEGAL */}
        {activeTab === 'footer' && (
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
            <h3 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#c5a059]" />
              Footer Layout, Quick Links & Legal Policies
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-white mb-1">Footer Description Paragraph</label>
                <textarea
                  rows={3}
                  value={form.footerDescription || ''}
                  onChange={e => handleChange('footerDescription', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-white mb-1">Footer Disclaimer & Adult Compliance Notice (18+)</label>
                <textarea
                  rows={2}
                  value={form.disclaimerText || ''}
                  onChange={e => handleChange('disclaimerText', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Privacy Policy Link Target</label>
                <input
                  type="text"
                  value={form.privacyPolicyUrl || ''}
                  onChange={e => handleChange('privacyPolicyUrl', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-[#c5a059] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Terms & Conditions Link Target</label>
                <input
                  type="text"
                  value={form.termsUrl || ''}
                  onChange={e => handleChange('termsUrl', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-[#c5a059] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-white mb-1">Physical Office / Location Address</label>
                <input
                  type="text"
                  value={form.footerAddress || ''}
                  onChange={e => handleChange('footerAddress', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>
            </div>

            {/* Quick Links List Manager */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#c5a059]" /> Footer Quick Links Menu
                </h4>
                <button
                  type="button"
                  onClick={handleAddQuickLink}
                  className="px-3 py-1 bg-[#c5a059] text-black font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Quick Link
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickLinks.map((link, idx) => (
                  <div key={link.id} className="bg-[#181818] border border-white/10 rounded-xl p-3 flex items-center gap-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={e => handleQuickLinkChange(idx, 'label', e.target.value)}
                      placeholder="Label"
                      className="flex-1 bg-[#111] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={e => handleQuickLinkChange(idx, 'url', e.target.value)}
                      placeholder="URL"
                      className="flex-1 bg-[#111] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveQuickLink(link.id)}
                      className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: WHATSAPP SETTINGS */}
        {activeTab === 'whatsapp' && (
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
            <h3 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              Global WhatsApp Floating Button & Message Preset
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">WhatsApp Phone Number (With Country Code)</label>
                <input
                  type="text"
                  placeholder="918726179837"
                  value={form.whatsappNumber || ''}
                  onChange={e => handleChange('whatsappNumber', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-[#25D366] font-mono font-bold focus:border-[#c5a059] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Floating Widget Enable Status</label>
                <button
                  type="button"
                  onClick={() => handleChange('whatsappFloatingEnabled', !form.whatsappFloatingEnabled)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer border ${
                    form.whatsappFloatingEnabled
                      ? 'bg-[#25D366]/10 border-[#25D366]/40 text-[#25D366]'
                      : 'bg-white/5 border-white/10 text-white/40'
                  }`}
                >
                  <span>{form.whatsappFloatingEnabled ? 'Floating Widget Enabled' : 'Widget Disabled'}</span>
                  <span className="w-3 h-3 rounded-full bg-current"></span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Widget Desktop/Mobile Position</label>
                <select
                  value={form.whatsappPosition || 'bottom-right'}
                  onChange={e => handleChange('whatsappPosition', e.target.value as any)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                >
                  <option value="bottom-right">Bottom Right Corner</option>
                  <option value="bottom-left">Bottom Left Corner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Widget CTA Badge Text</label>
                <input
                  type="text"
                  value={form.whatsappCtaText || ''}
                  onChange={e => handleChange('whatsappCtaText', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-white mb-1">Default Pre-Filled Message</label>
                <textarea
                  rows={3}
                  value={form.whatsappMessage || ''}
                  onChange={e => handleChange('whatsappMessage', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-[#c5a059] outline-none font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: POPUPS & BANNERS */}
        {activeTab === 'popups' && (
          <div className="space-y-6">
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#c5a059]" />
                Interactive Lead Popups & Special Offer Modals
              </h3>

              {/* Announcement Popup */}
              <div className="bg-[#181818] border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">1. Timed Announcement Popup</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleChange('announcementPopup', {
                        ...(form.announcementPopup || { title: '', content: '' }),
                        enabled: !form.announcementPopup?.enabled
                      })
                    }
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      form.announcementPopup?.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {form.announcementPopup?.enabled ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Popup Title"
                    value={form.announcementPopup?.title || ''}
                    onChange={e =>
                      handleChange('announcementPopup', {
                        ...(form.announcementPopup || { enabled: false, content: '' }),
                        title: e.target.value
                      })
                    }
                    className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="number"
                    placeholder="Delay Seconds (e.g. 5)"
                    value={form.announcementPopup?.delaySeconds || 5}
                    onChange={e =>
                      handleChange('announcementPopup', {
                        ...(form.announcementPopup || { enabled: false, title: '', content: '' }),
                        delaySeconds: Number(e.target.value)
                      })
                    }
                    className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="Popup Body Content"
                    value={form.announcementPopup?.content || ''}
                    onChange={e =>
                      handleChange('announcementPopup', {
                        ...(form.announcementPopup || { enabled: false, title: '' }),
                        content: e.target.value
                      })
                    }
                    className="sm:col-span-2 bg-[#111] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Exit Popup */}
              <div className="bg-[#181818] border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">2. Exit Intent Retention Popup</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleChange('exitPopup', {
                        ...(form.exitPopup || { title: '', content: '' }),
                        enabled: !form.exitPopup?.enabled
                      })
                    }
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      form.exitPopup?.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {form.exitPopup?.enabled ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Exit Modal Headline"
                    value={form.exitPopup?.title || ''}
                    onChange={e =>
                      handleChange('exitPopup', {
                        ...(form.exitPopup || { enabled: false, content: '' }),
                        title: e.target.value
                      })
                    }
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="Exit Retention Copy"
                    value={form.exitPopup?.content || ''}
                    onChange={e =>
                      handleChange('exitPopup', {
                        ...(form.exitPopup || { enabled: false, title: '' }),
                        content: e.target.value
                      })
                    }
                    className="w-full bg-[#111] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: THEME SETTINGS */}
        {activeTab === 'theme' && (
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#c5a059]" />
                  Global Theme Settings & Styling Architecture
                </h3>
                <p className="text-xs text-white/50">Theme parameters are stored cleanly in CMS state for future design overrides.</p>
              </div>

              <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded text-[10px] font-bold uppercase">
                Architecture Prepared
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">Primary Color (Accent)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.themeConfig?.primaryColor || '#c5a059'}
                    onChange={e =>
                      handleChange('themeConfig', {
                        ...(form.themeConfig || { secondaryColor: '#141414', accentColor: '#d4b578', borderRadius: '0.75rem', fontFamily: 'serif' }),
                        primaryColor: e.target.value
                      })
                    }
                    className="w-10 h-10 bg-transparent rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.themeConfig?.primaryColor || '#c5a059'}
                    onChange={e =>
                      handleChange('themeConfig', {
                        ...(form.themeConfig || { secondaryColor: '#141414', accentColor: '#d4b578', borderRadius: '0.75rem', fontFamily: 'serif' }),
                        primaryColor: e.target.value
                      })
                    }
                    className="flex-1 bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Secondary Canvas Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.themeConfig?.secondaryColor || '#141414'}
                    onChange={e =>
                      handleChange('themeConfig', {
                        ...(form.themeConfig || { primaryColor: '#c5a059', accentColor: '#d4b578', borderRadius: '0.75rem', fontFamily: 'serif' }),
                        secondaryColor: e.target.value
                      })
                    }
                    className="w-10 h-10 bg-transparent rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.themeConfig?.secondaryColor || '#141414'}
                    onChange={e =>
                      handleChange('themeConfig', {
                        ...(form.themeConfig || { primaryColor: '#c5a059', accentColor: '#d4b578', borderRadius: '0.75rem', fontFamily: 'serif' }),
                        secondaryColor: e.target.value
                      })
                    }
                    className="flex-1 bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Corner Radius</label>
                <input
                  type="text"
                  placeholder="0.75rem"
                  value={form.themeConfig?.borderRadius || '0.75rem'}
                  onChange={e =>
                    handleChange('themeConfig', {
                      ...(form.themeConfig || { primaryColor: '#c5a059', secondaryColor: '#141414', accentColor: '#d4b578', fontFamily: 'serif' }),
                      borderRadius: e.target.value
                    })
                  }
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: CUSTOM SCRIPTS & CODE */}
        {activeTab === 'custom_code' && (
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
            <h3 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Code className="w-4 h-4 text-[#c5a059]" />
              Custom Scripts, Stylesheets & Header Injections
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">Header Scripts (&lt;head&gt; Injections)</label>
                <textarea
                  rows={4}
                  value={form.customHeaderScript || ''}
                  onChange={e => handleChange('customHeaderScript', e.target.value)}
                  placeholder="<!-- Google Tag Manager / Meta Pixel -->"
                  className="w-full bg-[#111] border border-white/15 rounded-xl p-3 text-xs text-[#c5a059] font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Footer Scripts (Before &lt;/body&gt; Injections)</label>
                <textarea
                  rows={4}
                  value={form.customFooterScript || ''}
                  onChange={e => handleChange('customFooterScript', e.target.value)}
                  placeholder="<!-- Live Chat / Tracking Scripts -->"
                  className="w-full bg-[#111] border border-white/15 rounded-xl p-3 text-xs text-[#c5a059] font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Custom CSS Styling Block</label>
                <textarea
                  rows={4}
                  value={form.customCss || ''}
                  onChange={e => handleChange('customCss', e.target.value)}
                  placeholder="/* .custom-class { color: #c5a059; } */"
                  className="w-full bg-[#111] border border-white/15 rounded-xl p-3 text-xs text-emerald-400 font-mono outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: INTEGRATIONS & ANALYTICS */}
        {activeTab === 'integrations' && (
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
            <h3 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#c5a059]" />
              Analytics, Pixels & Search Console Verification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">Google Analytics Tracking ID</label>
                <input
                  type="text"
                  placeholder="G-XXXXXXXXXX"
                  value={form.googleAnalyticsId || ''}
                  onChange={e => handleChange('googleAnalyticsId', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Google Tag Manager Container ID</label>
                <input
                  type="text"
                  placeholder="GTM-XXXXXXXX"
                  value={form.googleTagManagerId || ''}
                  onChange={e => handleChange('googleTagManagerId', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Meta (Facebook) Pixel ID</label>
                <input
                  type="text"
                  placeholder="1234567890123456"
                  value={form.metaPixelId || ''}
                  onChange={e => handleChange('metaPixelId', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Google Search Console Verification Tag</label>
                <input
                  type="text"
                  value={form.googleSearchConsoleTag || ''}
                  onChange={e => handleChange('googleSearchConsoleTag', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Bing Webmaster Verification Code</label>
                <input
                  type="text"
                  value={form.bingVerification || ''}
                  onChange={e => handleChange('bingVerification', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: EMAIL & SMTP */}
        {activeTab === 'email' && (
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
            <h3 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-[#c5a059]" />
              SMTP Gateway Email Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">SMTP Host Server</label>
                <input
                  type="text"
                  placeholder="smtp.hostinger.com"
                  value={form.smtpHost || ''}
                  onChange={e => handleChange('smtpHost', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">SMTP Port</label>
                <input
                  type="number"
                  placeholder="465"
                  value={form.smtpPort || 465}
                  onChange={e => handleChange('smtpPort', Number(e.target.value))}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">SMTP Username / Email</label>
                <input
                  type="text"
                  value={form.smtpUsername || ''}
                  onChange={e => handleChange('smtpUsername', e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">SMTP Encryption</label>
                <select
                  value={form.smtpEncryption || 'ssl'}
                  onChange={e => handleChange('smtpEncryption', e.target.value as any)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
                >
                  <option value="ssl">SSL / TLS (Port 465)</option>
                  <option value="tls">STARTTLS (Port 587)</option>
                  <option value="none">None (Port 25)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: SECURITY & MODES */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* System Modes */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                System Operation Modes & Security Toggles
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#181818] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Maintenance Mode</span>
                    <span className="text-[11px] text-white/50">Shows temporary maintenance splash screen</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChange('maintenanceMode', !form.maintenanceMode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      form.maintenanceMode ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {form.maintenanceMode ? 'Active' : 'Off'}
                  </button>
                </div>

                <div className="bg-[#181818] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Coming Soon Mode</span>
                    <span className="text-[11px] text-white/50">Shows coming soon splash screen</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChange('comingSoonMode', !form.comingSoonMode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      form.comingSoonMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {form.comingSoonMode ? 'Active' : 'Off'}
                  </button>
                </div>

                <div className="bg-[#181818] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Force HTTPS Redirection</span>
                    <span className="text-[11px] text-white/50">Enforces SSL/TLS transport security</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChange('forceHttps', !form.forceHttps)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      form.forceHttps ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {form.forceHttps ? 'Enforced' : 'Off'}
                  </button>
                </div>
              </div>
            </div>

            {/* Admin Credentials Update Box */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#c5a059]" />
                  Admin Passcode & SHA-256 Credentials
                </h3>
                <p className="text-xs text-white/50">Stored securely using Web Crypto API SHA-256 salt hashing.</p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-white mb-1">Current Passcode (Required)</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Enter current passcode"
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">New Username</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">New Passcode</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-white mb-1">Confirm New Passcode</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new passcode"
                    className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleCredentialsSubmit}
                  disabled={isSubmittingCredentials}
                  className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
                >
                  {isSubmittingCredentials ? 'Updating...' : 'Update Security Credentials'}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Media Picker Modal for Global Settings */}
      <MediaPickerModal
        isOpen={!!mediaPickerTargetField}
        onClose={() => setMediaPickerTargetField(null)}
        onSelectImage={(url) => {
          if (mediaPickerTargetField) {
            handleChange(mediaPickerTargetField, url);
          }
        }}
        allowedCategory="logos"
        title="Select Asset from Media Library"
      />
    </div>
  );
};
