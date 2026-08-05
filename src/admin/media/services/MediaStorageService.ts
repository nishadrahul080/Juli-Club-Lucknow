import { MediaItem, MediaCategory, ImageDimensions, StorageConfig } from '../types';
import { COMPANION_PROFILES } from '../../../data/mockData';
import { INITIAL_BLOGS, DEFAULT_SETTINGS } from '../../../data/cmsStore';

const STORAGE_KEY = 'juli_club_media_library_v1';
const DB_NAME = 'JuliClubMediaDB';
const STORE_NAME = 'media_items';

export const DEFAULT_STORAGE_CONFIG: StorageConfig = {
  maxFileSizeBytes: 10 * 1024 * 1024, // 10MB
  autoCompress: true,
  maxDimensionWidth: 2000,
  compressionQuality: 0.85,
  activeProvider: 'indexeddb'
};

// Security: Forbidden executable file extensions
const BLOCKED_EXTENSIONS = [
  '.exe', '.php', '.js', '.sh', '.bat', '.py', '.rb', '.pl', '.cgi',
  '.html', '.htm', '.phtml', '.php3', '.php4', '.php5', '.phps', '.jar',
  '.cmd', '.com', '.scr', '.vbs', '.wsf', '.cpl'
];

// Supported image MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml'
];

/**
 * Sanitize filename to prevent directory traversal and script injection
 */
export function sanitizeFilename(filename: string): string {
  // Strip path traversal attempts
  let cleanName = filename.replace(/^.*[\\/]/, '');
  // Remove dangerous control characters and illegal symbols
  cleanName = cleanName.replace(/[^a-zA-Z0-9_.-]/g, '_');
  // Lowercase extension
  const parts = cleanName.split('.');
  if (parts.length > 1) {
    const ext = parts.pop()?.toLowerCase() || '';
    cleanName = `${parts.join('_')}.${ext}`;
  }
  return cleanName;
}

/**
 * Validate file safety & mime type
 */
export function validateFile(file: File, config: StorageConfig = DEFAULT_STORAGE_CONFIG): { valid: boolean; error?: string } {
  const filename = file.name.toLowerCase();

  // Check forbidden executable extension
  const hasBlockedExt = BLOCKED_EXTENSIONS.some(ext => filename.endsWith(ext));
  if (hasBlockedExt) {
    return { valid: false, error: 'Security Warning: Executable and script files are strictly prohibited.' };
  }

  // Check file type
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase()) && !filename.match(/\.(jpg|jpeg|png|webp|svg)$/i)) {
    return { valid: false, error: `Unsupported file type: "${file.type || filename}". Only JPG, PNG, WEBP, and SVG are supported.` };
  }

  // Check size limit
  if (file.size > config.maxFileSizeBytes) {
    const maxMb = (config.maxFileSizeBytes / (1024 * 1024)).toFixed(0);
    return { valid: false, error: `File size exceeds the maximum limit of ${maxMb}MB.` };
  }

  return { valid: true };
}

/**
 * Helper: Format Bytes to human readable (e.g. 1.2 MB, 450 KB)
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Generate checksum for duplicate detection
 */
export function generateChecksum(filename: string, fileSize: number): string {
  return `${filename.toLowerCase().trim()}_${fileSize}`;
}

/**
 * Load image object to extract dimensions & perform canvas compression
 */
