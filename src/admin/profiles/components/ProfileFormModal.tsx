import React, { useState, useEffect } from 'react';
import { CompanionProfile, CategoryType, LucknowArea } from '../../../types';
import { LUCKNOW_AREAS } from '../../../data/mockData';
import { generateSlug, generateProfileSchema, normalizeProfile } from '../utils/profileHelpers';
import { MediaPickerModal } from '../../media/components/MediaPickerModal';
import {
  X,
  User,
  Image as ImageIcon,
  DollarSign,
  Phone,
  MapPin,
  FileText,
  Search as SearchIcon,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Code,
  Check,
  Zap,
  Star,
  Globe,
  Tag
} from 'lucide-react';

interface ProfileFormModalProps {
  isOpen: boolean;
  profileToEdit: CompanionProfile | null;
  onClose: () => void;
  onSave: (profile: CompanionProfile) => void;
}

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

const DEFAULT_SERVICES = [
  'Girlfriend Experience (GFE)',
  'Body to Body Massage',
  'Dinner Date & Social Events',
  '5-Star Hotel Outcall',
  'Free Pickup & Drop',
  'Cash on Delivery (No Advance)',
  'Deep Tissue Relief',
  'Party & Club Companion',
  'VIP Travel Companion'
];

export const ProfileFormModal: React.FC<ProfileFormModalProps> = ({
  isOpen,
  profileToEdit,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<
    'basic' | 'images' | 'pricing' | 'location' | 'seo'
  >('basic');

  const [formData, setFormData] = useState<Partial<CompanionProfile>>(() => {
    if (profileToEdit) {
      return { ...profileToEdit };
    }
    return normalizeProfile({
      name: '',
      category: 'Independent',
      location: 'Gomti Nagar'
    });
  });

  const [isAutoSlug, setIsAutoSlug] = useState<boolean>(!profileToEdit);
  const [newGalleryUrl, setNewGalleryUrl] = useState<string>('');
  const [newServiceTag, setNewServiceTag] = useState<string>('');

  // Media picker target state
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'featured' | 'gallery' | null>(null);

  useEffect(() => {
    if (profileToEdit) {
      setFormData({ ...profileToEdit });
      setIsAutoSlug(false);
    } else {
      const initial = normalizeProfile({
        name: '',
        category: 'Independent',
        location: 'Gomti Nagar'
      });
      setFormData(initial);
      setIsAutoSlug(true);
    }
  }, [profileToEdit]);

  // Handle Name change & Auto Slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => {
      const nextSlug = isAutoSlug ? generateSlug(val) : prev.slug;
      return {
        ...prev,
        name: val,
        slug: nextSlug,
        seoTitle: `${val} (${prev.category || 'Call Girl'}) in ${prev.location || 'Lucknow'} | 0 Advance`
      };
    });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAutoSlug(false);
    setFormData(prev => ({
      ...prev,
      slug: generateSlug(e.target.value)
    }));
  };

  const handleRegenerateSlug = () => {
    if (formData.name) {
      const slug = generateSlug(formData.name);
      setFormData(prev => ({ ...prev, slug }));
      setIsAutoSlug(true);
    }
  };

  const handleRegenerateSchema = () => {
    const schema = generateProfileSchema(formData);
    setFormData(prev => ({ ...prev, schemaMarkup: schema }));
  };

  // Image Gallery Handlers
  const handleAddGalleryImage = (url: string) => {
    if (!url.trim()) return;
    setFormData(prev => {
      const current = prev.gallery || [];
      if (current.includes(url)) return prev;
      return { ...prev, gallery: [...current, url.trim()] };
    });
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData(prev => {
      const current = [...(prev.gallery || [])];
      current.splice(index, 1);
      return { ...prev, gallery: current };
    });
  };

  const handleMoveGalleryImage = (index: number, direction: 'up' | 'down') => {
    setFormData(prev => {
      const current = [...(prev.gallery || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.length) return prev;
      const temp = current[index];
      current[index] = current[targetIndex];
      current[targetIndex] = temp;
      return { ...prev, gallery: current };
    });
  };

  // Services Tag Handlers
  const handleToggleService = (service: string) => {
    setFormData(prev => {
      const current = prev.services || [];
      if (current.includes(service)) {
        return { ...prev, services: current.filter(s => s !== service) };
      }
      return { ...prev, services: [...current, service] };
    });
  };

  const handleAddCustomService = () => {
    if (!newServiceTag.trim()) return;
    const tag = newServiceTag.trim();
    setFormData(prev => {
      const current = prev.services || [];
      if (current.includes(tag)) return prev;
      return { ...prev, services: [...current, tag] };
    });
    setNewServiceTag('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('Please enter a profile name.');
      setActiveTab('basic');
      return;
    }

    const normalized = normalizeProfile(formData);
    onSave(normalized);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0f0f0f] border border-white/10 rounded-lg overflow-hidden text-[#e0e0e0] my-6 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#141414] border-b border-white/10">
          <div>
            <h2 className="text-lg font-serif text-[#e0e0e0] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#c5a059]" />
              {profileToEdit ? `Edit Profile: ${profileToEdit.name}` : 'Create New Companion Profile'}
            </h2>
            <p className="text-xs text-white/50">
              Manage complete profile details, galleries, rates, locations, and search engine optimization.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 bg-[#0a0a0a] border-b border-white/10 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('basic')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors shrink-0 ${
              activeTab === 'basic'
                ? 'border-[#c5a059] text-[#c5a059] bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            Basic Info
          </button>

          <button
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors shrink-0 ${
              activeTab === 'images'
                ? 'border-[#c5a059] text-[#c5a059] bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Media & Gallery ({formData.gallery?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors shrink-0 ${
              activeTab === 'pricing'
                ? 'border-[#c5a059] text-[#c5a059] bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Pricing & Contact
          </button>

          <button
            onClick={() => setActiveTab('location')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors shrink-0 ${
              activeTab === 'location'
                ? 'border-[#c5a059] text-[#c5a059] bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Location & Content
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors shrink-0 ${
              activeTab === 'seo'
                ? 'border-[#c5a059] text-[#c5a059] bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <SearchIcon className="w-4 h-4" />
            SEO & Schema
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#0a0a0a]">
          {/* TAB 1: BASIC INFORMATION */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Profile Name */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Profile Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={handleNameChange}
                    placeholder="e.g. Riya Kapoor"
                    className="w-full bg-[#141414] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                {/* Nickname */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Nick Name
                  </label>
                  <input
                    type="text"
                    value={formData.nickName || ''}
                    onChange={e => setFormData({ ...formData, nickName: e.target.value })}
                    placeholder="e.g. Riya"
                    className="w-full bg-[#141414] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                {/* Slug */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider">
                      SEO URL Slug
                    </label>
                    <button
                      type="button"
                      onClick={handleRegenerateSlug}
                      className="text-[10px] text-[#c5a059] hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Auto-Generate from Name
                    </button>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-[#1a1a1a] border border-r-0 border-white/10 rounded-l px-3 py-2 text-xs text-white/40 font-mono">
                      /profile/
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.slug || ''}
                      onChange={handleSlugChange}
                      placeholder="riya-kapoor"
                      className="w-full bg-[#141414] border border-white/10 rounded-r px-3 py-2 text-xs text-[#c5a059] font-mono focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                {/* Subtitle / Tagline */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Short Title / Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. VIP Independent College Girl Gomti Nagar"
                    className="w-full bg-[#141414] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category || 'Independent'}
                    onChange={e => setFormData({ ...formData, category: e.target.value as CategoryType })}
                    className="w-full bg-[#141414] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={50}
                    value={formData.age || 22}
                    onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) || 22 })}
                    className="w-full bg-[#141414] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                {/* Height */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Height
                  </label>
                  <input
                    type="text"
                    value={formData.height || ''}
                    onChange={e => setFormData({ ...formData, height: e.target.value })}
                    placeholder={`5'7"`}
                    className="w-full bg-[#141414] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Weight
                  </label>
                  <input
                    type="text"
                    value={formData.weight || ''}
                    onChange={e => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="52 kg"
                    className="w-full bg-[#141414] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                {/* Body Type */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Body Type
                  </label>
                  <input
                    type="text"
                    value={formData.bodyType || ''}
                    onChange={e => setFormData({ ...formData, bodyType: e.target.value })}
                    placeholder="Slim / Busty / Petite"
                    className="w-full bg-[#141414] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                {/* Figure / Measurements */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Measurements (Figure)
                  </label>
                  <input
                    type="text"
                    value={formData.figure || ''}
                    onChange={e => setFormData({ ...formData, figure: e.target.value })}
                    placeholder="34B-26-36"
                    className="w-full bg-[#141414] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Languages (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={formData.languages?.join(', ') || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })
                    }
                    placeholder="Hindi, English"
                    className="w-full bg-[#141414] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={formData.nationality || ''}
                    onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                    placeholder="Indian / Russian / Nepalese"
                    className="w-full bg-[#141414] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                {/* Profession */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Profession
                  </label>
                  <input
                    type="text"
                    value={formData.profession || ''}
                    onChange={e => setFormData({ ...formData, profession: e.target.value })}
                    placeholder="Student / Fashion Model"
                    className="w-full bg-[#141414] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={formData.experience || ''}
                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="2+ Years"
                    className="w-full bg-[#141414] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Availability Status
                  </label>
                  <input
                    type="text"
                    value={formData.availability || ''}
                    onChange={e => setFormData({ ...formData, availability: e.target.value })}
                    placeholder="24/7 Available"
                    className="w-full bg-[#141414] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              {/* Status & Badge Toggles */}
              <div className="bg-[#141414] border border-white/10 p-4 rounded space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#c5a059] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Visibility & Status Badges
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {/* Active Toggle */}
                  <label className="flex items-center gap-3 bg-[#0f0f0f] border border-white/10 p-3 rounded cursor-pointer hover:border-white/20">
                    <input
                      type="checkbox"
                      checked={formData.isActive ?? true}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                      className="accent-[#c5a059] w-4 h-4"
                    />
                    <div>
                      <span className="font-semibold block text-white">Active Profile</span>
                      <span className="text-[10px] text-white/50 block">Published on website</span>
                    </div>
                  </label>

                  {/* Featured Toggle */}
                  <label className="flex items-center gap-3 bg-[#0f0f0f] border border-white/10 p-3 rounded cursor-pointer hover:border-white/20">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured ?? false}
                      onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="accent-[#c5a059] w-4 h-4"
                    />
                    <div>
                      <span className="font-semibold block text-white flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#c5a059] fill-[#c5a059]" /> Featured Profile
                      </span>
                      <span className="text-[10px] text-white/50 block">High priority placement</span>
                    </div>
                  </label>

                  {/* Verified Badge Toggle */}
                  <label className="flex items-center gap-3 bg-[#0f0f0f] border border-white/10 p-3 rounded cursor-pointer hover:border-white/20">
                    <input
                      type="checkbox"
                      checked={formData.verified ?? true}
                      onChange={e => setFormData({ ...formData, verified: e.target.checked })}
                      className="accent-[#c5a059] w-4 h-4"
                    />
                    <div>
                      <span className="font-semibold block text-white flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" /> Verification Badge
                      </span>
                      <span className="text-[10px] text-white/50 block">Show verified checkmark</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE IMAGES */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              {/* Featured Main Image */}
              <div className="bg-[#141414] border border-white/10 p-4 rounded space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">
                    Featured Main Image *
                  </label>
                  <button
                    type="button"
                    onClick={() => setMediaPickerTarget('featured')}
                    className="px-3 py-1 bg-[#c5a059]/10 hover:bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30 rounded text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Select from Media Library
                  </button>
                </div>

                <div className="flex gap-4 items-start">
                  {formData.image ? (
                    <div className="w-24 h-32 rounded overflow-hidden border border-white/20 shrink-0 bg-black">
                      <img
                        src={formData.image}
                        alt="Featured"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-32 rounded border-2 border-dashed border-white/20 shrink-0 flex items-center justify-center text-white/40">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      required
                      value={formData.image || ''}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
                    />
                    <p className="text-[10px] text-white/50">
                      Primary hero portrait image. Recommended aspect ratio 3:4 or 4:5 with high visual clarity.
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery Images */}
              <div className="bg-[#141414] border border-white/10 p-4 rounded space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">
                      Photo Gallery ({formData.gallery?.length || 0})
                    </h4>
                    <p className="text-[10px] text-white/50">
                      Drag, reorder, and add high-resolution photos for this companion.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMediaPickerTarget('gallery')}
                    className="px-3 py-1.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add from Media Library
                  </button>
                </div>

                {/* Add Custom Gallery Image URL */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGalleryUrl}
                    onChange={e => setNewGalleryUrl(e.target.value)}
                    placeholder="Paste external image URL..."
                    className="flex-1 bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddGalleryImage(newGalleryUrl)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded text-xs transition-colors"
                  >
                    Add URL
                  </button>
                </div>

                {/* Gallery Items Grid */}
                {formData.gallery && formData.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                    {formData.gallery.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative group bg-[#0a0a0a] border border-white/10 rounded overflow-hidden"
                      >
                        <div className="aspect-[3/4]">
                          <img
                            src={imgUrl}
                            alt={`Gallery ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="absolute top-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-white/80">
                          #{idx + 1}
                        </div>

                        {/* Actions Overlay */}
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryImage(idx, 'up')}
                              className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded"
                              title="Move Left/Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {idx < (formData.gallery?.length || 0) - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryImage(idx, 'down')}
                              className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded"
                              title="Move Right/Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="p-1.5 bg-rose-500/80 hover:bg-rose-600 text-white rounded"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-white/10 rounded text-xs text-white/40">
                    No gallery photos added yet. Click "Add from Media Library" or paste an image URL above.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PRICING & CONTACT */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              {/* Rate Chart */}
              <div className="bg-[#141414] border border-white/10 p-4 rounded space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#c5a059] flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" /> Service Rates (INR ₹)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1 Hour Rate */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                      1 Hour Rate (₹)
                    </label>
                    <input
                      type="number"
                      step={500}
                      value={formData.rate1Hour || ''}
                      onChange={e => setFormData({ ...formData, rate1Hour: parseInt(e.target.value) || 0 })}
                      placeholder="e.g. 3000"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-xs text-[#c5a059] font-bold focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  {/* 2 Hours Rate (Short time) */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                      Short Time (2 Hours ₹) *
                    </label>
                    <input
                      type="number"
                      step={500}
                      required
                      value={formData.rateShort || ''}
                      onChange={e => setFormData({ ...formData, rateShort: parseInt(e.target.value) || 0 })}
                      placeholder="e.g. 3999"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-xs text-[#c5a059] font-bold focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  {/* Full Night Rate */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                      Full Night (8 Hours ₹) *
                    </label>
                    <input
                      type="number"
                      step={500}
                      required
                      value={formData.rateFull || ''}
                      onChange={e => setFormData({ ...formData, rateFull: parseInt(e.target.value) || 0 })}
                      placeholder="e.g. 9999"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-xs text-[#c5a059] font-bold focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                {/* Service Types */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <label className="flex items-center gap-3 bg-[#0f0f0f] border border-white/10 p-3 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.outcall ?? true}
                      onChange={e => setFormData({ ...formData, outcall: e.target.checked })}
                      className="accent-[#c5a059] w-4 h-4"
                    />
                    <div>
                      <span className="font-semibold block text-white">Outcall Service Available</span>
                      <span className="text-[10px] text-white/50 block">5-Star Hotel & Private Room Delivery</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 bg-[#0f0f0f] border border-white/10 p-3 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.incall ?? true}
                      onChange={e => setFormData({ ...formData, incall: e.target.checked })}
                      className="accent-[#c5a059] w-4 h-4"
                    />
                    <div>
                      <span className="font-semibold block text-white">Incall Service Available</span>
                      <span className="text-[10px] text-white/50 block">Private VIP Apartment Stay</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-[#141414] border border-white/10 p-4 rounded space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#c5a059] flex items-center gap-1.5">
                  <Phone className="w-4 h-4" /> Direct Contact Channels
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* WhatsApp */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                      WhatsApp Number (Format: 918726179837)
                    </label>
                    <input
                      type="text"
                      value={formData.whatsapp || ''}
                      onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="918726179837"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                      Phone Number (Display)
                    </label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 87261 79837"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  {/* Telegram */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                      Telegram Username (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.telegram || ''}
                      onChange={e => setFormData({ ...formData, telegram: e.target.value })}
                      placeholder="@juliclub_official"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LOCATION & CONTENT */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              {/* Location */}
              <div className="bg-[#141414] border border-white/10 p-4 rounded space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#c5a059] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Geographical Location & Coverage
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                      Primary City
                    </label>
                    <input
                      type="text"
                      value={formData.city || 'Lucknow'}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                      Primary Area / Neighborhood *
                    </label>
                    <select
                      value={formData.location || 'Gomti Nagar'}
                      onChange={e => setFormData({ ...formData, location: e.target.value as LucknowArea })}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    >
                      {LUCKNOW_AREAS.filter(a => a !== 'All Lucknow').map(area => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                      Nearby Areas Served (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={formData.nearbyAreas?.join(', ') || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          nearbyAreas: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        })
                      }
                      placeholder="Hazratganj, Indira Nagar, Charbagh, Airport Road"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
              </div>

              {/* Biography & Descriptions */}
              <div className="bg-[#141414] border border-white/10 p-4 rounded space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#c5a059] flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Biography & Introduction
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Short Introduction
                  </label>
                  <input
                    type="text"
                    value={formData.shortIntro || ''}
                    onChange={e => setFormData({ ...formData, shortIntro: e.target.value })}
                    placeholder="Brief 1-line teaser for search results & cards"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Full Biography & About Companion *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.bio || ''}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Detailed bio describing personality, date expectations, background..."
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              {/* Services Included */}
              <div className="bg-[#141414] border border-white/10 p-4 rounded space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#c5a059] flex items-center gap-1.5">
                  <Tag className="w-4 h-4" /> Services & Specialities
                </h4>

                <div className="space-y-2">
                  <span className="text-[10px] text-white/50 block">Select standard services included:</span>
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_SERVICES.map(service => {
                      const isSelected = formData.services?.includes(service);
                      return (
                        <button
                          key={service}
                          type="button"
                          onClick={() => handleToggleService(service)}
                          className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 border ${
                            isSelected
                              ? 'bg-[#c5a059] text-black font-semibold border-[#c5a059]'
                              : 'bg-[#0a0a0a] text-white/70 border-white/10 hover:border-white/30'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          {service}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Service Tag */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newServiceTag}
                    onChange={e => setNewServiceTag(e.target.value)}
                    placeholder="Add custom service tag..."
                    className="flex-1 bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomService}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-colors"
                  >
                    Add Service
                  </button>
                </div>
              </div>

              {/* Expectations & Rules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#141414] border border-white/10 p-4 rounded space-y-2">
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider">
                    Client Expectations & Preferences
                  </label>
                  <textarea
                    rows={3}
                    value={formData.expectations || ''}
                    onChange={e => setFormData({ ...formData, expectations: e.target.value })}
                    placeholder="e.g. Clean room, respectful behavior, 0 advance cash payment..."
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded p-3 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div className="bg-[#141414] border border-white/10 p-4 rounded space-y-2">
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider">
                    Booking Rules & Safety Terms
                  </label>
                  <textarea
                    rows={3}
                    value={formData.rules || ''}
                    onChange={e => setFormData({ ...formData, rules: e.target.value })}
                    placeholder="e.g. Strictly no recording, no advance transfer requested..."
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded p-3 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SEO & SCHEMA */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="bg-[#141414] border border-white/10 p-4 rounded space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#c5a059] flex items-center gap-1.5">
                  <Globe className="w-4 h-4" /> Search Engine Optimization (SEO)
                </h4>

                {/* Meta Title */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                      Meta SEO Title
                    </label>
                    <span className="text-[10px] text-white/40">
                      {(formData.seoTitle || '').length} / 70 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.seoTitle || ''}
                    onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                    placeholder="Riya Kapoor (VIP Call Girl) in Gomti Nagar Lucknow | 0 Advance"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                      Meta Description
                    </label>
                    <span className="text-[10px] text-white/40">
                      {(formData.metaDescription || '').length} / 160 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={formData.metaDescription || ''}
                    onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Book Riya Kapoor in Gomti Nagar Lucknow. Verified high class escort, 100% Cash on Delivery, free hotel room delivery within 30 mins."
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded p-3 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                {/* Focus Keyword & Canonical */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                      Focus Keyword
                    </label>
                    <input
                      type="text"
                      value={formData.focusKeyword || ''}
                      onChange={e => setFormData({ ...formData, focusKeyword: e.target.value })}
                      placeholder="riya kapoor gomti nagar call girl"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                      Canonical URL
                    </label>
                    <input
                      type="text"
                      value={formData.canonicalUrl || ''}
                      onChange={e => setFormData({ ...formData, canonicalUrl: e.target.value })}
                      placeholder={`https://lucknow.juliclub.in/profile/${formData.slug || ''}`}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                {/* Robots */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                    Robots Directive
                  </label>
                  <input
                    type="text"
                    value={formData.robots || 'index, follow'}
                    onChange={e => setFormData({ ...formData, robots: e.target.value })}
                    placeholder="index, follow, max-image-preview:large"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              {/* JSON-LD Profile Schema */}
              <div className="bg-[#141414] border border-white/10 p-4 rounded space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#c5a059] flex items-center gap-1.5">
                    <Code className="w-4 h-4" /> JSON-LD Profile Structured Schema
                  </h4>

                  <button
                    type="button"
                    onClick={handleRegenerateSchema}
                    className="px-3 py-1 bg-[#c5a059]/10 hover:bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30 rounded text-xs flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Auto Generate Schema
                  </button>
                </div>

                <textarea
                  rows={8}
                  value={formData.schemaMarkup || generateProfileSchema(formData)}
                  onChange={e => setFormData({ ...formData, schemaMarkup: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded p-3 text-xs text-emerald-400 font-mono focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded text-xs uppercase tracking-widest transition-colors shadow-lg flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {profileToEdit ? 'Save Changes' : 'Publish Profile'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Media Picker Modal helper for selecting images */}
      <MediaPickerModal
        isOpen={Boolean(mediaPickerTarget)}
        onClose={() => setMediaPickerTarget(null)}
        onSelectImage={(url) => {
          if (mediaPickerTarget === 'featured') {
            setFormData(prev => ({ ...prev, image: url }));
          } else if (mediaPickerTarget === 'gallery') {
            handleAddGalleryImage(url);
          }
          setMediaPickerTarget(null);
        }}
        title={mediaPickerTarget === 'featured' ? 'Select Featured Profile Photo' : 'Add Photo to Gallery'}
        allowedCategory="profiles"
      />
    </div>
  );
};
