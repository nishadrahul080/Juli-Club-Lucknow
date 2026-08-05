// Category Repository

import { BaseRepository } from './base.repository';
import { CategoryRow } from '../db/types';
import { CategoryEntity } from '../models/entities';
import { DatabaseTables } from '../db/database';

export class CategoryRepository extends BaseRepository<CategoryEntity, CategoryRow> {
  protected tableName: keyof DatabaseTables = 'categories';

  protected mapRowToEntity(row: CategoryRow): CategoryEntity {
    return CategoryEntity.fromRow(row);
  }

  protected mapEntityToRow(entity: Partial<CategoryEntity>): CategoryRow {
    return {
      id: entity.id || `cat-${Date.now()}`,
      name: entity.name || 'General',
      slug: entity.slug || 'general',
      description: entity.description,
      display_order: entity.displayOrder || 1,
      is_active: entity.isActive ?? true
    };
  }

  public async findByName(name: string): Promise<CategoryEntity | null> {
    const rows = this.getRecords();
    const found = rows.find(r => r.name.toLowerCase() === name.toLowerCase());
    if (!found) return null;
    return this.mapRowToEntity(found);
  }
}

export const categoryRepository = new CategoryRepository();
