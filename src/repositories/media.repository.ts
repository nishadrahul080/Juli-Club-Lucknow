// Media Repository - Manages Media Library files and image assets

import { BaseRepository } from './base.repository';
import { MediaRow } from '../db/types';
import { MediaEntity } from '../models/entities';
import { DatabaseTables } from '../db/database';

export class MediaRepository extends BaseRepository<MediaEntity, MediaRow> {
  protected tableName: keyof DatabaseTables = 'media_library';

  protected mapRowToEntity(row: MediaRow): MediaEntity {
    return MediaEntity.fromRow(row);
  }

  protected mapEntityToRow(entity: Partial<MediaEntity>): MediaRow {
    return {
      id: entity.id || `med-${Date.now()}`,
      filename: entity.filename || 'image.jpg',
      original_name: entity.originalName || 'image.jpg',
      mime_type: entity.mimeType || 'image/jpeg',
      size_bytes: entity.sizeBytes || 100000,
      storage_path: entity.storagePath || '/uploads/image.jpg',
      public_url: entity.publicUrl || '',
      alt_text: entity.altText || '',
      width: entity.width,
      height: entity.height,
      uploaded_by: entity.uploadedBy,
      created_at: entity.createdAt || new Date().toISOString()
    };
  }

  public async findByPublicUrl(url: string): Promise<MediaEntity | null> {
    const records = this.getRecords();
    const found = records.find(r => r.public_url === url);
    if (!found) return null;
    return this.mapRowToEntity(found);
  }
}

export const mediaRepository = new MediaRepository();
