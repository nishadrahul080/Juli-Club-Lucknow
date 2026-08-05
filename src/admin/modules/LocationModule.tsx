import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { LocationPageInfo, CMSSection, PublishStatus } from '../../types';
import { SectionBuilder } from '../components/SectionBuilder';
import { MediaPickerModal } from '../media/components/MediaPickerModal';
import {
  MapPin,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  Globe,
  ArrowLeft,
  X,
  ExternalLink,
  Save,
  HelpCircle
} from 'lucide-react';

export const LocationModule: React.FC = () => {
  const { cmsData, addLocationPage, deleteLocationPage, updateLocations, isPreviewMode, togglePreviewMode } = useCMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingLocation, setEditingLocation] = useState<LocationPageInfo | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'details' | 'builder' | 'seo' | 'faqs'>('details');
  const [saveNotification, setSaveNotification] = useState<string | null>(null);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'ogImage' | null>(null);

  const locationsList = (Object.values(cmsData.locations) as LocationPageInfo[]);

  const filteredLocations = locationsList.filter(loc => {
    const matchesSearch =
      loc.areaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateNewLocation = () => {
    const newLoc: LocationPageInfo = {
      slug: `call-girl-service-${Date.now().toString().slice(-4)}`,
      areaName: 'New Area Lucknow',
      title: 'Call Girl Service New Area Lucknow | 100% Cash on Delivery',
      metaDescription: 'Verified 5-star call girl service in New Area Lucknow with zero advance payment.',
      h1: 'Call Girl Service New Area Lucknow',
      intro: 'Experience luxury companion services in New Area Lucknow with 100% COD guarantee and free cab delivery.',
      tagline: '100% Cash on Delivery & Free Hotel Pickup',
      keywords: ['Call Girl Service New Area Lucknow', 'Escorts in New Area Lucknow'],
      landmarks: ['Taj Mahal Lucknow', 'Hyatt Regency', 'Novotel Gomti Nagar'],
      contentSections: [
        {
          title: 'Premium Escorts & Call Girl Service in New Area Lucknow',
          paragraphs: [
            'Experience elite female companionship in New Area Lucknow with 100% Cash on Delivery guarantee and complimentary private pickup.'
          ]
        }
      ],
      heroTitle: 'Exclusive VIP Call Girls in New Area Lucknow',
      heroDescription: '100% Cash on Delivery • Free Doorstep & Hotel Pickup • Zero Advance',
      locationName: 'New Area Lucknow Escorts',
      status: 'published',
      isFeatured: true,
      canonicalUrl: 'https://lucknow.juliclub.in/new-area-lucknow',
      robotsMeta: 'index, follow, max-image-preview:large',
      focusKeyword: 'Call Girl Service New Area Lucknow',
      whatsappNumber: '918726179837',
      highlights: ['100% Genuine Pictures', 'Zero Advance Payment Required', 'Free 30-Min Hotel Pickup', '5-Star Luxury Outcalls'],
      popularHotels: ['Hotel Taj Mahal Lucknow', 'Novotel Gomti Nagar', 'Hyatt Regency'],
      pricingOverrides: {
        shortTime1Hr: '₹3,999',
        shortTime2Hr: '₹6,999',
        fullNight: '₹11,999'
      },
      faqs: [
        {
          question: 'How to book a call girl in this area?',
          answer: 'Simply send us a WhatsApp message or call us directly. Select your companion and specify your hotel or home address. Zero advance is required.'
        },
        {
          question: 'Is 100% Cash on Delivery available here?',
          answer: 'Yes, 100% Cash on Delivery is strictly guaranteed across all local hotels and private residences.'
        }
      ],
      customSections: [
        {
          id: `sec-loc-hero-${Date.now()}`,
          type: 'hero',
          title: 'Call Girl Service New Area Lucknow',
          subtitle: 'VERIFIED LUCKNOW COMPANIONS',
          description: 'Experience luxury companion services in New Area Lucknow with 100% COD guarantee and free cab delivery.',
          ctaText: 'Book via WhatsApp Now',
          ctaUrl: 'https://wa.me/918726179837',
          bgColor: '#0d0d0d',
          spacing: 'medium',
          order: 1,
          show: true,
          status: 'published'
        },
        {
          id: `sec-loc-text-${Date.now()}`,
          type: 'text',
          title: 'Safe & Discreet Companion Stay in New Area Lucknow',
          subtitle: 'Zero Advance Payment Guarantee',
          description: 'Our escorts in New Area offer elite companionship for 5-star hotel stays, private dinners, and executive relaxation.',
          bgColor: '#0a0a0a',
          spacing: 'medium',
          order: 2,
          show: true,
          status: 'published'
        }
      ]
    };

    setEditingLocation(newLoc);
    setActiveSubTab('details');
  };

  const handleCloneLocation = (loc: LocationPageInfo) => {
    const slugSuffix = Math.floor(100 + Math.random() * 900);
    const cloned: LocationPageInfo = {
      ...loc,
      slug: `${loc.slug}-copy-${slugSuffix}`,
      areaName: `${loc.areaName} (Copy)`,
      title: `${loc.title} (Copy)`,
      status: 'draft'
    };
    addLocationPage(cloned);
    setSaveNotification(`Successfully cloned "${loc.areaName}" as draft!`);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  const handleDeleteLoc = (slug: string, areaName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${areaName}" location page?`)) return;
    deleteLocationPage(slug);
    if (editingLocation?.slug === slug) setEditingLocation(null);
    setSaveNotification(`Deleted location "${areaName}"`);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  const handleSaveLocationForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingLocation) return;

    addLocationPage(editingLocation);
    setSaveNotification(`Saved location "${editingLocation.areaName}" successfully!`);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Module Title Header */}
      <div className="bg-[#141414] border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#c5a059]/10 text-[#c5a059] rounded-xl border border-[#c5a059]/30">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif font-bold text-white">Location Page Management</h2>
              <span className="px-2.5 py-0.5 bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30 rounded text-[10px] font-bold uppercase">
                {locationsList.length} Area Pages
              </span>
            </div>
            <p className="text-xs text-white/60">
              Create and manage SEO-optimized location pages for Gomti Nagar, Hazratganj, Charbagh, and custom Lucknow sectors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {!editingLocation && (
            <button
              type="button"
              onClick={handleCreateNewLocation}
              className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-lg shadow-[#c5a059]/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Location Page</span>
            </button>
          )}

          {editingLocation && (
            <button
              type="button"
              onClick={() => setEditingLocation(null)}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Locations List</span>
            </button>
          )}
        </div>
      </div>

      {saveNotification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveNotification}</span>
        </div>
      )}

      {/* Main Mode 1: Locations Table List */}
      {!editingLocation && (
        <div className="space-y-4">
          {/* Search & Status Filters */}
          <div className="bg-[#141414] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search area, title, or slug..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg pl-9 pr-3.5 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-[#1a1a1a] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published Only</option>
                <option value="draft">Draft Only</option>
                <option value="scheduled">Scheduled Only</option>
                <option value="archived">Archived Only</option>
              </select>
            </div>
          </div>

          {/* Locations Grid / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocations.map(loc => (
              <div
                key={loc.slug}
                className="bg-[#141414] border border-white/10 rounded-xl p-5 hover:border-[#c5a059]/40 transition-all flex flex-col justify-between gap-4 group shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 rounded text-[10px] font-mono font-bold uppercase">
                      /{loc.slug}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        loc.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {loc.status || 'published'}
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-white group-hover:text-[#c5a059] transition-colors">
                    {loc.areaName}
                  </h3>

                  <p className="text-xs text-white/60 line-clamp-2 font-sans">{loc.intro || loc.title}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-white/40">
                    {loc.customSections?.length || 0} Sections • {loc.faqs?.length || 0} FAQs
                  </span>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`/${loc.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded"
                      title="View Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => handleCloneLocation(loc)}
                      className="p-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded"
                      title="Clone Location"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setEditingLocation({ ...loc });
                        setActiveSubTab('details');
                      }}
                      className="px-2.5 py-1 bg-[#c5a059]/20 hover:bg-[#c5a059]/30 text-[#c5a059] font-bold rounded flex items-center gap-1 border border-[#c5a059]/30 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>

                    <button
                      onClick={() => handleDeleteLoc(loc.slug, loc.areaName)}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded"
                      title="Delete Location"
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

      {/* Main Mode 2: Editing Location Page Form */}
      {editingLocation && (
        <div className="space-y-6">
          {/* Sub-Tabs Bar */}
          <div className="flex border-b border-white/10 gap-2 bg-[#141414] p-2 rounded-xl">
            <button
              onClick={() => setActiveSubTab('details')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'details'
                  ? 'bg-[#c5a059] text-black font-extrabold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Location Details & Pricing</span>
            </button>

            <button
              onClick={() => setActiveSubTab('builder')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'builder'
                  ? 'bg-[#c5a059] text-black font-extrabold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Custom Section Builder ({(editingLocation.customSections || []).length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('faqs')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'faqs'
                  ? 'bg-[#c5a059] text-black font-extrabold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Location FAQs ({(editingLocation.faqs || []).length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('seo')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'seo'
                  ? 'bg-[#c5a059] text-black font-extrabold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>SEO & Schema</span>
            </button>
          </div>

          {/* Sub-Tab 1: Basic Location Details */}
          {activeSubTab === 'details' && (
            <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white mb-1">Area Name (e.g. Gomti Nagar)</label>
                    <input
                      type="text"
                      value={editingLocation.areaName}
                      onChange={e => {
                        const newArea = e.target.value;
                        const newSlug = newArea.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setEditingLocation(prev => prev ? ({
                          ...prev,
                          areaName: newArea,
                          slug: newSlug || prev.slug
                        }) : null);
                      }}
                      className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={editingLocation.slug}
                      onChange={e => setEditingLocation(prev => prev ? ({ ...prev, slug: e.target.value }) : null)}
                      className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none font-mono text-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1">H1 Heading</label>
                    <input
                      type="text"
                      value={editingLocation.h1}
                      onChange={e => setEditingLocation(prev => prev ? ({ ...prev, h1: e.target.value }) : null)}
                      className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1">Intro Paragraph</label>
                    <textarea
                      rows={4}
                      value={editingLocation.intro}
                      onChange={e => setEditingLocation(prev => prev ? ({ ...prev, intro: e.target.value }) : null)}
                      className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none resize-none font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white mb-1">Publish Status</label>
                    <select
                      value={editingLocation.status || 'published'}
                      onChange={e => setEditingLocation(prev => prev ? ({ ...prev, status: e.target.value as PublishStatus }) : null)}
                      className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                    >
                      <option value="published">Published (Live)</option>
                      <option value="draft">Draft (Hidden)</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {/* Pricing Overrides */}
                  <div className="p-4 bg-[#0d0d0d] rounded-lg border border-white/10 space-y-3">
                    <span className="text-xs font-bold text-[#c5a059] block">Rate Cards for this Location</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] text-white/60 mb-1">1 Hour</label>
                        <input
                          type="text"
                          value={editingLocation.pricingOverrides?.shortTime1Hr || '₹3,999'}
                          onChange={e => setEditingLocation(prev => prev ? ({
                            ...prev,
                            pricingOverrides: { ...(prev.pricingOverrides || {}), shortTime1Hr: e.target.value }
                          }) : null)}
                          className="w-full bg-[#1a1a1a] border border-white/15 rounded p-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-white/60 mb-1">2 Hours</label>
                        <input
                          type="text"
                          value={editingLocation.pricingOverrides?.shortTime2Hr || '₹6,999'}
                          onChange={e => setEditingLocation(prev => prev ? ({
                            ...prev,
                            pricingOverrides: { ...(prev.pricingOverrides || {}), shortTime2Hr: e.target.value }
                          }) : null)}
                          className="w-full bg-[#1a1a1a] border border-white/15 rounded p-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-white/60 mb-1">Full Night</label>
                        <input
                          type="text"
                          value={editingLocation.pricingOverrides?.fullNight || '₹11,999'}
                          onChange={e => setEditingLocation(prev => prev ? ({
                            ...prev,
                            pricingOverrides: { ...(prev.pricingOverrides || {}), fullNight: e.target.value }
                          }) : null)}
                          className="w-full bg-[#1a1a1a] border border-white/15 rounded p-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1">Popular Hotels Nearby (Comma separated)</label>
                    <input
                      type="text"
                      value={(editingLocation.popularHotels || []).join(', ')}
                      onChange={e => {
                        const hotelsArr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        setEditingLocation(prev => prev ? ({ ...prev, popularHotels: hotelsArr }) : null);
                      }}
                      placeholder="Taj Mahal Lucknow, Novotel, Renaissance"
                      className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveLocationForm()}
                  className="px-6 py-2.5 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-lg shadow-[#c5a059]/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Location Details
                </button>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Custom Section Builder */}
          {activeSubTab === 'builder' && (
            <div className="space-y-4">
              <SectionBuilder
                sections={editingLocation.customSections || []}
                onChangeSections={updatedSecs => {
                  setEditingLocation(prev => prev ? ({ ...prev, customSections: updatedSecs }) : null);
                }}
              />
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveLocationForm()}
                  className="px-6 py-2.5 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-lg shadow-[#c5a059]/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Location Sections
                </button>
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Location FAQs */}
          {activeSubTab === 'faqs' && (
            <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-base font-serif font-bold text-white">Location Specific FAQs</h3>
                <button
                  type="button"
                  onClick={() => {
                    const currentFaqs = editingLocation.faqs || [];
                    setEditingLocation(prev => prev ? ({
                      ...prev,
                      faqs: [
                        ...currentFaqs,
                        { question: 'New Question for ' + prev.areaName, answer: 'Answer detail...' }
                      ]
                    }) : null);
                  }}
                  className="px-3 py-1.5 bg-[#c5a059]/20 text-[#c5a059] font-bold rounded text-xs flex items-center gap-1 border border-[#c5a059]/40 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add FAQ
                </button>
              </div>

              {(editingLocation.faqs || []).map((faq, fIdx) => (
                <div key={fIdx} className="p-4 bg-[#0d0d0d] border border-white/10 rounded-lg space-y-3 relative group">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={e => {
                        const updated = [...(editingLocation.faqs || [])];
                        updated[fIdx].question = e.target.value;
                        setEditingLocation(prev => prev ? ({ ...prev, faqs: updated }) : null);
                      }}
                      placeholder="Question"
                      className="flex-1 bg-[#1a1a1a] border border-white/15 rounded px-3 py-2 text-xs font-bold text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(editingLocation.faqs || [])];
                        updated.splice(fIdx, 1);
                        setEditingLocation(prev => prev ? ({ ...prev, faqs: updated }) : null);
                      }}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={e => {
                      const updated = [...(editingLocation.faqs || [])];
                      updated[fIdx].answer = e.target.value;
                      setEditingLocation(prev => prev ? ({ ...prev, faqs: updated }) : null);
                    }}
                    placeholder="Answer"
                    className="w-full bg-[#1a1a1a] border border-white/15 rounded p-3 text-xs text-white/80 resize-none"
                  />
                </div>
              ))}

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveLocationForm()}
                  className="px-6 py-2.5 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-lg shadow-[#c5a059]/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save FAQs
                </button>
              </div>
            </div>
          )}

          {/* Sub-Tab 4: SEO Settings */}
          {activeSubTab === 'seo' && (
            <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white mb-1">SEO Meta Title Tag</label>
                    <input
                      type="text"
                      value={editingLocation.title}
                      onChange={e => setEditingLocation(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                      className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1">Meta Description</label>
                    <textarea
                      rows={3}
                      value={editingLocation.metaDescription}
                      onChange={e => setEditingLocation(prev => prev ? ({ ...prev, metaDescription: e.target.value }) : null)}
                      className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1">Focus Keyword</label>
                    <input
                      type="text"
                      value={editingLocation.focusKeyword || ''}
                      onChange={e => setEditingLocation(prev => prev ? ({ ...prev, focusKeyword: e.target.value }) : null)}
                      className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white mb-1">Canonical URL</label>
                    <input
                      type="text"
                      value={editingLocation.canonicalUrl || `https://lucknow.juliclub.in/${editingLocation.slug}`}
                      onChange={e => setEditingLocation(prev => prev ? ({ ...prev, canonicalUrl: e.target.value }) : null)}
                      className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1">Robots Meta Tag</label>
                    <input
                      type="text"
                      value={editingLocation.robotsMeta || 'index, follow, max-image-preview:large'}
                      onChange={e => setEditingLocation(prev => prev ? ({ ...prev, robotsMeta: e.target.value }) : null)}
                      className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveLocationForm()}
                  className="px-6 py-2.5 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-lg shadow-[#c5a059]/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save SEO Settings
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
