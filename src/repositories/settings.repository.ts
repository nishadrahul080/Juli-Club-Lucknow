// Settings Repository - Manages Global Site Settings

import { BaseRepository } from './base.repository';
import { SiteSettingRow } from '../db/types';
import { SiteSettings, DEFAULT_SETTINGS } from '../data/cmsStore';
import { DatabaseTables } from '../db/database';

export class SettingsRepository extends BaseRepository<SiteSettingRow, SiteSettingRow> {
  protected tableName: keyof DatabaseTables = 'site_settings';

  protected mapRowToEntity(row: SiteSettingRow): SiteSettingRow {
    return row;
  }

  protected mapEntityToRow(entity: Partial<SiteSettingRow>): SiteSettingRow {
    return {
      id: entity.id || `set-${entity.setting_key}`,
      setting_key: entity.setting_key || '',
      setting_value: entity.setting_value || '',
      description: entity.description,
      updated_at: new Date().toISOString()
    };
  }

  public async getSettings(): Promise<SiteSettings> {
    const rows = this.getRecords();
    const map: Record<string, any> = {};
    rows.forEach(r => {
      let val: any = r.setting_value;
      if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
        try {
          val = JSON.parse(val);
        } catch {
          // ignore parse error and leave as string
        }
      }
      map[r.setting_key] = val;
    });

    return {
      ...DEFAULT_SETTINGS,
      ...map
    };
  }

  public async updateSettings(newSettings: Partial<SiteSettings>): Promise<SiteSettings> {
    const records = this.getRecords();
    for (const [key, val] of Object.entries(newSettings)) {
      if (val !== undefined) {
        const existingIdx = records.findIndex(r => r.setting_key === key);
        const strVal = typeof val === 'string' ? val : JSON.stringify(val);
        if (existingIdx !== -1) {
          records[existingIdx].setting_value = strVal;
          records[existingIdx].updated_at = new Date().toISOString();
        } else {
          records.push({
            id: `set-${key}`,
            setting_key: key,
            setting_value: strVal,
            updated_at: new Date().toISOString()
          });
        }
      }
    }
    this.setRecords(records);
    return this.getSettings();
  }
}

export const settingsRepository = new SettingsRepository();
