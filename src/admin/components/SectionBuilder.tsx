import React, { useState, useEffect } from 'react';
import { CMSSection, SectionType, PublishStatus } from '../../types';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Edit2,
  GripVertical,
  Layers,
  Sparkles,
  Layout,
  Code,
  Image as ImageIcon,
  HelpCircle,
  Star,
  BarChart2,
  Type,
  Minus,
  Maximize2,
  Video,
  List,
  LayoutTemplate,
  History,
  Monitor,
  Bookmark,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { SectionFormModal } from './SectionFormModal';
import { LivePreviewModal } from './LivePreviewModal';
import { VersionHistoryModal } from './VersionHistoryModal';
import { ReusableBlocksModal } from './ReusableBlocksModal';

interface SectionBuilderProps {
  sections: CMSSection[];
  onChangeSections: (newSections: CMSSection[]) => void;
  pageTitle?: string;
  pageId?: string;
}

const SECTION_TYPE_CONFIG: Record<SectionType, { label: string; icon: React.ReactNode; defaultTitle: string; defaultDesc: string }> = {
  hero: {
    label: 'Hero Banner',
    icon: <Sparkles className="w-4 h-4 text-[#c5a059]" />,
    defaultTitle: 'Exclusive VIP Escort Directory',
    defaultDesc: '100% Cash on Delivery with zero advance required.'
  },
  text: {
    label: 'Text Content Block',
    icon: <Type className="w-4 h-4 text-blue-400" />,
    defaultTitle: 'About Our Premium Service',
    defaultDesc: 'Discover high-society companionship in Lucknow.'
  },
  image: {
    label: 'Image Banner',
    icon: <ImageIcon className="w-4 h-4 text-emerald-400" />,
    defaultTitle: 'Luxury Experience Showcase',
    defaultDesc: 'Unmatched elegance and 5-star outcall services.'
  },
  'image-text': {
    label: 'Image + Text Grid',
    icon: <Layout className="w-4 h-4 text-purple-400" />,
    defaultTitle: 'Fulfill Your Fantasy',
    defaultDesc: 'Experience unmatched romance and total privacy.'
  },
  gallery: {
    label: 'Image Gallery',
    icon: <ImageIcon className="w-4 h-4 text-amber-400" />,
    defaultTitle: 'Companion Photo Gallery',
    defaultDesc: '100% verified unedited pictures.'
  },
  cards: {
    label: 'Card Grid',
    icon: <Layers className="w-4 h-4 text-cyan-400" />,
    defaultTitle: 'Featured Models Directory',
    defaultDesc: 'Browse verified profiles with instant WhatsApp booking.'
  },
  faq: {
    label: 'FAQ Accordion',
    icon: <HelpCircle className="w-4 h-4 text-rose-400" />,
    defaultTitle: 'Frequently Asked Questions',
    defaultDesc: 'Everything you need to know before booking.'
  },
  cta: {
    label: 'Call To Action (CTA)',
    icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
    defaultTitle: 'Ready to Book Your VIP Experience?',
    defaultDesc: 'Contact us on WhatsApp for 30-minute doorstep pickup.'
  },
  statistics: {
    label: 'Statistics / Highlights',
    icon: <BarChart2 className="w-4 h-4 text-indigo-400" />,
    defaultTitle: 'Why Choose Juli Club?',
    defaultDesc: 'Starting ₹3,999 • Zero Advance • Free Cab Delivery'
  },
  review: {
    label: 'Client Reviews',
    icon: <Star className="w-4 h-4 text-amber-400" />,
    defaultTitle: 'Verified Client Reviews',
    defaultDesc: '5-Star ratings from satisfied clients in Lucknow.'
  },
  features: {
    label: 'Features List / Grid',
    icon: <List className="w-4 h-4 text-[#c5a059]" />,
    defaultTitle: 'Key Service Features',
    defaultDesc: '5-Star outcall delivery, certified models, and cod guarantee.'
  },
  video: {
    label: 'Video Embed Block',
    icon: <Video className="w-4 h-4 text-rose-400" />,
    defaultTitle: 'Watch Video Showcase',
    defaultDesc: 'Interactive video tour of our services.'
  },
  'custom-block': {
    label: 'Custom Content Block',
    icon: <LayoutTemplate className="w-4 h-4 text-cyan-400" />,
    defaultTitle: 'Custom Display Card',
    defaultDesc: 'Flexible composite block layout.'
  },
  'custom-html': {
    label: 'Custom HTML Code',
    icon: <Code className="w-4 h-4 text-orange-400" />,
    defaultTitle: 'Custom Embed Block',
    defaultDesc: 'Raw HTML, maps, or interactive widgets.'
  },
  divider: {
    label: 'Line Divider',
    icon: <Minus className="w-4 h-4 text-white/40" />,
    defaultTitle: 'Section Divider',
    defaultDesc: 'Elegant horizontal rule separator.'
  },
  spacer: {
    label: 'Vertical Spacer',
    icon: <Maximize2 className="w-4 h-4 text-white/40" />,
    defaultTitle: 'Vertical Spacer',
    defaultDesc: 'Blank vertical margin gap.'
  }
};

