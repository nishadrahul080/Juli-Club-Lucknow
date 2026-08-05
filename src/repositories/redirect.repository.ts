// Redirect Rules Repository

import { BaseRepository } from './base.repository';
import { RedirectRuleRow } from '../db/types';
import { RedirectRule } from '../types';
import { DatabaseTables } from '../db/database';

export class RedirectRepository extends BaseRepository<RedirectRule, RedirectRuleRow> {
  protected tableName: keyof DatabaseTables = 'redirect_rules';

  protected mapRowToEntity(row: RedirectRuleRow): RedirectRule {
    return {
      id: row.id,
      fromSlug: row.from_slug,
      toTarget: row.to_target,
      statusCode: row.status_code,
      isActive: row.is_active,
      createdAt: row.created_at
    };
  }

  protected mapEntityToRow(entity: Partial<RedirectRule>): RedirectRuleRow {
    return {
      id: entity.id || `red-${Date.now()}`,
      from_slug: entity.fromSlug || '',
      to_target: entity.toTarget || '',
      status_code: entity.statusCode || 301,
      is_active: entity.isActive ?? true,
      created_at: entity.createdAt || new Date().toISOString()
    };
  }

  public async findActiveByFromSlug(fromSlug: string): Promise<RedirectRule | null> {
    const rows = this.getRecords();
    const cleanFrom = fromSlug.startsWith('/') ? fromSlug : `/${fromSlug}`;
    const found = rows.find(r => r.is_active && (r.from_slug === cleanFrom || r.from_slug === fromSlug));
    if (!found) return null;
    return this.mapRowToEntity(found);
  }
}

export const redirectRepository = new RedirectRepository();
