// Multi-City Repository - Multi-city expansion support (Lucknow, Noida, Delhi, Bangalore, etc.)

import { BaseRepository } from './base.repository';
import { CityRow } from '../db/types';
import { CityEntity } from '../models/entities';
import { DatabaseTables } from '../db/database';

export class CityRepository extends BaseRepository<CityEntity, CityRow> {
  protected tableName: keyof DatabaseTables = 'cities';

  protected mapRowToEntity(row: CityRow): CityEntity {
    return CityEntity.fromRow(row);
  }

  protected mapEntityToRow(entity: Partial<CityEntity>): CityRow {
    return {
      id: entity.id || `city-${Date.now()}`,
      name: entity.name || 'Lucknow',
      slug: entity.slug || 'lucknow',
      state: entity.state || 'Uttar Pradesh',
      country: entity.country || 'India',
      ads_count: entity.adsCount || 0,
      is_popular: entity.isPopular ?? true,
      is_active: entity.isActive ?? true
    };
  }

  public async findBySlug(slug: string): Promise<CityEntity | null> {
    const rows = this.getRecords();
    const found = rows.find(r => r.slug === slug.toLowerCase());
    if (!found) return null;
    return this.mapRowToEntity(found);
  }
}

export const cityRepository = new CityRepository();
