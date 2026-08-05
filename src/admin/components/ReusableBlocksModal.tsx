import React, { useState, useEffect } from 'react';
import { CMSSection, ReusableTemplate } from '../../types';
import { LayoutTemplate, X, Plus, Trash2, CheckCircle2, Sparkles, Layers } from 'lucide-react';

interface ReusableBlocksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertTemplate: (section: CMSSection) => void;
  sectionToSave?: CMSSection | null;
}

const REUSABLE_STORAGE_KEY = 'juli_club_reusable_templates';

const DEFAULT_TEMPLATES: ReusableTemplate[] = [
  {
    id: 'tmpl-cta-1',
    name: 'WhatsApp VIP Booking CTA',
    category: 'Call to Action',
    description: 'High-converting WhatsApp booking banner with green button and zero advance callout.',
    createdAt: new Date().toLocaleDateString(),
    section: {
      id: '',
      type: 'cta',
      title: 'Ready for Instant VIP Outcall Booking?',
      subtitle: 'Zero Advance Required • 100% Cash on Delivery',
      description: 'Book verified independent call girls in Lucknow with doorstep delivery in 30 minutes.',
      ctaText: 'Chat on WhatsApp Now',
      ctaUrl: 'https://wa.me/918726179837',
      bgColor: '#0f0f0f',
      spacing: 'medium',
      order: 1,
      show: true,
      status: 'published'
    }
  },
  {
    id: 'tmpl-faq-1',
    name: 'Standard Lucknow FAQ Accordion',
    category: 'FAQ',
    description: 'Common questions about cash on delivery, zero advance, hotel outcall, and safety.',
    createdAt: new Date().toLocaleDateString(),
    section: {
      id: '',
      type: 'faq',
      title: 'Frequently Asked Questions (Lucknow Service)',
      subtitle: '100% Genuine Guidance',
      description: 'Clear answers regarding payments, hotel deliveries, privacy, and verification.',
      bgColor: '#0a0a0a',
      spacing: 'medium',
      order: 1,
      show: true,
      status: 'published',
      customData: {
        faqs: [
          { question: 'Do I need to pay any advance amount?', answer: 'No! We strictly operate on 100% Cash on Delivery (COD). Zero advance required.' },
          { question: 'Are photos 100% genuine and unedited?', answer: 'Yes, all companion profiles feature verified, unedited real pictures.' },
          { question: 'Do you provide 5-star hotel outcall service in Lucknow?', answer: 'Yes, we deliver companions directly to major hotels in Gomti Nagar, Hazratganj, Alambagh, etc.' }
        ]
      }
    }
  },
  {
    id: 'tmpl-hero-1',
    name: 'Luxury Outcall Hero Banner',
    category: 'Hero',
    description: 'High-impact dark luxury hero section with gold accent subtitle.',
    createdAt: new Date().toLocaleDateString(),
    section: {
      id: '',
      type: 'hero',
      title: 'Exclusive Independent Call Girl Service Lucknow',
      subtitle: '100% Verified Profiles • 0 Advance Payment',
      description: 'Discreet high-society escorts for 5-star hotel outcalls, body massage, and romantic dates.',
      ctaText: 'Explore Verified Models',
      ctaUrl: 'https://wa.me/918726179837',
      bgColor: '#0a0a0a',
      spacing: 'large',
      order: 1,
      show: true,
      status: 'published'
    }
  }
];

