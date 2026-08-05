// Profile Repository - Handles Companion Profile Entity persistence & relational joins

import { BaseRepository } from './base.repository';
import { ProfileRow } from '../db/types';
import { CompanionProfile, CategoryType, LucknowArea } from '../types';
import { db, DatabaseTables } from '../db/database';
import { QueryParams, PaginatedResponse } from '../dtos';

export class ProfileRepository extends BaseRepository<CompanionProfile, ProfileRow> {
  protected tableName: keyof DatabaseTables = 'profiles';

  protected mapRowToEntity(row: ProfileRow): CompanionProfile {
    // Relational join with profile_images
    const images = db.getTable('profile_images').filter(img => img.profile_id === row.id);
    const gallery = images.map(img => img.image_url);

    // Relational join with seo_metadata
    const seo = db.getTable('seo_metadata').find(s => s.entity_type === 'profile' && s.entity_id === row.id);

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      nickName: row.nick_name,
      title: row.title,
      category: row.category_name as CategoryType,
      age: row.age,
      height: row.height,
      weight: row.weight,
      bodyType: row.body_type,
      figure: row.figure,
      rate1Hour: row.rate_1hr,
      rateShort: row.rate_short,
      rateFull: row.rate_full,
      incall: row.incall,
      outcall: row.outcall,
      location: row.location_area as LucknowArea,
      city: 'Lucknow',
      phone: row.phone,
      whatsapp: row.whatsapp,
      telegram: row.telegram,
      verified: row.verified,
      pickupDropFree: row.pickup_drop_free,
      noAdvanceCashOnDelivery: row.no_advance_cod,
      image: row.avatar_url,
      gallery: gallery.length > 0 ? gallery : [row.avatar_url],
      shortIntro: row.short_intro,
      bio: row.bio,
      services: row.services || [],
      specialities: row.specialities || [],
      expectations: row.expectations,
      rules: row.rules,
      rating: row.rating,
      reviewsCount: row.reviews_count,
      isOnline: row.is_online,
      languages: row.languages || ['Hindi', 'English'],
      nationality: row.nationality,
      profession: row.profession,
      experience: row.experience,
      availability: row.availability,
      isActive: row.is_active,
      isFeatured: row.is_featured,
      seoTitle: seo?.meta_title || row.title,
      metaDescription: seo?.meta_description || row.short_intro,
      canonicalUrl: seo?.canonical_url,
      ogImage: seo?.og_image_url || row.avatar_url,
      focusKeyword: seo?.focus_keyword,
      robots: seo?.robots_meta,
      schemaMarkup: seo?.schema_markup,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  protected mapEntityToRow(entity: Partial<CompanionProfile>): ProfileRow {
    return {
      id: entity.id || `prof-${Date.now()}`,
      city_id: 'city-1',
      name: entity.name || 'Companion',
      slug: entity.slug || (entity.name ? entity.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `prof-${Date.now()}`),
      nick_name: entity.nickName,
      title: entity.title || '',
      category_id: 'cat-1',
      category_name: entity.category || 'Independent',
      age: entity.age || 22,
      height: entity.height || "5'5\"",
      weight: entity.weight,
      body_type: entity.bodyType,
      figure: entity.figure || '34B-26-36',
      rate_1hr: entity.rate1Hour || 3000,
      rate_short: entity.rateShort || 4000,
      rate_full: entity.rateFull || 10000,
      incall: entity.incall ?? true,
      outcall: entity.outcall ?? true,
      location_area: entity.location || 'Gomti Nagar',
      phone: entity.phone || '918726179837',
      whatsapp: entity.whatsapp || '918726179837',
      telegram: entity.telegram,
      verified: entity.verified ?? true,
      pickup_drop_free: entity.pickupDropFree ?? true,
      no_advance_cod: entity.noAdvanceCashOnDelivery ?? true,
      avatar_url: entity.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      short_intro: entity.shortIntro,
      bio: entity.bio || '',
      services: entity.services || [],
      specialities: entity.specialities || [],
      expectations: entity.expectations,
      rules: entity.rules,
      rating: entity.rating || 4.9,
      reviews_count: entity.reviewsCount || 10,
      is_online: entity.isOnline ?? true,
      languages: entity.languages || ['Hindi', 'English'],
      nationality: entity.nationality || 'Indian',
      profession: entity.profession,
      experience: entity.experience,
      availability: entity.availability || '24/7 Available',
      is_active: entity.isActive ?? true,
      is_featured: entity.isFeatured ?? true,
      created_at: entity.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  public async findBySlug(slug: string): Promise<CompanionProfile | null> {
    const rows = this.getRecords();
    const found = rows.find(r => r.slug === slug || r.id === slug);
    if (!found) return null;
    return this.mapRowToEntity(found);
  }

  public async filterProfiles(params: QueryParams): Promise<PaginatedResponse<CompanionProfile>> {
    let records = this.getRecords();

    if (params.search) {
      const term = params.search.toLowerCase();
      records = records.filter(r =>
        r.name.toLowerCase().includes(term) ||
        r.location_area.toLowerCase().includes(term) ||
        r.category_name.toLowerCase().includes(term) ||
        r.bio.toLowerCase().includes(term)
      );
    }

    if (params.categoryName && params.categoryName !== 'All') {
      records = records.filter(r => r.category_name === params.categoryName);
    }

    if (params.locationArea && params.locationArea !== 'All Lucknow') {
      records = records.filter(r => r.location_area === params.locationArea);
    }

    if (params.isFeatured !== undefined) {
      records = records.filter(r => r.is_featured === params.isFeatured);
    }

    const total = records.length;
    const page = params.page || 1;
    const limit = params.limit || 100;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = records.slice((page - 1) * limit, page * limit);

    return {
      data: paginated.map(r => this.mapRowToEntity(r)),
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }
}

export const profileRepository = new ProfileRepository();
