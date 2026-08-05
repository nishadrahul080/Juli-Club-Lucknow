// Profile Service Layer - Handles validation, sanitization, transaction handling for Companion Profiles

import { profileRepository } from '../repositories/profile.repository';
import { CompanionProfile } from '../types';
import { CreateProfileDTO, UpdateProfileDTO, QueryParams, PaginatedResponse } from '../dtos';
import { Sanitizer } from '../validation/sanitizer';
import { Validator } from '../validation/validators';
import { db } from '../db/database';

export class ProfileService {
  public async getProfiles(params?: QueryParams): Promise<PaginatedResponse<CompanionProfile>> {
    return profileRepository.filterProfiles(params || {});
  }

  public async getProfileBySlug(slug: string): Promise<CompanionProfile | null> {
    const cleanSlug = Sanitizer.sanitizeSlug(slug);
    return profileRepository.findBySlug(cleanSlug);
  }

  public async createProfile(dto: CreateProfileDTO): Promise<CompanionProfile> {
    const sanitized = Sanitizer.sanitizeObject(dto);
    const validation = Validator.validateProfile(sanitized);

    if (!validation.isValid) {
      throw new Error(`Profile Validation Failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    return db.runTransaction(async () => {
      const created = await profileRepository.create(sanitized as Partial<CompanionProfile>);
      return created;
    });
  }

  public async updateProfile(id: string, dto: UpdateProfileDTO): Promise<CompanionProfile> {
    const sanitized = Sanitizer.sanitizeObject(dto);

    return db.runTransaction(async () => {
      const existing = await profileRepository.findById(id);
      if (!existing) {
        throw new Error(`Profile with ID ${id} not found`);
      }
      return profileRepository.update(id, sanitized as Partial<CompanionProfile>);
    });
  }

  public async deleteProfile(id: string): Promise<boolean> {
    return db.runTransaction(async () => {
      return profileRepository.delete(id);
    });
  }
}

export const profileService = new ProfileService();
