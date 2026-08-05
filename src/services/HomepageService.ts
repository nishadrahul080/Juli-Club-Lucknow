// Homepage & CMS Sections Service

import { homepageRepository } from '../repositories/homepage.repository';
import { CMSSection, HomepageConfig } from '../types';
import { Sanitizer } from '../validation/sanitizer';
import { db } from '../db/database';

export class HomepageService {
  public async getHomepageConfig(): Promise<HomepageConfig> {
    return homepageRepository.getHomepageConfig();
  }

  public async updateHomepageConfig(config: Partial<HomepageConfig>): Promise<HomepageConfig> {
    const sanitized = Sanitizer.sanitizeObject(config);

    return db.runTransaction(async () => {
      if (sanitized.sections) {
        await homepageRepository.saveHomepageSections(sanitized.sections);
      }
      return homepageRepository.getHomepageConfig();
    });
  }

  public async updateSections(sections: CMSSection[]): Promise<CMSSection[]> {
    const sanitizedSections = Sanitizer.sanitizeObject(sections);
    return db.runTransaction(async () => {
      await homepageRepository.saveHomepageSections(sanitizedSections);
      const updated = await homepageRepository.findAll();
      return updated.data;
    });
  }
}

export const homepageService = new HomepageService();
