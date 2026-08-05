import React, { useState } from 'react';
import { CMSSection, CompanionProfile } from '../../types';
import { PublicSectionRenderer } from '../../components/PublicSectionRenderer';
import { X, Monitor, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';

interface LivePreviewModalProps {
  isOpen: boolean;
  pageTitle: string;
  sections: CMSSection[];
  profiles?: CompanionProfile[];
  onClose: () => void;
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({
  isOpen,
  pageTitle,
  sections,
  profiles = [],
  onClose
}) => {
  if (!isOpen) return null;

  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Map sections for preview: show draft/published/scheduled sections
  const previewSections = sections.map(s => ({
    ...s,
    show: true,
    status: 'published' as const // override status for real-time visual inspection in preview mode
  }));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-xl">
      {/* Top Controls Toolbar */}
      <div className="bg-[#111] border-b border-white/10 px-4 py-3 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#c5a059]/10 text-[#c5a059] rounded-lg border border-[#c5a059]/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
              Live Page Preview: <span className="text-[#c5a059]">{pageTitle}</span>
            </h3>
            <span className="text-[11px] text-white/50 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Showing draft & published dynamic sections
            </span>
          </div>
        </div>

        {/* Viewport Selector */}
        <div className="flex items-center gap-2 bg-[#1a1a1a] p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
              device === 'desktop' ? 'bg-[#c5a059] text-black shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">Desktop View</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
              device === 'mobile' ? 'bg-[#c5a059] text-black shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Mobile Frame</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center bg-[#050505]">
        <div
          className={`transition-all duration-300 bg-[#0a0a0a] border border-white/15 rounded-xl shadow-2xl overflow-hidden ${
            device === 'mobile' ? 'w-[375px] max-w-full min-h-[667px] my-auto' : 'w-full max-w-6xl'
          }`}
        >
          <div className="p-2 bg-[#161616] border-b border-white/10 text-[10px] font-mono text-white/40 flex items-center justify-between px-4">
            <span>PREVIEW MODE — {device.toUpperCase()}</span>
            <span>{sections.length} SECTIONS TOTAL</span>
          </div>

          <PublicSectionRenderer sections={previewSections} profiles={profiles} />
        </div>
      </div>
    </div>
  );
};
