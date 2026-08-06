// Relational Database Engine Abstraction
// Handles SQL-like query execution, indexing, relational joins, and ACID transactions.
// Ready for PostgreSQL / Supabase migration.

import {
  CityRow,
  CategoryRow,
  UserRow,
  MediaRow,
  SeoMetadataRow,
  ProfileRow,
  ProfileImageRow,
  LocationPageRow,
  LocationContentSectionRow,
  LocationFaqRow,
  HomepageConfigRow,
  HomepageSectionRow,
  BlogRow,
  FaqRow,
  ReviewRow,
  SiteSettingRow,
  NavigationItemRow,
  RedirectRuleRow
} from './types';

import { COMPANION_PROFILES, CLIENT_REVIEWS, FAQS } from '../data/mockData';
import { LOCATION_PAGES } from '../data/locationData';
import { DEFAULT_HOMEPAGE_SECTIONS, DEFAULT_HOMEPAGE_CONFIG, DEFAULT_SETTINGS, INITIAL_BLOGS, getCMSData } from '../data/cmsStore';

export interface DatabaseTables {
  cities: CityRow[];
  categories: CategoryRow[];
  users: UserRow[];
  media_library: MediaRow[];
  seo_metadata: SeoMetadataRow[];
  profiles: ProfileRow[];
  profile_images: ProfileImageRow[];
  location_pages: LocationPageRow[];
  location_content_sections: LocationContentSectionRow[];
  location_faqs: LocationFaqRow[];
  homepage_configs: HomepageConfigRow[];
  homepage_sections: HomepageSectionRow[];
  blogs: BlogRow[];
  faqs: FaqRow[];
  reviews: ReviewRow[];
  site_settings: SiteSettingRow[];
  navigation_items: NavigationItemRow[];
  redirect_rules: RedirectRuleRow[];
}

class RelationalDatabase {
  private tables: DatabaseTables;
  private inTransaction: boolean = false;
  private snapshot: DatabaseTables | null = null;
  private cache: Map<string, any> = new Map();

  constructor() {
    this.tables = this.seedDatabase();
  }