export function processImageFile(
  file: File,
  category: MediaCategory,
  config: StorageConfig = DEFAULT_STORAGE_CONFIG
): Promise<{ url: string; dimensions: ImageDimensions; fileSize: number; mimeType: string }> {
  return new Promise((resolve, reject) => {
    // If SVG, skip canvas compression
    if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        resolve({
          url,
          dimensions: { width: 400, height: 400 },
          fileSize: file.size,
          mimeType: 'image/svg+xml'
        });
      };
      reader.onerror = () => reject(new Error('Failed to read SVG file'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const srcUrl = e.target?.result as string;
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Check if compression / resizing is needed
        const needsResize = config.autoCompress && width > config.maxDimensionWidth;
        const needsCompression = config.autoCompress && file.size > 1.5 * 1024 * 1024; // > 1.5MB

        if (!needsResize && !needsCompression) {
          resolve({
            url: srcUrl,
            dimensions: { width, height },
            fileSize: file.size,
            mimeType: file.type || 'image/jpeg'
          });
          return;
        }

        // Perform canvas resize & compression
        if (needsResize) {
          const ratio = config.maxDimensionWidth / width;
          width = config.maxDimensionWidth;
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            url: srcUrl,
            dimensions: { width, height },
            fileSize: file.size,
            mimeType: file.type || 'image/jpeg'
          });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to optimized WEBP or JPEG Data URL
        const outputMime = file.type === 'image/png' ? 'image/png' : 'image/webp';
        const compressedDataUrl = canvas.toDataURL(outputMime, config.compressionQuality);

        // Approximate compressed byte size
        const head = `data:${outputMime};base64,`;
        const approxBytes = Math.round((compressedDataUrl.length - head.length) * 3 / 4);

        resolve({
          url: compressedDataUrl,
          dimensions: { width, height },
          fileSize: Math.min(approxBytes, file.size),
          mimeType: outputMime
        });
      };

      img.onerror = () => reject(new Error('Corrupted or invalid image file'));
      img.src = srcUrl;
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Generate initial pre-seeded media items from existing CMS content
 */
function createPreseededMedia(): MediaItem[] {
  const items: MediaItem[] = [];

  // Seed profile images & galleries
  COMPANION_PROFILES.forEach((p, idx) => {
    if (p.image) {
      items.push({
        id: `media-prof-hero-${p.id}`,
        filename: `${p.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_profile.jpg`,
        originalName: `${p.name} Primary Photo.jpg`,
        title: `${p.name} - Official Profile Cover`,
        altText: `${p.name} companion in ${p.location} Lucknow`,
        url: p.image,
        folder: 'profiles',
        mimeType: 'image/jpeg',
        fileSize: 245000 + idx * 12500,
        dimensions: { width: 800, height: 1000 },
        uploadDate: new Date(Date.now() - (idx + 1) * 86400000).toISOString(),
        storageType: 'external',
        checksum: generateChecksum(`${p.name}_profile.jpg`, 245000 + idx * 12500)
      });
    }

    if (p.gallery && Array.isArray(p.gallery)) {
      p.gallery.forEach((gUrl, gIdx) => {
        if (gUrl !== p.image) {
          items.push({
            id: `media-prof-gal-${p.id}-${gIdx}`,
            filename: `${p.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_gallery_${gIdx + 1}.jpg`,
            originalName: `${p.name} Gallery Photo ${gIdx + 1}.jpg`,
            title: `${p.name} - Gallery Photo ${gIdx + 1}`,
            altText: `${p.name} gallery image ${gIdx + 1}`,
            url: gUrl,
            folder: 'gallery',
            mimeType: 'image/jpeg',
            fileSize: 310000 + gIdx * 18000,
            dimensions: { width: 800, height: 1000 },
            uploadDate: new Date(Date.now() - (gIdx + 2) * 86400000).toISOString(),
            storageType: 'external',
            checksum: generateChecksum(`${p.name}_gallery_${gIdx + 1}.jpg`, 310000 + gIdx * 18000)
          });
        }
      });
    }
  });

  // Seed blog images
  INITIAL_BLOGS.forEach((b, idx) => {
    if (b.image) {
      items.push({
        id: `media-blog-${b.id}`,
        filename: `${b.slug}_header.jpg`,
        originalName: `${b.title.substring(0, 20)}.jpg`,
        title: b.title,
        altText: b.title,
        url: b.image,
        folder: 'blog',
        mimeType: 'image/jpeg',
        fileSize: 420000 + idx * 25000,
        dimensions: { width: 1200, height: 675 },
        uploadDate: new Date(Date.now() - (idx + 5) * 86400000).toISOString(),
        storageType: 'external',
        checksum: generateChecksum(`${b.slug}_header.jpg`, 420000 + idx * 25000)
      });
    }
  });

  // Seed SEO & Logo
  if (DEFAULT_SETTINGS.ogImage) {
    items.push({
      id: 'media-seo-og',
      filename: 'juliclub_og_social_banner.jpg',
      originalName: 'Social OpenGraph Banner.jpg',
      title: 'Juli Club Main Social Share Banner',
      altText: 'VIP Call Girl Service Lucknow Juli Club Banner',
      url: DEFAULT_SETTINGS.ogImage,
      folder: 'seo',
      mimeType: 'image/jpeg',
      fileSize: 580000,
      dimensions: { width: 1200, height: 630 },
      uploadDate: new Date().toISOString(),
      storageType: 'external',
      checksum: generateChecksum('juliclub_og_social_banner.jpg', 580000)
    });
  }

  return items;
}

/**
 * Primary Storage Service Class
 */
export class MediaStorageService {
  private static instance: MediaStorageService;
  private itemsCache: MediaItem[] | null = null;

  public static getInstance(): MediaStorageService {
    if (!MediaStorageService.instance) {
      MediaStorageService.instance = new MediaStorageService();
    }
    return MediaStorageService.instance;
  }

  /**
   * Get all media items (loads from localStorage with fallback to preseeded data)
   */
  public async getMediaItems(): Promise<MediaItem[]> {
    if (this.itemsCache) {
      return this.itemsCache;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: MediaItem[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.itemsCache = parsed;
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to load media library from storage:', err);
    }

    // Seed defaults on first run
    const defaultItems = createPreseededMedia();
    this.saveToStorage(defaultItems);
    this.itemsCache = defaultItems;
    return defaultItems;
  }

  /**
   * Add a new file to the Media Library with duplicate check & auto optimization
   */
  public async uploadFile(
    file: File,
    folder: MediaCategory = 'uncategorized',
    config: StorageConfig = DEFAULT_STORAGE_CONFIG,
    customTitle?: string
  ): Promise<MediaItem> {
    // 1. Safety validation
    const val = validateFile(file, config);
    if (!val.valid) {
      throw new Error(val.error || 'Invalid file');
    }

    // 2. Filename sanitization
    const safeName = sanitizeFilename(file.name);
    const checksum = generateChecksum(safeName, file.size);

    // 3. Duplicate check
    const currentItems = await this.getMediaItems();
    const duplicate = currentItems.find(item => item.checksum === checksum || (item.originalName === file.name && item.fileSize === file.size));
    if (duplicate) {
      throw new Error(`Duplicate File Alert: "${file.name}" has already been uploaded to the Media Library.`);
    }

    // 4. Process image canvas compression & dimensions
    const processed = await processImageFile(file, folder, config);

    // 5. Construct Unique Filename & ID
    const timeStamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const uniqueId = `media_${timeStamp}_${randomSuffix}`;
    const cleanBase = safeName.substring(0, safeName.lastIndexOf('.')) || safeName;
    const ext = safeName.substring(safeName.lastIndexOf('.')) || '.jpg';
    const finalFilename = `${cleanBase}_${randomSuffix}${ext}`;

    const newMediaItem: MediaItem = {
      id: uniqueId,
      filename: finalFilename,
      originalName: file.name,
      title: customTitle || cleanBase.replace(/_/g, ' '),
      altText: customTitle || cleanBase.replace(/_/g, ' '),
      url: processed.url,
      folder,
      mimeType: processed.mimeType,
      fileSize: processed.fileSize,
      dimensions: processed.dimensions,
      uploadDate: new Date().toISOString(),
      storageType: 'local',
      checksum
    };

    const updatedList = [newMediaItem, ...currentItems];
    this.saveToStorage(updatedList);
    return newMediaItem;
  }

  /**
   * Rename or update metadata of a media item
   */
  public async updateItem(id: string, updates: Partial<Pick<MediaItem, 'title' | 'altText' | 'folder' | 'filename'>>): Promise<MediaItem> {
    const items = await this.getMediaItems();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Media item not found.');
    }

    const updatedItem = {
      ...items[index],
      ...updates
    };

    if (updates.filename) {
      updatedItem.filename = sanitizeFilename(updates.filename);
    }

    items[index] = updatedItem;
    this.saveToStorage(items);
    return updatedItem;
  }

  /**
   * Replace image file content of an existing media item
   */
  public async replaceItemImage(
    id: string,
    newFile: File,
    config: StorageConfig = DEFAULT_STORAGE_CONFIG
  ): Promise<MediaItem> {
    const val = validateFile(newFile, config);
    if (!val.valid) {
      throw new Error(val.error || 'Invalid file');
    }

    const items = await this.getMediaItems();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Media item not found.');
    }

    const target = items[index];
    const processed = await processImageFile(newFile, target.folder, config);

    const updatedItem: MediaItem = {
      ...target,
      url: processed.url,
      mimeType: processed.mimeType,
      fileSize: processed.fileSize,
      dimensions: processed.dimensions,
      uploadDate: new Date().toISOString(),
      checksum: generateChecksum(newFile.name, newFile.size)
    };

    items[index] = updatedItem;
    this.saveToStorage(items);
    return updatedItem;
  }

  /**
   * Delete a single media item
   */
  public async deleteItem(id: string): Promise<boolean> {
    const items = await this.getMediaItems();
    const filtered = items.filter(i => i.id !== id);
    this.saveToStorage(filtered);
    return true;
  }

  /**
   * Bulk delete multiple media items
   */
  public async bulkDeleteItems(ids: string[]): Promise<number> {
    const setIds = new Set(ids);
    const items = await this.getMediaItems();
    const filtered = items.filter(i => !setIds.has(i.id));
    const deletedCount = items.length - filtered.length;
    this.saveToStorage(filtered);
    return deletedCount;
  }

  /**
   * Reset media library back to default seeded assets
   */
  public async resetToDefaults(): Promise<MediaItem[]> {
    const defaults = createPreseededMedia();
    this.saveToStorage(defaults);
    return defaults;
  }

  /**
   * Internal storage save helper
   */
  private saveToStorage(items: MediaItem[]): void {
    this.itemsCache = items;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('LocalStorage quota limit reached for images. Purging oldest local uploads...', e);
      // If quota error occurs (e.g. big data URLs), keep latest 30 items
      const trimmed = items.slice(0, 30);
      this.itemsCache = trimmed;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      } catch (err) {
        console.error('Critical storage save error:', err);
      }
    }
  }
}

export const mediaStorage = MediaStorageService.getInstance();
