// Redirect Rules Service

import { redirectRepository } from '../repositories/redirect.repository';
import { RedirectRule } from '../types';
import { Sanitizer } from '../validation/sanitizer';

export class RedirectService {
  public async getRedirects(): Promise<RedirectRule[]> {
    const res = await redirectRepository.findAll();
    return res.data;
  }

  public async getActiveRedirect(fromSlug: string): Promise<RedirectRule | null> {
    return redirectRepository.findActiveByFromSlug(fromSlug);
  }

  public async createRedirect(rule: Partial<RedirectRule>): Promise<RedirectRule> {
    const sanitized = Sanitizer.sanitizeObject(rule);
    return redirectRepository.create(sanitized);
  }

  public async updateRedirects(rules: RedirectRule[]): Promise<RedirectRule[]> {
    const sanitizedRules = Sanitizer.sanitizeObject(rules);
    redirectRepository.setRecords(sanitizedRules as any);
    return this.getRedirects();
  }

  public async deleteRedirect(id: string): Promise<boolean> {
    return redirectRepository.delete(id);
  }
}

export const redirectService = new RedirectService();
