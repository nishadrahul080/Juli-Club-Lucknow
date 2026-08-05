import { useState, useEffect, useMemo, useCallback } from 'react';
import { MediaItem, MediaCategory, UploadProgress } from '../types';
import { mediaStorage, formatBytes } from '../services/MediaStorageService';

export function useMediaLibrary(initialCategory: MediaCategory | 'all' = 'all') {
  const [allItems, setAllItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory | 'all'>(initialCategory);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'size'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Upload progress state
  const [uploadProgresses, setUploadProgresses] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Load items from storage
  const reloadMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await mediaStorage.getMediaItems();
      setAllItems(items);
    } catch (err: any) {
      setError(err.message || 'Failed to load media items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadMedia();
  }, [reloadMedia]);

  // Compute folder counts
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allItems.length,
      profiles: 0,
      gallery: 0,
      blog: 0,
      logos: 0,
      seo: 0,
      'location-pages': 0,
      uncategorized: 0
    };

    allItems.forEach(item => {
      const f = item.folder || 'uncategorized';
      counts[f] = (counts[f] || 0) + 1;
    });

    return counts;
  }, [allItems]);

  // Compute total storage size
  const totalStorageBytes = useMemo(() => {
    return allItems.reduce((sum, item) => sum + (item.fileSize || 0), 0);
  }, [allItems]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    let result = [...allItems];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.folder === selectedCategory);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(q) ||
          item.filename.toLowerCase().includes(q) ||
          item.originalName.toLowerCase().includes(q) ||
          (item.altText && item.altText.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'size') {
        return b.fileSize - a.fileSize;
      }
      return 0;
    });

    return result;
  }, [allItems, selectedCategory, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  // Selection handlers
  const toggleSelectItem = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAllInView = () => {
    const pageIds = paginatedItems.map(i => i.id);
    const allSelected = pageIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  // Upload multiple files with progress simulation
  const uploadFiles = async (files: FileList | File[], targetFolder: MediaCategory = 'uncategorized') => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setIsUploading(true);

    const initialProgresses: UploadProgress[] = fileArray.map((file, idx) => ({
      fileId: `up_${Date.now()}_${idx}`,
      filename: file.name,
      progress: 5,
      status: 'compressing'
    }));

    setUploadProgresses(initialProgresses);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const pId = initialProgresses[i].fileId;

      try {
        setUploadProgresses(prev =>
          prev.map(p => (p.fileId === pId ? { ...p, progress: 30, status: 'compressing' } : p))
        );

        // Small delay to simulate smooth UI progress
        await new Promise(r => setTimeout(r, 120));

        setUploadProgresses(prev =>
          prev.map(p => (p.fileId === pId ? { ...p, progress: 70, status: 'uploading' } : p))
        );

        const uploadedItem = await mediaStorage.uploadFile(file, targetFolder);

        setUploadProgresses(prev =>
          prev.map(p => (p.fileId === pId ? { ...p, progress: 100, status: 'completed' } : p))
        );

        // Append to state
        setAllItems(prev => [uploadedItem, ...prev]);
      } catch (err: any) {
        setUploadProgresses(prev =>
          prev.map(p =>
            p.fileId === pId
              ? { ...p, progress: 0, status: 'error', errorMessage: err.message || 'Upload failed' }
              : p
          )
        );
      }
    }

    setIsUploading(false);
  };

  // Single Item Actions
  const deleteItem = async (id: string) => {
    await mediaStorage.deleteItem(id);
    setAllItems(prev => prev.filter(i => i.id !== id));
    setSelectedIds(prev => prev.filter(i => i !== id));
  };

  const bulkDelete = async () => {
    if (selectedIds.length === 0) return 0;
    const count = await mediaStorage.bulkDeleteItems(selectedIds);
    setAllItems(prev => prev.filter(i => !selectedIds.includes(i.id)));
    setSelectedIds([]);
    return count;
  };

  const updateItem = async (id: string, updates: Partial<MediaItem>) => {
    const updated = await mediaStorage.updateItem(id, updates);
    setAllItems(prev => prev.map(i => (i.id === id ? updated : i)));
    return updated;
  };

  const replaceImage = async (id: string, newFile: File) => {
    const updated = await mediaStorage.replaceItemImage(id, newFile);
    setAllItems(prev => prev.map(i => (i.id === id ? updated : i)));
    return updated;
  };

  const resetToDefaults = async () => {
    const defaults = await mediaStorage.resetToDefaults();
    setAllItems(defaults);
    setSelectedIds([]);
  };

  return {
    items: paginatedItems,
    allItems,
    filteredItems,
    loading,
    error,
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
    itemsPerPage,
    selectedIds,
    toggleSelectItem,
    selectAllInView,
    clearSelection,
    uploadFiles,
    uploadProgresses,
    isUploading,
    clearUploadProgresses: () => setUploadProgresses([]),
    deleteItem,
    bulkDelete,
    updateItem,
    replaceImage,
    resetToDefaults,
    folderCounts,
    totalStorageFormatted: formatBytes(totalStorageBytes),
    reloadMedia
  };
}
