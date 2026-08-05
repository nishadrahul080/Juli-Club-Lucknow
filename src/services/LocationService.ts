// Location Service Layer

import { locationRepository } from '../repositories/location.repository';
import { LocationPageInfo } from '../types';
import { CreateLocationPageDTO, UpdateLocationPageDTO, QueryParams, PaginatedResponse } from '../dtos';
import { Sanitizer } from '../validation/sanitizer';
import { Validator } from '../validation/validators';
import { db } from '../db/database';

export class LocationService {
  public async getAllLocations(params?: QueryParams): Promise<PaginatedResponse<LocationPageInfo>> {
    return locationRepository.findAll(params || {});
  }

  public async getLocationBySlug(slug: string): Promise<LocationPageInfo | null> {
    const cleanSlug = Sanitizer.sanitizeSlug(slug);
    return locationRepository.findBySlug(cleanSlug);
  }

  public async createLocationPage(dto: CreateLocationPageDTO): Promise<LocationPageInfo> {
    const sanitized = Sanitizer.sanitizeObject(dto);
    const validation = Validator.validateLocationPage(sanitized);

    if (!validation.isValid) {
      throw new Error(`Location Page Validation Failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    return db.runTransaction(async () => {
      return locationRepository.create(sanitized as Partial<LocationPageInfo>);
    });
  }

  public async updateLocationPage(slug: string, dto: UpdateLocationPageDTO): Promise<LocationPageInfo> {
    const sanitized = Sanitizer.sanitizeObject(dto);

    return db.runTransaction(async () => {
      const existing = await locationRepository.findBySlug(slug);
      if (!existing) {
        throw new Error(`Location page with slug ${slug} not found`);
      }
      return locationRepository.update(existing.slug, sanitized as Partial<LocationPageInfo>);
    });
  }

  public async deleteLocationPage(slug: string): Promise<boolean> {
    return db.runTransaction(async () => {
      const existing = await locationRepository.findBySlug(slug);
      if (!existing) return false;
      return locationRepository.delete(existing.slug);
    });
  }
}

export const locationService = new LocationService();
