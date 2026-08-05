// Location Repository - Manages Location Pages with content sections and FAQs

import { BaseRepository } from './base.repository';
import { LocationPageRow } from '../db/types';
import { LocationPageInfo } from '../types';
import { db, DatabaseTables } from '../db/database';

export class LocationRepository extends BaseRepository<LocationPageInfo, LocationPageRow> {
  protected tableName: keyof DatabaseTables = 'location_pages';

  protected mapRowToEntity(row: LocationPageRow): LocationPageInfo {
    const contentSections = db
      .getTable('location_content_sections')
      .filter(s => s.location_page_id === row.id)
      .sort((a, b) => a.display_order - b.display_order)
      .map(cs => ({ title: cs.title, paragraphs: cs.paragraphs }));

    const faqs = db
      .getTable('location_faqs')
      .filter(f => f.location_page_id === row.id)
      .sort((a, b) => a.display_order - b.display_order)
      .map(f => ({ question: f.question, answer: f.answer }));

    const seo = db
      .getTable('seo_metadata')
      .find(s => s.entity_type === 'location_page' && s.entity_id === row.id);

    return {
      slug: row.slug,
      areaName: row.area_name,
      locationName: row.location_name || `${row.area_name} Call Girls`,
      title: row.title,
      metaDescription: row.meta_description,
      h1: row.h1,
      heroTitle: row.hero_title,
      heroDescription: row.hero_description,
      heroImage: row.hero_image_url,
      tagline: row.tagline,
      intro: row.intro,
      keywords: row.keywords || [],
      landmarks: row.landmarks || [],
      highlights: row.highlights || [],
      popularHotels: row.popular_hotels || [],
      pricingOverrides: row.pricing_overrides || {},
      canonicalUrl: seo?.canonical_url || `https://lucknow.juliclub.in/${row.slug}`,
      robotsMeta: seo?.robots_meta || 'index, follow',
      focusKeyword: seo?.focus_keyword,
      ogTitle: seo?.og_title || row.title,
      ogDescription: seo?.og_description || row.meta_description,
      ogImage: seo?.og_image_url || row.hero_image_url,
      twitterCard: seo?.twitter_card || 'summary_large_image',
      schemaMarkup: seo?.schema_markup,
      breadcrumbText: row.breadcrumb_text,
      ctaText: row.cta_text,
      whatsappNumber: row.whatsapp_number,
      status: row.status,
      scheduledAt: row.scheduled_at,
      isFeatured: row.is_featured,
      contentSections,
      faqs,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  protected mapEntityToRow(entity: Partial<LocationPageInfo>): LocationPageRow {
    return {
      id: `loc-page-${entity.slug || Date.now()}`,
      city_id: 'city-1',
      slug: entity.slug || `location-${Date.now()}`,
      area_name: entity.areaName || 'Lucknow Area',
      location_name: entity.locationName,
      title: entity.title || '',
      meta_description: entity.metaDescription || '',
      h1: entity.h1 || '',
      hero_title: entity.heroTitle,
      hero_description: entity.heroDescription,
      hero_image_url: entity.heroImage,
      tagline: entity.tagline || '100% Cash on Delivery',
      intro: entity.intro || '',
      keywords: entity.keywords || [],
      landmarks: entity.landmarks || [],
      highlights: entity.highlights || [],
      popular_hotels: entity.popularHotels || [],
      pricing_overrides: entity.pricingOverrides || {},
      breadcrumb_text: entity.breadcrumbText,
      cta_text: entity.ctaText,
      whatsapp_number: entity.whatsappNumber || '918726179837',
      status: entity.status || 'published',
      scheduled_at: entity.scheduledAt,
      is_featured: entity.isFeatured ?? true,
      created_at: entity.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  public async findBySlug(slug: string): Promise<LocationPageInfo | null> {
    const rows = this.getRecords();
    const found = rows.find(r => r.slug === slug);
    if (!found) return null;
    return this.mapRowToEntity(found);
  }
}

export const locationRepository = new LocationRepository();
