import React, { useState, useEffect, useRef } from 'react';
import { MediaItem, MediaCategory } from '../types';
import { formatBytes } from '../services/MediaStorageService';
import {
  X,
  Copy,
  Check,
  Download,
  Trash2,
  RefreshCw,
  Info,
  Save,
  Folder,
  Calendar,
  HardDrive,
  FileCode,
  Maximize2
} from 'lucide-react';

interface MediaDetailModalProps {
  item: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<MediaItem>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReplaceImage: (id: string, file: File) => Promise<void>;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onReplaceImage
}) => {
  if (!isOpen || !item) return null;

  const [copied, setCopied] = useState<boolean>(false);
  const [titleInput, setTitleInput] = useState<string>(item.title || '');
  const [altInput, setAltInput] = useState<string>(item.altText || '');
  const [folderInput, setFolderInput] = useState<MediaCategory>(item.folder || 'uncategorized');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitleInput(item.title || '');
    setAltInput(item.altText || '');
    setFolderInput(item.folder || 'uncategorized');
  }, [item]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(item.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveMetadata = async () => {
    setIsSaving(true);
    try {
      await onUpdate(item.id, {
        title: titleInput,
        altText: altInput,
        folder: folderInput
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to permanently delete "${item.title}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(item.id);
        onClose();
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileReplaceSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await onReplaceImage(item.id, file);
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#181818]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center font-bold text-xs">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white truncate max-w-md">{item.title}</h3>
              <p className="text-[11px] font-mono text-white/50">{item.filename}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
          {/* Left: Image Canvas Preview (Col 7) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden min-h-[300px] flex items-center justify-center p-4 group">
              <img
                src={item.url}
                alt={item.altText || item.title}
                className="max-h-[420px] w-auto max-w-full object-contain rounded-lg shadow-xl"
              />
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black rounded-lg text-white/80 hover:text-white transition-all text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Full View
              </a>
            </div>

            {/* Quick Action Toolbar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={handleCopyUrl}
                className="py-2.5 px-3 bg-[#1c1c1c] hover:bg-[#252525] border border-white/10 rounded-xl text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#c5a059]" />}
                <span>{copied ? 'Copied!' : 'Copy URL'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="py-2.5 px-3 bg-[#1c1c1c] hover:bg-[#252525] border border-white/10 rounded-xl text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>Download</span>
              </button>

              <button
                onClick={() => replaceInputRef.current?.click()}
                className="py-2.5 px-3 bg-[#1c1c1c] hover:bg-[#252525] border border-white/10 rounded-xl text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Replace</span>
              </button>
              <input
                ref={replaceInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileReplaceSelect}
              />

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="py-2.5 px-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs font-medium text-red-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Right: Metadata & Editable Fields (Col 5) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Technical Information Box */}
            <div className="bg-[#181818] border border-white/10 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileCode className="w-3.5 h-3.5 text-[#c5a059]" />
                File Attributes
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-white/40 block text-[10px]">Dimensions</span>
                  <span className="font-mono text-white font-medium">
                    {item.dimensions?.width} × {item.dimensions?.height} px
                  </span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px]">File Size</span>
                  <span className="font-mono text-white font-medium">{formatBytes(item.fileSize)}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px]">File Format</span>
                  <span className="font-mono text-white uppercase">{item.mimeType.split('/')[1]}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px]">Uploaded Date</span>
                  <span className="text-white font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-white/40" />
                    {new Date(item.uploadDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Editable Form Fields */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block">
                  Image Title
                </label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/10 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block">
                  Alt Text (SEO Description)
                </label>
                <input
                  type="text"
                  value={altInput}
                  onChange={(e) => setAltInput(e.target.value)}
                  placeholder="Describe image for search engines"
                  className="w-full bg-[#1c1c1c] border border-white/10 focus:border-[#c5a059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block">
                  Category Folder
                </label>
                <div className="relative">
                  <select
                    value={folderInput}
                    onChange={(e) => setFolderInput(e.target.value as MediaCategory)}
                    className="w-full bg-[#1c1c1c] border border-white/10 focus:border-[#c5a059] text-xs text-white rounded-xl px-3.5 py-2.5 outline-none cursor-pointer pr-10"
                  >
                    <option value="profiles">profiles/</option>
                    <option value="gallery">gallery/</option>
                    <option value="blog">blog/</option>
                    <option value="logos">logos/</option>
                    <option value="seo">seo/</option>
                    <option value="location-pages">location-pages/</option>
                    <option value="uncategorized">uncategorized/</option>
                  </select>
                  <Folder className="w-4 h-4 text-white/40 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <button
                onClick={handleSaveMetadata}
                disabled={isSaving}
                className="w-full py-2.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving Changes...' : 'Save Image Details'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
