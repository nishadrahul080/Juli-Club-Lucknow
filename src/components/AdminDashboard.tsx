import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import {
  ShieldCheck,
  Settings,
  Users,
  MapPin,
  MessageSquare,
  HelpCircle,
  FileText,
  Save,
  Download,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
  Eye,
  Lock,
  LogOut,
  Check,
  Globe,
  Share2,
  Image as ImageIcon,
  Phone,
  Code
} from 'lucide-react';
import { CompanionProfile, LucknowArea, CategoryType } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const {
    cmsData,
    updateSettings,
    updateProfiles,
    updateReviews,
    updateFAQs,
    updateLocations,
    updateBlogs,
    resetToDefaults,
    exportCMSConfig
  } = useCMS();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'settings' | 'profiles' | 'locations' | 'reviews' | 'faqs' | 'blogs' | 'media' | 'export'
  >('settings');

  // Success Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === 'juliclub2026') {
      setIsAuthenticated(true);
      setAuthError('');
      showToast('Welcome to Juli Club Admin CMS Portal');
    } else {
      setAuthError('Invalid Admin Passcode.');
    }
  };

  // Local Form state for Global Settings
  const [settingsForm, setSettingsForm] = useState(cmsData.settings);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    showToast('Global Site & SEO Settings updated successfully!');
  };

  // State for adding/editing a Profile
  const [editingProfile, setEditingProfile] = useState<Partial<CompanionProfile> | null>(null);

  const handleSaveProfile = () => {
    if (!editingProfile?.name) return;
    const existing = cmsData.profiles.find(p => p.id === editingProfile.id);
    let updatedProfiles: CompanionProfile[];

    if (existing) {
      updatedProfiles = cmsData.profiles.map(p =>
        p.id === editingProfile.id ? ({ ...p, ...editingProfile } as CompanionProfile) : p
      );
    } else {
      const newProfile: CompanionProfile = {
        id: `profile-${Date.now()}`,
        name: editingProfile.name || 'New Companion',
        title: editingProfile.title || 'VIP Companion',
        category: (editingProfile.category as CategoryType) || 'Independent',
        age: editingProfile.age || 22,
        height: editingProfile.height || "5'5\"",
        figure: editingProfile.figure || '34-26-36',
        rateShort: editingProfile.rateShort || 3000,
        rateFull: editingProfile.rateFull || 8000,
        location: (editingProfile.location as LucknowArea) || 'Gomti Nagar',
        city: 'Lucknow',
        phone: editingProfile.phone || '+918726179837',
        whatsapp: editingProfile.whatsapp || '918726179837',
        verified: editingProfile.verified ?? true,
        pickupDropFree: true,
        noAdvanceCashOnDelivery: true,
        image: editingProfile.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
        gallery: editingProfile.gallery || [],
        bio: editingProfile.bio || 'Verified high profile companion in Lucknow.',
        services: editingProfile.services || ['Outcall', 'Incall', 'Hotel Delivery'],
        rating: 4.9,
        reviewsCount: 12,
        isOnline: true,
        languages: ['Hindi', 'English']
      };
      updatedProfiles = [newProfile, ...cmsData.profiles];
    }

    updateProfiles(updatedProfiles);
    setEditingProfile(null);
    showToast('Companion Profile saved successfully!');
  };

  const handleDeleteProfile = (id: string) => {
    if (confirm('Are you sure you want to delete this companion profile?')) {
      updateProfiles(cmsData.profiles.filter(p => p.id !== id));
      showToast('Profile removed successfully');
    }
  };

  // State for Location SEO Editing
  const [selectedLocationSlug, setSelectedLocationSlug] = useState<string>('gomti-nagar');
  const currentLocationData = cmsData.locations[selectedLocationSlug];

  const handleUpdateLocationField = (field: string, value: any) => {
    if (!currentLocationData) return;
    const updatedLoc = { ...currentLocationData, [field]: value };
    updateLocations({
      ...cmsData.locations,
      [selectedLocationSlug]: updatedLoc
    });
    showToast(`Updated location metadata for ${currentLocationData.areaName}`);
  };

  // State for Blogs Editing
  const [newBlogTitle, setNewBlogTitle] = useState<string>('');
  const [newBlogExcerpt, setNewBlogExcerpt] = useState<string>('');

  const handleAddBlog = () => {
    if (!newBlogTitle.trim()) return;
    const newSlug = newBlogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newPost = {
      id: `blog-${Date.now()}`,
      slug: newSlug,
      title: newBlogTitle,
      metaTitle: `${newBlogTitle} | Juli Club Lucknow`,
      metaDescription: newBlogExcerpt,
      author: 'Juli Club Admin',
      date: new Date().toISOString().split('T')[0],
      category: 'Lucknow Escorts',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
      excerpt: newBlogExcerpt,
      content: `${newBlogExcerpt}\n\nFull details and 100% Cash on delivery booking in Lucknow.`,
      published: true
    };
    updateBlogs([newPost, ...cmsData.blogs]);
    setNewBlogTitle('');
    setNewBlogExcerpt('');
    showToast('New blog article added successfully!');
  };

  const handleDeleteBlog = (id: string) => {
    if (confirm('Delete this blog article?')) {
      updateBlogs(cmsData.blogs.filter(b => b.id !== id));
      showToast('Blog article deleted.');
    }
  };

  // Render Login Gate if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#141414] border border-[#c5a059]/40 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-[#e0e0e0]">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059]">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#e0e0e0]">Juli Club Admin Portal</h2>
            <p className="text-xs text-white/60">
              Enter your secure passcode to manage SEO tags, WhatsApp numbers, companion profiles, and location content.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#c5a059] mb-1">
                Admin Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="Enter admin passcode"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded border border-rose-800/40 text-center font-medium">
                {authError}
              </p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Cancel / Exit
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-[#c5a059] hover:bg-[#d4b578] text-black rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
              >
                Access Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] text-[#e0e0e0] flex flex-col overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 bg-[#25D366] text-black font-bold text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="bg-[#121212] border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-serif font-bold text-white flex items-center gap-2">
              Juli Club Admin CMS Panel
              <span className="text-[10px] font-sans font-normal px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                LIVE DYNAMIC ENGINE
              </span>
            </h1>
            <p className="text-[11px] text-white/50">
              Changes auto-update frontend instantly & can be exported for Hostinger File Manager
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={exportCMSConfig}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-[#c5a059]/10 hover:bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#c5a059] text-xs font-bold rounded transition-colors"
            title="Download cms_data.json file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-2 bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-white/80 hover:text-rose-400 rounded transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded transition-colors"
          >
            Close Dashboard
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-16 sm:w-64 bg-[#111111] border-r border-white/10 flex flex-col shrink-0">
          <div className="p-3 sm:p-4 space-y-1 overflow-y-auto flex-1">
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-[#c5a059] text-black font-bold'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">SEO & Global Meta</span>
            </button>

            <button
              onClick={() => setActiveTab('profiles')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'profiles'
                  ? 'bg-[#c5a059] text-black font-bold'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Profiles ({cmsData.profiles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('locations')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'locations'
                  ? 'bg-[#c5a059] text-black font-bold'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Location Pages SEO</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'reviews'
                  ? 'bg-[#c5a059] text-black font-bold'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Reviews ({cmsData.reviews.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('faqs')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'faqs'
                  ? 'bg-[#c5a059] text-black font-bold'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">FAQs ({cmsData.faqs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('blogs')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'blogs'
                  ? 'bg-[#c5a059] text-black font-bold'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Blogs / Articles ({cmsData.blogs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'media'
                  ? 'bg-[#c5a059] text-black font-bold'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Media & Links</span>
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'export'
                  ? 'bg-[#c5a059] text-black font-bold'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Hostinger Deploy / Sync</span>
            </button>
          </div>

          <div className="p-3 border-t border-white/10 hidden sm:block">
            <button
              onClick={() => {
                if (confirm('Reset all CMS data to default mock settings?')) {
                  resetToDefaults();
                  showToast('CMS restored to factory defaults');
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 rounded text-[11px] font-bold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Factory Defaults</span>
            </button>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0a0a]">
          {/* TAB 1: SEO & Global Settings */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#c5a059]" />
                  <span>Global SEO & Site Settings</span>
                </h2>
                <p className="text-xs text-white/60">
                  Configure meta titles, descriptions, canonical URLs, WhatsApp numbers, analytics tags, and custom scripts.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* Contact & Phone */}
                <div className="bg-[#141414] border border-white/10 p-4 sm:p-5 rounded-xl space-y-4">
                  <h3 className="text-xs font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>WhatsApp & Phone Contact Routing</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/80 mb-1 font-medium">WhatsApp Phone Number (Country Code + Number)</label>
                      <input
                        type="text"
                        value={settingsForm.whatsappNumber}
                        onChange={e => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        className="w-full bg-[#1e1e1e] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                        placeholder="918726179837"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-white/80 mb-1 font-medium">Direct Call Phone Number</label>
                      <input
                        type="text"
                        value={settingsForm.contactPhone}
                        onChange={e => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                        className="w-full bg-[#1e1e1e] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                        placeholder="+91 8726179837"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-white/80 mb-1 font-medium">Default WhatsApp Pre-filled Message</label>
                    <input
                      type="text"
                      value={settingsForm.whatsappMessage}
                      onChange={e => setSettingsForm({ ...settingsForm, whatsappMessage: e.target.value })}
                      className="w-full bg-[#1e1e1e] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                {/* Meta Tags */}
                <div className="bg-[#141414] border border-white/10 p-4 sm:p-5 rounded-xl space-y-4">
                  <h3 className="text-xs font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    <span>Search Engine Optimization (SEO) Meta Tags</span>
                  </h3>

                  <div>
                    <label className="block text-xs text-white/80 mb-1 font-medium">Homepage Meta Title</label>
                    <input
                      type="text"
                      value={settingsForm.siteTitle}
                      onChange={e => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                      className="w-full bg-[#1e1e1e] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-white/80 mb-1 font-medium">Homepage Meta Description</label>
                    <textarea
                      rows={3}
                      value={settingsForm.metaDescription}
                      onChange={e => setSettingsForm({ ...settingsForm, metaDescription: e.target.value })}
                      className="w-full bg-[#1e1e1e] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/80 mb-1 font-medium">Canonical URL</label>
                      <input
                        type="text"
                        value={settingsForm.canonicalUrl}
                        onChange={e => setSettingsForm({ ...settingsForm, canonicalUrl: e.target.value })}
                        className="w-full bg-[#1e1e1e] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-white/80 mb-1 font-medium">Robots Meta Tag</label>
                      <input
                        type="text"
                        value={settingsForm.robotsMeta}
                        onChange={e => setSettingsForm({ ...settingsForm, robotsMeta: e.target.value })}
                        className="w-full bg-[#1e1e1e] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Sharing & Open Graph */}
                <div className="bg-[#141414] border border-white/10 p-4 sm:p-5 rounded-xl space-y-4">
                  <h3 className="text-xs font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    <span>Open Graph & Social Share Preview</span>
                  </h3>

                  <div>
                    <label className="block text-xs text-white/80 mb-1 font-medium">OG Image Banner URL</label>
                    <input
                      type="text"
                      value={settingsForm.ogImage}
                      onChange={e => setSettingsForm({ ...settingsForm, ogImage: e.target.value })}
                      className="w-full bg-[#1e1e1e] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-white/80 mb-1 font-medium">Google Analytics ID / Tag Manager</label>
                    <input
                      type="text"
                      value={settingsForm.googleAnalyticsId}
                      onChange={e => setSettingsForm({ ...settingsForm, googleAnalyticsId: e.target.value })}
                      className="w-full bg-[#1e1e1e] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Global Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Companion Profiles Manager */}
          {activeTab === 'profiles' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#c5a059]" />
                    <span>Companion Profiles Manager</span>
                  </h2>
                  <p className="text-xs text-white/60">
                    Add new escort profiles, modify rates, photos, categories, locations, and verification status.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setEditingProfile({
                      name: '',
                      category: 'Independent',
                      location: 'Gomti Nagar',
                      rateShort: 3000,
                      rateFull: 8000,
                      verified: true
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#c5a059] hover:bg-[#d4b578] text-black text-xs font-bold rounded transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Profile</span>
                </button>
              </div>

              {/* Editing Modal / Drawer */}
              {editingProfile && (
                <div className="bg-[#141414] border border-[#c5a059]/40 p-5 rounded-xl space-y-4">
                  <h3 className="text-sm font-serif font-bold text-[#c5a059] flex items-center justify-between">
                    <span>{editingProfile.id ? 'Edit Profile' : 'Add New Companion Profile'}</span>
                    <button
                      onClick={() => setEditingProfile(null)}
                      className="text-xs text-white/50 hover:text-white"
                    >
                      Cancel
                    </button>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] text-white/70 mb-1">Companion Name</label>
                      <input
                        type="text"
                        value={editingProfile.name || ''}
                        onChange={e => setEditingProfile({ ...editingProfile, name: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-white/70 mb-1">Category</label>
                      <select
                        value={editingProfile.category || 'Independent'}
                        onChange={e => setEditingProfile({ ...editingProfile, category: e.target.value as CategoryType })}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-1.5 text-xs text-white"
                      >
                        <option value="Independent">Independent</option>
                        <option value="College Girls">College Girls</option>
                        <option value="Housewife">Housewife</option>
                        <option value="Supermodels">Supermodels</option>
                        <option value="Russian / Exotic">Russian / Exotic</option>
                        <option value="VIP Celebrity">VIP Celebrity</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-white/70 mb-1">Lucknow Location Area</label>
                      <select
                        value={editingProfile.location || 'Gomti Nagar'}
                        onChange={e => setEditingProfile({ ...editingProfile, location: e.target.value as LucknowArea })}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-1.5 text-xs text-white"
                      >
                        <option value="Gomti Nagar">Gomti Nagar</option>
                        <option value="Hazratganj">Hazratganj</option>
                        <option value="Alambagh">Alambagh</option>
                        <option value="Indira Nagar">Indira Nagar</option>
                        <option value="Mahanagar">Mahanagar</option>
                        <option value="Charbagh">Charbagh</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-white/70 mb-1">Short Time Rate (₹ 2 Hours)</label>
                      <input
                        type="number"
                        value={editingProfile.rateShort || 3000}
                        onChange={e => setEditingProfile({ ...editingProfile, rateShort: Number(e.target.value) })}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-white/70 mb-1">Full Night Rate (₹ 8 Hours)</label>
                      <input
                        type="number"
                        value={editingProfile.rateFull || 8000}
                        onChange={e => setEditingProfile({ ...editingProfile, rateFull: Number(e.target.value) })}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-white/70 mb-1">Image Photo URL</label>
                      <input
                        type="text"
                        value={editingProfile.image || ''}
                        onChange={e => setEditingProfile({ ...editingProfile, image: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-1.5 text-xs text-white"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingProfile(null)}
                      className="px-3 py-1.5 bg-white/10 text-white text-xs rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-1.5 bg-[#c5a059] text-black font-bold text-xs rounded"
                    >
                      Save Companion Profile
                    </button>
                  </div>
                </div>
              )}

              {/* Profiles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cmsData.profiles.map(p => (
                  <div
                    key={p.id}
                    className="bg-[#141414] border border-white/10 rounded-lg p-3 flex gap-3 relative group hover:border-[#c5a059]/40 transition-colors"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-20 h-24 object-cover rounded bg-black/40 shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-white truncate">{p.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30">
                          {p.category}
                        </span>
                      </div>
                      <p className="text-[#c5a059] font-bold">₹{p.rateShort.toLocaleString()} / 2h</p>
                      <p className="text-white/60 text-[11px]">📍 {p.location}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => setEditingProfile(p)}
                          className="p-1 bg-white/10 hover:bg-white/20 rounded text-white"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProfile(p.id)}
                          className="p-1 bg-rose-900/40 hover:bg-rose-900 text-rose-300 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Location Pages SEO */}
          {activeTab === 'locations' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#c5a059]" />
                  <span>Location Pages SEO Editor</span>
                </h2>
                <p className="text-xs text-white/60">
                  Select a targeted Lucknow area to customize its H1 heading, intro text, landmark badges, and SEO keywords.
                </p>
              </div>

              {/* Selector */}
              <div className="flex flex-wrap gap-2">
                {Object.keys(cmsData.locations).map(slug => (
                  <button
                    key={slug}
                    onClick={() => setSelectedLocationSlug(slug)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      selectedLocationSlug === slug
                        ? 'bg-[#c5a059] text-black'
                        : 'bg-[#141414] text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {cmsData.locations[slug].areaName}
                  </button>
                ))}
              </div>

              {/* Location Editor Form */}
              {currentLocationData && (
                <div className="bg-[#141414] border border-white/10 p-5 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold text-[#c5a059] uppercase tracking-wider">
                    Editing SEO for: {currentLocationData.areaName} ({currentLocationData.slug})
                  </h3>

                  <div>
                    <label className="block text-xs text-white/80 mb-1 font-medium">Page Title (Meta Title)</label>
                    <input
                      type="text"
                      value={currentLocationData.title}
                      onChange={e => handleUpdateLocationField('title', e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-white/80 mb-1 font-medium">Main H1 Heading</label>
                    <input
                      type="text"
                      value={currentLocationData.h1}
                      onChange={e => handleUpdateLocationField('h1', e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-white/80 mb-1 font-medium">SEO Meta Description</label>
                    <textarea
                      rows={2}
                      value={currentLocationData.metaDescription}
                      onChange={e => handleUpdateLocationField('metaDescription', e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-white/80 mb-1 font-medium">Introductory Section Text</label>
                    <textarea
                      rows={3}
                      value={currentLocationData.intro}
                      onChange={e => handleUpdateLocationField('intro', e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Blogs / Articles Manager */}
          {activeTab === 'blogs' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#c5a059]" />
                  <span>Blogs & Articles Manager</span>
                </h2>
                <p className="text-xs text-white/60">
                  Publish SEO guides, hotel reviews, and safety articles to drive organic search rankings on Google.
                </p>
              </div>

              {/* Add New Blog Form */}
              <div className="bg-[#141414] border border-white/10 p-4 sm:p-5 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Publish New Blog Post</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newBlogTitle}
                    onChange={e => setNewBlogTitle(e.target.value)}
                    placeholder="Blog Title (e.g., Safe Hotels in Hazratganj Lucknow)"
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                  <input
                    type="text"
                    value={newBlogExcerpt}
                    onChange={e => setNewBlogExcerpt(e.target.value)}
                    placeholder="Short Excerpt / Summary for SEO"
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <button
                  onClick={handleAddBlog}
                  className="px-4 py-2 bg-[#c5a059] text-black font-bold text-xs rounded hover:bg-[#d4b578] transition-colors"
                >
                  Publish Article
                </button>
              </div>

              {/* Blog List */}
              <div className="space-y-3">
                {cmsData.blogs.map(b => (
                  <div key={b.id} className="bg-[#141414] border border-white/10 p-4 rounded-xl flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-serif font-bold text-white">{b.title}</h4>
                      <p className="text-xs text-white/60">{b.excerpt}</p>
                      <p className="text-[11px] text-[#c5a059]">Published: {b.date} • Slug: /{b.slug}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteBlog(b.id)}
                      className="p-1.5 bg-rose-900/40 text-rose-300 rounded hover:bg-rose-900 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Hostinger Export & Automatic CI/CD Deploy Instructions */}
          {activeTab === 'export' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#c5a059]" />
                  <span>Hostinger CI/CD & Automatic Deployment Center</span>
                </h2>
                <p className="text-xs text-white/60">
                  Every commit pushed to your GitHub repository automatically builds and deploys to Hostinger's <code className="text-[#c5a059]">./lucknow/</code> folder via GitHub Actions!
                </p>
              </div>

              {/* GitHub Actions CI/CD Card */}
              <div className="bg-[#141414] border border-[#25D366]/40 p-5 rounded-xl space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center font-bold text-lg">
                      ⚡
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Automatic GitHub Actions CI/CD (Active)</h3>
                      <p className="text-xs text-emerald-400 font-medium">
                        ✓ File <code className="text-white font-mono">.github/workflows/deploy.yml</code> is configured in repository
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold uppercase tracking-wider">
                    Auto Deploy Enabled
                  </span>
                </div>

                <div className="bg-[#0b0b0b] p-3.5 rounded-lg border border-white/10 text-xs text-white/80 space-y-2">
                  <p className="font-bold text-[#c5a059]">Required GitHub Secrets (Setup in 2 minutes):</p>
                  <p className="text-[11px] text-white/70">
                    Go to your GitHub Repository ➔ <strong>Settings</strong> ➔ <strong>Secrets and variables</strong> ➔ <strong>Actions</strong> ➔ Add New Repository Secrets:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[11px] font-mono text-white/90 bg-[#161616] p-2.5 rounded border border-white/5">
                    <li><strong className="text-[#c5a059]">FTP_SERVER</strong>: your-hostinger-ftp-host (e.g. ftp.juliclub.in or access IP)</li>
                    <li><strong className="text-[#c5a059]">FTP_USERNAME</strong>: your Hostinger FTP username</li>
                    <li><strong className="text-[#c5a059]">FTP_PASSWORD</strong>: your Hostinger FTP password</li>
                    <li><strong className="text-[#c5a059]">FTP_PORT</strong>: 21 (or 22 for SFTP)</li>
                  </ul>
                </div>
              </div>

              {/* Manual ZIP Download Option */}
              <div className="bg-[#141414] border border-white/10 p-5 rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center font-bold">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Manual ZIP Package Backup</h3>
                    <p className="text-xs text-white/60">
                      Download pre-packaged <code className="text-[#c5a059]">public_html.zip</code> for manual upload anytime if needed.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href="/public_html.zip"
                    download="public_html.zip"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold rounded-lg text-xs uppercase tracking-wider transition-all shadow-xl"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download public_html.zip</span>
                  </a>

                  <button
                    onClick={exportCMSConfig}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded-lg text-xs uppercase tracking-wider transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#141414] border border-white/10 p-5 rounded-xl space-y-3 text-xs text-white/80">
                <h4 className="font-bold text-[#c5a059] uppercase tracking-wider">How Automatic Deployment Works</h4>
                <ol className="list-decimal list-inside space-y-2 text-white/70">
                  <li>Make updates in AI Studio or commit code directly to GitHub.</li>
                  <li>GitHub Actions automatically triggers the <code className="text-[#c5a059]">build-and-deploy</code> job on push to <code className="text-[#c5a059]">main</code>.</li>
                  <li>The workflow compiles Vite assets, tests syntax, and syncs updated files directly to Hostinger <code className="text-[#c5a059]">./lucknow/</code>.</li>
                  <li>Full deployment logs and 1-click re-runs/rollbacks are stored under the <strong>Actions</strong> tab on your GitHub repository!</li>
                </ol>
                <p className="text-[11px] text-white/50 pt-2 border-t border-white/10">
                  ✨ Live domain: <code className="text-[#c5a059]">lucknow.juliclub.in</code> — updates go live seamlessly within seconds!
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
