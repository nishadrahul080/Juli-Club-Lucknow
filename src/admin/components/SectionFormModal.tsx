import React, { useState } from 'react';
import { CMSSection, SectionType, PublishStatus, CMSSectionButton, CMSSectionImage } from '../../types';
import {
  X,
  Image as ImageIcon,
  Sparkles,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Sliders,
  Type,
  FileText,
  Clock,
  Layout,
  Video,
  List,
  Star,
  BarChart2,
  HelpCircle,
  Code,
  Layers,
  Save,
  Bookmark
} from 'lucide-react';
import { MediaPickerModal } from '../media/components/MediaPickerModal';
import { RichTextEditor } from './RichTextEditor';
import { ReusableBlocksModal } from './ReusableBlocksModal';

interface SectionFormModalProps {
  isOpen: boolean;
  section: CMSSection | null;
  onClose: () => void;
  onSave: (savedSection: CMSSection) => void;
}

const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  hero: 'Hero Banner',
  text: 'Text Content Block',
  image: 'Image Banner',
  'image-text': 'Image + Text Grid',
  gallery: 'Image Gallery',
  cards: 'Card Grid',
  faq: 'FAQ Accordion',
  cta: 'Call To Action (CTA)',
  statistics: 'Statistics / Highlights',
  review: 'Client Reviews',
  features: 'Features List / Grid',
  video: 'Video Embed',
  'custom-block': 'Custom Content Block',
  'custom-html': 'Custom HTML Code',
  divider: 'Line Divider',
  spacer: 'Vertical Spacer'
};