export const ReusableBlocksModal: React.FC<ReusableBlocksModalProps> = ({
  isOpen,
  onClose,
  onInsertTemplate,
  sectionToSave
}) => {
  if (!isOpen) return null;

  const [templates, setTemplates] = useState<ReusableTemplate[]>([]);
  const [templateName, setTemplateName] = useState<string>('');
  const [templateCategory, setTemplateCategory] = useState<string>('CTA');
  const [templateDesc, setTemplateDesc] = useState<string>('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(REUSABLE_STORAGE_KEY);
      if (stored) {
        setTemplates(JSON.parse(stored));
      } else {
        setTemplates(DEFAULT_TEMPLATES);
        localStorage.setItem(REUSABLE_STORAGE_KEY, JSON.stringify(DEFAULT_TEMPLATES));
      }
    } catch {
      setTemplates(DEFAULT_TEMPLATES);
    }
  }, []);

  const saveToStorage = (list: ReusableTemplate[]) => {
    setTemplates(list);
    try {
      localStorage.setItem(REUSABLE_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveCurrentAsTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionToSave || !templateName.trim()) return;

    const newTmpl: ReusableTemplate = {
      id: `tmpl-${Date.now()}`,
      name: templateName,
      category: templateCategory,
      description: templateDesc,
      section: { ...sectionToSave },
      createdAt: new Date().toLocaleDateString()
    };

    const updated = [newTmpl, ...templates];
    saveToStorage(updated);
    setTemplateName('');
    setTemplateDesc('');
    alert('Section saved to Reusable Templates Library!');
  };

  const handleDeleteTemplate = (id: string) => {
    if (!window.confirm('Delete this template from library?')) return;
    const updated = templates.filter(t => t.id !== id);
    saveToStorage(updated);
  };

  const handleSelectToInsert = (tmpl: ReusableTemplate) => {
    const secCopy: CMSSection = {
      ...tmpl.section,
      id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      show: true,
      status: 'published'
    };
    onInsertTemplate(secCopy);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#141414] border border-[#c5a059]/30 rounded-xl w-full max-w-3xl text-white shadow-2xl overflow-hidden my-8 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#111]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#c5a059]/10 text-[#c5a059] rounded-lg border border-[#c5a059]/30">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white">
                Reusable Section Template Library
              </h3>
              <p className="text-xs text-white/50">Save custom sections as templates and insert them across any page</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Save Current Section Form (if sectionToSave is provided) */}
          {sectionToSave && (
            <form onSubmit={handleSaveCurrentAsTemplate} className="p-4 bg-[#0d0d0d] rounded-xl border border-[#c5a059]/40 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Save Active Section as Template
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={templateName}
                  onChange={e => setTemplateName(e.target.value)}
                  placeholder="Template Name (e.g. VIP CTA Banner)"
                  className="bg-[#1a1a1a] border border-white/15 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#c5a059]"
                />
                <select
                  value={templateCategory}
                  onChange={e => setTemplateCategory(e.target.value)}
                  className="bg-[#1a1a1a] border border-white/15 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#c5a059]"
                >
                  <option value="CTA">Call to Action (CTA)</option>
                  <option value="FAQ">FAQ Accordion</option>
                  <option value="Hero">Hero Banner</option>
                  <option value="Reviews">Client Reviews</option>
                  <option value="Gallery">Gallery Showcase</option>
                  <option value="General">General Block</option>
                </select>
              </div>

              <input
                type="text"
                value={templateDesc}
                onChange={e => setTemplateDesc(e.target.value)}
                placeholder="Optional description note..."
                className="w-full bg-[#1a1a1a] border border-white/15 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#c5a059]"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Save to Library</span>
              </button>
            </form>
          )}

          {/* Templates Grid */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider block">
              Available Templates ({templates.length})
            </span>

            {templates.length === 0 ? (
              <p className="text-xs text-white/40 italic p-8 text-center border border-white/10 rounded-xl">
                No templates saved yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {templates.map(tmpl => (
                  <div
                    key={tmpl.id}
                    className="p-4 bg-[#161616] border border-white/10 rounded-xl space-y-3 flex flex-col justify-between hover:border-[#c5a059]/40 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-[#c5a059]/15 text-[#c5a059] rounded text-[10px] font-mono font-bold uppercase">
                          {tmpl.category}
                        </span>
                        <span className="text-[10px] text-white/40">{tmpl.createdAt}</span>
                      </div>
                      <h4 className="text-xs font-serif font-bold text-white">{tmpl.name}</h4>
                      <p className="text-[11px] text-white/60 leading-relaxed font-sans">{tmpl.description || tmpl.section.title}</p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleDeleteTemplate(tmpl.id)}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleSelectToInsert(tmpl)}
                        className="px-3.5 py-1.5 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Insert Block</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
