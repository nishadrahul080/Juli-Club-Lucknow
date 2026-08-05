export type MediaCategory = 
  | 'profiles'
  | 'gallery'
  | 'blog'
  | 'logos'
  | 'seo'
  | 'location-pages'
  | 'uncategorized';

export type AllowedMimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/webp'
  | 'image/svg+xml'
  | 'image/jpg';

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  title: string;
  altText?: string;
  url: string; // Base64 Data URL, Object URL, or external URL
  folder: MediaCategory;
  mimeType: AllowedMimeType | string;
  fileSize: number; // in bytes
  dimensions: ImageDimensions;
  uploadDate: string; // ISO String
  storageType: 'indexeddb' | 'local' | 'cloud' | 'external';
  checksum: string; // Hash/signature for duplicate detection
}

export interface MediaFilterOptions {
  searchQuery: string;
  category: MediaCategory | 'all';
  sortBy: 'newest' | 'oldest' | 'title' | 'size';
  page: number;
  itemsPerPage: number;
}

export interface UploadProgress {
  fileId: string;
  filename: string;
  progress: number; // 0 - 100
  status: 'pending' | 'compressing' | 'uploading' | 'completed' | 'error';
  errorMessage?: string;
}

export interface StorageConfig {
  maxFileSizeBytes: number; // default 10MB
  autoCompress: boolean;
  maxDimensionWidth: number; // default 2000px
  compressionQuality: number; // 0.85
  activeProvider: 'local_storage' | 'indexeddb' | 'cloudinary' | 's3';
}

/**
 * Storage Adapter interface to ensure Future-Ready compatibility
 * with S3, Cloudinary, DigitalOcean Spaces, or custom API endpoints.
 */
export interface StorageAdapter {
  providerName: string;
  saveMediaItem(item: Omit<MediaItem, 'id' | 'uploadDate'>): Promise<MediaItem>;
  deleteMediaItem(id: string): Promise<boolean>;
  updateMediaItem(id: string, updates: Partial<MediaItem>): Promise<MediaItem>;
  getMediaItems(): Promise<MediaItem[]>;
  clearAll(): Promise<boolean>;
}
