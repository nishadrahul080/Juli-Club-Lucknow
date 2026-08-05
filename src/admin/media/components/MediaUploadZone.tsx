import React, { useState, useRef } from 'react';
import { MediaCategory, UploadProgress } from '../types';
import { Upload, FileImage, ShieldCheck, Zap, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface MediaUploadZoneProps {
  onUpload: (files: FileList | File[], category: MediaCategory) => Promise<void>;
  uploadProgresses: UploadProgress[];
  isUploading: boolean;
  onClearProgress: () => void;
  defaultCategory?: MediaCategory;
}

export const MediaUploadZone: React.FC<MediaUploadZoneProps> = ({
  onUpload,
  uploadProgresses,
  isUploading,
  onClearProgress,
  defaultCategory = 'uncategorized'
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedFolder, setSelectedFolder] = useState<MediaCategory>(defaultCategory);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await onUpload(e.dataTransfer.files, selectedFolder);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await onUpload(e.target.files, selectedFolder);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
      {/* Category Selection Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#c5a059]" />
            Upload New Media Assets
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            Images will be automatically validated, sanitized, compressed, and organized into folders.
          </p>
        </div>

        {/* Folder Select Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-medium text-white/70 shrink-0">Destination Folder:</label>
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value as MediaCategory)}
            className="bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-xs text-white rounded-xl px-3 py-2 outline-none cursor-pointer transition-colors"
          >
            <option value="profiles">profiles/</option>
            <option value="gallery">gallery/</option>
            <option value="blog">blog/</option>
            <option value="logos">logos/</option>
            <option value="seo">seo/</option>
            <option value="location-pages">location-pages/</option>
            <option value="uncategorized">uncategorized/</option>
          </select>
        </div>
      </div>

      {/* Drag & Drop Target Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 group ${
          isDragging
            ? 'border-[#c5a059] bg-[#c5a059]/10 scale-[1.01]'
            : 'border-white/15 hover:border-[#c5a059]/60 bg-[#181818] hover:bg-[#1f1f1f]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center mx-auto mb-4 border border-[#c5a059]/20 group-hover:scale-110 transition-transform">
          <FileImage className="w-7 h-7" />
        </div>

        <h4 className="text-base font-semibold text-white mb-1">
          Drag & Drop files here, or <span className="text-[#c5a059] underline underline-offset-4">browse computer</span>
        </h4>
        <p className="text-xs text-white/50 max-w-md mx-auto">
          Supports JPG, PNG, WEBP, and SVG formats up to 10MB per file. Multiple files selection supported.
        </p>

        {/* Auto Features Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] text-white/70 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Auto Compression & Resize
          </span>
          <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] text-white/70 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Executable & Injection Shield
          </span>
        </div>
      </div>

      {/* Upload Progress Tracker */}
      {uploadProgresses.length > 0 && (
        <div className="space-y-3 bg-[#181818] border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-white border-b border-white/10 pb-2">
            <span>Active Upload Queue ({uploadProgresses.length} items)</span>
            {!isUploading && (
              <button
                onClick={onClearProgress}
                className="text-white/40 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
              >
                <X className="w-3.5 h-3.5" />
                Clear Queue
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {uploadProgresses.map((p) => (
              <div key={p.fileId} className="bg-[#101010] border border-white/5 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate max-w-[240px] font-medium text-white/90">{p.filename}</span>
                  <span className="text-[11px] font-mono shrink-0">
                    {p.status === 'compressing' && <span className="text-amber-400">Compressing...</span>}
                    {p.status === 'uploading' && <span className="text-sky-400">{p.progress}%</span>}
                    {p.status === 'completed' && (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    )}
                    {p.status === 'error' && (
                      <span className="text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Failed
                      </span>
                    )}
                  </span>
                </div>

                {/* Progress Bar */}
                {p.status !== 'error' ? (
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        p.status === 'completed' ? 'bg-emerald-500' : 'bg-[#c5a059]'
                      }`}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                ) : (
                  <p className="text-[11px] text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                    {p.errorMessage}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
