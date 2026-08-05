// Homepage Repository - Manages Homepage Config and Section components

import { BaseRepository } from './base.repository';
import { HomepageSectionRow } from '../db/types';
import { CMSSection, HomepageConfig } from '../types';
import { db, DatabaseTables } from '../db/database';

export class HomepageRepository extends BaseRepository<CMSSection, HomepageSectionRow> {
  protected tableName: keyof DatabaseTables = 'homepage_sections';

  protected mapRowToEntity(row: HomepageSectionRow): CMSSection {
    return {
      id: row.id,
      type: row.type as any,
      title: row.title,
      subtitle: row.subtitle,
      description: row.description,
      ctaText: row.cta_text,
      ctaUrl: row.cta_url,
      bgImage: row.bg_image_url,
      bgColor: row.bg_color,
      spacing: row.spacing,
      order: row.display_order,
      show: row.is_visible,
      status: row.status,
      customData: row.custom_data
    };
  }

  protected mapEntityToRow(entity: Partial<CMSSection>): HomepageSectionRow {
    return {
      id: entity.id || `sec-${Date.now()}`,
      homepage_config_id: 'hp-cfg-1',
      type: entity.type || 'text',
      title: entity.title || '',
      subtitle: entity.subtitle,
      description: entity.description,
      cta_text: entity.ctaText,
      cta_url: entity.ctaUrl,
      bg_image_url: entity.bgImage,
      bg_color: entity.bgColor || '#0a0a0a',
      spacing: entity.spacing || 'medium',
      display_order: entity.order || 1,
      is_visible: entity.show ?? true,
      status: entity.status || 'published',
      custom_data: entity.customData || {},
      created_at: new Date().toISOString()
    };
  }

  public async getHomepageConfig(): Promise<HomepageConfig> {
    const seo = db.getTable('seo_metadata').find(s => s.entity_type === 'homepage');
    const sections = await this.findAll();
    sections.data.sort((a, b) => a.order - b.order);

    return {
      seoTitle: seo?.meta_title || 'Juli Club Lucknow',
      metaDescription: seo?.meta_description || '',
      canonicalUrl: seo?.canonical_url || 'https://lucknow.juliclub.in/',
      robots: seo?.robots_meta || 'index, follow',
      ogTitle: seo?.og_title || '',
      ogDescription: seo?.og_description || '',
      ogImage: seo?.og_image_url || '',
      twitterCard: seo?.twitter_card || 'summary_large_image',
      focusKeyword: seo?.focus_keyword || 'Call Girl Service Lucknow',
      schemaMarkup: seo?.schema_markup || '{}',
      status: 'published',
      sections: sections.data
    };
  }

  public async saveHomepageSections(sections: CMSSection[]): Promise<void> {
    const rows = sections.map(sec => this.mapEntityToRow(sec));
    db.setTable('homepage_sections', rows);
  }
}

export const homepageRepository = new HomepageRepository();