export const SectionBuilder: React.FC<SectionBuilderProps> = ({
  sections,
  onChangeSections,
  pageTitle = 'Page Content',
  pageId = 'page-main'
}) => {
  const [editingSection, setEditingSection] = useState<CMSSection | null>(null);
  const [selectedAddType, setSelectedAddType] = useState<SectionType>('text');
  const [statusFilter, setStatusFilter] = useState<'all' | PublishStatus>('all');
  const [showLivePreview, setShowLivePreview] = useState<boolean>(false);
  const [showVersionHistory, setShowVersionHistory] = useState<boolean>(false);
  const [showReusableModal, setShowReusableModal] = useState<boolean>(false);
  const [autoSaveTime, setAutoSaveTime] = useState<string>('');

  // Drag state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Auto save timer simulation indicator
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoSaveTime(new Date().toLocaleTimeString());
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  // Ensure sections sorted by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  const filteredSections = sortedSections.filter(sec => {
    if (statusFilter === 'all') return true;
    return sec.status === statusFilter;
  });

  const updateSectionOrders = (list: CMSSection[]) => {
    return list.map((sec, idx) => ({ ...sec, order: idx + 1 }));
  };

  const handleAddSection = () => {
    const config = SECTION_TYPE_CONFIG[selectedAddType];
    const newSec: CMSSection = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: selectedAddType,
      title: config.defaultTitle,
      subtitle: config.label,
      description: config.defaultDesc,
      ctaText: 'Book Now',
      ctaUrl: 'https://wa.me/918726179837',
      bgColor: '#0a0a0a',
      spacing: 'medium',
      order: sortedSections.length + 1,
      show: true,
      status: 'published'
    };

    const updated = updateSectionOrders([...sortedSections, newSec]);
    onChangeSections(updated);
    setEditingSection(newSec);
  };

  const handleDuplicate = (id: string) => {
    const targetIdx = sortedSections.findIndex(s => s.id === id);
    if (targetIdx === -1) return;

    const original = sortedSections[targetIdx];
    const copy: CMSSection = {
      ...original,
      id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: `${original.title} (Copy)`,
      order: original.order + 0.5
    };

    const nextList = [...sortedSections, copy].sort((a, b) => a.order - b.order);
    onChangeSections(updateSectionOrders(nextList));
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;
    const nextList = sortedSections.filter(s => s.id !== id);
    onChangeSections(updateSectionOrders(nextList));
  };

  const handleToggleShow = (id: string) => {
    const nextList = sortedSections.map(s => (s.id === id ? { ...s, show: !s.show } : s));
    onChangeSections(nextList);
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const list = [...sortedSections];
    const temp = list[index];
    list[index] = list[index - 1];
    list[index - 1] = temp;
    onChangeSections(updateSectionOrders(list));
  };

  const handleMoveDown = (index: number) => {
    if (index >= sortedSections.length - 1) return;
    const list = [...sortedSections];
    const temp = list[index];
    list[index] = list[index + 1];
    list[index + 1] = temp;
    onChangeSections(updateSectionOrders(list));
  };

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const list = [...sortedSections];
    const item = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(index, 0, item);
    setDraggedIndex(index);
    onChangeSections(updateSectionOrders(list));
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSaveSectionModal = (savedSection: CMSSection) => {
    const nextList = sortedSections.map(s => (s.id === savedSection.id ? savedSection : s));
    onChangeSections(nextList);
    setEditingSection(null);
  };

  const handleInsertReusableTemplate = (sec: CMSSection) => {
    const updated = updateSectionOrders([...sortedSections, sec]);
    onChangeSections(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar Header with Live Preview, Version History, Auto-Save */}
      <div className="bg-[#141414] border border-[#c5a059]/30 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#c5a059]" />
            Dynamic Content Management Engine
          </h3>
          <div className="flex items-center gap-3 text-xs text-white/50 mt-1">
            <span>Edit sections for: <strong className="text-white">{pageTitle}</strong></span>
            {autoSaveTime && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <CheckCircle2 className="w-3 h-3" /> Auto-saved {autoSaveTime}
              </span>
            )}
          </div>
        </div>

        {/* Global Toolbar Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => setShowReusableModal(true)}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Templates</span>
          </button>

          <button
            type="button"
            onClick={() => setShowVersionHistory(true)}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>Version History</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLivePreview(true)}
            className="px-3.5 py-1.5 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-[#c5a059]/20 cursor-pointer"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Add New Section Controls */}
      <div className="bg-[#111] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedAddType}
            onChange={e => setSelectedAddType(e.target.value as SectionType)}
            className="bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none flex-1 sm:w-56"
          >
            {Object.entries(SECTION_TYPE_CONFIG).map(([type, cfg]) => (
              <option key={type} value={type}>
                {cfg.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddSection}
            className="px-4 py-2 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Section</span>
          </button>
        </div>

        {/* Filter by status */}
        <div className="flex items-center gap-2 self-end sm:self-center text-xs">
          <span className="text-white/40 font-medium text-[11px]">Filter:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="bg-[#1a1a1a] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white/80 outline-none"
          >
            <option value="all">All Status ({sections.length})</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      {/* Sections Stack List */}
      {filteredSections.length === 0 ? (
        <div className="p-12 text-center bg-[#111] border border-white/10 rounded-xl text-white/40 space-y-2">
          <Layers className="w-8 h-8 mx-auto text-white/20" />
          <p className="text-xs">No section blocks match the criteria. Click "Add Section" or "Templates" to start.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSections.map((sec, idx) => {
            const config = SECTION_TYPE_CONFIG[sec.type] || SECTION_TYPE_CONFIG.text;
            const isFirst = idx === 0;
            const isLast = idx === filteredSections.length - 1;

            return (
              <div
                key={sec.id}
                draggable
                onDragStart={e => handleDragStart(e, idx)}
                onDragOver={e => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                className={`bg-[#141414] border rounded-xl p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-grab active:cursor-grabbing ${
                  draggedIndex === idx ? 'border-[#c5a059] bg-[#1a1a1a] shadow-2xl' : ''
                } ${
                  sec.show
                    ? 'border-white/10 hover:border-white/20'
                    : 'border-red-500/30 bg-red-950/10 opacity-75'
                }`}
              >
                {/* Drag Handle & Info */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-white/30 hover:text-white/60">
                    <GripVertical className="w-4 h-4 shrink-0" />
                    <div className="flex flex-col gap-0.5 items-center justify-center p-0.5 bg-white/5 rounded">
                      <button
                        onClick={() => handleMoveUp(idx)}
                        disabled={isFirst}
                        className="hover:text-[#c5a059] disabled:opacity-20 cursor-pointer p-0.5"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <span className="text-[10px] font-mono font-bold text-[#c5a059]">#{sec.order}</span>
                      <button
                        onClick={() => handleMoveDown(idx)}
                        disabled={isLast}
                        className="hover:text-[#c5a059] disabled:opacity-20 cursor-pointer p-0.5"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 shrink-0">
                    {config.icon}
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-serif font-bold text-white truncate">{sec.title || 'Untitled Section'}</h4>
                      <span className="px-2 py-0.5 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 rounded text-[10px] font-mono uppercase font-bold">
                        {config.label}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          sec.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : sec.status === 'draft'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {sec.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-white/50 truncate font-sans">
                      {sec.description || sec.subtitle || 'No description copy provided.'}
                    </p>
                  </div>
                </div>

                {/* Section Action Controls */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleToggleShow(sec.id)}
                    className={`p-2 rounded-lg text-xs font-bold transition-colors ${
                      sec.show
                        ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                    }`}
                    title={sec.show ? 'Hide Section' : 'Show Section'}
                  >
                    {sec.show ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setEditingSection(sec)}
                    className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    title="Edit Section Content"
                  >
                    <Edit2 className="w-4 h-4 text-[#c5a059]" />
                    <span className="hidden md:inline">Edit</span>
                  </button>

                  <button
                    onClick={() => handleDuplicate(sec.id)}
                    className="p-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Duplicate Section"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(sec.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer"
                    title="Delete Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Section Modal */}
      {editingSection && (
        <SectionFormModal
          isOpen={!!editingSection}
          section={editingSection}
          onClose={() => setEditingSection(null)}
          onSave={handleSaveSectionModal}
        />
      )}

      {/* Live Preview Modal */}
      {showLivePreview && (
        <LivePreviewModal
          isOpen={showLivePreview}
          pageTitle={pageTitle}
          sections={sections}
          onClose={() => setShowLivePreview(false)}
        />
      )}

      {/* Version History Modal */}
      {showVersionHistory && (
        <VersionHistoryModal
          isOpen={showVersionHistory}
          pageId={pageId}
          currentSections={sections}
          onClose={() => setShowVersionHistory(false)}
          onRestoreVersion={restoredSecs => onChangeSections(restoredSecs)}
        />
      )}

      {/* Reusable Blocks Modal */}
      {showReusableModal && (
        <ReusableBlocksModal
          isOpen={showReusableModal}
          onClose={() => setShowReusableModal(false)}
          onInsertTemplate={handleInsertReusableTemplate}
        />
      )}
    </div>
  );
};
