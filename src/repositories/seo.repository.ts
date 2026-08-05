// SEO Metadata Repository - Separated SEO entity management

import { BaseRepository } from './base.repository';
import { SeoMetadataRow } from '../db/types';
import { SeoMetadataEntity } from '../models/entities';
import { DatabaseTables } from '../db/database';

export class SeoRepository extends BaseRepository<SeoMetadataEntity, SeoMetadataRow> {
  protected tableName: keyof DatabaseTables = 'seo_metadata';

  protected mapRowToEntity(row: SeoMetadataRow): SeoMetadataEntity {
    return SeoMetadataEntity.fromRow(row);
  }

  protected mapEntityToRow(entity: Partial<SeoMetadataEntity>): SeoMetadataRow {
    return {
      id: entity.id || `seo-${Date.now()}`,
      entity_type: entity.entityType || 'site',
      entity_id: entity.entityId || 'main',
      meta_title: entity.metaTitle || '',
      meta_description: entity.metaDescription || '',
      canonical_url: entity.canonicalUrl,
      robots_meta: entity.robotsMeta || 'index, follow',
      og_title: entity.ogTitle,
      og_description: entity.ogDescription,
      og_image_id: entity.ogImageId,
      og_image_url: entity.ogImageUrl,
      twitter_card: entity.twitterCard || 'summary_large_image',
      focus_keyword: entity.focusKeyword,
      schema_markup: entity.schemaMarkup,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  public async findByEntity(entityType: string, entityId: string): Promise<SeoMetadataEntity | null> {
    const rows = this.getRecords();
    const found = rows.find(r => r.entity_type === entityType && r.entity_id === entityId);
    if (!found) return null;
    return this.mapRowToEntity(found);
  }
}

export const seoRepository = new SeoRepository();
