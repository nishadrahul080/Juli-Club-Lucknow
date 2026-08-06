import React, { useState } from 'react';
import { useMediaLibrary } from '../media/hooks/useMediaLibrary';
import { MediaUploadZone } from '../media/components/MediaUploadZone';
import { MediaDetailModal } from '../media/components/MediaDetailModal';
import { MediaCategory, MediaItem } from '../media/types';
import { formatBytes } from '../media/services/MediaStorageService';
import {
  Image as ImageIcon,
  Grid,
  List as ListIcon,
  Search,
  Upload,
  Trash2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Folder,
  Cloud,
  CheckSquare,
  Square,
  Maximize2,
  Sparkles,
  Zap,
  HardDrive
} from 'lucide-react';

export const MediaLibraryModule: React.FC = () => {
  const {
    items,
    allItems,
    filteredItems,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedIds,
    toggleSelectItem,
    selectAllInView,
    clearSelection,
    uploadFiles,
    uploadProgresses,
    isUploading,
    clearUploadProgresses,
    deleteItem,
    bulkDelete,
    updateItem,
    replaceImage,
    resetToDefaults,
    folderCounts,
    totalStorageFormatted
  } = useMediaLibrary();

  const [showUploadZone, setShowUploadZone] = useState<boolean>(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleQuickCopy = (e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected media items?`)) {
      await bulkDelete();
    }
  };

  return (
    <div className="space-y-6 selection:bg-[#c5a059] selection:text-black">
      {/* Top Header & Storage Summary Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141414] border border-white/10 rounded-2xl p-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-serif text-white tracking-tight">Media & Image Library</h1>
            <span className="px-2.5 py-0.5 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
              WordPress Standards Engine
            </span>
          </div>
          <p className="text-xs text-white/50">
            Manage high-converting companion photos, blog headers, logos, and location banners with automated compression.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Storage Stat Pill */}
          <div className="bg-[#181818] border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
            <HardDrive className="w-4 h-4 text-[#c5a059]" />
            <div>
              <span className="text-[10px] text-white/40 uppercase font-bold block">Storage Used</span>
              <span className="text-xs font-mono font-bold text-white">
                {totalStorageFormatted} ({allItems.length} files)
              </span>
            </div>
          </div>

          {/* Cloud Ready Badge */}
          <div className="bg-[#181818] border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <Cloud className="w-4 h-4" />
            <span>S3 / Cloudinary Ready</span>
          </div>

          {/* Upload Drawer Toggle Button */}
          <button
            onClick={() => setShowUploadZone(!showUploadZone)}
            className="px-4 py-2.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{showUploadZone ? 'Close Upload' : 'Upload Files'}</span>
          </button>
        </div>
      </div>

      {/* Upload Zone Drawer */}
      {showUploadZone && (
        <MediaUploadZone
          onUpload={async (files, cat) => {
            await uploadFiles(files, cat);
          }}
          uploadProgresses={uploadProgresses}
          isUploading={isUploading}
          onClearProgress={clearUploadProgresses}
        />
      )}

      {/* Controls & Filter Toolbar */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Left: Search & Category Folders */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, filename, alt text..."
                className="w-full bg-[#1c1c1c] border border-white/10 focus:border-[#c5a059] rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none transition-colors"
              />
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5 pointer-events-none" />
            </div>

            {/* Folder Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as MediaCategory | 'all')}
              className="w-full sm:w-48 bg-[#1c1c1c] border border-white/10 focus:border-[#c5a059] text-xs text-white rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              <option value="all">📁 All Folders ({folderCounts.all || 0})</option>
              <option value="profiles">profiles/ ({folderCounts.profiles || 0})</option>
              <option value="gallery">gallery/ ({folderCounts.gallery || 0})</option>
              <option value="blog">blog/ ({folderCounts.blog || 0})</option>
              <option value="logos">logos/ ({folderCounts.logos || 0})</option>
              <option value="seo">seo/ ({folderCounts.seo || 0})</option>
              <option value="location-pages">location-pages/ ({folderCounts['location-pages'] || 0})</option>
              <option value="banners">banners/ ({folderCounts.banners || 0})</option>
              <option value="uncategorized">uncategorized/ ({folderCounts.uncategorized || 0})</option>
            </select>
          </div>

          {/* Right: Sort, View Toggle, Selection Actions */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#1c1c1c] border border-white/10 focus:border-[#c5a059] text-xs text-white rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="title">Sort: Title (A-Z)</option>
              <option value="size">Sort: File Size (Largest)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#101010] border border-white/10 rounded-xl p-1 text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#c5a059] text-black font-bold' : 'text-white/60 hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#c5a059] text-black font-bold' : 'text-white/60 hover:text-white'
                }`}
                title="List View"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Selection Bar Actions (if items selected) */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-[#c5a059]/10 border border-[#c5a059]/30 rounded-xl px-4 py-2.5 text-xs text-[#c5a059]">
            <span className="font-semibold flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              {selectedIds.length} item(s) selected
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={clearSelection}
                className="text-white/70 hover:text-white text-[11px] underline cursor-pointer"
              >
                Deselect All
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content: Grid vs List View */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#c5a059] animate-spin mx-auto" />
          <p className="text-xs text-white/50">Loading Media Library...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-white/30">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-white">No Media Files Found</h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto">
            No image files match your current search or folder filters. Upload a new file or reset filters.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-medium cursor-pointer"
            >
              Clear Filters
            </button>
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 bg-[#c5a059]/10 hover:bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30 rounded-xl text-xs font-medium cursor-pointer"
            >
              Reset Seeded Assets
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => setSelectedDetailItem(item)}
                className={`group bg-[#141414] border rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 shadow-lg relative flex flex-col ${
                  isSelected
                    ? 'border-[#c5a059] ring-2 ring-[#c5a059]/40 bg-[#c5a059]/5'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                {/* Select Checkbox Overlay */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelectItem(item.id);
                  }}
                  className="absolute top-2.5 left-2.5 z-10 p-1 bg-black/60 backdrop-blur rounded-lg text-white opacity-90 hover:scale-110 transition-transform cursor-pointer"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-[#c5a059]" />
                  ) : (
                    <Square className="w-4 h-4 text-white/60 hover:text-white" />
                  )}
                </button>

                {/* Quick Copy URL Button */}
                <button
                  type="button"
                  onClick={(e) => handleQuickCopy(e, item)}
                  className="absolute top-2.5 right-2.5 z-10 p-1.5 bg-black/60 backdrop-blur rounded-lg text-white/80 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Copy Image URL"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[#c5a059]" />
                  )}
                </button>

                {/* Thumbnail Container */}
                <div className="aspect-square bg-[#0c0c0c] relative flex items-center justify-center p-2 overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.altText || item.title}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 bg-black/80 border border-white/20 rounded-xl text-[11px] font-semibold text-white flex items-center gap-1 shadow-xl">
                      <Maximize2 className="w-3 h-3 text-[#c5a059]" />
                      Manage
                    </span>
                  </div>
                </div>

                {/* Info Card Footer */}
                <div className="p-3 space-y-1 bg-[#141414] border-t border-white/5 flex-1 flex flex-col justify-between">
                  <p className="text-xs font-semibold text-white truncate" title={item.title}>
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-white/40 font-mono pt-1">
                    <span className="px-1.5 py-0.5 bg-white/5 rounded text-white/60">
                      {item.folder}/
                    </span>
                    <span>{formatBytes(item.fileSize)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW TABLE */
        <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white">
              <thead className="bg-[#181818] border-b border-white/10 text-[11px] uppercase tracking-wider text-white/50 font-bold">
                <tr>
                  <th className="p-4 w-10">
                    <button
                      onClick={selectAllInView}
                      className="text-white/60 hover:text-white cursor-pointer"
                    >
                      <CheckSquare className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="p-4">Asset</th>
                  <th className="p-4">Filename</th>
                  <th className="p-4">Folder</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Dimensions</th>
                  <th className="p-4">Uploaded</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedDetailItem(item)}
                      className={`hover:bg-white/5 transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#c5a059]/10' : ''
                      }`}
                    >
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleSelectItem(item.id)}
                          className="text-white/60 hover:text-white cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#c5a059]" />
                          ) : (
                            <Square className="w-4 h-4 text-white/40" />
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-10 h-10 object-cover rounded-lg border border-white/10 shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-white block truncate max-w-xs">{item.title}</span>
                            <span className="text-[10px] text-white/40 block truncate">{item.altText || 'No alt text'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-white/70">{item.filename}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[11px] font-mono text-[#c5a059]">
                          {item.folder}/
                        </span>
                      </td>
                      <td className="p-4 font-mono text-white/60">{formatBytes(item.fileSize)}</td>
                      <td className="p-4 font-mono text-white/60">
                        {item.dimensions?.width}×{item.dimensions?.height} px
                      </td>
                      <td className="p-4 text-white/50">{new Date(item.uploadDate).toLocaleDateString()}</td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => handleQuickCopy(e, item)}
                            className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors cursor-pointer"
                            title="Copy Image URL"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => setSelectedDetailItem(item)}
                            className="px-2.5 py-1 bg-[#c5a059]/10 hover:bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-[#141414] border border-white/10 rounded-2xl p-4 text-xs">
          <span className="text-white/50">
            Showing <strong className="text-white">{items.length}</strong> of{' '}
            <strong className="text-white">{filteredItems.length}</strong> total items (Page {currentPage} of {totalPages})
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-[#1c1c1c] hover:bg-[#252525] disabled:opacity-30 border border-white/10 rounded-xl text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-white/5 rounded-lg font-mono text-white">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-[#1c1c1c] hover:bg-[#252525] disabled:opacity-30 border border-white/10 rounded-xl text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Media Detail Inspection Modal */}
      <MediaDetailModal
        item={selectedDetailItem}
        isOpen={!!selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
        onUpdate={updateItem}
        onDelete={deleteItem}
        onReplaceImage={replaceImage}
      />
    </div>
  );
};
