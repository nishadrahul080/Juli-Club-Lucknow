import React, { useState } from 'react';
import { MediaItem, MediaCategory } from '../types';
import { useMediaLibrary } from '../hooks/useMediaLibrary';
import { MediaUploadZone } from './MediaUploadZone';
import { formatBytes } from '../services/MediaStorageService';
import {
  X,
  Search,
  Check,
  Upload,
  Image as ImageIcon,
  Folder,
  CheckCircle2,
  Filter
} from 'lucide-react';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string, mediaItem?: MediaItem) => void;
  title?: string;
  allowedCategory?: MediaCategory | 'all';
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  title = 'Select Media Asset',
  allowedCategory = 'all'
}) => {
  if (!isOpen) return null;

  const {
    items,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    uploadFiles,
    uploadProgresses,
    isUploading,
    clearUploadProgresses,
    folderCounts
  } = useMediaLibrary(allowedCategory as MediaCategory | 'all');

  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const handleConfirmSelection = () => {
    if (selectedItem) {
      onSelectImage(selectedItem.url, selectedItem);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-hidden">
      <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 bg-[#181818] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center font-bold text-xs">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="text-[11px] text-white/50">Choose an existing asset from the Media Library or upload a new file.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Tabs */}
            <div className="flex items-center bg-[#101010] border border-white/10 rounded-xl p-1 text-xs">
              <button
                onClick={() => setActiveTab('library')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'library'
                    ? 'bg-[#c5a059] text-black font-semibold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Media Library
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-[#c5a059] text-black font-semibold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload New
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'upload' ? (
            <div className="p-6 overflow-y-auto">
              <MediaUploadZone
                onUpload={async (files, cat) => {
                  await uploadFiles(files, cat);
                  setActiveTab('library');
                }}
                uploadProgresses={uploadProgresses}
                isUploading={isUploading}
                onClearProgress={clearUploadProgresses}
                defaultCategory={allowedCategory !== 'all' ? allowedCategory : 'uncategorized'}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Filter & Search Toolbar */}
              <div className="px-6 py-3 border-b border-white/10 bg-[#161616] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search media files..."
                    className="w-full bg-[#1c1c1c] border border-white/10 focus:border-[#c5a059] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5 pointer-events-none" />
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
                  {(['all', 'profiles', 'gallery', 'blog', 'logos', 'seo', 'location-pages', 'banners', 'uncategorized'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40'
                          : 'bg-white/5 text-white/60 hover:text-white border border-transparent'
                      }`}
                    >
                      {cat} ({folderCounts[cat] || 0})
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Images View */}
              <div className="flex-1 p-6 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <ImageIcon className="w-12 h-12 text-white/20 mx-auto" />
                    <p className="text-xs text-white/50">No media assets found matching filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {items.map((item) => {
                      const isSelected = selectedItem?.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className={`group relative bg-[#181818] border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? 'border-[#c5a059] ring-2 ring-[#c5a059]/50 bg-[#c5a059]/10'
                              : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="aspect-square bg-black/40 relative flex items-center justify-center p-2">
                            <img
                              src={item.url}
                              alt={item.title}
                              className="w-full h-full object-cover rounded"
                            />

                            {/* Selection Radio Overlay */}
                            <div className="absolute top-2 right-2">
                              {isSelected ? (
                                <div className="w-5 h-5 rounded-full bg-[#c5a059] text-black flex items-center justify-center font-bold">
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-white/40 bg-black/50 group-hover:border-white" />
                              )}
                            </div>
                          </div>

                          <div className="p-2.5 space-y-0.5">
                            <p className="text-xs text-white font-medium truncate">{item.title}</p>
                            <div className="flex items-center justify-between text-[10px] text-white/40">
                              <span>{item.folder}/</span>
                              <span>{formatBytes(item.fileSize)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#181818] flex items-center justify-between shrink-0">
          <div className="text-xs text-white/60">
            {selectedItem ? (
              <span className="flex items-center gap-1.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#c5a059]" />
                Selected: <strong className="font-semibold text-white">{selectedItem.title}</strong> ({selectedItem.dimensions.width}×{selectedItem.dimensions.height}px)
              </span>
            ) : (
              <span>Click any image above to select it.</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSelection}
              disabled={!selectedItem}
              className="px-5 py-2 bg-[#c5a059] hover:bg-[#d4b578] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              Use Selected Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
