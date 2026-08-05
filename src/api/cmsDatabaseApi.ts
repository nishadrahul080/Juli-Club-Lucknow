// High-Level CMS Database API Facade
// Connects Services, Repositories, and Database layer to the React application context.

import { profileService } from '../services/ProfileService';
import { locationService } from '../services/LocationService';
import { homepageService } from '../services/HomepageService';
import { blogService } from '../services/BlogService';
import { settingsService } from '../services/SettingsService';
import { redirectService } from '../services/RedirectService';
import { faqRepository } from '../repositories/faq.repository';
import { reviewRepository } from '../repositories/review.repository';

import { CMSData, SiteSettings, HomepageConfig, BlogPost } from '../data/cmsStore';
import { CompanionProfile, Review, LocationPageInfo, CMSSection, RedirectRule } from '../types';
import { db } from '../db/database';

export class CMSDatabaseApi {
  public async loadFullCMSData(): Promise<CMSData> {
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
      settings,
      homepage,
      profiles: profilesRes.data,
      reviews: reviewsRes.data,
      faqs: faqsRes.data,
      locations: locationsMap,
      redirects,
      blogs
    };
  }

  public async updateSettings(newSettings: Partial<SiteSettings>): Promise<SiteSettings> {
    return settingsService.updateSettings(newSettings);
  }

  public async updateHomepage(newHomepage: Partial<HomepageConfig>): Promise<HomepageConfig> {
    return homepageService.updateHomepageConfig(newHomepage);
  }

  public async updateHomepageSections(sections: CMSSection[]): Promise<CMSSection[]> {
    return homepageService.updateSections(sections);
  }

  public async updateProfiles(profiles: CompanionProfile[]): Promise<CompanionProfile[]> {
    return db.runTransaction(async () => {
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
  }

  public async updateReviews(reviews: Review[]): Promise<Review[]> {
    return db.runTransaction(async () => {
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
  }

  public async updateFAQs(faqs: { id: string; question: string; answer: string; category: string }[]): Promise<{ id: string; question: string; answer: string; category: string }[]> {
    return db.runTransaction(async () => {
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
  }

  public async updateLocations(locationsMap: Record<string, LocationPageInfo>): Promise<Record<string, LocationPageInfo>> {
    return db.runTransaction(async () => {
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
  }

  public async addLocationPage(location: LocationPageInfo): Promise<LocationPageInfo> {
    return locationService.createLocationPage(location as any);
  }

  public async deleteLocationPage(slug: string): Promise<boolean> {
    return locationService.deleteLocationPage(slug);
  }

  public async updateRedirects(redirects: RedirectRule[]): Promise<RedirectRule[]> {
    return redirectService.updateRedirects(redirects);
  }

  public async updateBlogs(blogs: BlogPost[]): Promise<BlogPost[]> {
    return db.runTransaction(async () => {
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
  }
}

export const cmsDatabaseApi = new CMSDatabaseApi();
