import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { HomepageConfig, PublishStatus } from '../../types';
import { SectionBuilder } from '../components/SectionBuilder';
import { MediaPickerModal } from '../media/components/MediaPickerModal';
import {
  Home,
  Save,
  Eye,
  EyeOff,
  Sparkles,
  Search,
  CheckCircle2,
  Image as ImageIcon,
  Code,
  Globe,
  Layers,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export const HomepageModule: React.FC = () => {
  const { cmsData, updateHomepage, updateHomepageSections, updateSettings, isPreviewMode, togglePreviewMode } = useCMS();
  const [activeTab, setActiveTab] = useState<'hero' | 'builder' | 'seo'>('hero');
  const [formData, setFormData] = useState<HomepageConfig>({ ...cmsData.homepage });
  const [heroSettings, setHeroSettings] = useState({
    badgeText: cmsData.settings.badgeText || '',
    heroHeading: cmsData.settings.heroHeading || '',
    heroSubheading: cmsData.settings.heroSubheading || '',
    whatsappMessage: cmsData.settings.whatsappMessage || '',
    whatsappNumber: cmsData.settings.whatsappNumber || ''
  });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'ogImage' | null>(null);

  const handleFieldChange = (field: keyof HomepageConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleHeroSettingChange = (field: string, value: string) => {
    setHeroSettings(prev => ({ ...prev, [field]: value }));
    updateSettings({ [field]: value });
  };

  const handleSaveHomepage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateHomepage(formData);
    updateSettings(heroSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Module Title Header & Global Actions */}
      <div className="bg-[#141414] border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#c5a059]/10 text-[#c5a059] rounded-xl border border-[#c5a059]/30">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif font-bold text-white">Homepage Content Manager</h2>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold uppercase">
                {formData.status}
              </span>
            </div>
            <p className="text-xs text-white/60">
              Manage hero copy, layout sections, CTA buttons, and search engine optimization for the homepage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Live Preview Mode Button */}
          <button
            type="button"
            onClick={() => togglePreviewMode()}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              isPreviewMode
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
            }`}
          >
            {isPreviewMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{isPreviewMode ? 'Preview Mode Active' : 'Enable Preview Mode'}</span>
          </button>

          <a
            href="/?preview=true"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg text-xs font-bold border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4 text-[#c5a059]" />
            <span className="hidden sm:inline">View Live</span>
          </a>

          <button
            type="button"
            onClick={() => handleSaveHomepage()}
            className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-lg shadow-[#c5a059]/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Homepage changes successfully saved to CMS store!</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'hero'
              ? 'border-[#c5a059] text-[#c5a059] bg-[#c5a059]/10 rounded-t-lg'
              : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Hero Banner Copy</span>
        </button>

        <button
          onClick={() => setActiveTab('builder')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'builder'
              ? 'border-[#c5a059] text-[#c5a059] bg-[#c5a059]/10 rounded-t-lg'
              : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Dynamic Section Builder ({formData.sections.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'seo'
              ? 'border-[#c5a059] text-[#c5a059] bg-[#c5a059]/10 rounded-t-lg'
              : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Homepage SEO & Social Meta</span>
        </button>
      </div>

      {/* Tab 1: Hero Settings */}
      {activeTab === 'hero' && (
        <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-base font-serif font-bold text-white">Main Homepage Hero Section</h3>
            <span className="text-xs text-white/40">Visual styling matches public header layout 100%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">Badge Text (Eyebrow Tag)</label>
                <input
                  type="text"
                  value={heroSettings.badgeText}
                  onChange={e => handleHeroSettingChange('badgeText', e.target.value)}
                  placeholder="e.g. 100% Genuine & Verified Companions (Lucknow)"
                  className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Main H1 Title</label>
                <input
                  type="text"
                  value={heroSettings.heroHeading}
                  onChange={e => handleHeroSettingChange('heroHeading', e.target.value)}
                  placeholder="Exclusive Call Girl Service Lucknow"
                  className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Hero Subheading</label>
                <input
                  type="text"
                  value={heroSettings.heroSubheading}
                  onChange={e => handleHeroSettingChange('heroSubheading', e.target.value)}
                  placeholder="100% Cash on Delivery • 0 Advance Payment • Free Cab Pickup"
                  className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">WhatsApp Call-to-Action Text</label>
                <input
                  type="text"
                  value={heroSettings.whatsappMessage}
                  onChange={e => handleHeroSettingChange('whatsappMessage', e.target.value)}
                  placeholder="Hello Juli Club, I want to book a VIP companion in Lucknow."
                  className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">WhatsApp Phone Number</label>
                <input
                  type="text"
                  value={heroSettings.whatsappNumber}
                  onChange={e => handleHeroSettingChange('whatsappNumber', e.target.value)}
                  placeholder="918726179837"
                  className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none font-mono"
                />
              </div>

              <div className="p-4 bg-[#0d0d0d] rounded-lg border border-[#c5a059]/30 text-xs space-y-1">
                <span className="font-bold text-[#c5a059] block">Hero Live Preview Copy:</span>
                <p className="text-white/80 font-serif font-bold text-sm">{heroSettings.heroHeading || cmsData.settings.heroHeading}</p>
                <p className="text-white/60 text-[11px]">{heroSettings.heroSubheading || cmsData.settings.heroSubheading}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Dynamic Section Builder */}
      {activeTab === 'builder' && (
        <SectionBuilder
          sections={formData.sections}
          onChangeSections={newSections => {
            handleFieldChange('sections', newSections);
            updateHomepageSections(newSections);
          }}
        />
      )}

      {/* Tab 3: SEO Settings */}
      {activeTab === 'seo' && (
        <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-base font-serif font-bold text-white">Homepage Meta Tags & Search Engine Indexing</h3>
            <span className="text-xs text-white/40">JSON-LD, OpenGraph & Canonical URL</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">SEO Title Tag</label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={e => handleFieldChange('seoTitle', e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={formData.metaDescription}
                  onChange={e => handleFieldChange('metaDescription', e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white mb-1">Focus Keyword</label>
                  <input
                    type="text"
                    value={formData.focusKeyword}
                    onChange={e => handleFieldChange('focusKeyword', e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white mb-1">Robots Tag</label>
                  <input
                    type="text"
                    value={formData.robots}
                    onChange={e => handleFieldChange('robots', e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">Canonical URL</label>
                <input
                  type="text"
                  value={formData.canonicalUrl}
                  onChange={e => handleFieldChange('canonicalUrl', e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">OpenGraph Social Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.ogImage}
                    onChange={e => handleFieldChange('ogImage', e.target.value)}
                    className="flex-1 bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerTarget('ogImage')}
                    className="px-3.5 py-2.5 bg-[#c5a059]/20 hover:bg-[#c5a059]/30 text-[#c5a059] font-bold rounded-lg text-xs border border-[#c5a059]/40 shrink-0"
                  >
                    Select
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">JSON-LD Schema Markup</label>
                <textarea
                  rows={4}
                  value={formData.schemaMarkup}
                  onChange={e => handleFieldChange('schemaMarkup', e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-white/20 rounded-lg p-3 text-xs text-emerald-400 font-mono focus:border-[#c5a059] outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {mediaPickerTarget && (
        <MediaPickerModal
          isOpen={!!mediaPickerTarget}
          onClose={() => setMediaPickerTarget(null)}
          onSelectMedia={media => {
            handleFieldChange('ogImage', media.url);
            setMediaPickerTarget(null);
          }}
        />
      )}
    </div>
  );
};
