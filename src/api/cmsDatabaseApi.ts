// High-Level CMS Database API Facade
// Connects Supabase Cloud Database, Repositories, and Database layer to the React application context.

import { profileService } from '../services/ProfileService';
import { locationService } from '../services/LocationService';
import { homepageService } from '../services/HomepageService';
import { blogService } from '../services/BlogService';
import { settingsService } from '../services/SettingsService';
import { redirectService } from '../services/RedirectService';
import { faqRepository } from '../repositories/faq.repository';
import { reviewRepository } from '../repositories/review.repository';

import { CMSData, SiteSettings, HomepageConfig, BlogPost, getCMSData, saveCMSData } from '../data/cmsStore';
import { CompanionProfile, Review, LocationPageInfo, CMSSection, RedirectRule } from '../types';
import { db } from '../db/database';
import { getSupabaseClient } from '../lib/supabaseClient';

export class CMSDatabaseApi {
  public async loadFullCMSData(): Promise<CMSData> {
    const localData = getCMSData();
    const client = getSupabaseClient();

    if (client) {
      try {
        console.log('[Supabase API] Fetching CMS data from Supabase Cloud...');
        const [
          settingsRes,
          homepageRes,
          profilesRes,
          locationsRes,
          blogsRes,
          faqsRes,
          reviewsRes,
          redirectsRes
        ] = await Promise.all([
          client.from('site_settings').select('*'),
          client.from('homepage_config').select('*').eq('id', 'main').single(),
          client.from('profiles').select('*'),
          client.from('locations').select('*'),
          client.from('blogs').select('*'),
          client.from('faqs').select('*').order('display_order', { ascending: true }),
          client.from('reviews').select('*'),
          client.from('redirects').select('*')
        ]);

        let settings = localData.settings;
        if (settingsRes.data && settingsRes.data.length > 0) {
          const fetchedMap: Record<string, any> = {};
          settingsRes.data.forEach(r => {
            fetchedMap[r.key] = r.value;
          });
          settings = { ...localData.settings, ...fetchedMap };
        } else {
          // Seed site_settings to Supabase
          console.log('[Supabase API] Seeding site_settings into empty Supabase database...');
          const upsertRows = Object.entries(localData.settings).map(([key, value]) => ({
            key,
            value,
            updated_at: new Date().toISOString()
          }));
          const { error } = await client.from('site_settings').upsert(upsertRows, { onConflict: 'key' });
          if (error) console.warn('[Supabase Sync Notice - site_settings]:', error.message || error);
        }

        let homepage = localData.homepage;
        if (homepageRes.data && homepageRes.data.data) {
          homepage = { ...localData.homepage, ...homepageRes.data.data };
        } else {
          // Seed homepage_config to Supabase
          console.log('[Supabase API] Seeding homepage_config into empty Supabase database...');
          const { error } = await client.from('homepage_config').upsert({
            id: 'main',
            data: localData.homepage,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
          if (error) console.warn('[Supabase Sync Notice - homepage_config]:', error.message || error);
        }

        let profiles = localData.profiles;
        if (profilesRes.data && profilesRes.data.length > 0) {
          profiles = profilesRes.data.map(r => r.data || r);
        } else if (localData.profiles && localData.profiles.length > 0) {
          // Seed profiles to Supabase
          console.log('[Supabase API] Seeding profiles into empty Supabase database...');
          const rows = localData.profiles.map(p => ({
            id: p.id,
            slug: p.slug || p.id,
            name: p.name,
            data: p,
            updated_at: new Date().toISOString()
          }));
          const { error } = await client.from('profiles').upsert(rows, { onConflict: 'id' });
          if (error) console.warn('[Supabase Sync Notice - profiles]:', error.message || error);
        }

        let locations = localData.locations;
        if (locationsRes.data && locationsRes.data.length > 0) {
          const locMap: Record<string, LocationPageInfo> = {};
          locationsRes.data.forEach(r => {
            const locObj = r.data || r;
            if (locObj && locObj.slug) {
              locMap[locObj.slug] = locObj;
            }
          });
          if (Object.keys(locMap).length > 0) {
            locations = locMap;
          }
        } else if (localData.locations && Object.keys(localData.locations).length > 0) {
          // Seed locations to Supabase
          console.log('[Supabase API] Seeding locations into empty Supabase database...');
          const rows = Object.values(localData.locations).map(loc => ({
            slug: loc.slug,
            name: loc.areaName,
            data: loc,
            updated_at: new Date().toISOString()
          }));
          const { error } = await client.from('locations').upsert(rows, { onConflict: 'slug' });
          if (error) console.warn('[Supabase Sync Notice - locations]:', error.message || error);
        }

        let blogs = localData.blogs;
        if (blogsRes.data && blogsRes.data.length > 0) {
          blogs = blogsRes.data.map(r => r.data || r);
        } else if (localData.blogs && localData.blogs.length > 0) {
          // Seed blogs to Supabase
          console.log('[Supabase API] Seeding blogs into empty Supabase database...');
          const rows = localData.blogs.map(b => ({
            id: b.id,
            slug: b.slug,
            title: b.title,
            data: b,
            updated_at: new Date().toISOString()
          }));
          const { error } = await client.from('blogs').upsert(rows, { onConflict: 'id' });
          if (error) console.warn('[Supabase Sync Notice - blogs]:', error.message || error);
        }

        let faqs = localData.faqs;
        if (faqsRes.data && faqsRes.data.length > 0) {
          faqs = faqsRes.data.map(r => r.data || r);
        } else if (localData.faqs && localData.faqs.length > 0) {
          // Seed FAQs to Supabase
          console.log('[Supabase API] Seeding faqs into empty Supabase database...');
          const rows = localData.faqs.map((f, idx) => ({
            id: f.id || `faq-${idx}`,
            question: f.question,
            answer: f.answer,
            category: f.category || 'General',
            display_order: idx + 1,
            data: f,
            updated_at: new Date().toISOString()
          }));
          const { error } = await client.from('faqs').upsert(rows, { onConflict: 'id' });
          if (error) console.warn('[Supabase Sync Notice - faqs]:', error.message || error);
        }

        let reviews = localData.reviews;
        if (reviewsRes.data && reviewsRes.data.length > 0) {
          reviews = reviewsRes.data.map(r => r.data || r);
        } else if (localData.reviews && localData.reviews.length > 0) {
          // Seed reviews to Supabase
          console.log('[Supabase API] Seeding reviews into empty Supabase database...');
          const rows = localData.reviews.map(r => ({
            id: r.id || `rev-${Date.now()}`,
            data: r,
            created_at: new Date().toISOString()
          }));
          const { error } = await client.from('reviews').upsert(rows, { onConflict: 'id' });
          if (error) console.warn('[Supabase Sync Notice - reviews]:', error.message || error);
        }

        let redirects = localData.redirects;
        if (redirectsRes.data && redirectsRes.data.length > 0) {
          redirects = redirectsRes.data.map(r => ({
            id: r.id,
            fromSlug: r.from_path || (r as any).from || '',
            toTarget: r.to_path || (r as any).to || '',
            statusCode: (r.type || 301) as any,
            isActive: true
          }));
        } else if (localData.redirects && localData.redirects.length > 0) {
          // Seed redirects to Supabase
          console.log('[Supabase API] Seeding redirects into empty Supabase database...');
          const rows = localData.redirects.map((r: any, idx) => ({
            id: r.id || `red-${idx}`,
            from_path: r.fromSlug || r.from || '',
            to_path: r.toTarget || r.to || '',
            type: r.statusCode || r.type || 301,
            created_at: new Date().toISOString()
          }));
          const { error } = await client.from('redirects').upsert(rows, { onConflict: 'id' });
          if (error) console.warn('[Supabase Sync Notice - redirects]:', error.message || error);
        }

        const fullData: CMSData = {
          settings,
          homepage,
          profiles,
          locations,
          blogs,
          faqs,
          reviews,
          redirects
        };

        saveCMSData(fullData);
        return fullData;
      } catch (err) {
        console.warn('[Supabase API] Error reading from Supabase, falling back to local store:', err);
      }
    } else {
      console.warn('[Supabase API] Supabase is not configured or client is null.');
    }

    // Local Repository Fallback
    const settings = await settingsService.getSettings();
    const homepage = await homepageService.getHomepageConfig();
    const profilesRes = await profileService.getProfiles({ limit: 1000 });
    const locationsRes = await locationService.getAllLocations({ limit: 1000 });
    const blogs = await blogService.getBlogs();
    const faqsRes = await faqRepository.findAll({ limit: 1000 });
    const reviewsRes = await reviewRepository.findAll({ limit: 1000 });
    const redirects = await redirectService.getRedirects();

    const locationsMap: Record<string, LocationPageInfo> = {};
    locationsRes.data.forEach(loc => {
      locationsMap[loc.slug] = loc;
    });

    return {
      settings: { ...localData.settings, ...settings },
      homepage: { ...localData.homepage, ...homepage },
      profiles: profilesRes.data.length > 0 ? profilesRes.data : localData.profiles,
      reviews: reviewsRes.data.length > 0 ? reviewsRes.data : localData.reviews,
      faqs: faqsRes.data.length > 0 ? faqsRes.data : localData.faqs,
      locations: Object.keys(locationsMap).length > 0 ? locationsMap : localData.locations,
      redirects: redirects.length > 0 ? redirects : localData.redirects,
      blogs: blogs.length > 0 ? blogs : localData.blogs
    };
  }

  public async updateSettings(newSettings: Partial<SiteSettings>): Promise<SiteSettings> {
    const updatedLocal = await settingsService.updateSettings(newSettings);
    const client = getSupabaseClient();

    if (!client) {
      const msg = 'Supabase database client is unavailable. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
      console.error('[Supabase Save Failure - site_settings]:', msg);
      throw new Error(msg);
    }

    try {
      const upsertRows = Object.entries(newSettings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }));
      console.log('[Supabase Write Request - site_settings]: Upserting', upsertRows.length, 'keys...');
      const { data, error } = await client.from('site_settings').upsert(upsertRows, { onConflict: 'key' });
      if (error) {
        console.error('[Supabase Save Failure - site_settings]:', error);
        throw new Error(`Supabase write failed on site_settings: ${error.message}`);
      }
      console.log('[Supabase Save Success - site_settings]: Database write confirmed!', data);
    } catch (err) {
      console.error('[Supabase API] Error updating settings:', err);
      throw err;
    }

    return updatedLocal;
  }

