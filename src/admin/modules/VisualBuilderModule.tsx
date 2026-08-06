import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { CMSSection } from '../../types';
import {
  Layers,
  Eye,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Copy,
  Save,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  Layout,
  Settings,
  Grid,
  Type,
  Maximize2,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { WhatsAppIcon } from '../../components/WhatsAppIcon';

interface VisualSectionItem {
  id: string;
  type: 'hero' | 'profiles' | 'map' | 'rates' | 'content' | 'blog' | 'reviews' | 'faq' | 'custom_cta';
  name: string;
  title: string;
  subtitle: string;
  show: boolean;
  padding: 'small' | 'medium' | 'large';
  bgColor: string;
  buttonLabel?: string;
  buttonUrl?: string;
}

const DEFAULT_BUILDER_SECTIONS: VisualSectionItem[] = [
  {
    id: 'sec-hero',
    type: 'hero',
    name: 'Hero Section',
    title: 'Exclusive Call Girl Service Lucknow',
    subtitle: '100% Cash on Delivery & Zero Advance',
    show: true,
    padding: 'large',
    bgColor: '#0d0d0d',
    buttonLabel: 'Book via WhatsApp Now',
    buttonUrl: 'https://wa.me/918726179837'
  },
  {
    id: 'sec-profiles',
    type: 'profiles',
    name: 'Verified Companions Grid',
    title: 'Verified Companion Directory (Lucknow)',
    subtitle: 'Showing independent VIP models with zero advance payment',
    show: true,
    padding: 'medium',
    bgColor: '#0a0a0a'
  },
  {
    id: 'sec-map',
    type: 'map',
    name: 'Lucknow Area Coverage Map',
    title: 'Explore Call Girl Services Across Lucknow Areas',
    subtitle: 'Fast 15-minute express hotel delivery in top sectors',
    show: true,
    padding: 'medium',
    bgColor: '#0f0f0f'
  },
  {
    id: 'sec-rates',
    type: 'rates',
    name: 'Rate Chart & Tariff Table',
    title: 'Transparent Companion Rate Card Lucknow',
    subtitle: 'No hidden charges • 100% Cash on Delivery',
    show: true,
    padding: 'medium',
    bgColor: '#0a0a0a'
  },
  {
    id: 'sec-content',
    type: 'content',
    name: 'SEO Content Blocks',
    title: 'Premier Call Girl Service Lucknow Content',
    subtitle: 'Comprehensive local Lucknow service guide',
    show: true,
    padding: 'large',
    bgColor: '#0a0a0a'
  },
  {
    id: 'sec-blog',
    type: 'blog',
    name: 'Blog & Local Escort Articles',
    title: 'Latest Lucknow Lifestyle & Escort Guides',
    subtitle: 'Stay informed with genuine Lucknow escort news',
    show: true,
    padding: 'medium',
    bgColor: '#0d0d0d'
  },
  {
    id: 'sec-reviews',
    type: 'reviews',
    name: 'Client Reviews & Testimonials',
    title: 'Verified Client Feedback & Ratings',
    subtitle: '4.9/5 Star Rated Service in Lucknow',
    show: true,
    padding: 'medium',
    bgColor: '#0f0f0f'
  },
  {
    id: 'sec-faq',
    type: 'faq',
    name: 'FAQ Accordion',
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know before booking',
    show: true,
    padding: 'medium',
    bgColor: '#0a0a0a'
  }
];

export const VisualBuilderModule: React.FC = () => {
  const { cmsData, updateHomepageSections, updateSettings } = useCMS();
  const [sections, setSections] = useState<VisualSectionItem[]>(() => {
    const saved = localStorage.getItem('juli_cms_builder_sections');
    return saved ? JSON.parse(saved) : DEFAULT_BUILDER_SECTIONS;
  });

  const [activeEditingId, setActiveEditingId] = useState<string | null>('sec-hero');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [toast, setToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'builder' | 'templates'>('builder');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const saveSections = (newSecs: VisualSectionItem[]) => {
    setSections(newSecs);
    localStorage.setItem('juli_cms_builder_sections', JSON.stringify(newSecs));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    saveSections(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    saveSections(updated);
  };

  const handleToggleShow = (id: string) => {
    const updated = sections.map(sec => {
      if (sec.id === id) {
        return { ...sec, show: !sec.show };
      }
      return sec;
    });
    saveSections(updated);
  };

  const handleDuplicateSection = (sec: VisualSectionItem) => {
    const duplicated: VisualSectionItem = {
      ...sec,
      id: 'sec-custom-' + Date.now(),
      name: `${sec.name} (Copy)`
    };
    saveSections([...sections, duplicated]);
    showToast(`Duplicated ${sec.name}.`);
  };

  const handleDeleteSection = (id: string) => {
    if (sections.length <= 1) {
      alert('At least one section must remain in the visual builder.');
      return;
    }
    const updated = sections.filter(sec => sec.id !== id);
    saveSections(updated);
    if (activeEditingId === id) setActiveEditingId(updated[0]?.id || null);
    showToast('Section removed.');
  };

  const handleUpdateActiveSection = (field: keyof VisualSectionItem, value: any) => {
    if (!activeEditingId) return;
    const updated = sections.map(sec => {
      if (sec.id === activeEditingId) {
        return { ...sec, [field]: value };
      }
      return sec;
    });
    saveSections(updated);
  };

  const handlePublishLayout = () => {
    // Transform VisualSectionItems to CMSSection format
    const cmsSections: CMSSection[] = sections.map((sec, idx) => ({
      id: sec.id,
      title: sec.title,
      subtitle: sec.subtitle,
      content: sec.subtitle,
      order: idx + 1,
      show: sec.show,
      status: sec.show ? 'published' : 'draft',
      type: sec.type,
      ctaText: sec.buttonLabel,
      ctaUrl: sec.buttonUrl
    }));

    updateHomepageSections(cmsSections);
    showToast('Visual Layout published successfully to the live website!');
  };

  const handleApplyTemplate = (templateName: string) => {
    if (templateName === 'High-Conversion SEO') {
      const updated = DEFAULT_BUILDER_SECTIONS.map(sec => ({ ...sec, show: true }));
      saveSections(updated);
      showToast('Applied High-Conversion SEO Template!');
    } else if (templateName === 'Minimalist VIP Directory') {
      const updated = DEFAULT_BUILDER_SECTIONS.map(sec => ({
        ...sec,
        show: ['sec-hero', 'sec-profiles', 'sec-rates', 'sec-faq'].includes(sec.id)
      }));
      saveSections(updated);
      showToast('Applied Minimalist VIP Directory Template!');
    } else if (templateName === 'Content Focus') {
      const updated = DEFAULT_BUILDER_SECTIONS.map(sec => ({
        ...sec,
        show: ['sec-hero', 'sec-content', 'sec-map', 'sec-blog'].includes(sec.id)
      }));
      saveSections(updated);
      showToast('Applied Content Focus Template!');
    }
  };

  const selectedSection = sections.find(sec => sec.id === activeEditingId) || sections[0];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Bar */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 rounded-xl">
            <Layout className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif text-white font-medium flex items-center gap-2">
              Visual Page Builder <span className="text-xs font-mono px-2 py-0.5 bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40 rounded-full">Elementor Lite v1.0</span>
            </h1>
            <p className="text-xs text-white/50">Drag, reorder, customize styling, and manage homepage section blocks live</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Responsive Preview Device Toggles */}
          <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-1 flex items-center gap-1">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                previewDevice === 'desktop' ? 'bg-[#c5a059] text-black font-bold' : 'text-white/40 hover:text-white'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewDevice('tablet')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                previewDevice === 'tablet' ? 'bg-[#c5a059] text-black font-bold' : 'text-white/40 hover:text-white'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                previewDevice === 'mobile' ? 'bg-[#c5a059] text-black font-bold' : 'text-white/40 hover:text-white'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handlePublishLayout}
            className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Save className="w-4 h-4" />
            Publish Layout
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-white/10 space-x-6 text-xs font-semibold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('builder')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'builder' ? 'text-[#c5a059] border-b-2 border-[#c5a059]' : 'text-white/40 hover:text-white'
          }`}
        >
          Section Inspector & Order
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'templates' ? 'text-[#c5a059] border-b-2 border-[#c5a059]' : 'text-white/40 hover:text-white'
          }`}
        >
          Preset Page Templates
        </button>
      </div>

      {activeTab === 'builder' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Section Navigator & Reordering */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#c5a059]" /> Section Hierarchy
                </h3>
                <span className="text-[11px] font-mono text-white/40">{sections.length} Blocks</span>
              </div>

              <div className="space-y-2">
                {sections.map((sec, idx) => {
                  const isSelected = sec.id === activeEditingId;
                  return (
                    <div
                      key={sec.id}
                      onClick={() => setActiveEditingId(sec.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#1c1c1c] border-[#c5a059] shadow-md'
                          : 'bg-[#161616] border-white/10 hover:border-white/20'
                      } ${!sec.show ? 'opacity-40' : ''}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-5 h-5 rounded bg-white/5 text-white/60 font-mono text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-white block truncate">{sec.name}</span>
                          <span className="text-[10px] text-white/40 font-mono uppercase">{sec.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handleToggleShow(sec.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            sec.show ? 'text-emerald-400 bg-emerald-500/10' : 'text-white/30 bg-white/5'
                          }`}
                          title={sec.show ? 'Visible' : 'Hidden'}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleMoveUp(idx)}
                          disabled={idx === 0}
                          className="p-1.5 text-white/40 hover:text-white disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleMoveDown(idx)}
                          disabled={idx === sections.length - 1}
                          className="p-1.5 text-white/40 hover:text-white disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDuplicateSection(sec)}
                          className="p-1.5 text-white/40 hover:text-blue-400 cursor-pointer"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteSection(sec.id)}
                          className="p-1.5 text-white/40 hover:text-red-400 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Section Property Inspector */}
          <div className="lg:col-span-7 space-y-4">
            {selectedSection ? (
              <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#c5a059]" /> Section Inspector: {selectedSection.name}
                    </h3>
                    <p className="text-xs text-white/50">Modify titles, spacing, colors, and button parameters</p>
                  </div>
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded font-mono text-[10px] text-[#c5a059]">
                    ID: {selectedSection.id}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/60 block mb-1">Section Display Name</label>
                    <input
                      type="text"
                      value={selectedSection.name}
                      onChange={e => handleUpdateActiveSection('name', e.target.value)}
                      className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/60 block mb-1">Heading Title</label>
                    <input
                      type="text"
                      value={selectedSection.title}
                      onChange={e => handleUpdateActiveSection('title', e.target.value)}
                      className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/60 block mb-1">Subtitle / Badge Text</label>
                    <input
                      type="text"
                      value={selectedSection.subtitle}
                      onChange={e => handleUpdateActiveSection('subtitle', e.target.value)}
                      className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/60 block mb-1">Section Vertical Padding</label>
                      <select
                        value={selectedSection.padding}
                        onChange={e => handleUpdateActiveSection('padding', e.target.value)}
                        className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none"
                      >
                        <option value="small">Compact (py-8)</option>
                        <option value="medium">Standard (py-16)</option>
                        <option value="large">Spacious (py-24)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-white/60 block mb-1">Background Tone</label>
                      <select
                        value={selectedSection.bgColor}
                        onChange={e => handleUpdateActiveSection('bgColor', e.target.value)}
                        className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none font-mono"
                      >
                        <option value="#0a0a0a">Dark Canvas (#0a0a0a)</option>
                        <option value="#0f0f0f">Elevated Card (#0f0f0f)</option>
                        <option value="#0d0d0d">Deep Twilight (#0d0d0d)</option>
                        <option value="#1a1a1a">Highlight Charcoal (#1a1a1a)</option>
                      </select>
                    </div>
                  </div>

                  {/* Button Builder */}
                  <div className="pt-3 border-t border-white/10 space-y-3">
                    <h4 className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Button CTA Configuration</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-white/60 block mb-1">Button Label</label>
                        <input
                          type="text"
                          value={selectedSection.buttonLabel || ''}
                          onChange={e => handleUpdateActiveSection('buttonLabel', e.target.value)}
                          placeholder="e.g. Book via WhatsApp"
                          className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-white/60 block mb-1">Target URL</label>
                        <input
                          type="text"
                          value={selectedSection.buttonUrl || ''}
                          onChange={e => handleUpdateActiveSection('buttonUrl', e.target.value)}
                          placeholder="https://wa.me/..."
                          className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-[#141414] border border-white/10 rounded-2xl text-center text-white/40 font-mono text-xs">
                Select a section block from the left navigator to inspect properties.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Presets Tab */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#c5a059]" /> High-Conversion SEO
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Enables all 8 homepage modules including profiles, rate chart, interactive Lucknow coverage map, reviews, and SEO blocks.
            </p>
            <button
              onClick={() => handleApplyTemplate('High-Conversion SEO')}
              className="w-full py-2.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
            >
              Apply High-Conversion Template
            </button>
          </div>

          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <Grid className="w-5 h-5 text-blue-400" /> Minimalist VIP Directory
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Streamlined layout focusing purely on the hero banner, verified companion cards, rate chart, and FAQ accordion.
            </p>
            <button
              onClick={() => handleApplyTemplate('Minimalist VIP Directory')}
              className="w-full py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Apply Minimalist Template
            </button>
          </div>

          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <Type className="w-5 h-5 text-purple-400" /> Content & Local SEO Focus
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Emphasizes deep Lucknow location guides, blog articles, and area highlights for maximal organic search ranking.
            </p>
            <button
              onClick={() => handleApplyTemplate('Content Focus')}
              className="w-full py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Apply Content Focus Template
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
