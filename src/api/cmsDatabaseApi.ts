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
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export class CMSDatabaseApi {
  public async loadFullCMSData(): Promise<CMSData> {
    const localData = getCMSData();

    if (isSupabaseConfigured() && supabase) {
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
          supabase.from('site_settings').select('*'),
          supabase.from('homepage_config').select('*').eq('id', 'main').single(),
          supabase.from('profiles').select('*'),
          supabase.from('locations').select('*'),
          supabase.from('blogs').select('*'),
          supabase.from('faqs').select('*').order('display_order', { ascending: true }),
          supabase.from('reviews').select('*'),
          supabase.from('redirects').select('*')
        ]);

        let settings = localData.settings;
        if (settingsRes.data && settingsRes.data.length > 0) {
          const fetchedMap: Record<string, any> = {};
          settingsRes.data.forEach(r => {
            fetchedMap[r.key] = r.value;
          });
          settings = { ...localData.settings, ...fetchedMap };
        } else {
          // Auto-seed site settings
          const upsertRows = Object.entries(localData.settings).map(([key, value]) => ({
            key,
            value,
            updated_at: new Date().toISOString()
          }));
          await supabase.from('site_settings').upsert(upsertRows, { onConflict: 'key' }).catch(e => console.error('Seed error:', e));
        }

        let homepage = localData.homepage;
        if (homepageRes.data && homepageRes.data.data) {
          homepage = { ...localData.homepage, ...homepageRes.data.data };
        } else {
          // Auto-seed homepage config
          await supabase.from('homepage_config').upsert({
            id: 'main',
            data: localData.homepage,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' }).catch(e => console.error('Seed error:', e));
        }

        let profiles = localData.profiles;
        if (profilesRes.data && profilesRes.data.length > 0) {
          profiles = profilesRes.data.map(r => r.data || r);
        } else if (localData.profiles && localData.profiles.length > 0) {
          // Auto-seed profiles
          const rows = localData.profiles.map(p => ({
            id: p.id,
            slug: p.slug || p.id,
            name: p.name,
            data: p,
            updated_at: new Date().toISOString()
          }));
          await supabase.from('profiles').upsert(rows, { onConflict: 'id' }).catch(e => console.error('Seed error:', e));
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
          // Auto-seed locations
          const rows = Object.values(localData.locations).map(loc => ({
            slug: loc.slug,
            name: loc.areaName,
            data: loc,
            updated_at: new Date().toISOString()
          }));
          await supabase.from('locations').upsert(rows, { onConflict: 'slug' }).catch(e => console.error('Seed error:', e));
        }

        let blogs = localData.blogs;
        if (blogsRes.data && blogsRes.data.length > 0) {
          blogs = blogsRes.data.map(r => r.data || r);
        } else if (localData.blogs && localData.blogs.length > 0) {
          // Auto-seed blogs
          const rows = localData.blogs.map(b => ({
            id: b.id,
            slug: b.slug,
            title: b.title,
            data: b,
            updated_at: new Date().toISOString()
          }));
          await supabase.from('blogs').upsert(rows, { onConflict: 'id' }).catch(e => console.error('Seed error:', e));
        }

        let faqs = localData.faqs;
        if (faqsRes.data && faqsRes.data.length > 0) {
          faqs = faqsRes.data.map(r => r.data || r);
        } else if (localData.faqs && localData.faqs.length > 0) {
          // Auto-seed FAQs
          const rows = localData.faqs.map((f, idx) => ({
            id: f.id || `faq-${idx}`,
            question: f.question,
            answer: f.answer,
            category: f.category || 'General',
            display_order: idx + 1,
            data: f,
            updated_at: new Date().toISOString()
          }));
          await supabase.from('faqs').upsert(rows, { onConflict: 'id' }).catch(e => console.error('Seed error:', e));
        }

        let reviews = localData.reviews;
        if (reviewsRes.data && reviewsRes.data.length > 0) {
          reviews = reviewsRes.data.map(r => r.data || r);
        } else if (localData.reviews && localData.reviews.length > 0) {
          // Auto-seed reviews
          const rows = localData.reviews.map(r => ({
            id: r.id || `rev-${Date.now()}`,
            data: r,
            created_at: new Date().toISOString()
          }));
          await supabase.from('reviews').upsert(rows, { onConflict: 'id' }).catch(e => console.error('Seed error:', e));
        }

        let redirects = localData.redirects;
        if (redirectsRes.data && redirectsRes.data.length > 0) {
          redirects = redirectsRes.data.map(r => ({
            id: r.id,
            from: r.from_path,
            to: r.to_path,
            type: r.type
          }));
        } else if (localData.redirects && localData.redirects.length > 0) {
          // Auto-seed redirects
          const rows = localData.redirects.map((r, idx) => ({
            id: r.id || `red-${idx}`,
            from_path: r.from,
            to_path: r.to,
            type: r.type || 301,
            created_at: new Date().toISOString()
          }));
          await supabase.from('redirects').upsert(rows, { onConflict: 'id' }).catch(e => console.error('Seed error:', e));
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

    if (isSupabaseConfigured() && supabase) {
      try {
        const upsertRows = Object.entries(newSettings).map(([key, value]) => ({
          key,
          value,
          updated_at: new Date().toISOString()
        }));
        await supabase.from('site_settings').upsert(upsertRows, { onConflict: 'key' });
      } catch (err) {
        console.error('[Supabase API] Error updating settings:', err);
      }
    }

    return updatedLocal;
  }

  public async updateHomepage(newHomepage: Partial<HomepageConfig>): Promise<HomepageConfig> {
    const updatedLocal = await homepageService.updateHomepageConfig(newHomepage);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('homepage_config').upsert({
          id: 'main',
          data: updatedLocal,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      } catch (err) {
        console.error('[Supabase API] Error updating homepage:', err);
      }
    }

    return updatedLocal;
  }

  public async updateHomepageSections(sections: CMSSection[]): Promise<CMSSection[]> {
    const updatedLocal = await homepageService.updateSections(sections);

    if (isSupabaseConfigured() && supabase) {
      try {
        const fullHomepage = await homepageService.getHomepageConfig();
        await supabase.from('homepage_config').upsert({
          id: 'main',
          data: { ...fullHomepage, sections },
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      } catch (err) {
        console.error('[Supabase API] Error updating homepage sections:', err);
      }
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

    if (isSupabaseConfigured() && supabase) {
      try {
        const rows = profiles.map(p => ({
          id: p.id,
          slug: p.slug || p.id,
          name: p.name,
          data: p,
          updated_at: new Date().toISOString()
        }));
        await supabase.from('profiles').upsert(rows, { onConflict: 'id' });
      } catch (err) {
        console.error('[Supabase API] Error updating profiles:', err);
      }
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

    if (isSupabaseConfigured() && supabase) {
      try {
        const rows = reviews.map(r => ({
          id: r.id || `rev-${Date.now()}`,
          data: r,
          created_at: new Date().toISOString()
        }));
        await supabase.from('reviews').upsert(rows, { onConflict: 'id' });
      } catch (err) {
        console.error('[Supabase API] Error updating reviews:', err);
      }
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

    if (isSupabaseConfigured() && supabase) {
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
        await supabase.from('faqs').upsert(rows, { onConflict: 'id' });
      } catch (err) {
        console.error('[Supabase API] Error updating FAQs:', err);
      }
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

    if (isSupabaseConfigured() && supabase) {
      try {
        const rows = Object.values(locationsMap).map(loc => ({
          slug: loc.slug,
          name: loc.areaName,
          data: loc,
          updated_at: new Date().toISOString()
        }));
        await supabase.from('locations').upsert(rows, { onConflict: 'slug' });
      } catch (err) {
        console.error('[Supabase API] Error updating locations:', err);
      }
    }

    return localRes;
  }

  public async addLocationPage(location: LocationPageInfo): Promise<LocationPageInfo> {
    const localRes = await locationService.createLocationPage(location as any);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('locations').upsert({
          slug: location.slug,
          name: location.areaName,
          data: location,
          updated_at: new Date().toISOString()
        }, { onConflict: 'slug' });
      } catch (err) {
        console.error('[Supabase API] Error adding location page:', err);
      }
    }

    return localRes;
  }

  public async deleteLocationPage(slug: string): Promise<boolean> {
    const localRes = await locationService.deleteLocationPage(slug);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('locations').delete().eq('slug', slug);
      } catch (err) {
        console.error('[Supabase API] Error deleting location page:', err);
      }
    }

    return localRes;
  }

  public async updateRedirects(redirects: RedirectRule[]): Promise<RedirectRule[]> {
    const localRes = await redirectService.updateRedirects(redirects);

    if (isSupabaseConfigured() && supabase) {
      try {
        const rows = redirects.map((r, idx) => ({
          id: r.id || `red-${idx}`,
          from_path: r.from,
          to_path: r.to,
          type: r.type || 301,
          created_at: new Date().toISOString()
        }));
        await supabase.from('redirects').upsert(rows, { onConflict: 'id' });
      } catch (err) {
        console.error('[Supabase API] Error updating redirects:', err);
      }
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

    if (isSupabaseConfigured() && supabase) {
      try {
        const rows = blogs.map(b => ({
          id: b.id,
          slug: b.slug,
          title: b.title,
          data: b,
          updated_at: new Date().toISOString()
        }));
        await supabase.from('blogs').upsert(rows, { onConflict: 'id' });
      } catch (err) {
        console.error('[Supabase API] Error updating blogs:', err);
      }
    }

    return localRes;
  }

  public async uploadMediaAsset(file: File): Promise<{ url: string; filename: string }> {
    if (isSupabaseConfigured() && supabase) {
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { data, error } = await supabase.storage.from('cms_media').upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

      if (error) {
        console.error('[Supabase Storage] Upload error:', error);
        throw error;
      }

      const { data: publicUrlData } = supabase.storage.from('cms_media').getPublicUrl(data.path);
      const url = publicUrlData.publicUrl;

      await supabase.from('media_library').insert({
        id: `med-${Date.now()}`,
        filename: file.name,
        url,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type,
        created_at: new Date().toISOString()
      });

      return { url, filename: file.name };
    }

    throw new Error('Supabase storage is not configured.');
  }
}

export const cmsDatabaseApi = new CMSDatabaseApi();