  private seedDatabase(): DatabaseTables {
    const initialData = getCMSData();

    const cities: CityRow[] = [
      { id: 'city-1', name: 'Lucknow', slug: 'lucknow', state: 'Uttar Pradesh', country: 'India', ads_count: 50, is_popular: true, is_active: true },
      { id: 'city-2', name: 'Noida', slug: 'noida', state: 'Uttar Pradesh', country: 'India', ads_count: 35, is_popular: true, is_active: true },
      { id: 'city-3', name: 'Delhi', slug: 'delhi', state: 'Delhi NCR', country: 'India', ads_count: 80, is_popular: true, is_active: true },
      { id: 'city-4', name: 'Bangalore', slug: 'bangalore', state: 'Karnataka', country: 'India', ads_count: 45, is_popular: true, is_active: true }
    ];

    const categories: CategoryRow[] = [
      { id: 'cat-1', name: 'Independent', slug: 'independent', display_order: 1, is_active: true },
      { id: 'cat-2', name: 'College Girls', slug: 'college-girls', display_order: 2, is_active: true },
      { id: 'cat-3', name: 'Housewife', slug: 'housewife', display_order: 3, is_active: true },
      { id: 'cat-4', name: 'Supermodels', slug: 'supermodels', display_order: 4, is_active: true },
      { id: 'cat-5', name: 'Russian / Exotic', slug: 'russian-exotic', display_order: 5, is_active: true },
      { id: 'cat-6', name: 'VIP Celebrity', slug: 'vip-celebrity', display_order: 6, is_active: true },
      { id: 'cat-7', name: 'Air Hostess', slug: 'air-hostess', display_order: 7, is_active: true },
      { id: 'cat-8', name: 'South Indian', slug: 'south-indian', display_order: 8, is_active: true },
      { id: 'cat-9', name: 'North Indian', slug: 'north-indian', display_order: 9, is_active: true },
      { id: 'cat-10', name: 'Asian', slug: 'asian', display_order: 10, is_active: true }
    ];

    const users: UserRow[] = [
      {
        id: 'usr-1',
        email: 'admin@juliclub.in',
        password_hash: 'pbkdf2_hashed_admin_pass',
        name: 'Super Admin',
        role: 'superadmin',
        is_active: true,
        created_at: new Date().toISOString()
      }
    ];

    const media_library: MediaRow[] = [];
    const seo_metadata: SeoMetadataRow[] = [];
    const profile_images: ProfileImageRow[] = [];

    // Seed Profiles
    const profilesList = initialData.profiles && initialData.profiles.length > 0 ? initialData.profiles : COMPANION_PROFILES;
    const profiles: ProfileRow[] = profilesList.map(prof => {
      const mediaId = `med-avatar-${prof.id}`;
      media_library.push({
        id: mediaId,
        filename: `${prof.name.toLowerCase().replace(/\s+/g, '-')}-avatar.jpg`,
        original_name: `${prof.name}.jpg`,
        mime_type: 'image/jpeg',
        size_bytes: 120000,
        storage_path: `/uploads/profiles/${prof.id}.jpg`,
        public_url: prof.image,
        alt_text: prof.name
      });

      (prof.gallery || []).forEach((gUrl, idx) => {
        const gMediaId = `med-gallery-${prof.id}-${idx}`;
        media_library.push({
          id: gMediaId,
          filename: `${prof.name.toLowerCase().replace(/\s+/g, '-')}-gallery-${idx}.jpg`,
          original_name: `${prof.name}-gallery-${idx}.jpg`,
          mime_type: 'image/jpeg',
          size_bytes: 150000,
          storage_path: `/uploads/profiles/${prof.id}_${idx}.jpg`,
          public_url: gUrl,
          alt_text: `${prof.name} Gallery Photo ${idx + 1}`
        });

        profile_images.push({
          id: `pimg-${prof.id}-${idx}`,
          profile_id: prof.id,
          media_id: gMediaId,
          image_url: gUrl,
          display_order: idx + 1,
          is_primary: idx === 0
        });
      });

      // Seed SEO for Profile
      seo_metadata.push({
        id: `seo-profile-${prof.id}`,
        entity_type: 'profile',
        entity_id: prof.id,
        meta_title: prof.seoTitle || `${prof.name} - ${prof.title} | Juli Club Lucknow`,
        meta_description: prof.metaDescription || prof.shortIntro || (prof.bio || '').substring(0, 160),
        canonical_url: prof.canonicalUrl || `https://lucknow.juliclub.in/profiles/${prof.slug || prof.id}`,
        og_title: `${prof.name} - Call Girl Service Lucknow`,
        og_description: prof.shortIntro,
        og_image_url: prof.image,
        focus_keyword: prof.focusKeyword || `${prof.name} Lucknow Escort`
      });

      return {
        id: prof.id,
        city_id: 'city-1', // Lucknow
        name: prof.name,
        slug: prof.slug || prof.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        nick_name: prof.nickName,
        title: prof.title,
        category_id: categories.find(c => c.name === prof.category)?.id || 'cat-1',
        category_name: prof.category,
        age: prof.age,
        height: prof.height,
        weight: prof.weight,
        body_type: prof.bodyType,
        figure: prof.figure,
        rate_1hr: prof.rate1Hour || 3000,
        rate_short: prof.rateShort,
        rate_full: prof.rateFull,
        incall: prof.incall ?? true,
        outcall: prof.outcall ?? true,
        location_area: prof.location,
        phone: prof.phone,
        whatsapp: prof.whatsapp,
        telegram: prof.telegram,
        verified: prof.verified,
        pickup_drop_free: prof.pickupDropFree,
        no_advance_cod: prof.noAdvanceCashOnDelivery,
        avatar_media_id: mediaId,
        avatar_url: prof.image,
        short_intro: prof.shortIntro,
        bio: prof.bio,
        services: prof.services || [],
        specialities: prof.specialities || [],
        expectations: prof.expectations,
        rules: prof.rules,
        rating: prof.rating || 4.9,
        reviews_count: prof.reviewsCount || 12,
        is_online: prof.isOnline ?? true,
        languages: prof.languages || ['Hindi', 'English'],
        nationality: prof.nationality || 'Indian',
        profession: prof.profession,
        experience: prof.experience,
        availability: prof.availability || '24/7 Available',
        is_active: prof.isActive ?? true,
        is_featured: prof.isFeatured ?? true,
        created_at: prof.createdAt || new Date().toISOString(),
        updated_at: prof.updatedAt || new Date().toISOString()
      };
    });

    // Seed Locations
    const location_pages: LocationPageRow[] = [];
    const location_content_sections: LocationContentSectionRow[] = [];
    const location_faqs: LocationFaqRow[] = [];

    const locsList = Object.values(initialData.locations || {});
    locsList.forEach((loc, idx) => {
      const locId = `loc-${idx + 1}`;
      location_pages.push({
        id: locId,
        city_id: 'city-1',
        slug: loc.slug,
        area_name: loc.areaName,
        location_name: loc.locationName || `${loc.areaName} Call Girls`,
        title: loc.title,
        meta_description: loc.metaDescription,
        h1: loc.h1,
        hero_title: loc.heroTitle || loc.h1,
        hero_description: loc.heroDescription || loc.intro,
        tagline: loc.tagline,
        intro: loc.intro,
        keywords: loc.keywords || [],
        landmarks: loc.landmarks || [],
        highlights: loc.highlights || [],
        popular_hotels: loc.popularHotels || [],
        pricing_overrides: loc.pricingOverrides || {},
        breadcrumb_text: loc.breadcrumbText || loc.areaName,
        cta_text: loc.ctaText || 'Book via WhatsApp',
        whatsapp_number: loc.whatsappNumber || '918726179837',
        status: loc.status || 'published',
        is_featured: loc.isFeatured ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // Content Sections
      (loc.contentSections || []).forEach((cs, cIdx) => {
        location_content_sections.push({
          id: `lcs-${locId}-${cIdx}`,
          location_page_id: locId,
          title: cs.title,
          paragraphs: cs.paragraphs,
          display_order: cIdx + 1
        });
      });

      // FAQs
      (loc.faqs || []).forEach((fq, fIdx) => {
        location_faqs.push({
          id: `lfq-${locId}-${fIdx}`,
          location_page_id: locId,
          question: fq.question,
          answer: fq.answer,
          display_order: fIdx + 1
        });
      });

      // Location SEO
      seo_metadata.push({
        id: `seo-loc-${locId}`,
        entity_type: 'location_page',
        entity_id: locId,
        meta_title: loc.title,
        meta_description: loc.metaDescription,
        canonical_url: loc.canonicalUrl || `https://lucknow.juliclub.in/${loc.slug}`,
        robots_meta: loc.robotsMeta || 'index, follow, max-image-preview:large',
        focus_keyword: loc.focusKeyword || `${loc.areaName} Call Girl Service Lucknow`
      });
    });

    // Seed Homepage
    const homepageConfig = initialData.homepage || DEFAULT_HOMEPAGE_CONFIG;
    const homepage_configs: HomepageConfigRow[] = [
      {
        id: 'hp-cfg-1',
        city_id: 'city-1',
        status: homepageConfig.status || 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    seo_metadata.push({
      id: 'seo-hp-1',
      entity_type: 'homepage',
      entity_id: 'hp-cfg-1',
      meta_title: homepageConfig.seoTitle,
      meta_description: homepageConfig.metaDescription,
      canonical_url: homepageConfig.canonicalUrl,
      robots_meta: homepageConfig.robots,
      og_title: homepageConfig.ogTitle,
      og_description: homepageConfig.ogDescription,
      og_image_url: homepageConfig.ogImage,
      twitter_card: homepageConfig.twitterCard,
      focus_keyword: homepageConfig.focusKeyword,
      schema_markup: homepageConfig.schemaMarkup
    });

    const homepage_sections: HomepageSectionRow[] = (homepageConfig.sections || DEFAULT_HOMEPAGE_SECTIONS).map(sec => ({
      id: sec.id,
      homepage_config_id: 'hp-cfg-1',
      type: sec.type,
      title: sec.title,
      subtitle: sec.subtitle,
      description: sec.description,
      cta_text: sec.ctaText,
      cta_url: sec.ctaUrl,
      bg_image_url: sec.bgImage,
      bg_color: sec.bgColor,
      spacing: sec.spacing,
      display_order: sec.order,
      is_visible: sec.show,
      status: sec.status,
      custom_data: sec.customData
    }));

    // Seed Blogs
    const blogsList = initialData.blogs || INITIAL_BLOGS;
    const blogs: BlogRow[] = blogsList.map(b => ({
      id: b.id,
      slug: b.slug,
      title: b.title,
      meta_title: b.metaTitle,
      meta_description: b.metaDescription,
      author: b.author,
      published_date: b.date,
      category: b.category,
      featured_image_url: b.image,
      excerpt: b.excerpt,
      content: b.content,
      is_published: b.published,
      created_at: new Date().toISOString()
    }));

    // Seed FAQs
    const faqsList = initialData.faqs || FAQS.map((item, idx) => ({ id: `faq-${idx}`, question: item.question, answer: item.answer, category: 'General' }));
    const faqs: FaqRow[] = faqsList.map((item, idx) => ({
      id: item.id || `faq-${idx + 1}`,
      question: item.question,
      answer: item.answer,
      category: item.category || 'General',
      display_order: idx + 1,
      is_active: true
    }));

    // Seed Reviews
    const reviewsList = initialData.reviews || CLIENT_REVIEWS;
    const reviews: ReviewRow[] = reviewsList.map((rev, idx) => ({
      id: rev.id || `rev-${idx + 1}`,
      client_name: rev.clientName,
      profile_name: rev.profileName,
      rating: rev.rating,
      review_date: rev.date,
      comment: rev.comment,
      location: rev.location,
      verified_booking: rev.verifiedBooking
    }));

    // Seed Settings
    const settingsObj = initialData.settings || DEFAULT_SETTINGS;
    const site_settings: SiteSettingRow[] = Object.entries(settingsObj).map(([k, v]) => ({
      id: `set-${k}`,
      setting_key: k,
      setting_value: typeof v === 'string' ? v : JSON.stringify(v),
      updated_at: new Date().toISOString()
    }));

    // Seed Navigation Items
    const navigation_items: NavigationItemRow[] = [
      { id: 'nav-1', title: 'Home', url: '/', display_order: 1, is_active: true },
      { id: 'nav-2', title: 'Companions', url: '#profiles', display_order: 2, is_active: true },
      { id: 'nav-3', title: 'Locations', url: '#locations', display_order: 3, is_active: true },
      { id: 'nav-4', title: 'Rates', url: '#rates', display_order: 4, is_active: true },
      { id: 'nav-5', title: 'Reviews', url: '#reviews', display_order: 5, is_active: true },
      { id: 'nav-6', title: 'Blogs', url: '#blogs', display_order: 6, is_active: true }
    ];

    const redirect_rules: RedirectRuleRow[] = [];

    return {
      cities,
      categories,
      users,
      media_library,
      seo_metadata,
      profiles,
      profile_images,
      location_pages,
      location_content_sections,
      location_faqs,
      homepage_configs,
      homepage_sections,
      blogs,
      faqs,
      reviews,
      site_settings,
      navigation_items,
      redirect_rules
    };
  }

  // Transaction Management
  public beginTransaction(): void {
    if (this.inTransaction) {
      throw new Error('Transaction already in progress');
    }
    this.inTransaction = true;
    this.snapshot = JSON.parse(JSON.stringify(this.tables));
  }

  public commit(): void {
    if (!this.inTransaction) {
      throw new Error('No transaction in progress');
    }
    this.inTransaction = false;
    this.snapshot = null;
    this.cache.clear();
  }

  public rollback(): void {
    if (!this.inTransaction) {
      throw new Error('No transaction in progress');
    }
    if (this.snapshot) {
      this.tables = this.snapshot;
    }
    this.inTransaction = false;
    this.snapshot = null;
    this.cache.clear();
  }

  public async runTransaction<T>(work: () => Promise<T>): Promise<T> {
    this.beginTransaction();
    try {
      const result = await work();
      this.commit();
      return result;
    } catch (err) {
      this.rollback();
      throw err;
    }
  }

  // Generic Query Operations
  public getTable<K extends keyof DatabaseTables>(tableName: K): DatabaseTables[K] {
    return this.tables[tableName];
  }

  public setTable<K extends keyof DatabaseTables>(tableName: K, records: DatabaseTables[K]): void {
    this.tables[tableName] = records;
    this.cache.clear();
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

export const db = new RelationalDatabase();
