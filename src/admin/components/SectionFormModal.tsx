import React, { useState } from 'react';
import { CMSSection, SectionType, PublishStatus } from '../../types';
import { X, Image as ImageIcon, Sparkles, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { MediaPickerModal } from '../media/components/MediaPickerModal';

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

  const [formData, setFormData] = useState<CMSSection>({ ...section });
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'bgImage' | 'customImage' | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#141414] border border-[#c5a059]/30 rounded-xl w-full max-w-2xl text-white shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
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
              <p className="text-xs text-white/50">Configure text, media, spacing, and publishing status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Status & Show/Hide Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#0d0d0d] rounded-lg border border-white/10">
            <div>
              <label className="block text-xs font-bold text-[#c5a059] uppercase tracking-wider mb-1">
                Publishing Status
              </label>
              <select
                value={formData.status}
                onChange={e => handleChange('status', e.target.value as PublishStatus)}
                className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
              >
                <option value="published">Published (Live on site)</option>
                <option value="draft">Draft (Hidden from public)</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-4 sm:pt-0">
              <div>
                <label className="block text-xs font-bold text-white mb-0.5">Visibility Toggle</label>
                <span className="text-[10px] text-white/50">Show or hide this section</span>
              </div>
              <button
                type="button"
                onClick={() => handleChange('show', !formData.show)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  formData.show
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {formData.show ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{formData.show ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-4">
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
              <label className="block text-xs font-bold text-white mb-1">Subtitle / Tagline</label>
              <input
                type="text"
                value={formData.subtitle || ''}
                onChange={e => handleChange('subtitle', e.target.value)}
                placeholder="Optional Badge or Subtitle text"
                className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1">Description / Content</label>
              <textarea
                rows={4}
                value={formData.description || ''}
                onChange={e => handleChange('description', e.target.value)}
                placeholder="Detailed paragraph or description copy..."
                className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none resize-none font-sans"
              />
            </div>
          </div>

          {/* CTA Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white mb-1">CTA Button Text</label>
              <input
                type="text"
                value={formData.ctaText || ''}
                onChange={e => handleChange('ctaText', e.target.value)}
                placeholder="e.g. Book via WhatsApp Now"
                className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white mb-1">CTA Button URL / Link</label>
              <input
                type="text"
                value={formData.ctaUrl || ''}
                onChange={e => handleChange('ctaUrl', e.target.value)}
                placeholder="e.g. https://wa.me/... or #profiles"
                className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
              />
            </div>
          </div>

          {/* Background Image & Colors */}
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
                  <ImageIcon className="w-3.5 h-3.5" />
                  Select
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
                  className="flex-1 bg-[#1a1a1a] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Spacing */}
          <div>
            <label className="block text-xs font-bold text-white mb-1">Section Spacing (Padding)</label>
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

          {/* Custom Type-Specific Fields */}
          {formData.type === 'custom-html' && (
            <div>
              <label className="block text-xs font-bold text-[#c5a059] mb-1">Custom Raw HTML Code</label>
              <textarea
                rows={6}
                value={formData.customData?.html || ''}
                onChange={e => handleCustomDataChange('html', e.target.value)}
                placeholder="<div>Custom widget or iframe code</div>"
                className="w-full bg-[#0d0d0d] border border-white/20 rounded-lg p-3 text-xs text-emerald-400 font-mono focus:border-[#c5a059] outline-none resize-none"
              />
            </div>
          )}

          {formData.type === 'statistics' && (
            <div className="space-y-3 p-4 bg-[#0d0d0d] rounded-lg border border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#c5a059]">Statistics / Highlight Cards</label>
                <button
                  type="button"
                  onClick={() => {
                    const currentStats = formData.customData?.stats || [];
                    handleCustomDataChange('stats', [
                      ...currentStats,
                      { label: 'New Highlight', value: '100%', detail: 'Description detail' }
                    ]);
                  }}
                  className="px-2.5 py-1 bg-[#c5a059]/20 text-[#c5a059] rounded text-[11px] font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Stat
                </button>
              </div>

              {(formData.customData?.stats || []).map((stat: any, sIdx: number) => (
                <div key={sIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#161616] p-2.5 rounded border border-white/10 relative group">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={e => {
                      const updated = [...(formData.customData?.stats || [])];
                      updated[sIdx].value = e.target.value;
                      handleCustomDataChange('stats', updated);
                    }}
                    placeholder="Value (e.g. 100%)"
                    className="bg-[#1a1a1a] border border-white/10 rounded px-2 py-1 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={e => {
                      const updated = [...(formData.customData?.stats || [])];
                      updated[sIdx].label = e.target.value;
                      handleCustomDataChange('stats', updated);
                    }}
                    placeholder="Label (e.g. Real Pictures)"
                    className="bg-[#1a1a1a] border border-white/10 rounded px-2 py-1 text-xs text-white"
                  />
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={stat.detail}
                      onChange={e => {
                        const updated = [...(formData.customData?.stats || [])];
                        updated[sIdx].detail = e.target.value;
                        handleCustomDataChange('stats', updated);
                      }}
                      placeholder="Detail text"
                      className="flex-1 bg-[#1a1a1a] border border-white/10 rounded px-2 py-1 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(formData.customData?.stats || [])];
                        updated.splice(sIdx, 1);
                        handleCustomDataChange('stats', updated);
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

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold rounded-lg text-xs transition-colors shadow-lg shadow-[#c5a059]/20"
            >
              Save Section Changes
            </button>
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
            }
            setMediaPickerTarget(null);
          }}
        />
      )}
    </div>
  );
};