  public async updateHomepage(newHomepage: Partial<HomepageConfig>): Promise<HomepageConfig> {
    const updatedLocal = await homepageService.updateHomepageConfig(newHomepage);
    const client = getSupabaseClient();

    if (!client) {
      const msg = 'Supabase database client is unavailable. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
      console.error('[Supabase Save Failure - homepage_config]:', msg);
      throw new Error(msg);
    }

    try {
      console.log('[Supabase Write Request - homepage_config]: Upserting record with id main...', updatedLocal);
      const { data, error } = await client.from('homepage_config').upsert({
        id: 'main',
        data: updatedLocal,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
      if (error) {
        console.error('[Supabase Save Failure - homepage_config]:', error);
        throw new Error(`Supabase write failed on homepage_config: ${error.message}`);
      }
      console.log('[Supabase Save Success - homepage_config]: Row main created/updated in Supabase!', data);
    } catch (err) {
      console.error('[Supabase API] Error updating homepage:', err);
      throw err;
    }

    return updatedLocal;
  }

  public async updateHomepageSections(sections: CMSSection[]): Promise<CMSSection[]> {
    const updatedLocal = await homepageService.updateSections(sections);
    const client = getSupabaseClient();

    if (!client) {
      const msg = 'Supabase database client is unavailable. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
      console.error('[Supabase Save Failure - homepage_sections]:', msg);
      throw new Error(msg);
    }

    try {
      const fullHomepage = await homepageService.getHomepageConfig();
      console.log('[Supabase Write Request - homepage_sections]: Upserting main sections...', sections.length);
      const { data, error } = await client.from('homepage_config').upsert({
        id: 'main',
        data: { ...fullHomepage, sections },
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
      if (error) {
        console.error('[Supabase Save Failure - homepage_sections]:', error);
        throw new Error(`Supabase write failed on homepage_sections: ${error.message}`);
      }
      console.log('[Supabase Save Success - homepage_sections]: Sections updated in Supabase!', data);
    } catch (err) {
      console.error('[Supabase API] Error updating homepage sections:', err);
      throw err;
    }

    return updatedLocal;
  }

  public async updateProfiles(profiles: CompanionProfile[]): Promise<CompanionProfile[]> {
    const localRes = await db.runTransaction(async () => {
      for (const prof of profiles) {
        const existing = await profileService.getProfileBySlug(prof.slug || prof.id);
        if (existing) {
          await profileService.updateProfile(existing.id, prof);
        } else {
          await profileService.createProfile(prof as any);
        }
      }
      const updated = await profileService.getProfiles({ limit: 1000 });
      return updated.data;
    });

    const client = getSupabaseClient();
    if (!client) {
      const msg = 'Supabase database client is unavailable. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
      console.error('[Supabase Save Failure - profiles]:', msg);
      throw new Error(msg);
    }

    try {
      const rows = profiles.map(p => ({
        id: p.id,
        slug: p.slug || p.id,
        name: p.name,
        data: p,
        updated_at: new Date().toISOString()
      }));
      console.log('[Supabase Write Request - profiles]: Upserting', rows.length, 'profiles...');
      const { data, error } = await client.from('profiles').upsert(rows, { onConflict: 'id' });
      if (error) {
        console.error('[Supabase Save Failure - profiles]:', error);
        throw new Error(`Supabase write failed on profiles: ${error.message}`);
      }
      console.log('[Supabase Save Success - profiles]: Database write confirmed!', data);
    } catch (err) {
      console.error('[Supabase API] Error updating profiles:', err);
      throw err;
    }

    return localRes;
  }

  public async updateReviews(reviews: Review[]): Promise<Review[]> {
    const localRes = await db.runTransaction(async () => {
      reviewRepository.setRecords(reviews.map(r => ({
        id: r.id || `rev-${Date.now()}`,
        client_name: r.clientName,
        profile_name: r.profileName,
        rating: r.rating,
        review_date: r.date,
        comment: r.comment,
        location: r.location,
        verified_booking: r.verifiedBooking,
        created_at: new Date().toISOString()
      })));
      const res = await reviewRepository.findAll();
      return res.data;
    });

    const client = getSupabaseClient();
    if (!client) {
      const msg = 'Supabase database client is unavailable. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
      console.error('[Supabase Save Failure - reviews]:', msg);
      throw new Error(msg);
    }

    try {
      const rows = reviews.map(r => ({
        id: r.id || `rev-${Date.now()}`,
        data: r,
        created_at: new Date().toISOString()
      }));
      console.log('[Supabase Write Request - reviews]: Upserting', rows.length, 'reviews...');
      const { data, error } = await client.from('reviews').upsert(rows, { onConflict: 'id' });
      if (error) {
        console.error('[Supabase Save Failure - reviews]:', error);
        throw new Error(`Supabase write failed on reviews: ${error.message}`);
      }
      console.log('[Supabase Save Success - reviews]: Database write confirmed!', data);
    } catch (err) {
      console.error('[Supabase API] Error updating reviews:', err);
      throw err;
    }

    return localRes;
  }

  public async updateFAQs(faqs: { id: string; question: string; answer: string; category: string }[]): Promise<{ id: string; question: string; answer: string; category: string }[]> {
    const localRes = await db.runTransaction(async () => {
      faqRepository.setRecords(faqs.map((f, idx) => ({
        id: f.id || `faq-${idx}`,
        question: f.question,
        answer: f.answer,
        category: f.category || 'General',
        display_order: idx + 1,
        is_active: true,
        created_at: new Date().toISOString()
      })));
      const res = await faqRepository.findAll();
      return res.data;
    });

    const client = getSupabaseClient();
    if (!client) {
      const msg = 'Supabase database client is unavailable. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
      console.error('[Supabase Save Failure - faqs]:', msg);
      throw new Error(msg);
    }

    try {
      const rows = faqs.map((f, idx) => ({
        id: f.id || `faq-${idx}`,
        question: f.question,
        answer: f.answer,
        category: f.category || 'General',
        display_order: idx + 1,
        data: f,
        updated_at: new Date().toISOString()
      }));
      console.log('[Supabase Write Request - faqs]: Upserting', rows.length, 'FAQs...');
      const { data, error } = await client.from('faqs').upsert(rows, { onConflict: 'id' });
      if (error) {
        console.error('[Supabase Save Failure - faqs]:', error);
        throw new Error(`Supabase write failed on faqs: ${error.message}`);
      }
      console.log('[Supabase Save Success - faqs]: Database write confirmed!', data);
    } catch (err) {
      console.error('[Supabase API] Error updating FAQs:', err);
      throw err;
    }

    return localRes;
  }

  public async updateLocations(locationsMap: Record<string, LocationPageInfo>): Promise<Record<string, LocationPageInfo>> {
    const localRes = await db.runTransaction(async () => {
      for (const [slug, loc] of Object.entries(locationsMap)) {
        const existing = await locationService.getLocationBySlug(slug);
        if (existing) {
          await locationService.updateLocationPage(slug, loc);
        } else {
          await locationService.createLocationPage(loc as any);
        }
      }
      const allLocs = await locationService.getAllLocations({ limit: 1000 });
      const resMap: Record<string, LocationPageInfo> = {};
      allLocs.data.forEach(l => { resMap[l.slug] = l; });
      return resMap;
    });

    const client = getSupabaseClient();
    if (!client) {
      const msg = 'Supabase database client is unavailable. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
      console.error('[Supabase Save Failure - locations]:', msg);
      throw new Error(msg);
    }

    try {
      const rows = Object.values(locationsMap).map(loc => ({
        slug: loc.slug,
        name: loc.areaName,
        data: loc,
        updated_at: new Date().toISOString()
      }));
      console.log('[Supabase Write Request - locations]: Upserting', rows.length, 'locations...');
      const { data, error } = await client.from('locations').upsert(rows, { onConflict: 'slug' });
      if (error) {
        console.error('[Supabase Save Failure - locations]:', error);
        throw new Error(`Supabase write failed on locations: ${error.message}`);
      }
      console.log('[Supabase Save Success - locations]: Database write confirmed!', data);
    } catch (err) {
      console.error('[Supabase API] Error updating locations:', err);
      throw err;
    }

    return localRes;
  }

  public async addLocationPage(location: LocationPageInfo): Promise<LocationPageInfo> {
    const localRes = await locationService.createLocationPage(location as any);
    const client = getSupabaseClient();

    if (!client) {
      const msg = 'Supabase database client is unavailable. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
      console.error('[Supabase Save Failure - addLocationPage]:', msg);
      throw new Error(msg);
    }

    try {
      console.log('[Supabase Write Request - addLocationPage]: Upserting slug', location.slug);
      const { data, error } = await client.from('locations').upsert({
        slug: location.slug,
        name: location.areaName,
        data: location,
        updated_at: new Date().toISOString()
      }, { onConflict: 'slug' });
      if (error) {
        console.error('[Supabase Save Failure - add location]:', error);
        throw new Error(`Supabase write failed on locations: ${error.message}`);
      }
      console.log('[Supabase Save Success - addLocationPage]: Location added to Supabase!', data);
    } catch (err) {
      console.error('[Supabase API] Error adding location page:', err);
      throw err;
    }

    return localRes;
  }

  public async deleteLocationPage(slug: string): Promise<boolean> {
    const localRes = await locationService.deleteLocationPage(slug);
    const client = getSupabaseClient();

    if (!client) {
      const msg = 'Supabase database client is unavailable. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
      console.error('[Supabase Save Failure - deleteLocationPage]:', msg);
      throw new Error(msg);
    }

    try {
      console.log('[Supabase Write Request - deleteLocationPage]: Deleting slug', slug);
      const { error } = await client.from('locations').delete().eq('slug', slug);
      if (error) {
        console.error('[Supabase Save Failure - delete location]:', error);
        throw new Error(`Supabase write failed on locations: ${error.message}`);
      }
      console.log('[Supabase Save Success - deleteLocationPage]: Location deleted from Supabase!');
    } catch (err) {
      console.error('[Supabase API] Error deleting location page:', err);
      throw err;
    }

    return localRes;
  }

  public async updateRedirects(redirects: RedirectRule[]): Promise<RedirectRule[]> {
    const localRes = await redirectService.updateRedirects(redirects);
    const client = getSupabaseClient();

    if (!client) {
      const msg = 'Supabase database client is unavailable. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
      console.error('[Supabase Save Failure - redirects]:', msg);
      throw new Error(msg);
    }

    try {
      const rows = redirects.map((r: any, idx) => ({
        id: r.id || `red-${idx}`,
        from_path: r.fromSlug || r.from || '',
        to_path: r.toTarget || r.to || '',
        type: r.statusCode || r.type || 301,
        created_at: new Date().toISOString()
      }));
      console.log('[Supabase Write Request - redirects]: Upserting', rows.length, 'redirects...');
      const { data, error } = await client.from('redirects').upsert(rows, { onConflict: 'id' });
      if (error) {
        console.error('[Supabase Save Failure - redirects]:', error);
        throw new Error(`Supabase write failed on redirects: ${error.message}`);
      }
      console.log('[Supabase Save Success - redirects]: Database write confirmed!', data);
    } catch (err) {
      console.error('[Supabase API] Error updating redirects:', err);
      throw err;
    }

    return localRes;
  }

  public async updateBlogs(blogs: BlogPost[]): Promise<BlogPost[]> {
    const localRes = await db.runTransaction(async () => {
      for (const b of blogs) {
        const existing = await blogService.getBlogBySlug(b.slug);
        if (existing) {
          await blogService.updateBlog(existing.id, b);
        } else {
          await blogService.createBlog(b);
        }
      }
      return blogService.getBlogs();
    });

    const client = getSupabaseClient();
    if (!client) {
      const msg = 'Supabase database client is unavailable. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
      console.error('[Supabase Save Failure - blogs]:', msg);
      throw new Error(msg);
    }

    try {
      const rows = blogs.map(b => ({
        id: b.id,
        slug: b.slug,
        title: b.title,
        data: b,
        updated_at: new Date().toISOString()
      }));
      console.log('[Supabase Write Request - blogs]: Upserting', rows.length, 'blogs...');
      const { data, error } = await client.from('blogs').upsert(rows, { onConflict: 'id' });
      if (error) {
        console.error('[Supabase Save Failure - blogs]:', error);
        throw new Error(`Supabase write failed on blogs: ${error.message}`);
      }
      console.log('[Supabase Save Success - blogs]: Database write confirmed!', data);
    } catch (err) {
      console.error('[Supabase API] Error updating blogs:', err);
      throw err;
    }

    return localRes;
  }

  public async uploadMediaAsset(file: File): Promise<{ url: string; filename: string }> {
    const client = getSupabaseClient();
    if (client) {
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { data, error } = await client.storage.from('cms_media').upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

      if (error) {
        console.error('[Supabase Storage Upload Error]:', error);
        throw new Error(`Storage upload failed: ${error.message}`);
      }

      const { data: publicUrlData } = client.storage.from('cms_media').getPublicUrl(data.path);
      const url = publicUrlData.publicUrl;

      const { error: dbError } = await client.from('media_library').insert({
        id: `med-${Date.now()}`,
        filename: file.name,
        url,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type,
        created_at: new Date().toISOString()
      });

      if (dbError) {
        console.error('[Supabase Media Library Insert Error]:', dbError);
      }

      return { url, filename: file.name };
    }

    throw new Error('Supabase storage is not configured.');
  }
}

export const cmsDatabaseApi = new CMSDatabaseApi();