export const SectionFormModal: React.FC<SectionFormModalProps> = ({
  isOpen,
  section,
  onClose,
  onSave
}) => {
  if (!isOpen || !section) return null;

  const [formData, setFormData] = useState<CMSSection>({
    ...section,
    buttons: section.buttons || [
      { id: 'b1', label: section.ctaText || 'Book Now', url: section.ctaUrl || 'https://wa.me/918726179837', variant: 'whatsapp', target: '_blank' }
    ],
    images: section.images || [],
    visibility: section.visibility || 'all',
    animation: section.animation || 'none',
    bgOverlayOpacity: section.bgOverlayOpacity ?? 85,
    seoNotes: section.seoNotes || ''
  });

  const [activeTab, setActiveTab] = useState<'content' | 'appearance' | 'visibility' | 'seo'>('content');
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'bgImage' | 'singleImage' | null>(null);
  const [showReusableSaveModal, setShowReusableSaveModal] = useState<boolean>(false);

  const handleChange = (field: keyof CMSSection, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomDataChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      customData: {
        ...(prev.customData || {}),
        [key]: value
      }
    }));
  };

  // Button helpers
  const handleAddButton = () => {
    const newBtn: CMSSectionButton = {
      id: `btn-${Date.now()}`,
      label: 'Click Here',
      url: 'https://wa.me/918726179837',
      variant: 'primary',
      target: '_blank'
    };
    handleChange('buttons', [...(formData.buttons || []), newBtn]);
  };

  const handleUpdateButton = (index: number, key: keyof CMSSectionButton, val: any) => {
    const updated = [...(formData.buttons || [])];
    updated[index] = { ...updated[index], [key]: val };
    handleChange('buttons', updated);
  };

  const handleRemoveButton = (index: number) => {
    const updated = [...(formData.buttons || [])];
    updated.splice(index, 1);
    handleChange('buttons', updated);
  };

  // Gallery image helpers
  const handleAddImage = (url: string) => {
    const newImg: CMSSectionImage = {
      id: `img-${Date.now()}`,
      url,
      alt: formData.title || 'Section Image',
      caption: ''
    };
    handleChange('images', [...(formData.images || []), newImg]);
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...(formData.images || [])];
    updated.splice(index, 1);
    handleChange('images', updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#141414] border border-[#c5a059]/30 rounded-xl w-full max-w-3xl text-white shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#111]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#c5a059]/10 text-[#c5a059] rounded-lg border border-[#c5a059]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white">
                Edit Section: {SECTION_TYPE_LABELS[formData.type]}
              </h3>
              <p className="text-xs text-white/50">Full dynamic content, layout, styling & visibility customization</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowReusableSaveModal(true)}
              className="px-3 py-1.5 bg-[#c5a059]/15 hover:bg-[#c5a059]/30 text-[#c5a059] border border-[#c5a059]/40 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save as Template</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/10 bg-[#0d0d0d] px-4 pt-2 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`py-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'content'
                ? 'border-[#c5a059] text-[#c5a059]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" /> Content Block
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('appearance')}
            className={`py-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'appearance'
                ? 'border-[#c5a059] text-[#c5a059]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Appearance & Style
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('visibility')}
            className={`py-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'visibility'
                ? 'border-[#c5a059] text-[#c5a059]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Visibility & Schedule
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`py-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'seo'
                ? 'border-[#c5a059] text-[#c5a059]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> SEO Notes
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: CONTENT */}
          {activeTab === 'content' && (
            <div className="space-y-5">
              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white mb-1">Section Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => handleChange('title', e.target.value)}
                    placeholder="Section Title / Heading"
                    className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white mb-1">Subtitle / Badge</label>
                  <input
                    type="text"
                    value={formData.subtitle || ''}
                    onChange={e => handleChange('subtitle', e.target.value)}
                    placeholder="Tagline or Badge text"
                    className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                  />
                </div>
              </div>

              {/* Rich Text Editor for Description / Copy */}
              <div>
                <label className="block text-xs font-bold text-white mb-1">Section Main Description (Rich Text Editor)</label>
                <RichTextEditor
                  value={formData.description || ''}
                  onChange={val => handleChange('description', val)}
                  placeholder="Detailed paragraph copy, lists, or HTML block..."
                  rows={6}
                />
              </div>

              {/* Buttons Editor Array */}
              <div className="p-4 bg-[#0d0d0d] rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">
                    Call To Action Buttons ({(formData.buttons || []).length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddButton}
                    className="px-2.5 py-1 bg-[#c5a059]/20 text-[#c5a059] rounded text-[11px] font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Button
                  </button>
                </div>

                {(formData.buttons || []).map((btn, bIdx) => (
                  <div key={btn.id || bIdx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-[#161616] p-2.5 rounded border border-white/10">
                    <input
                      type="text"
                      value={btn.label}
                      onChange={e => handleUpdateButton(bIdx, 'label', e.target.value)}
                      placeholder="Button Label"
                      className="bg-[#1a1a1a] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={btn.url}
                      onChange={e => handleUpdateButton(bIdx, 'url', e.target.value)}
                      placeholder="Button URL / Link"
                      className="bg-[#1a1a1a] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                    />
                    <select
                      value={btn.variant || 'primary'}
                      onChange={e => handleUpdateButton(bIdx, 'variant', e.target.value)}
                      className="bg-[#1a1a1a] border border-white/10 rounded px-2 py-1.5 text-xs text-white"
                    >
                      <option value="whatsapp">WhatsApp Green</option>
                      <option value="primary">Gold Primary</option>
                      <option value="secondary">Dark Secondary</option>
                      <option value="outline">Outline Border</option>
                    </select>
                    <div className="flex gap-1 items-center">
                      <select
                        value={btn.target || '_blank'}
                        onChange={e => handleUpdateButton(bIdx, 'target', e.target.value)}
                        className="flex-1 bg-[#1a1a1a] border border-white/10 rounded px-2 py-1.5 text-xs text-white"
                      >
                        <option value="_blank">New Tab</option>
                        <option value="_self">Same Tab</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveButton(bIdx)}
                        className="p-1.5 text-red-400 hover:bg-red-500/20 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Type-Specific Data Field Configulators */}
              {formData.type === 'video' && (
                <div className="space-y-3 p-4 bg-[#0d0d0d] rounded-xl border border-white/10">
                  <label className="block text-xs font-bold text-[#c5a059]">Video Embed URL / Direct Video</label>
                  <input
                    type="text"
                    value={formData.customData?.videoUrl || ''}
                    onChange={e => handleCustomDataChange('videoUrl', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or MP4 URL"
                    className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#c5a059]"
                  />
                </div>
              )}

              {formData.type === 'features' && (
                <div className="space-y-3 p-4 bg-[#0d0d0d] rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#c5a059]">Features / Highlights Items</label>
                    <button
                      type="button"
                      onClick={() => {
                        const cur = formData.customData?.features || [];
                        handleCustomDataChange('features', [...cur, { title: 'Feature Title', desc: 'Feature description' }]);
                      }}
                      className="px-2.5 py-1 bg-[#c5a059]/20 text-[#c5a059] rounded text-[11px] font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Feature
                    </button>
                  </div>
                  {(formData.customData?.features || []).map((f: any, fIdx: number) => (
                    <div key={fIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#161616] p-2.5 rounded border border-white/10">
                      <input
                        type="text"
                        value={f.title}
                        onChange={e => {
                          const updated = [...(formData.customData?.features || [])];
                          updated[fIdx].title = e.target.value;
                          handleCustomDataChange('features', updated);
                        }}
                        placeholder="Feature Heading"
                        className="bg-[#1a1a1a] border border-white/10 rounded px-2.5 py-1 text-xs text-white"
                      />
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={f.desc}
                          onChange={e => {
                            const updated = [...(formData.customData?.features || [])];
                            updated[fIdx].desc = e.target.value;
                            handleCustomDataChange('features', updated);
                          }}
                          placeholder="Short description text"
                          className="flex-1 bg-[#1a1a1a] border border-white/10 rounded px-2.5 py-1 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(formData.customData?.features || [])];
                            updated.splice(fIdx, 1);
                            handleCustomDataChange('features', updated);
                          }}
                          className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {formData.type === 'gallery' && (
                <div className="space-y-3 p-4 bg-[#0d0d0d] rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#c5a059]">Gallery Images ({(formData.images || []).length})</label>
                    <button
                      type="button"
                      onClick={() => setMediaPickerTarget('singleImage')}
                      className="px-2.5 py-1 bg-[#c5a059]/20 text-[#c5a059] rounded text-[11px] font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Select Image from Media
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(formData.images || []).map((img, iIdx) => (
                      <div key={img.id || iIdx} className="relative group rounded border border-white/10 overflow-hidden bg-black h-24">
                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(iIdx)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.type === 'faq' && (
                <div className="space-y-3 p-4 bg-[#0d0d0d] rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#c5a059]">FAQ Accordions</label>
                    <button
                      type="button"
                      onClick={() => {
                        const cur = formData.customData?.faqs || [];
                        handleCustomDataChange('faqs', [...cur, { question: 'New Question?', answer: 'Answer details...' }]);
                      }}
                      className="px-2.5 py-1 bg-[#c5a059]/20 text-[#c5a059] rounded text-[11px] font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add FAQ Item
                    </button>
                  </div>
                  {(formData.customData?.faqs || []).map((faq: any, qIdx: number) => (
                    <div key={qIdx} className="space-y-1.5 bg-[#161616] p-3 rounded border border-white/10">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={e => {
                            const updated = [...(formData.customData?.faqs || [])];
                            updated[qIdx].question = e.target.value;
                            handleCustomDataChange('faqs', updated);
                          }}
                          placeholder="Question title"
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded px-2.5 py-1 text-xs text-white font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(formData.customData?.faqs || [])];
                            updated.splice(qIdx, 1);
                            handleCustomDataChange('faqs', updated);
                          }}
                          className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={e => {
                          const updated = [...(formData.customData?.faqs || [])];
                          updated[qIdx].answer = e.target.value;
                          handleCustomDataChange('faqs', updated);
                        }}
                        placeholder="Detailed answer text"
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded px-2.5 py-1 text-xs text-white/80 font-sans"
                      />
                    </div>
                  ))}
                </div>
              )}

              {formData.type === 'custom-html' && (
                <div>
                  <label className="block text-xs font-bold text-[#c5a059] mb-1">Raw Custom HTML Embed Code</label>
                  <textarea
                    rows={6}
                    value={formData.customData?.html || ''}
                    onChange={e => handleCustomDataChange('html', e.target.value)}
                    placeholder="<div>Custom maps iframe or raw HTML widget</div>"
                    className="w-full bg-[#0d0d0d] border border-white/20 rounded-lg p-3 text-xs text-emerald-400 font-mono outline-none resize-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white mb-1">Background Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.bgImage || ''}
                      onChange={e => handleChange('bgImage', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 bg-[#1a1a1a] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setMediaPickerTarget('bgImage')}
                      className="px-3 py-2 bg-[#c5a059]/20 hover:bg-[#c5a059]/30 text-[#c5a059] rounded-lg text-xs font-bold flex items-center gap-1 border border-[#c5a059]/40 shrink-0"
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Select
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.bgColor || '#0a0a0a'}
                      onChange={e => handleChange('bgColor', e.target.value)}
                      className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={formData.bgColor || '#0a0a0a'}
                      onChange={e => handleChange('bgColor', e.target.value)}
                      placeholder="#0a0a0a"
                      className="flex-1 bg-[#1a1a1a] border border-white/15 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Background Overlay Opacity */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-white">Background Dark Overlay Opacity</label>
                  <span className="text-xs font-mono text-[#c5a059] font-bold">{formData.bgOverlayOpacity ?? 85}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={formData.bgOverlayOpacity ?? 85}
                  onChange={e => handleChange('bgOverlayOpacity', Number(e.target.value))}
                  className="w-full accent-[#c5a059] cursor-pointer"
                />
              </div>

              {/* Spacing & Padding */}
              <div>
                <label className="block text-xs font-bold text-white mb-1">Section Vertical Padding (Spacing)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'none', label: 'None (py-0)' },
                    { id: 'small', label: 'Small (py-6)' },
                    { id: 'medium', label: 'Medium (py-12)' },
                    { id: 'large', label: 'Large (py-20)' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleChange('spacing', opt.id)}
                      className={`py-2 px-1 rounded-lg text-[11px] font-bold border transition-all ${
                        formData.spacing === opt.id
                          ? 'bg-[#c5a059] text-black border-[#c5a059]'
                          : 'bg-[#1a1a1a] text-white/70 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Entrance Animation */}
              <div>
                <label className="block text-xs font-bold text-white mb-1">Entrance Transition Animation</label>
                <select
                  value={formData.animation || 'none'}
                  onChange={e => handleChange('animation', e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
                >
                  <option value="none">None (Instant Load)</option>
                  <option value="fade">Fade In</option>
                  <option value="slide">Slide Up</option>
                  <option value="zoom">Zoom In Scale</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 3: VISIBILITY & SCHEDULE */}
          {activeTab === 'visibility' && (
            <div className="space-y-5">
              <div className="p-4 bg-[#0d0d0d] rounded-xl border border-white/10 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#c5a059] uppercase tracking-wider mb-1">
                      Publishing Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={e => handleChange('status', e.target.value as PublishStatus)}
                      className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
                    >
                      <option value="published">Published (Live on website)</option>
                      <option value="draft">Draft (Hidden from public)</option>
                      <option value="scheduled">Scheduled Publication</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1">Device Visibility Targeting</label>
                    <select
                      value={formData.visibility || 'all'}
                      onChange={e => handleChange('visibility', e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
                    >
                      <option value="all">All Devices (Desktop & Mobile)</option>
                      <option value="desktop">Desktop Only (Hidden on Mobile)</option>
                      <option value="mobile">Mobile Only (Hidden on Desktop)</option>
                    </select>
                  </div>
                </div>

                {formData.status === 'scheduled' && (
                  <div>
                    <label className="block text-xs font-bold text-amber-400 mb-1">Scheduled Release Date & Time</label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledAt || ''}
                      onChange={e => handleChange('scheduledAt', e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-amber-500/40 rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SEO NOTES */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#c5a059] mb-1">Section SEO Annotations & Internal Notes</label>
                <textarea
                  rows={6}
                  value={formData.seoNotes || ''}
                  onChange={e => handleChange('seoNotes', e.target.value)}
                  placeholder="Notes on target keywords, schema markup intent, or content strategy for this section..."
                  className="w-full bg-[#0d0d0d] border border-white/15 rounded-lg p-3 text-xs text-white/80 font-sans outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowReusableSaveModal(true)}
              className="text-xs text-[#c5a059] hover:underline flex items-center gap-1"
            >
              <Bookmark className="w-3.5 h-3.5" /> Save as Reusable Template
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold rounded-lg text-xs transition-colors shadow-lg shadow-[#c5a059]/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Section</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Media Picker Modal */}
      {mediaPickerTarget && (
        <MediaPickerModal
          isOpen={!!mediaPickerTarget}
          onClose={() => setMediaPickerTarget(null)}
          onSelectMedia={media => {
            if (mediaPickerTarget === 'bgImage') {
              handleChange('bgImage', media.url);
            } else if (mediaPickerTarget === 'singleImage') {
              handleAddImage(media.url);
            }
            setMediaPickerTarget(null);
          }}
        />
      )}

      {/* Save as Reusable Template Modal */}
      {showReusableSaveModal && (
        <ReusableBlocksModal
          isOpen={showReusableSaveModal}
          onClose={() => setShowReusableSaveModal(false)}
          onInsertTemplate={() => {}}
          sectionToSave={formData}
        />
      )}
    </div>
  );
};
