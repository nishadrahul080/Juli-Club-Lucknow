// Site Settings Service

import { settingsRepository } from '../repositories/settings.repository';
import { SiteSettings } from '../data/cmsStore';
import { Sanitizer } from '../validation/sanitizer';

export class SettingsService {
  public async getSettings(): Promise<SiteSettings> {
    return settingsRepository.getSettings();
  }

  public async updateSettings(newSettings: Partial<SiteSettings>): Promise<SiteSettings> {
    const sanitized = Sanitizer.sanitizeObject(newSettings);
    return settingsRepository.updateSettings(sanitized);
  }
}

export const settingsService = new SettingsService();
