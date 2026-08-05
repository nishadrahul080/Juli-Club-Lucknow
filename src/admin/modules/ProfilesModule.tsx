import React, { useState, useMemo } from 'react';
import { useCMS } from '../../context/CMSContext';
import { CompanionProfile, CategoryType, LucknowArea } from '../../types';
import { LUCKNOW_AREAS } from '../../data/mockData';
import { normalizeProfile } from '../profiles/utils/profileHelpers';
import { ProfileFormModal } from '../profiles/components/ProfileFormModal';
import { ProfilePreviewModal } from '../profiles/components/ProfilePreviewModal';
import {
  Users,
  Plus,
  Search,
  Filter,
  CheckSquare,
  Square,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  Copy,
  Star,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutGrid,
  List,
  MapPin,
  Tag,
  DollarSign,
  UserCheck,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

const CATEGORIES: CategoryType[] = [
  'Independent',
  'College Girls',
  'Housewife',
  'Supermodels',
  'Russian / Exotic',
  'VIP Celebrity',
  'Air Hostess',
  'South Indian',
  'North Indian',
  'Asian'
];

export const ProfilesModule: React.FC = () => {
  const { cmsData, updateProfiles } = useCMS();

  // State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured'>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified'>('all');
  const [sortBy, setSortBy] = useState<
    'nameAsc' | 'nameDesc' | 'age' | 'priceLow' | 'priceHigh' | 'rating' | 'newest'
  >('newest');

  const [viewStyle, setViewStyle] = useState<'table' | 'grid'>('table');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingProfile, setEditingProfile] = useState<CompanionProfile | null>(null);
  const [previewProfile, setPreviewProfile] = useState<CompanionProfile | null>(null);

  // Normalize profiles from store to ensure compatibility
  const normalizedProfiles = useMemo(() => {
    return cmsData.profiles.map(p => normalizeProfile(p));
  }, [cmsData.profiles]);

  // Statistics
  const stats = useMemo(() => {
    const total = normalizedProfiles.length;
    const active = normalizedProfiles.filter(p => p.isActive !== false).length;
    const featured = normalizedProfiles.filter(p => p.isFeatured).length;
    const verified = normalizedProfiles.filter(p => p.verified).length;
    return { total, active, featured, verified };
  }, [normalizedProfiles]);

  // Filtering & Sorting
  const filteredProfiles = useMemo(() => {
    return normalizedProfiles
      .filter(profile => {
        // Search
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchesName = profile.name.toLowerCase().includes(q);
          const matchesSlug = (profile.slug || '').toLowerCase().includes(q);
          const matchesArea = profile.location.toLowerCase().includes(q);
          const matchesCategory = profile.category.toLowerCase().includes(q);
          const matchesProf = (profile.profession || '').toLowerCase().includes(q);
          if (!matchesName && !matchesSlug && !matchesArea && !matchesCategory && !matchesProf) {
            return false;
          }
        }

        // Category Filter
        if (selectedCategory !== 'all' && profile.category !== selectedCategory) {
          return false;
        }

        // Area Filter
        if (selectedArea !== 'all' && profile.location !== selectedArea) {
          return false;
        }

        // Active Status Filter
        if (statusFilter === 'active' && profile.isActive === false) return false;
        if (statusFilter === 'inactive' && profile.isActive !== false) return false;

        // Featured Filter
        if (featuredFilter === 'featured' && !profile.isFeatured) return false;

        // Verified Filter
        if (verifiedFilter === 'verified' && !profile.verified) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'nameAsc') return a.name.localeCompare(b.name);
        if (sortBy === 'nameDesc') return b.name.localeCompare(a.name);
        if (sortBy === 'age') return a.age - b.age;
        if (sortBy === 'priceLow') return a.rateShort - b.rateShort;
        if (sortBy === 'priceHigh') return b.rateShort - a.rateShort;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Default newest
        return (
          new Date(b.createdAt || '2026-01-01').getTime() -
          new Date(a.createdAt || '2026-01-01').getTime()
        );
      });
  }, [
    normalizedProfiles,
    searchQuery,
    selectedCategory,
    selectedArea,
    statusFilter,
    featuredFilter,
    verifiedFilter,
    sortBy
  ]);

  // Paginated Data
  const totalPages = Math.ceil(filteredProfiles.length / pageSize) || 1;
  const paginatedProfiles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProfiles.slice(start, start + pageSize);
  }, [filteredProfiles, currentPage, pageSize]);

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedProfiles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedProfiles.map(p => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Profile Actions
  const handleCreateNew = () => {
    setEditingProfile(null);
    setIsFormOpen(true);
  };

  const handleEdit = (profile: CompanionProfile) => {
    setEditingProfile(profile);
    setIsFormOpen(true);
  };

  const handleDuplicate = (profile: CompanionProfile) => {
    const copy: CompanionProfile = {
      ...profile,
      id: `lko-${Date.now().toString(36)}`,
      name: `${profile.name} (Copy)`,
      slug: `${profile.slug || profile.id}-copy`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [copy, ...normalizedProfiles];
    updateProfiles(updated);
    alert(`Duplicated profile as "${copy.name}".`);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete profile "${name}"?`)) {
      const updated = normalizedProfiles.filter(p => p.id !== id);
      updateProfiles(updated);
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleSaveProfile = (savedProfile: CompanionProfile) => {
    let updated: CompanionProfile[];
    const exists = normalizedProfiles.some(p => p.id === savedProfile.id);
    if (exists) {
      updated = normalizedProfiles.map(p => (p.id === savedProfile.id ? savedProfile : p));
    } else {
      updated = [savedProfile, ...normalizedProfiles];
    }
    updateProfiles(updated);
    setIsFormOpen(false);
  };

  // Bulk Actions
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected profiles?`
      )
    ) {
      const updated = normalizedProfiles.filter(p => !selectedIds.includes(p.id));
      updateProfiles(updated);
      setSelectedIds([]);
    }
  };

  const handleBulkEnable = () => {
    if (selectedIds.length === 0) return;
    const updated = normalizedProfiles.map(p =>
      selectedIds.includes(p.id) ? { ...p, isActive: true } : p
    );
    updateProfiles(updated);
    setSelectedIds([]);
  };

  const handleBulkDisable = () => {
    if (selectedIds.length === 0) return;
    const updated = normalizedProfiles.map(p =>
      selectedIds.includes(p.id) ? { ...p, isActive: false } : p
    );
    updateProfiles(updated);
    setSelectedIds([]);
  };

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(normalizedProfiles, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `juli_club_profiles_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overview Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c5a059] animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#c5a059]">
              Companion Management Engine
            </span>
          </div>
          <h1 className="text-2xl font-serif text-[#e0e0e0]">
            Dynamic Profiles Catalog & CMS
          </h1>
          <p className="text-xs text-white/50 mt-1 max-w-2xl">
            Complete CRUD, SEO URLs, custom galleries, rates, and multi-area availability. Updates here automatically reflect across the public site.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-white/70" /> Export Catalog
          </button>
          <button
            onClick={handleCreateNew}
            className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Profile
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0f0f0f] border border-white/10 p-4 rounded flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-white/40 block">Total Profiles</span>
            <span className="text-2xl font-serif text-[#e0e0e0] font-bold">{stats.total}</span>
          </div>
          <Users className="w-6 h-6 text-[#c5a059]" />
        </div>

        <div className="bg-[#0f0f0f] border border-white/10 p-4 rounded flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-white/40 block">Active Listings</span>
            <span className="text-2xl font-serif text-emerald-400 font-bold">{stats.active}</span>
          </div>
          <UserCheck className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="bg-[#0f0f0f] border border-white/10 p-4 rounded flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-white/40 block">Featured Profiles</span>
            <span className="text-2xl font-serif text-[#c5a059] font-bold">{stats.featured}</span>
          </div>
          <Star className="w-6 h-6 text-[#c5a059] fill-[#c5a059]" />
        </div>

        <div className="bg-[#0f0f0f] border border-white/10 p-4 rounded flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-white/40 block">Verified Badges</span>
            <span className="text-2xl font-serif text-sky-400 font-bold">{stats.verified}</span>
          </div>
          <ShieldCheck className="w-6 h-6 text-sky-400" />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0f0f0f] border border-white/10 p-4 rounded-lg space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by profile name, slug, category, location, profession..."
              className="w-full bg-[#141414] border border-white/10 rounded pl-9 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex bg-[#141414] border border-white/10 rounded p-1 text-xs">
              <button
                onClick={() => setViewStyle('table')}
                className={`p-1.5 rounded transition-colors ${
                  viewStyle === 'table' ? 'bg-[#c5a059] text-black' : 'text-white/50 hover:text-white'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewStyle('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewStyle === 'grid' ? 'bg-[#c5a059] text-black' : 'text-white/50 hover:text-white'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Category Filter */}
          <div>
            <label className="block text-[10px] uppercase text-white/40 mb-1 font-semibold">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#141414] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Area Filter */}
          <div>
            <label className="block text-[10px] uppercase text-white/40 mb-1 font-semibold">
              Location / Area
            </label>
            <select
              value={selectedArea}
              onChange={e => {
                setSelectedArea(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#141414] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
            >
              <option value="all">All Lucknow Areas</option>
              {LUCKNOW_AREAS.filter(a => a !== 'All Lucknow').map(a => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[10px] uppercase text-white/40 mb-1 font-semibold">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full bg-[#141414] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          {/* Featured Filter */}
          <div>
            <label className="block text-[10px] uppercase text-white/40 mb-1 font-semibold">
              Featured
            </label>
            <select
              value={featuredFilter}
              onChange={e => {
                setFeaturedFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full bg-[#141414] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
            >
              <option value="all">All Profiles</option>
              <option value="featured">Featured Only</option>
            </select>
          </div>

          {/* Verified Filter */}
          <div>
            <label className="block text-[10px] uppercase text-white/40 mb-1 font-semibold">
              Verification
            </label>
            <select
              value={verifiedFilter}
              onChange={e => {
                setVerifiedFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full bg-[#141414] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
            >
              <option value="all">All Badges</option>
              <option value="verified">Verified Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] uppercase text-white/40 mb-1 font-semibold flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-[#c5a059]" /> Sort By
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full bg-[#141414] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
            >
              <option value="newest font-semibold">Newest Added</option>
              <option value="nameAsc">Name (A-Z)</option>
              <option value="nameDesc">Name (Z-A)</option>
              <option value="priceLow">Price (Low to High)</option>
              <option value="priceHigh">Price (High to Low)</option>
              <option value="rating">Rating (Highest)</option>
              <option value="age">Age (Youngest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-[#c5a059]/10 border border-[#c5a059]/30 p-3.5 rounded-lg flex items-center justify-between gap-4 text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c5a059]"></span>
            <span className="font-semibold text-white">
              {selectedIds.length} profiles selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkEnable}
              className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-400 border border-emerald-500/30 rounded font-semibold transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Enable Active
            </button>
            <button
              onClick={handleBulkDisable}
              className="px-3 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 text-amber-400 border border-amber-500/30 rounded font-semibold transition-colors flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" /> Disable Inactive
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-rose-600/30 hover:bg-rose-600/50 text-rose-400 border border-rose-500/30 rounded font-semibold transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Bulk Delete
            </button>
          </div>
        </div>
      )}

      {/* Main Profiles Display */}
      {paginatedProfiles.length > 0 ? (
        viewStyle === 'table' ? (
          /* Table View */
          <div className="bg-[#0f0f0f] border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#e0e0e0]">
                <thead className="bg-[#141414] text-white/50 border-b border-white/10 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3 w-10 text-center">
                      <button onClick={handleSelectAll} className="p-0.5">
                        {selectedIds.length === paginatedProfiles.length && paginatedProfiles.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-[#c5a059]" />
                        ) : (
                          <Square className="w-4 h-4 text-white/40" />
                        )}
                      </button>
                    </th>
                    <th className="p-3">Companion Profile</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Rates (Short/Night)</th>
                    <th className="p-3">Badges</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {paginatedProfiles.map(profile => {
                    const isSelected = selectedIds.includes(profile.id);
                    return (
                      <tr
                        key={profile.id}
                        className={`hover:bg-white/[0.02] transition-colors ${
                          isSelected ? 'bg-[#c5a059]/5' : ''
                        }`}
                      >
                        <td className="p-3 text-center">
                          <button onClick={() => handleToggleSelect(profile.id)}>
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#c5a059]" />
                            ) : (
                              <Square className="w-4 h-4 text-white/30" />
                            )}
                          </button>
                        </td>

                        {/* Profile Info */}
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-13 rounded overflow-hidden border border-white/10 shrink-0 bg-black">
                              <img
                                src={profile.image}
                                alt={profile.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white text-sm">
                                  {profile.name}
                                </span>
                                {profile.isFeatured && (
                                  <Star className="w-3.5 h-3.5 text-[#c5a059] fill-[#c5a059]" title="Featured" />
                                )}
                              </div>
                              <span className="text-[10px] text-[#c5a059] font-mono block">
                                /profile/{profile.slug || profile.id}
                              </span>
                              <span className="text-[10px] text-white/40 block">
                                {profile.age} Yrs • {profile.height} • {profile.figure}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[10px] font-semibold text-white/80">
                            {profile.category}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="p-3">
                          <div className="flex items-center gap-1 text-white/80">
                            <MapPin className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                            <span>{profile.location}</span>
                          </div>
                        </td>

                        {/* Rates */}
                        <td className="p-3">
                          <div className="space-y-0.5">
                            <span className="text-[#c5a059] font-bold block">
                              ₹{profile.rateShort.toLocaleString()}{' '}
                              <span className="text-[9px] text-white/40 font-normal">(2h)</span>
                            </span>
                            <span className="text-white/60 text-[10px] block">
                              ₹{profile.rateFull.toLocaleString()}{' '}
                              <span className="text-[9px] text-white/40 font-normal">(Night)</span>
                            </span>
                          </div>
                        </td>

                        {/* Badges */}
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            {profile.verified ? (
                              <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[9px] font-bold uppercase flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Verified
                              </span>
                            ) : (
                              <span className="text-[10px] text-white/30">Standard</span>
                            )}
                          </div>
                        </td>

                        {/* Active Status */}
                        <td className="p-3">
                          {profile.isActive !== false ? (
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setPreviewProfile(profile)}
                              className="p-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded border border-white/10"
                              title="Live Public Preview"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleEdit(profile)}
                              className="p-1.5 bg-[#c5a059]/10 hover:bg-[#c5a059]/20 text-[#c5a059] rounded border border-[#c5a059]/30"
                              title="Edit Profile"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDuplicate(profile)}
                              className="p-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded border border-white/10"
                              title="Duplicate Profile"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(profile.id, profile.name)}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded border border-rose-500/30"
                              title="Delete Profile"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedProfiles.map(profile => (
              <div
                key={profile.id}
                className="bg-[#0f0f0f] border border-white/10 rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#c5a059]/50 transition-all group"
              >
                <div>
                  <div className="relative aspect-[3/4] overflow-hidden bg-black">
                    <img
                      src={profile.image}
                      alt={profile.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className="px-2 py-0.5 bg-black/80 text-[#c5a059] rounded text-[9px] font-bold uppercase tracking-wider border border-[#c5a059]/30">
                        {profile.category}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      {profile.isFeatured && (
                        <span className="p-1 bg-[#c5a059] text-black rounded shadow">
                          <Star className="w-3 h-3 fill-black" />
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-serif text-[#e0e0e0] font-bold">
                        {profile.name}
                      </h3>
                      <span className="text-xs text-[#c5a059] font-bold">
                        ₹{profile.rateShort.toLocaleString()}
                      </span>
                    </div>

                    <p className="text-[10px] text-white/50 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#c5a059]" />
                      {profile.location}, Lucknow
                    </p>

                    <p className="text-xs text-white/70 line-clamp-2 font-sans">
                      {profile.bio}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#141414] border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/40">
                    /profile/{profile.slug || profile.id}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewProfile(profile)}
                      className="p-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded border border-white/10 text-xs"
                      title="Preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleEdit(profile)}
                      className="p-1.5 bg-[#c5a059]/10 hover:bg-[#c5a059]/20 text-[#c5a059] rounded border border-[#c5a059]/30 text-xs"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(profile.id, profile.name)}
                      className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded border border-rose-500/30 text-xs"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16 bg-[#0f0f0f] border border-white/10 rounded-lg space-y-3">
          <Users className="w-10 h-10 text-white/20 mx-auto" />
          <h3 className="text-base font-serif text-[#e0e0e0]">No Companion Profiles Found</h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto">
            Try adjusting search terms or filters, or create a brand new companion listing.
          </p>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-[#c5a059] text-black font-bold text-xs uppercase tracking-wider rounded"
          >
            Create Profile
          </button>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0f0f0f] border border-white/10 p-4 rounded-lg text-xs text-white/60">
        <div className="flex items-center gap-3">
          <span>
            Showing {filteredProfiles.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
            {Math.min(currentPage * pageSize, filteredProfiles.length)} of {filteredProfiles.length} profiles
          </span>

          <div className="flex items-center gap-1">
            <span className="text-white/40">Rows:</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-[#141414] border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#c5a059]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Page Buttons */}
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="p-1.5 bg-white/5 disabled:opacity-30 hover:bg-white/10 text-white rounded border border-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 rounded border text-xs font-semibold transition-colors ${
                currentPage === page
                  ? 'bg-[#c5a059] text-black border-[#c5a059]'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="p-1.5 bg-white/5 disabled:opacity-30 hover:bg-white/10 text-white rounded border border-white/10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Edit/Create Modal */}
      <ProfileFormModal
        isOpen={isFormOpen}
        profileToEdit={editingProfile}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProfile}
      />

      {/* Live Preview Drawer / Modal */}
      <ProfilePreviewModal
        profile={previewProfile}
        onClose={() => setPreviewProfile(null)}
      />
    </div>
  );
};
